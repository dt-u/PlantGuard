import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Animated } from 'react-native';
import { Leaf, Eye, ArrowRight, Sprout, LogIn, Database, Sparkles, AlertTriangle, CloudRain, Sun, Snowflake, Wind, CloudFog, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import HeaderBell from '../components/HeaderBell';
import ScreenHeader from '../components/ScreenHeader';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const [pendingCount, setPendingCount] = useState(0);
    const [weatherAlert, setWeatherAlert] = useState(null);

    useEffect(() => {
        if (isAuthenticated()) {
            axios.get(`${API_BASE_URL}/api/monitor/pending-captures?user_id=${user.id}`)
                .then(res => setPendingCount(res.data.length))
                .catch(err => console.log("Error fetching pending:", err));
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/weather-alert`)
            .then(res => setWeatherAlert(res.data))
            .catch(err => console.log("Error fetching weather alert:", err));
    }, []);

    const handleProfilePress = () => {
        if (isAuthenticated()) {
            navigation.navigate('Tài khoản');
        } else {
            navigation.navigate('Login');
        }
    };

    const getWeatherVisual = (alert) => {
        const condition = alert?.condition || '';
        if (condition === 'storm_or_strong_wind') {
            return { Icon: Wind, style: styles.weatherStorm, badge: 'GIÓ MẠNH', iconColor: '#FDE68A' };
        }
        if (condition === 'high_humidity_with_rain') {
            return { Icon: CloudRain, style: styles.weatherDanger, badge: 'NẤM BỆNH', iconColor: '#FDE68A' };
        }
        if (condition === 'heat_stress') {
            return { Icon: Sun, style: styles.weatherHeat, badge: 'NẮNG NÓNG', iconColor: '#FDE68A' };
        }
        if (condition === 'cold_stress') {
            return { Icon: Snowflake, style: styles.weatherCold, badge: 'NHIỆT ĐỘ THẤP', iconColor: '#CFFAFE' };
        }
        if (condition === 'fog_high_humidity') {
            return { Icon: CloudFog, style: styles.weatherFog, badge: 'SƯƠNG MÙ', iconColor: '#E2E8F0' };
        }
        if (alert?.status === 'danger') {
            return { Icon: AlertTriangle, style: styles.weatherDanger, badge: 'CẢNH BÁO', iconColor: '#FDE68A' };
        }
        return { Icon: ShieldCheck, style: styles.weatherSafe, badge: 'AN TOÀN', iconColor: '#BBF7D0' };
    };

    return (
        <View style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
            <ScreenHeader 
                paddingHorizontal={20}
                leftElement={
                    <View style={styles.logoContainer}>
                        <Sprout color="#2E7D32" size={28} />
                        <Text style={styles.logoText}>PlantGuard</Text>
                    </View>
                }
                rightElement={
                    <View style={styles.headerRight}>
                        <HeaderBell style={{ marginRight: 8 }} />
                        <TouchableOpacity 
                            onPress={handleProfilePress}
                            style={styles.profileButton}
                        >
                            {user ? (
                                <View style={styles.avatarMini}>
                                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                                </View>
                            ) : (
                                <View style={styles.guestAvatar}>
                                    <LogIn color="#2E7D32" size={14} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.title}>
                        {t('home.smart_agri')}{"\n"}
                        <Text style={styles.highlightText}>{t('home.smart_start')}</Text>
                    </Text>
                    <Text style={styles.subtitle}>{t('home.start_simple')}</Text>
                    <Text style={styles.description}>
                        {t('home.desc')}
                    </Text>
                </View>

                {weatherAlert && (
                    (() => {
                        const weatherVisual = getWeatherVisual(weatherAlert);
                        const WeatherIcon = weatherVisual.Icon;
                        return (
                    <View style={[
                        styles.weatherCard,
                        weatherVisual.style
                    ]}>
                        <View style={styles.weatherHeader}>
                            <WeatherIcon color={weatherVisual.iconColor} size={22} />
                            <Text style={styles.weatherTitle}>
                                {weatherAlert.title || 'CẢNH BÁO MÔI TRƯỜNG'}
                            </Text>
                            <View style={styles.weatherBadge}>
                                <Text style={styles.weatherBadgeText}>{weatherVisual.badge}</Text>
                            </View>
                        </View>
                        <Text style={styles.weatherMessage}>{weatherAlert.message}</Text>
                        {weatherAlert.recommendation ? (
                            <Text style={styles.weatherRecommendation}>
                                Khuyến nghị: {weatherAlert.recommendation}
                            </Text>
                        ) : null}
                    </View>
                        );
                    })()
                )}

                {/* Active Learning Banner */}
                {pendingCount > 0 && (
                    <TouchableOpacity 
                        style={styles.activeLearningBanner}
                        onPress={() => navigation.navigate('Giám sát', { screen: 'Monitor', params: { tab: 'dataset' } })}
                    >
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerIconBox}>
                                <Sparkles color="#3B82F6" size={20} />
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>{t('home.learning_title')}</Text>
                                <Text style={styles.bannerDesc}>{t('home.learning_desc', { count: pendingCount })}</Text>
                            </View>
                            <ArrowRight color="#FFFFFF" size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}


                {/* Options List - Stacked for better readability */}
                <View style={styles.menuList}>
                    <TouchableOpacity 
                        style={[styles.fullCard, styles.monitorCard]}
                        onPress={() => navigation.navigate('Giám sát')}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                                <Eye color="#3B82F6" size={24} />
                            </View>
                            <Text style={styles.cardTitle}>{t('home.monitor_mode')}</Text>
                        </View>
                        <Text style={styles.cardDesc}>
                            {t('home.monitor_desc')}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.actionText, { color: '#3B82F6' }]}>{t('home.start_now')}</Text>
                            <ArrowRight color="#3B82F6" size={16} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.fullCard, styles.doctorCard]}
                        onPress={() => navigation.navigate('Bác sĩ')}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                                <Leaf color="#2E7D32" size={24} />
                            </View>
                            <Text style={styles.cardTitle}>{t('home.doctor_mode')}</Text>
                        </View>
                        <Text style={styles.cardDesc}>
                            {t('home.doctor_desc')}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.actionText, { color: '#2E7D32' }]}>{t('home.diagnose_now')}</Text>
                            <ArrowRight color="#2E7D32" size={16} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>{t('home.footer')}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#F8FAFC',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginLeft: 8,
    },
    profileButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarMini: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
        color: '#2E7D32',
    },
    userNameMini: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        maxWidth: 80,
    },
    loginBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    loginTextMini: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#2E7D32',
    },
    heroSection: {
        paddingHorizontal: 24,
        marginTop: 15,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Vietnam-Bold',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 40,
    },
    highlightText: {
        color: '#2E7D32',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-SemiBold',
        color: '#10B981',
        marginTop: 4,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    menuList: {
        paddingHorizontal: 24,
        marginTop: 40,
        gap: 20,
    },
    fullCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    monitorCard: {
        borderLeftWidth: 6,
        borderLeftColor: '#3B82F6',
    },
    doctorCard: {
        borderLeftWidth: 6,
        borderLeftColor: '#2E7D32',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
    },
    cardDesc: {
        fontSize: 14,
        fontFamily: 'Vietnam-Medium',
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Vietnam-Medium',
        color: '#CBD5E1',
        marginTop: 40,
    },
    activeLearningBanner: {
        marginHorizontal: 24,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    bannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    bannerIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#FFFFFF',
    },
    bannerDesc: {
        fontSize: 11,
        fontFamily: 'Vietnam-Medium',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    weatherCard: {
        marginHorizontal: 24,
        marginTop: 18,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 2,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    weatherDanger: {
        backgroundColor: '#B91C1C',
        borderColor: '#FCA5A5',
        shadowColor: '#B91C1C',
    },
    weatherSafe: {
        backgroundColor: '#047857',
        borderColor: '#6EE7B7',
        shadowColor: '#047857',
    },
    weatherStorm: {
        backgroundColor: '#7F1D1D',
        borderColor: '#FCA5A5',
        shadowColor: '#7F1D1D',
    },
    weatherHeat: {
        backgroundColor: '#C2410C',
        borderColor: '#FDBA74',
        shadowColor: '#C2410C',
    },
    weatherCold: {
        backgroundColor: '#1D4ED8',
        borderColor: '#93C5FD',
        shadowColor: '#1D4ED8',
    },
    weatherFog: {
        backgroundColor: '#475569',
        borderColor: '#CBD5E1',
        shadowColor: '#475569',
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    weatherTitle: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
    },
    weatherMessage: {
        marginTop: 8,
        color: '#FFFFFF',
        opacity: 0.95,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Vietnam-Medium',
    },
    weatherRecommendation: {
        marginTop: 8,
        color: '#FFFFFF',
        fontSize: 11,
        lineHeight: 17,
        fontFamily: 'Vietnam-SemiBold',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    weatherBadge: {
        marginLeft: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    weatherBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
    },
});

export default HomeScreen;