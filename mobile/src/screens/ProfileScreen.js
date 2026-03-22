import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, History, LogOut, ChevronRight, Settings, Shield, Bell, LogIn, ArrowLeft, UserPlus, Globe, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const insets = useSafeAreaInsets();
    const [showGuestView, setShowGuestView] = React.useState(false);
    const [showLanguageModal, setShowLanguageModal] = React.useState(false);

    // Auto-close GuestView when user state changes
    useEffect(() => {
        if (user) {
            setShowGuestView(false);
        }
    }, [user]);

    const handleLogout = () => {
        Alert.alert(
            t('common.logout'),
            t('profile.logout_confirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { 
                    text: t('common.logout'), 
                    onPress: async () => {
                        await logout();
                        setShowGuestView(false);
                        navigation.navigate('MainTabs', { screen: 'Trang chủ' });
                    },
                    style: 'destructive' 
                },
            ]
        );
    };

    const handleHistoryPress = () => {
        if (isAuthenticated()) {
            navigation.navigate('History');
        } else {
            setShowGuestView(true);
        }
    };

    const selectLanguage = (lang) => {
        changeLanguage(lang);
        setShowLanguageModal(false);
    };

    if (!user && showGuestView) {
        return (
            <View style={styles.container}>
                <View style={[styles.guestContent, { paddingTop: insets.top + 60 }]}>
                    <TouchableOpacity 
                        style={[styles.backButtonGuest, { top: insets.top + 10 }]}
                        onPress={() => setShowGuestView(false)}
                    >
                        <ArrowLeft color="#2E7D32" size={24} />
                    </TouchableOpacity>

                    <View style={styles.guestIconContainer}>
                        <User color="#2E7D32" size={48} />
                    </View>
                    <Text style={styles.guestTitle}>{t('profile.not_logged_in')}</Text>
                    <Text style={styles.guestSubtitle}>{t('profile.not_logged_in_desc')}</Text>
                    
                    <TouchableOpacity 
                        style={styles.authButton} 
                        onPress={() => navigation.navigate('Login')}
                    >
                        <LinearGradient
                            colors={['#2E7D32', '#10B981']}
                            style={styles.gradient}
                        >
                            <Text style={styles.authButtonText}>{t('profile.login_now')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
            <LinearGradient
                colors={['#2E7D32', '#10B981']}
                style={[styles.header, { paddingTop: Math.max(insets.top + 30, 65), paddingBottom: 40 }]}
            >
                {user ? (
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <User color="#2E7D32" size={40} />
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.guestHeaderWrapper}>
                        <View style={styles.guestActionRow}>
                            <TouchableOpacity 
                                style={styles.authButtonSmall}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <LinearGradient
                                    colors={['#2E7D32', '#10B981']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.authButtonGradient}
                                >
                                    <LogIn color="#FFFFFF" size={20} />
                                    <Text style={[styles.authButtonSmallText, { color: '#FFFFFF' }]}>{t('common.login')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.authButtonSmall}
                                onPress={() => navigation.navigate('Register')}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#6366F1']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.authButtonGradient}
                                >
                                    <UserPlus color="#FFFFFF" size={20} />
                                    <Text style={[styles.authButtonSmallText, { color: '#FFFFFF' }]}>{t('common.register')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
                
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={handleHistoryPress}
                >
                    <View style={styles.menuIconContainer}>
                        <History color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{t('profile.history')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Bell color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{t('profile.notifications')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => setShowLanguageModal(true)}
                >
                    <View style={styles.menuIconContainer}>
                        <Globe color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{t('profile.language')}</Text>
                    <View style={styles.languageValue}>
                        <Text style={styles.languageText}>
                            {language === 'vi' ? 'Tiếng Việt' : 'English'}
                        </Text>
                        <ChevronRight color="#CBD5E1" size={20} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Shield color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{t('profile.privacy')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Settings color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{t('profile.app_settings')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                {user && (
                    <TouchableOpacity 
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
                            <LogOut color="#EF4444" size={20} />
                        </View>
                        <Text style={[styles.menuLabel, styles.logoutLabel]}>{t('common.logout')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.versionText}>{t('profile.version')}</Text>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowLanguageModal(false)}
                >
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>{t('profile.language')}</Text>
                        
                        <TouchableOpacity 
                            style={styles.languageOption}
                            onPress={() => selectLanguage('vi')}
                        >
                            <Text style={[styles.languageOptionText, language === 'vi' && styles.languageOptionActive]}>Tiếng Việt</Text>
                            {language === 'vi' && <Check color="#2E7D32" size={20} />}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.languageOption}
                            onPress={() => selectLanguage('en')}
                        >
                            <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionActive]}>English (US)</Text>
                            {language === 'en' && <Check color="#2E7D32" size={20} />}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.closeSheetBtn}
                            onPress={() => setShowLanguageModal(false)}
                        >
                            <Text style={styles.closeSheetText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    nameContainer: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Vietnam-Bold',
        color: '#FFFFFF',
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Vietnam-Medium',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    guestHeaderWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestActionRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        width: '100%',
    },
    authButtonSmall: {
        flex: 1,
        maxWidth: 160,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    authButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
    },
    authButtonSmallText: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        marginLeft: 8,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
        marginTop: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 13.5,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 9,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Vietnam-SemiBold',
        color: '#1E293B',
    },
    languageValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    languageText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Medium',
        color: '#64748B',
    },
    logoutItem: {
        marginTop: 15,
    },
    logoutIconContainer: {
        backgroundColor: '#FEF2F2',
    },
    logoutLabel: {
        color: '#EF4444',
    },
    backButtonGuest: {
        position: 'absolute',
        left: 20,
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 20,
    },
    guestContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: '#F8FAFC',
        position: 'relative',
    },
    guestIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 24,
        fontFamily: 'Vietnam-Bold',
        color: '#0F172A',
        marginBottom: 12,
    },
    guestSubtitle: {
        fontSize: 15,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    authButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#CBD5E1',
        fontFamily: 'Vietnam-Medium',
        marginTop: 35,
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    languageOptionText: {
        fontSize: 16,
        fontFamily: 'Vietnam-Medium',
        color: '#374151',
    },
    languageOptionActive: {
        color: '#2E7D32',
        fontFamily: 'Vietnam-Bold',
    },
    closeSheetBtn: {
        marginTop: 20,
        paddingVertical: 15,
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        alignItems: 'center',
    },
    closeSheetText: {
        fontSize: 15,
        fontFamily: 'Vietnam-Bold',
        color: '#4B5563',
    }
});

export default ProfileScreen;