import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations as uiTranslations } from '../locales/translations';

// Use require for JSON files to ensure compatibility in some Metro environments
const viData = require('../locales/vi.json');
const enData = require('../locales/en.json');

const mergeTranslations = (base, overrides) => {
    const result = { ...base };
    for (const key in overrides) {
        if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
            result[key] = mergeTranslations(base[key] || {}, overrides[key]);
        } else {
            result[key] = overrides[key];
        }
    }
    return result;
};

// Build the final translations object
// Priority: uiTranslations (translations.js) > JSON files (vi.json, en.json)
const translations = {
    vi: mergeTranslations(viData, uiTranslations.vi),
    en: mergeTranslations(enData, uiTranslations.en)
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('user_language');
                if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
                    setLanguage(savedLanguage);
                }
            } catch (e) {
                console.error('Error loading language:', e);
            } finally {
                setLoading(false);
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (newLang) => {
        try {
            setLanguage(newLang);
            await AsyncStorage.setItem('user_language', newLang);
        } catch (e) {
            console.error('Error saving language:', e);
        }
    };

    const t = (path) => {
        if (!path) return '';
        const keys = path.split('.');
        let current = translations[language] || translations['vi'];
        
        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                // If not found in current language, try fallback to 'vi'
                if (language !== 'vi') {
                    let fallback = translations['vi'];
                    for (const fKey of keys) {
                        if (fallback && fallback[fKey] !== undefined) {
                            fallback = fallback[fKey];
                        } else {
                            return path;
                        }
                    }
                    return fallback;
                }
                return path; 
            }
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
