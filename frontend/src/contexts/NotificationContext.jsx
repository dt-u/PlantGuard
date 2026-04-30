import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Activity, Calendar, ShieldCheck, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [activeToast, setActiveToast] = useState(null);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Sound blocked by browser'));
    };

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/notifications/?user_id=${user.id}`);
            setNotifications(response.data);
            
            const countRes = await axios.get(`http://127.0.0.1:8000/api/notifications/unread-count?user_id=${user.id}`);
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!user) return;

        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}`);
        
        ws.onopen = () => {
            console.log('Connected to Notification WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_NOTIFICATION') {
                setNotifications(prev => [data.notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Show in-app Toast
                setActiveToast(data.notification);
                playNotificationSound();
                
                // Auto hide toast
                setTimeout(() => setActiveToast(null), 6000);
                
                // Browser notification
                if (Notification.permission === 'granted') {
                    new Notification(data.notification.title, {
                        body: data.notification.message,
                        icon: '/logo192.png'
                    });
                }
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from Notification WebSocket');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            await axios.patch(`http://127.0.0.1:8000/api/notifications/read-all?user_id=${user.id}`);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const clearAll = async () => {
        if (!user) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/notifications/clear?user_id=${user.id}`);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
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
            case 'drone': return 'bg-blue-100';
            case 'routine': return 'bg-amber-100';
            case 'system': return 'bg-green-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            markAsRead, 
            markAllAsRead, 
            clearAll,
            fetchNotifications 
        }}>
            {children}
            
            {/* Real-time Toast UI */}
            <AnimatePresence>
                {activeToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        onClick={() => { markAsRead(activeToast.id); setActiveToast(null); }}
                        className="fixed bottom-6 right-6 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-80 cursor-pointer hover:shadow-agri-green/20 transition-shadow overflow-hidden group"
                    >
                        {/* Progress Bar for Auto-close */}
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-agri-green/30"
                        />
                        
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${getBgColor(activeToast.type)}`}>
                                {getIcon(activeToast.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 text-sm truncate pr-4">{activeToast.title}</h4>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveToast(null); }}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{activeToast.message}</p>
                                <p className="text-[10px] text-agri-green font-bold mt-2 flex items-center gap-1">
                                    Click để xem chi tiết
                                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
