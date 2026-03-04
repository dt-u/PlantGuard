import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, Stethoscope } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "bg-agri-green text-white" : "text-agri-dark hover:bg-green-100";
    };

    return (
        <nav className="glass-panel sticky top-4 z-50 mx-4 mb-8 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-agri-dark">
                <Sprout className="w-8 h-8 text-agri-green" />
                <span>PlantGuard</span>
            </Link>

            <div className="flex space-x-4">
                <Link to="/" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/')}`}>
                    Home
                </Link>
                <Link to="/monitor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/monitor')}`}>
                    <Activity className="w-4 h-4" />
                    <span>Monitor</span>
                </Link>
                <Link to="/doctor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/doctor')}`}>
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctor</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
