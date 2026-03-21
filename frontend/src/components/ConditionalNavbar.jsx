import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const ConditionalNavbar = () => {
    const location = useLocation();
    
    // Don't show navbar on home page
    if (location.pathname === '/') {
        return null;
    }
    
    return <Navbar />;
};

export default ConditionalNavbar;
