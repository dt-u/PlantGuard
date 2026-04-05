import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldAlert, FileText, Bell, CheckCircle2, Trash2, LogIn, Clock, Info } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { ENDPOINTS } from '../api/config';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

const SystemNotificationsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { user, isAuthenticated } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    
    const [notifications, setNotifications] = useState([]);
    
    const fetchNotifications = async () => {
        if (isAuthenticated() && user?.id) {
            try {
                setLoading(true);
                const response = await axios.get(`${ENDPOINTS.NOTIFICATIONS_LIST}?user_id=${user.id}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user, isAuthenticated]);

    const getIconAndColor = (type) => {
        switch (type) {
            case 'health':
                return { icon: ShieldAlert, color: '#EF4444' };
            case 'drone':
                return { icon: FileText, color: '#3B82F6' };
            case 'system':
                return { icon: Info, color: '#10B981' };
            default:
                return { icon: Bell, color: '#F59E0B' };
        }
    };

    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { 
                addSuffix: true, 
                locale: language === 'vi' ? vi : enUS 
            });
        } catch (e) {
            return dateString;
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await axios.patch(`${ENDPOINTS.NOTIFICATIONS_READ_ALL}?user_id=${user.id}`);
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

    const clearAll = async () => {
        if (!user?.id) return;
        try {
            await axios.delete(`${ENDPOINTS.NOTIFICATIONS_CLEAR}?user_id=${user.id}`);
            setNotifications([]);
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(ENDPOINTS.NOTIFICATIONS_MARK_READ(id));
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const content = {
        vi: {
            title: "Thông báo",
            empty: "Không có thông báo nào",
            markRead: "Đã đọc tất cả",
            clear: "Xóa tất cả",
            loginRequired: "Vui lòng đăng nhập",
            loginSub: "Bạn cần đăng nhập để xem thông báo cá nhân cho vườn cây của mình.",
            loginBtn: "Đăng nhập ngay"
        },
        en: {
            title: "Notifications",
            empty: "No notifications yet",
            markRead: "Mark all read",
            clear: "Clear all",
            loginRequired: "Please login",
            loginSub: "You need to log in to see personalized alerts for your garden.",
            loginBtn: "Login Now"
        }
    }[language] || {
        title: "Notifications",
        empty: "No notifications yet",
        markRead: "Mark all read",
        clear: "Clear all",
        loginRequired: "Please login",
        loginSub: "You need to log in to see personalized alerts for your garden.",
        loginBtn: "Login Now"
    };

    if (!isAuthenticated()) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft color="#1E293B" size={22} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{content.title}</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.centerContent}>
                    <View style={styles.lockIconContainer}>
                        <LogIn color="#94A3B8" size={60} />
                    </View>
                    <Text style={styles.lockTitle}>{content.loginRequired}</Text>
                    <Text style={styles.lockSub}>{content.loginSub}</Text>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>{content.loginBtn}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1E293B" size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{content.title}</Text>
                <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                    <Trash2 color="#94A3B8" size={18} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {notifications.length > 0 ? (
                        <>
                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={markAllAsRead} style={styles.markReadAction}>
                                    <CheckCircle2 color="#3B82F6" size={14} />
                                    <Text style={styles.markReadText}>{content.markRead}</Text>
                                </TouchableOpacity>
                            </View>

                            {notifications.map((item) => {
                                const { icon: Icon, color } = getIconAndColor(item.type);
                                return (
                                    <TouchableOpacity 
                                        key={item.id} 
                                        style={[styles.notiCard, !item.is_read && styles.unreadCard]}
                                        onPress={() => markAsRead(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                                            <Icon color={color} size={20} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.notiTitle}>{item.title}</Text>
                                                {!item.is_read && <View style={styles.unreadDot} />}
                                            </View>
                                            <Text style={styles.notiMessage} numberOfLines={2}>{item.message}</Text>
                                            <View style={styles.timeContainer}>
                                                <Clock color="#94A3B8" size={12} />
                                                <Text style={styles.notiTime}>{formatTime(item.created_at)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Bell color="#CBD5E1" size={80} strokeWidth={1} />
                            <Text style={styles.emptyText}>{content.empty}</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    markReadAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    markReadText: {
        fontSize: 12,
        fontFamily: 'Vietnam-SemiBold',
        color: '#3B82F6',
    },
    notiCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    unreadCard: {
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notiTitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
    },
    notiMessage: {
        fontSize: 13,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        lineHeight: 18,
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    notiTime: {
        fontSize: 11,
        fontFamily: 'Vietnam-Medium',
        color: '#94A3B8',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 15,
        fontFamily: 'Vietnam-Medium',
        color: '#94A3B8',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    lockIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    lockTitle: {
        fontSize: 20,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginBottom: 10,
    },
    lockSub: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Vietnam-Bold',
    },
});

export default SystemNotificationsScreen;
