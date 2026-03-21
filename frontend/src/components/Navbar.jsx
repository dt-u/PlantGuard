import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, Stethoscope, Clock, User, LogOut, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => {
        return location.pathname === path ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" : "text-gray-700 hover:bg-green-50/70";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Show different navigation items based on current page
    const getNavItems = () => {
        if (location.pathname === '/monitor') {
            return (
                <Link to="/doctor" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/doctor')}`}>
                    <Stethoscope className="w-5 h-5" />
                    <span>Bác sĩ AI</span>
                </Link>
            );
        } else if (location.pathname === '/doctor') {
            return (
                <Link to="/monitor" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/monitor')}`}>
                    <Activity className="w-5 h-5" />
                    <span>Giám sát</span>
                </Link>
            );
        }
        // For other pages (history, diagnosis detail)
        return (
            <>
                <Link to="/monitor" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/monitor')}`}>
                    <Activity className="w-5 h-5" />
                    <span>Giám sát</span>
                </Link>
                <Link to="/doctor" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/doctor')}`}>
                    <Stethoscope className="w-5 h-5" />
                    <span>Bác sĩ AI</span>
                </Link>
            </>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PlantGuard</span>
                            <span className="text-xs text-gray-500">Bảo vệ cây trồng</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {getNavItems()}
                        {isAuthenticated() && (
                            <Link to="/history" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/history')}`}>
                                <Clock className="w-5 h-5" />
                                <span>Lịch sử</span>
                            </Link>
                        )}
                        
                        {/* User Menu */}
                        {isAuthenticated() ? (
                            <div className="relative ml-4 pl-4 border-l border-gray-200" ref={dropdownRef}>
                                <button
                                    onClick={toggleUserDropdown}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-green-600" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="ml-4 pl-4 border-l border-gray-200">
                                <span className="text-sm text-gray-500">Chưa đăng nhập</span>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button 
                            onClick={toggleMenu}
                            className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-green-100">
                        <div className="px-4 py-3 space-y-1">
                            {getNavItems()}
                            {isAuthenticated() && (
                                <Link 
                                    to="/history" 
                                    className={`block px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/history')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Clock className="w-5 h-5" />
                                    <span>Lịch sử</span>
                                </Link>
                            )}
                            
                            {/* Mobile User Menu */}
                            {isAuthenticated() ? (
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="px-4 py-2">
                                        <p className="text-sm text-gray-500">Chưa đăng nhập</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
