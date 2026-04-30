import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, Stethoscope, User, LogOut, History, LogIn, Calendar, Bell, AlertCircle, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const { user, logout, openLogin } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const isActive = (path) => {
        return location.pathname === path ? "bg-agri-green text-white" : "text-agri-dark hover:bg-green-100";
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="glass-panel sticky top-4 z-50 mx-4 mb-8 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-agri-dark">
                <Sprout className="w-8 h-8 text-agri-green" />
                <span>PlantGuard</span>
            </Link>

            <div className="flex items-center space-x-4">
                <Link to="/monitor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/monitor')}`}>
                    <Activity className="w-4 h-4" />
                    <span>{t('navbar.monitor')}</span>
                </Link>
                <Link to="/doctor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/doctor')}`}>
                    <Stethoscope className="w-4 h-4" />
                    <span>{t('navbar.doctor')}</span>
                </Link>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* Language Switcher */}
                <div className="flex items-center space-x-1.5 mr-2">
                    <button
                        onClick={() => changeLanguage('vi')}
                        className={`transition-all duration-300 transform ${i18n.language.startsWith('vi') ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-60'}`}
                        title="Tiếng Việt"
                    >
                        <img 
                            src="https://flagicons.lipis.dev/flags/4x3/vn.svg" 
                            alt="Vietnamese" 
                            className="w-7 h-5 object-cover rounded shadow-sm"
                        />
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`transition-all duration-300 transform ${i18n.language.startsWith('en') ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-60'}`}
                        title="English"
                    >
                        <img 
                            src="https://flagicons.lipis.dev/flags/4x3/gb.svg" 
                            alt="English" 
                            className="w-7 h-5 object-cover rounded shadow-sm"
                        />
                    </button>
                </div>

                {user && (
                    <div className="relative">
                        <button
                            onClick={() => { setIsNotiOpen(!isNotiOpen); setIsProfileOpen(false); }}
                            className="p-2 rounded-lg text-agri-dark hover:bg-green-100 transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
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
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
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
                                                                {formatTimeAgo(noti.created_at)}
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
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-agri-dark hover:bg-green-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-agri-green/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-agri-green" />
                            </div>
                            <span className="max-w-[100px] truncate">{user.name}</span>
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <Link
                                        to="/history"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-agri-green"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <History className="w-4 h-4" />
                                        <span>{t('navbar.history')}</span>
                                    </Link>
                                    <Link
                                        to="/routines"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-agri-green"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>{t('navbar.routines') || 'Tiến độ chăm sóc'}</span>
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t('navbar.logout')}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={openLogin}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-bold bg-agri-green text-white hover:bg-green-700 transition-all shadow-md shadow-green-500/20"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>{t('navbar.login')}</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
