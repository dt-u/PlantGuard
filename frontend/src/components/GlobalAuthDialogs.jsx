import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';

const GlobalAuthDialogs = () => {
    const { 
        isLoginOpen, 
        closeLogin, 
        login, 
        openRegister,
        isRegisterOpen,
        closeRegister,
        openLogin
    } = useAuth();

    return (
        <div id="global-auth-dialogs">
            <LoginDialog 
                isOpen={isLoginOpen} 
                onClose={closeLogin} 
                onLogin={(data) => {
                    login(data);
                    closeLogin();
                }}
                onSwitchToRegister={openRegister}
            />
            <RegisterDialog 
                isOpen={isRegisterOpen} 
                onClose={closeRegister} 
                onRegister={() => {
                    closeRegister();
                    openLogin();
                }}
                onSwitchToLogin={openLogin}
            />
        </div>
    );
};

export default GlobalAuthDialogs;
