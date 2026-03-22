import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { t } = useLanguage();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert(t('common.error'), t('auth.fill_all'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t('common.error'), t('auth.confirm_mismatch'));
            return;
        }

        if (password.length < 6) {
            Alert.alert(t('common.error'), t('auth.pass_too_short'));
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);

        if (result.success) {
            Alert.alert(
                t('common.success'), 
                t('auth.register_success_desc'),
                [{ text: t('common.ok'), onPress: () => navigation.replace('Login') }]
            );
        } else {
            Alert.alert(t('auth.register_failed'), result.error);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })} 
                    style={styles.backButton}
                >
                    <ArrowLeft color="#3B82F6" size={24} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <UserPlus color="#3B82F6" size={40} />
                    </View>
                    <Text style={styles.title}>{t('auth.register_title')}</Text>
                    <Text style={styles.subtitle}>{t('auth.register_subtitle')}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('common.full_name')}</Text>
                        <View style={styles.inputWrapper}>
                            <User color="#94A3B8" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('common.email')}</Text>
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
                        <Text style={styles.label}>{t('common.password')}</Text>
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
                        <Text style={styles.hint}>{t('auth.password_hint')}</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('common.confirm_password')}</Text>
                        <View style={styles.inputWrapper}>
                            <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                        onPress={handleRegister} 
                        disabled={loading}
                        style={styles.registerButtonWrapper}
                    >
                        <LinearGradient
                            colors={['#3B82F6', '#6366F1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.registerButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.registerButtonText}>{t('common.register')}</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('auth.already_account')} </Text>
                        <TouchableOpacity onPress={() => navigation.replace('Login')}>
                            <Text style={styles.linkText}>{t('common.login')}</Text>
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
        backgroundColor: '#F8FAFC',
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
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    title: {
        fontSize: 26,
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
        marginBottom: 16,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        marginBottom: 6,
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
        height: 52,
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
    hint: {
        fontSize: 10,
        fontFamily: 'Vietnam-Medium',
        color: '#94A3B8',
        marginTop: 4,
        marginLeft: 4,
        fontStyle: 'italic',
    },
    registerButtonWrapper: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 20,
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
        color: '#3B82F6',
    },
});

export default RegisterScreen;