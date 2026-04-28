import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { ENDPOINTS } from '../api/config';
import { Alert } from 'react-native';
import { navigate } from '../api/navigation';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, registerTokenWithBackend } from '../services/pushNotificationService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);
    const notificationListener = useRef();
    const responseListener = useRef();

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated() || !user?.id) return;
        try {
            setLoading(true);
            const response = await axios.get(`${ENDPOINTS.NOTIFICATIONS_LIST}?user_id=${user.id}`);
            setNotifications(response.data);
            
            const countRes = await axios.get(`${ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT}?user_id=${user.id}`);
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated() && user?.id) {
            // Register for push notifications
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    registerTokenWithBackend(user.id, token);
                }
            });

            // Refresh notifications list
            fetchNotifications();

            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                fetchNotifications();
            });

            // This listener is fired whenever a user taps on or interacts with a notification
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const data = response.notification.request.content.data;
                if (data.type === 'drone') {
                    navigate('MainTabs', { screen: 'Giám sát' });
                } else if (data.type === 'routine') {
                    navigate('CareRoutines');
                } else {
                    navigate('NotificationCenter');
                }
            });

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };
        }
    }, [user, isAuthenticated, fetchNotifications]);

    const playNotificationSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
                { shouldPlay: true, volume: 0.5 }
            );
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing notification sound:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated() || !user?.id) {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            return;
        }

        const wsUrl = ENDPOINTS.WS_NOTIFICATIONS(user.id);
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            console.log('Mobile connected to Notification WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_NOTIFICATION') {
                const newNoti = data.notification;
                setNotifications(prev => [newNoti, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Play Sound
                playNotificationSound();
                
                // Show Alert if app is active
                Alert.alert(
                    newNoti.title,
                    newNoti.message,
                    [
                        { 
                            text: "Xem", 
                            onPress: () => {
                                if (newNoti.type === 'drone') {
                                    navigate('MainTabs', { screen: 'Giám sát' });
                                } else if (newNoti.type === 'routine') {
                                    navigate('CareRoutines');
                                } else {
                                    navigate('NotificationCenter');
                                }
                            } 
                        }, 
                        { text: "Đóng" }
                    ]
                );
            }
        };

        ws.onclose = () => {
            console.log('Mobile disconnected from Notification WebSocket');
        };

        ws.onerror = (e) => {
            console.error('WebSocket Error:', e.message);
        };

        socketRef.current = ws;

        return () => {
            if (ws) ws.close();
        };
    }, [user, isAuthenticated]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(ENDPOINTS.NOTIFICATIONS_MARK_READ(id));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await axios.patch(`${ENDPOINTS.NOTIFICATIONS_READ_ALL}?user_id=${user.id}`);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const clearAll = async () => {
        if (!user?.id) return;
        try {
            await axios.delete(`${ENDPOINTS.NOTIFICATIONS_CLEAR}?user_id=${user.id}`);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            loading,
            markAsRead, 
            markAllAsRead, 
            clearAll,
            refresh: fetchNotifications 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
