import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, History, LogOut, ChevronRight, Settings, Shield, Bell, LogIn, ArrowLeft, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const insets = useSafeAreaInsets();
    const [showGuestView, setShowGuestView] = React.useState(false);

    // Tự động đóng GuestView khi trạng thái user thay đổi (đăng nhập thành công)
    useEffect(() => {
        if (user) {
            setShowGuestView(false);
        }
    }, [user]);

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Đăng xuất', 
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
                    <Text style={styles.guestTitle}>Chưa đăng nhập</Text>
                    <Text style={styles.guestSubtitle}>Đăng nhập để lưu lịch sử chẩn đoán và quản lý tài khoản của bạn</Text>
                    
                    <TouchableOpacity 
                        style={styles.authButton} 
                        onPress={() => navigation.navigate('Login')}
                    >
                        <LinearGradient
                            colors={['#2E7D32', '#10B981']}
                            style={styles.gradient}
                        >
                            <Text style={styles.authButtonText}>Đăng nhập ngay</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#2E7D32', '#10B981']}
                style={[styles.header, { paddingTop: Math.max(insets.top + 35, 70), paddingBottom: 50 }]}
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
                                    <Text style={[styles.authButtonSmallText, { color: '#FFFFFF' }]}>Đăng nhập</Text>
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
                                    <Text style={[styles.authButtonSmallText, { color: '#FFFFFF' }]}>Đăng ký</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Tài khoản</Text>
                
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={handleHistoryPress}
                >
                    <View style={styles.menuIconContainer}>
                        <History color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>Lịch sử chẩn đoán</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Bell color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>Thông báo</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Cài đặt</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Shield color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>Quyền riêng tư</Text>
                    <ChevronRight color="#CBD5E1" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <Settings color="#2E7D32" size={20} />
                    </View>
                    <Text style={styles.menuLabel}>Thiết lập ứng dụng</Text>
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
                        <Text style={[styles.menuLabel, styles.logoutLabel]}>Đăng xuất</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.versionText}>PlantGuard v1.0.0 • AI Agriculture</Text>
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
        width: 72,
        height: 72,
        borderRadius: 24,
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
        paddingTop: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 12,
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
    logoutItem: {
        marginTop: 20,
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
        marginTop: 40,
        marginBottom: 40,
    }
});

export default ProfileScreen;