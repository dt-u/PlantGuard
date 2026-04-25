import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldAlert, FileText, Bell, CheckCircle2, Trash2, LogIn, Clock, Info } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { ENDPOINTS } from '../api/config';
import { useNotifications } from '../contexts/NotificationContext';

const formatTimeHelper = (dateString, lang) => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return lang === 'vi' ? 'Vừa xong' : 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return lang === 'vi' ? `${diffInMinutes} phút trước` : `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return lang === 'vi' ? `${diffInHours} giờ trước` : `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return lang === 'vi' ? `${diffInDays} ngày trước` : `${diffInDays}d ago`;
        
        return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US');
    } catch (e) {
        return dateString;
    }
};

const SystemNotificationsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const { notifications, loading, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredNotifications = notifications.filter(noti => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return !noti.is_read;
        return noti.type === activeFilter;
    });

    const getIconAndColor = (type) => {
        switch (type) {
            case 'drone':
                return { icon: FileText, color: '#3B82F6' };
            case 'system':
                return { icon: Info, color: '#10B981' };
            case 'routine':
                return { icon: ShieldAlert, color: '#F59E0B' };
            default:
                return { icon: Bell, color: '#64748B' };
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
            loginBtn: "Đăng nhập ngay",
            filters: {
                all: "Tất cả",
                unread: "Chưa đọc",
                drone: "Drone",
                routine: "Lộ trình"
            }
        },
        en: {
            title: "Notifications",
            empty: "No notifications yet",
            markRead: "Mark all read",
            clear: "Clear all",
            loginRequired: "Please login",
            loginSub: "You need to log in to see personalized alerts for your garden.",
            loginBtn: "Login Now",
            filters: {
                all: "All",
                unread: "Unread",
                drone: "Drone",
                routine: "Routine"
            }
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

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {Object.entries(content.filters).map(([key, label]) => (
                        <TouchableOpacity 
                            key={key}
                            onPress={() => setActiveFilter(key)}
                            style={[styles.filterTab, activeFilter === key && styles.activeFilterTab]}
                        >
                            <Text style={[styles.filterLabel, activeFilter === key && styles.activeFilterLabel]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                    {filteredNotifications.length > 0 ? (
                        <>
                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={markAllAsRead} style={styles.markReadAction}>
                                    <CheckCircle2 color="#3B82F6" size={14} />
                                    <Text style={styles.markReadText}>{content.markRead}</Text>
                                </TouchableOpacity>
                            </View>

                            {filteredNotifications.map((item) => {
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
                                                <Text style={styles.notiTime}>{formatTimeHelper(item.created_at, language)}</Text>
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
    filterContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    filterScroll: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeFilterTab: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    filterLabel: {
        fontSize: 13,
        fontFamily: 'Vietnam-Medium',
        color: '#64748B',
    },
    activeFilterLabel: {
        color: '#047857',
        fontFamily: 'Vietnam-Bold',
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
        borderColor: '#BFDBFE',
        backgroundColor: '#F0F9FF',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
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
