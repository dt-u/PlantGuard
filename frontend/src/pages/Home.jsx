import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Eye, ArrowRight, Sprout, LogIn, UserPlus, User, History, LogOut, Bell, Calendar, Activity, AlertTriangle, CloudRain, Sun, Snowflake, Wind, CloudFog, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Home = () => {
    const { user, logout, openLogin, openRegister } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [weatherAlert, setWeatherAlert] = useState(null);
    const [isWeatherAlertVisible, setIsWeatherAlertVisible] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchWeatherAlert = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
                const response = await axios.get(`${apiBase}/api/weather-alert`);
                setWeatherAlert(response.data);
                setIsWeatherAlertVisible(true);
            } catch (error) {
                console.error('Error fetching weather alert:', error);
            }
        };

        fetchWeatherAlert();
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getWeatherVisual = (alert) => {
        const condition = alert?.condition || '';
        if (condition === 'storm_or_strong_wind') {
            return {
                Icon: Wind,
                containerClass: 'bg-red-800 border-red-300 text-white animate-pulse',
                iconClass: 'text-amber-200',
                badge: 'GIÓ MẠNH',
            };
        }
        if (condition === 'high_humidity_with_rain') {
            return {
                Icon: CloudRain,
                containerClass: 'bg-red-700 border-red-300 text-white animate-pulse',
                iconClass: 'text-yellow-200',
                badge: 'NẤM BỆNH',
            };
        }
        if (condition === 'heat_stress') {
            return {
                Icon: Sun,
                containerClass: 'bg-orange-600 border-orange-300 text-white',
                iconClass: 'text-yellow-200',
                badge: 'NẮNG NÓNG',
            };
        }
        if (condition === 'cold_stress') {
            return {
                Icon: Snowflake,
                containerClass: 'bg-blue-700 border-blue-300 text-white',
                iconClass: 'text-cyan-100',
                badge: 'NHIỆT ĐỘ THẤP',
            };
        }
        if (condition === 'fog_high_humidity') {
            return {
                Icon: CloudFog,
                containerClass: 'bg-slate-700 border-slate-300 text-white',
                iconClass: 'text-slate-100',
                badge: 'SƯƠNG MÙ',
            };
        }
        if (alert?.status === 'danger') {
            return {
                Icon: AlertTriangle,
                containerClass: 'bg-red-700 border-red-300 text-white animate-pulse',
                iconClass: 'text-yellow-200',
                badge: 'CẢNH BÁO',
            };
        }
        return {
            Icon: ShieldCheck,
            containerClass: 'bg-emerald-600 border-emerald-300 text-white',
            iconClass: 'text-green-100',
            badge: 'AN TOÀN',
        };
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

                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => { setIsNotiOpen(!isNotiOpen); setIsProfileOpen(false); }}
                                className="p-2 rounded-xl text-agri-dark hover:bg-green-100 transition-colors relative bg-white shadow-sm border border-green-100"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotiOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotiOpen(false)}></div>
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left"
                                        >
                                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                <h3 className="font-bold text-gray-900 text-sm">Thông báo</h3>
                                                {unreadCount > 0 && (
                                                    <button 
                                                        onClick={() => markAllAsRead()}
                                                        className="text-xs text-agri-green font-bold hover:underline"
                                                    >
                                                        Đánh dấu tất cả là đã đọc
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center">
                                                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                        <p className="text-gray-400 text-xs">Không có thông báo mới</p>
                                                    </div>
                                                ) : (
                                                    notifications.slice(0, 10).map((noti) => (
                                                        <div 
                                                            key={noti.id}
                                                            onClick={() => { markAsRead(noti.id); setIsNotiOpen(false); }}
                                                            className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 flex gap-3 ${!noti.is_read ? 'bg-green-50/30' : ''}`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                                                                noti.type === 'drone' ? 'bg-blue-100 text-blue-600' :
                                                                noti.type === 'routine' ? 'bg-amber-100 text-amber-600' :
                                                                'bg-green-100 text-agri-green'
                                                            }`}>
                                                                {noti.type === 'drone' ? <Activity className="w-5 h-5" /> : 
                                                                 noti.type === 'routine' ? <Calendar className="w-5 h-5" /> : 
                                                                 <Bell className="w-5 h-5" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm ${!noti.is_read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                                    {noti.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{noti.message}</p>
                                                                <p className="text-[10px] text-gray-400 mt-1">
                                                                    {new Date(noti.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                            {!noti.is_read && (
                                                                <div className="w-2 h-2 rounded-full bg-agri-green mt-2 flex-shrink-0"></div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <Link 
                                                to="/notifications" 
                                                className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 border-t border-gray-50"
                                                onClick={() => setIsNotiOpen(false)}
                                            >
                                                Xem tất cả thông báo
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

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
                                        <Link
                                            to="/routines"
                                            className="flex items-center space-x-3 px-4 py-2.5 text-xs text-gray-700 hover:bg-green-50 hover:text-agri-green transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="font-medium">{t('navbar.routines') || 'Tiến độ chăm sóc'}</span>
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

            {/* Weather Predictive Alert Toast */}
            <AnimatePresence>
                {weatherAlert && isWeatherAlertVisible && (() => {
                    const weatherVisual = getWeatherVisual(weatherAlert);
                    const WeatherIcon = weatherVisual.Icon;
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: 120, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 140, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 24 }}
                            className={`fixed top-24 right-6 z-[60] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl px-5 py-4 border-2 shadow-2xl ${
                                weatherVisual.containerClass
                            }`}
                        >
                            <button
                                onClick={() => setIsWeatherAlertVisible(false)}
                                className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Đóng cảnh báo thời tiết"
                                title="Đóng"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            <div className="flex items-start gap-3 pr-6">
                                <WeatherIcon className={`w-6 h-6 mt-0.5 shrink-0 ${weatherVisual.iconClass}`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm md:text-base font-extrabold tracking-wide">
                                            {weatherAlert.title || 'CẢNH BÁO MÔI TRƯỜNG'}
                                        </p>
                                        <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-white/20 border border-white/30 font-bold tracking-wide">
                                            {weatherVisual.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm mt-1 opacity-95 leading-relaxed">
                                        {weatherAlert.message}
                                    </p>
                                    {weatherAlert.recommendation && (
                                        <p className="text-[11px] md:text-xs mt-2 leading-relaxed bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                                            <span className="font-extrabold">Khuyến nghị:</span> {weatherAlert.recommendation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

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
