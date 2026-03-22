import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Eye, ArrowRight, Sprout, LogIn, UserPlus, User, History, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { user, logout, openLogin, openRegister } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Top Bar for Auth */}
            <header className="px-8 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-agri-dark">
                    <Sprout className="w-7 h-7 text-agri-green" />
                    <span>PlantGuard</span>
                </Link>

                <div className="flex items-center space-x-4">
                    {/* Language Switcher in Home Header */}
                    <div className="flex items-center space-x-1 mr-2">
                        <button
                            onClick={() => changeLanguage('vi')}
                            className={`transition-all duration-300 transform ${i18n.language.startsWith('vi') ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-60'}`}
                            title="Tiếng Việt"
                        >
                            <img src="https://flagicons.lipis.dev/flags/4x3/vn.svg" alt="Vietnamese" className="w-6 h-4 object-cover rounded shadow-sm" />
                        </button>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`transition-all duration-300 transform ${i18n.language.startsWith('en') ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-60'}`}
                            title="English"
                        >
                            <img src="https://flagicons.lipis.dev/flags/4x3/gb.svg" alt="English" className="w-6 h-4 object-cover rounded shadow-sm" />
                        </button>
                    </div>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl font-medium bg-white shadow-sm border border-green-100 text-agri-dark hover:bg-green-50 transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-agri-green/10 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-agri-green" />
                                </div>
                                <span className="max-w-[120px] truncate font-bold text-sm">{user.name}</span>
                            </button>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('home.account')}</p>
                                            <p className="text-xs font-bold text-agri-dark truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            to="/history"
                                            className="flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-700 hover:bg-green-50 hover:text-agri-green transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <History className="w-3.5 h-3.5" />
                                            <span className="font-medium">{t('navbar.history')}</span>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            <span className="font-medium">{t('navbar.logout')}</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={openLogin}
                                className="flex items-center space-x-2 px-5 py-2 rounded-xl font-bold bg-agri-green text-white hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 text-sm"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>{t('navbar.login')}</span>
                            </button>
                            <button
                                onClick={openRegister}
                                className="flex items-center space-x-2 px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>{t('home.register')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-6">
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-agri-dark tracking-tight leading-tight">
                        {t('home.title')}
                        <span className="block text-agri-green mt-3">{t('home.subtitle')}</span>
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed">
                        {t('home.description1')} <br className="hidden md:block" />
                        {t('home.description2')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl px-4">
                    <Link to="/monitor" className="group relative overflow-hidden glass-panel p-6 hover:bg-white transition-all duration-500 transform hover:-translate-y-1.5 border-2 border-transparent hover:border-blue-100">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Eye className="w-20 h-20 text-blue-600" />
                        </div>
                        <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <Eye className="w-7 h-7 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-agri-dark mb-2">{t('home.monitor_title')}</h2>
                        <p className="text-gray-500 mb-6 text-xs leading-relaxed px-4">{t('home.monitor_desc')}</p>
                        <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            {t('home.monitor_btn')} <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link to="/doctor" className="group relative overflow-hidden glass-panel p-6 hover:bg-white transition-all duration-500 transform hover:-translate-y-1.5 border-2 border-transparent hover:border-green-100">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Leaf className="w-20 h-20 text-green-600" />
                        </div>
                        <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <Leaf className="w-7 h-7 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-agri-dark mb-2">{t('home.doctor_title')}</h2>
                        <p className="text-gray-500 mb-6 text-xs leading-relaxed px-4">{t('home.doctor_desc')}</p>
                        <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-green-50 text-green-600 font-bold text-xs group-hover:bg-agri-green group-hover:text-white transition-all duration-300">
                            {t('home.doctor_btn')} <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </main>

            {/* Subtle Footer to anchor the view */}
            <footer className="py-4 text-center text-gray-400 text-[10px] font-medium">
                {t('home.footer')}
            </footer>
        </div>
    );
};

export default Home;
