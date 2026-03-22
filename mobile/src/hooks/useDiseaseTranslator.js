import { useLanguage } from '../contexts/LanguageContext';

/**
 * Mobile Hook to handle disease translation, mirroring the logic from the web version.
 */
export const useDiseaseTranslator = () => {
    const { t, language } = useLanguage();

    const getDiseaseTranslation = (diseaseName) => {
        // Look up translation in JSON files (under 'diseases' key)
        const translated = t(`diseases.${diseaseName}`);
        if (typeof translated === 'object') {
            return translated;
        }
        return null;
    };

    const translateDiseaseName = (diseaseName, fallback) => {
        const translated = getDiseaseTranslation(diseaseName);
        return translated ? translated.name : fallback;
    };

    const translateDescription = (diseaseName, fallback) => {
        const translated = getDiseaseTranslation(diseaseName);
        return translated ? translated.desc : fallback;
    };

    const translateSymptoms = (diseaseName, fallback) => {
        const translated = getDiseaseTranslation(diseaseName);
        return (translated && translated.symptoms) ? translated.symptoms : fallback;
    };

    const translateTreatments = (diseaseName, fallback) => {
        const translated = getDiseaseTranslation(diseaseName);
        if (translated && translated.treatments) {
            // Map treatments to match the expected structure
            return fallback.map((item, index) => {
                const transItem = translated.treatments[index];
                if (transItem) {
                    return {
                        ...item,
                        level: transItem.level || item.level,
                        identification_guide: transItem.identification_guide || item.identification_guide,
                        action: transItem.action || item.action,
                        product: transItem.product || item.product
                    };
                }
                return item;
            });
        }
        return fallback;
    };

    return { 
        translateDiseaseName, 
        translateDescription, 
        translateSymptoms, 
        translateTreatments 
    };
};
