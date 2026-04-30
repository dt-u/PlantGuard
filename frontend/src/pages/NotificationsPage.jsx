import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Trash2, Check, Calendar, Activity, ShieldCheck, Filter, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsPage = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [filter, setFilter] = useState('all'); // all, unread, drone, routine

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        if (filter === 'drone') return n.type === 'drone';
        if (filter === 'routine') return n.type === 'routine';
        return true;
    });

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const getIcon = (type) => {
        switch (type) {
            case 'drone': return <Activity className="w-5 h-5 text-blue-600" />;
            case 'routine': return <Calendar className="w-5 h-5 text-amber-600" />;
            case 'system': return <ShieldCheck className="w-5 h-5 text-agri-green" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'drone': return 'bg-blue-50';
            case 'routine': return 'bg-amber-50';
            case 'system': return 'bg-green-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen pb-12 bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Bell className="w-6 h-6 text-agri-green" />
                            Thông báo của bạn
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Bạn có {unreadCount} thông báo chưa đọc</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-sm font-bold text-agri-green bg-agri-green/10 rounded-xl hover:bg-agri-green/20 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Đánh dấu đã đọc
                        </button>
                        <button 
                            onClick={clearAll}
                            className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa tất cả
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'Tất cả', icon: <Filter className="w-3.5 h-3.5" /> },
                        { id: 'unread', label: 'Chưa đọc', icon: <Clock className="w-3.5 h-3.5" /> },
                        { id: 'drone', label: 'Drone', icon: <Activity className="w-3.5 h-3.5" /> },
                        { id: 'routine', label: 'Chăm sóc', icon: <Calendar className="w-3.5 h-3.5" /> },
                    ].map(btn => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                                filter === btn.id 
                                ? 'bg-agri-dark text-white shadow-lg shadow-gray-200' 
                                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            {btn.icon}
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200"
                            >
                                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-400">Không có thông báo nào</h3>
                                <p className="text-gray-400 text-sm mt-1">Chúng tôi sẽ gửi thông báo cho bạn khi có cập nhật mới.</p>
                            </motion.div>
                        ) : (
                            filteredNotifications.map((noti) => (
                                <motion.div
                                    key={noti.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => markAsRead(noti.id)}
                                    className={`bg-white rounded-2xl p-6 border transition-all flex gap-4 cursor-pointer group ${
                                        !noti.is_read ? 'border-agri-green shadow-md shadow-agri-green/5 ring-1 ring-agri-green/5' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${getBgColor(noti.type)}`}>
                                        {getIcon(noti.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-bold ${!noti.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{noti.title}</h3>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {formatTimeAgo(noti.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed">{noti.message}</p>
                                    </div>
                                    {!noti.is_read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-agri-green mt-2 flex-shrink-0"></div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
