import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('plantguard_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('plantguard_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('plantguard_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('plantguard_user');
    };

    const openLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const closeLogin = () => setIsLoginOpen(false);

    const openRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const closeRegister = () => setIsRegisterOpen(false);

    const isAuthenticated = useCallback(() => {
        return user !== null;
    }, [user]);

    const getUserId = useCallback(() => {
        return user?.id || 'anonymous';
    }, [user]);

    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        getUserId,
        loading,
        isLoginOpen,
        openLogin,
        closeLogin,
        isRegisterOpen,
        openRegister,
        closeRegister
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
