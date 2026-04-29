import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, History, LogOut, ChevronRight, Settings, Shield, Bell, LogIn, ArrowLeft, UserPlus, Globe, Check, Edit2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderBell from '../components/HeaderBell';

const ProfileScreen = ({ navigation }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const insets = useSafeAreaInsets();
    const [showGuestView, setShowGuestView] = React.useState(false);
    const [showLanguageModal, setShowLanguageModal] = React.useState(false);

    useEffect(() => {
        if (user) setShowGuestView(false);
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
                        <LinearGradient colors={['#2E7D32', '#10B981']} style={styles.gradient}>
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
                style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 20 }]}
            >

                {user ? (
                    <View style={styles.profileInfo}>
                        <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('EditProfile')}>
                            <User color="#2E7D32" size={28} />
                            <View style={styles.editBadge}>
                                <Edit2 color="#FFFFFF" size={10} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.nameContainer}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                             <Edit2 color="#FFFFFF" size={20} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.guestHeaderWrapper}>
                        <View style={styles.guestActionRow}>
                            <TouchableOpacity style={styles.authButtonSmall} onPress={() => navigation.navigate('Login')}>
                                <LinearGradient colors={['#2E7D32', '#10B981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.authButtonGradient}>
                                    <LogIn color="#FFFFFF" size={18} />
                                    <Text style={styles.authButtonSmallText}>{t('common.login')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.authButtonSmall} onPress={() => navigation.navigate('Register')}>
                                <LinearGradient colors={['#3B82F6', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.authButtonGradient}>
                                    <UserPlus color="#FFFFFF" size={18} />
                                    <Text style={styles.authButtonSmallText}>{t('common.register')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
                <TouchableOpacity style={styles.menuItem} onPress={handleHistoryPress}>
                    <View style={styles.menuIconContainer}><History color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.history')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => isAuthenticated() ? navigation.navigate('CareRoutines') : setShowGuestView(true)}>
                    <View style={styles.menuIconContainer}><Calendar color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.routines')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
                    <View style={styles.menuIconContainer}><Bell color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.notifications')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
                    <View style={styles.menuIconContainer}><Globe color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.language')}</Text>
                    <View style={styles.languageValue}>
                        <Text style={styles.languageText}>{language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
                        <ChevronRight color="#CBD5E1" size={20} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
                    <View style={styles.menuIconContainer}><Shield color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.privacy')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AppSettings')}>
                    <View style={styles.menuIconContainer}><Settings color="#2E7D32" size={20} /></View>
                    <Text style={styles.menuLabel}>{t('profile.app_settings')}</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                {user && (
                    <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                        <View style={[styles.menuIconContainer, styles.logoutIconContainer]}><LogOut color="#EF4444" size={20} /></View>
                        <Text style={[styles.menuLabel, styles.logoutLabel]}>{t('common.logout')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.versionText}>{t('profile.version')}</Text>

            <Modal visible={showLanguageModal} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLanguageModal(false)}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>{t('profile.language')}</Text>
                        <TouchableOpacity style={styles.languageOption} onPress={() => selectLanguage('vi')}>
                            <Text style={[styles.languageOptionText, language === 'vi' && styles.languageOptionActive]}>Tiếng Việt</Text>
                            {language === 'vi' && <Check color="#2E7D32" size={20} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.languageOption} onPress={() => selectLanguage('en')}>
                            <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionActive]}>English (US)</Text>
                            {language === 'en' && <Check color="#2E7D32" size={20} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeSheetBtn} onPress={() => setShowLanguageModal(false)}>
                            <Text style={styles.closeSheetText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        justifyContent: 'center',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 54, // Thu nhỏ kích thước Avatar để tương xứng với nút login
        height: 54,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    nameContainer: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#FFFFFF',
    },
    editBadge: { position: 'absolute', bottom: -2, right: -4, backgroundColor: '#3B82F6', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
    editBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
    userEmail: {
        fontSize: 12,
        fontFamily: 'Vietnam-Medium',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    guestHeaderWrapper: {
        width: '100%',
    },
    guestActionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    authButtonSmall: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    authButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12, // Tương đương chiều cao avatar 54px
    },
    authButtonSmallText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    content: { paddingHorizontal: 20, paddingTop: 10 },
    sectionTitle: { fontSize: 11, fontFamily: 'Vietnam-Bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, marginBottom: 8, elevation: 1 },
    menuIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Vietnam-SemiBold', color: '#1E293B' },
    languageValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    languageText: { fontSize: 12, fontFamily: 'Vietnam-Medium', color: '#64748B' },
    logoutItem: { marginTop: 10 },
    logoutIconContainer: { backgroundColor: '#FEF2F2' },
    logoutLabel: { color: '#EF4444' },
    guestContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, backgroundColor: '#F8FAFC' },
    guestIconContainer: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    guestTitle: { fontSize: 22, fontFamily: 'Vietnam-Bold', color: '#0F172A', marginBottom: 8 },
    guestSubtitle: { fontSize: 14, fontFamily: 'Vietnam-Regular', color: '#64748B', textAlign: 'center', marginBottom: 24 },
    authButton: { width: '100%', borderRadius: 16, overflow: 'hidden' },
    gradient: { paddingVertical: 14, alignItems: 'center' },
    authButtonText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Vietnam-Bold' },
    versionText: { textAlign: 'center', fontSize: 11, color: '#CBD5E1', fontFamily: 'Vietnam-Medium', marginTop: 30, marginBottom: 10 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
    sheetHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { fontSize: 18, fontFamily: 'Vietnam-Bold', color: '#111827', marginBottom: 20, textAlign: 'center' },
    languageOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    languageOptionText: { fontSize: 15, fontFamily: 'Vietnam-Medium', color: '#374151' },
    languageOptionActive: { color: '#2E7D32', fontFamily: 'Vietnam-Bold' },
    closeSheetBtn: { marginTop: 20, paddingVertical: 14, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center' },
    closeSheetText: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#4B5563' }
});

export default ProfileScreen;
