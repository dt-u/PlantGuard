import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Leaf, Eye, ArrowRight, Sprout, LogIn } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();

    const handleProfilePress = () => {
        if (isAuthenticated()) {
            navigation.navigate('Tài khoản');
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
            {/* Header / Profile */}
            <View style={[styles.header, { paddingTop: insets.top + 10, paddingBottom: 15 }]}>
                <View style={styles.logoContainer}>
                    <Sprout color="#2E7D32" size={28} />
                    <Text style={styles.logoText}>PlantGuard</Text>
                </View>
                
                <TouchableOpacity 
                    onPress={handleProfilePress}
                    style={styles.profileButton}
                >
                    {user ? (
                        <View style={styles.userBadge}>
                            <View style={styles.avatarMini}>
                                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                            </View>
                            <Text style={styles.userNameMini} numberOfLines={1}>{user.name}</Text>
                        </View>
                    ) : (
                        <View style={styles.loginBadge}>
                            <LogIn color="#2E7D32" size={16} />
                            <Text style={styles.loginTextMini}>{t('common.login')}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

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
    }
});

export default HomeScreen;