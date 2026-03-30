import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ENDPOINTS } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check stored user on mount
        const loadStoredUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('plantguard_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error loading stored user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStoredUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(ENDPOINTS.LOGIN, { email, password });
            const userData = response.data;
            setUser(userData);
            await AsyncStorage.setItem('plantguard_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng thử lại.' 
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(ENDPOINTS.REGISTER, { name, email, password });
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Đăng ký thất bại. Vui lòng thử lại.' 
            };
        }
    };

    const updateProfile = async (name) => {
        try {
            if (!user) return { success: false, error: 'Chưa đăng nhập' };
            const response = await axios.put(ENDPOINTS.UPDATE_PROFILE(user.id), { name });
            const userData = response.data;
            setUser(userData);
            await AsyncStorage.setItem('plantguard_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Cập nhật thất bại. Vui lòng thử lại.' 
            };
        }
    };

    const updatePreferences = async (newPrefs) => {
        try {
            if (!user) return { success: false, error: 'Chưa đăng nhập' };
            const mergedPrefs = { ...(user.preferences || {}), ...newPrefs };
            const response = await axios.put(ENDPOINTS.UPDATE_PROFILE(user.id), { preferences: mergedPrefs });
            const userData = response.data;
            setUser(userData);
            await AsyncStorage.setItem('plantguard_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Update preferences error:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Cập nhật cài đặt thất bại.' 
            };
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            await AsyncStorage.removeItem('plantguard_user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isAuthenticated = () => user !== null;
    
    const getUserId = () => user?.id || 'anonymous';

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            logout, 
            updateProfile,
            updatePreferences,
            isAuthenticated, 
            getUserId 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
