import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, CheckSquare, Square } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    // Load saved credentials on mount
    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('remembered_email');
                const savedPassword = await AsyncStorage.getItem('remembered_password');
                const savedRememberMe = await AsyncStorage.getItem('remember_me');

                if (savedRememberMe === 'true') {
                    if (savedEmail) setEmail(savedEmail);
                    if (savedPassword) setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (e) {
                console.error('Error loading credentials:', e);
            }
        };
        loadCredentials();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            // Handle Remember Me logic
            try {
                if (rememberMe) {
                    await AsyncStorage.setItem('remembered_email', email);
                    await AsyncStorage.setItem('remembered_password', password);
                    await AsyncStorage.setItem('remember_me', 'true');
                } else {
                    await AsyncStorage.removeItem('remembered_email');
                    await AsyncStorage.removeItem('remembered_password');
                    await AsyncStorage.setItem('remember_me', 'false');
                }
            } catch (e) {
                console.error('Error saving credentials:', e);
            }

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('MainTabs');
            }
        } else {
            Alert.alert('Đăng nhập thất bại', result.error);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                >
                    <ArrowLeft color="#2E7D32" size={24} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <User color="#2E7D32" size={40} />
                    </View>
                    <Text style={styles.title}>Chào mừng trở lại</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục bảo vệ khu vườn của bạn</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <View style={styles.inputWrapper}>
                            <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>MẬT KHẨU</Text>
                        <View style={styles.inputWrapper}>
                            <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.rememberMeRow} 
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.7}
                    >
                        {rememberMe ? (
                            <CheckSquare color="#2E7D32" size={20} />
                        ) : (
                            <Square color="#94A3B8" size={20} />
                        )}
                        <Text style={[styles.rememberMeText, rememberMe && styles.rememberMeActive]}>
                            Ghi nhớ đăng nhập
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleLogin} 
                        disabled={loading}
                        style={styles.loginButtonWrapper}
                    >
                        <LinearGradient
                            colors={['#2E7D32', '#10B981']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.loginButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Tạo tài khoản mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FDF4',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BEE3C8',
    },
    title: {
        fontSize: 28,
        fontFamily: 'Vietnam-Bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#0F172A',
        fontFamily: 'Vietnam-Medium',
        fontSize: 15,
    },
    eyeIcon: {
        padding: 4,
    },
    rememberMeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingLeft: 4,
    },
    rememberMeText: {
        fontSize: 14,
        fontFamily: 'Vietnam-Medium',
        color: '#64748B',
        marginLeft: 8,
    },
    rememberMeActive: {
        color: '#2E7D32',
        fontFamily: 'Vietnam-Bold',
    },
    loginButtonWrapper: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
    },
    linkText: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#2E7D32',
    },
});

export default LoginScreen;
