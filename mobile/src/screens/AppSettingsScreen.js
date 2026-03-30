import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Linking, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useState, useEffect } from 'react';
import { ChevronLeft, Moon, HelpCircle, Info, Video, Database, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const AppSettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { t, language } = useLanguage();
    const { user, updatePreferences } = useAuth();
    
    const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode ?? false);
    const [videoQuality, setVideoQuality] = useState(user?.preferences?.videoQuality ?? 'auto'); // auto, high, low
    const [cacheSize, setCacheSize] = useState('Đang tính...');
    const [isClearing, setIsClearing] = useState(false);
    const [cacheBytes, setCacheBytes] = useState(0);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const calculateCacheSize = async () => {
        try {
            const cacheDir = FileSystem.cacheDirectory;
            let totalSize = 0;
            const readDir = async (dir) => {
                const items = await FileSystem.readDirectoryAsync(dir);
                for (const item of items) {
                    const itemPath = `${dir}${item}`;
                    const itemInfo = await FileSystem.getInfoAsync(itemPath, { size: true });
                    if (itemInfo.isDirectory) {
                        await readDir(itemPath + '/');
                    } else {
                        totalSize += (itemInfo.size || 0);
                    }
                }
            };
            await readDir(cacheDir);
            setCacheBytes(totalSize);
            setCacheSize(formatBytes(totalSize));
        } catch (error) {
            console.error("Error calculating cache size", error);
            setCacheSize('0 B');
            setCacheBytes(0);
        }
    };

    useEffect(() => {
        if (user?.preferences) {
            setDarkMode(user.preferences.darkMode ?? false);
            setVideoQuality(user.preferences.videoQuality ?? 'auto');
        } else {
            const loadSettings = async () => {
                try {
                    const stored = await AsyncStorage.getItem('appSettings');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        setDarkMode(parsed.darkMode ?? false);
                        setVideoQuality(parsed.videoQuality ?? 'auto');
                    }
                } catch (error) {
                    console.error('Failed to load settings', error);
                }
            };
            loadSettings();
        }
        calculateCacheSize();
    }, [user?.preferences]);

    const saveSettings = async (updates) => {
        try {
            if (user) {
                await updatePreferences(updates);
            } else {
                const stored = await AsyncStorage.getItem('appSettings');
                const parsed = stored ? JSON.parse(stored) : {};
                const newSettings = { ...parsed, darkMode, videoQuality, ...updates };
                await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
            }
        } catch (error) {
            console.error('Failed to save settings', error);
        }
    };

    const handleToggleDarkMode = () => {
        Alert.alert(
            language === 'vi' ? 'Thông báo' : 'Notice',
            language === 'vi' 
                ? 'Giao diện Tối (Dark Mode) hiện đang được phát triển ở phiên bản này.' 
                : 'Dark Mode is currently in development for this version.'
        );
        const newValue = !darkMode;
        setDarkMode(newValue);
        saveSettings({ darkMode: newValue });
    };

    const toggleVideoQuality = () => {
        let newValue = 'auto';
        if (videoQuality === 'auto') newValue = 'high';
        else if (videoQuality === 'high') newValue = 'low';
        setVideoQuality(newValue);
        saveSettings({ videoQuality: newValue });
    };

    const content = {
        vi: {
            title: "Cài đặt ứng dụng",
            pref: "Tùy chọn",
            dark: "Chế độ tối",
            video_quality: "Chất lượng Video Camera",
            video_quality_auto: "Tự động",
            storage: "Quản lý Bộ nhớ",
            clear_cache: "Xóa bộ nhớ đệm",
            clear_cache_msg: "Bạn có muốn giải phóng {{size}} bộ nhớ đệm ứng dụng?",
            support: "Hỗ trợ",
            help: "Trợ giúp & Hỗ trợ",
            about: "Giới thiệu",
            success: "Thành công",
            cache_cleared: "Đã xóa {{size}} khỏi bộ nhớ đệm."
        },
        en: {
            title: "App Settings",
            pref: "Preferences",
            dark: "Dark Mode",
            video_quality: "Video Stream Quality",
            video_quality_auto: "Auto",
            storage: "Storage",
            clear_cache: "Clear Cache",
            clear_cache_msg: "Do you want to free up {{size}} of image and video cache?",
            support: "Support",
            help: "Help & Support",
            about: "About",
            success: "Success",
            cache_cleared: "Cleared {{size}} from cache."
        }
    }[language] || {
        title: "App Settings",
        pref: "Preferences",
        dark: "Dark Mode",
        video_quality: "Video Stream Quality",
        video_quality_auto: "Auto",
        storage: "Storage",
        clear_cache: "Clear Cache",
        clear_cache_msg: "Do you want to clear the app's cache ({{size}})?",
        support: "Support",
        help: "Help & Support",
        about: "About",
        success: "Success",
        cache_cleared: "Cache cleared ({{size}} freed)."
    };

    const handleClearCache = async () => {
        if (cacheBytes === 0) {
            Alert.alert(
                language === 'vi' ? 'Thông báo' : 'Notice', 
                language === 'vi' ? 'Bộ nhớ đệm đã trống.' : 'Cache is already empty.'
            );
            return;
        }

        const msg = content.clear_cache_msg.replace('{{size}}', cacheSize);
        const successMsg = content.cache_cleared.replace('{{size}}', cacheSize);

        Alert.alert(
            content.clear_cache,
            msg,
            [
                { text: t('common.cancel') || 'Hủy', style: 'cancel' },
                { text: t('common.ok') || 'Đồng ý', onPress: async () => {
                    setIsClearing(true);
                    try {
                        const cacheDir = FileSystem.cacheDirectory;
                        const items = await FileSystem.readDirectoryAsync(cacheDir);
                        for (const item of items) {
                            await FileSystem.deleteAsync(`${cacheDir}${item}`, { idempotent: true });
                        }
                    } catch (error) {
                        console.error("Lỗi khi xóa bộ nhớ đệm", error);
                    }
                    
                    await calculateCacheSize();
                    setIsClearing(false);
                    Alert.alert(content.success, successMsg);
                }, style: 'destructive' }
            ]
        );
    };

    const handleSupport = () => {
        Linking.openURL('mailto:support@plantguard.com');
    };

    const handleAbout = () => {
        Alert.alert(
            content.about,
            language === 'vi' 
                ? 'Phiên bản 1.0.0\nỨng dụng AI Nông nghiệp bảo vệ mùa màng.' 
                : 'Version 1.0.0\nAI Agriculture App for crop protection.'
        );
    };

    const getVideoQualityText = () => {
        if (videoQuality === 'auto') return content.video_quality_auto;
        if (videoQuality === 'high') return language === 'vi' ? 'Cao' : 'High';
        return language === 'vi' ? 'Thấp (Tiết kiệm data)' : 'Low (Data Saver)';
    };

    const SettingItem = ({ icon: Icon, title, value, onPress, onToggle, toggleValue, color, isLoading }) => (
        <TouchableOpacity 
            style={styles.settingItem} 
            onPress={onPress} 
            disabled={(onToggle !== undefined && !onPress) || isLoading}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '12' }]}>
                {isLoading ? <ActivityIndicator size="small" color={color} /> : <Icon color={color} size={18} />}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{title}</Text>
                {value && <Text style={styles.settingValue}>{value}</Text>}
            </View>
            {onToggle !== undefined ? (
                <Switch
                    trackColor={{ false: "#CBD5E1", true: "#2E7D32" }}
                    onValueChange={onToggle}
                    value={toggleValue !== undefined ? toggleValue : darkMode}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
            ) : (
                <ChevronLeft color="#CBD5E1" size={18} style={{ transform: [{ rotate: '180deg' }] }} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1E293B" size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{content.title}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 60 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.pref}</Text>
                    <SettingItem 
                        icon={Moon}
                        title={content.dark}
                        onToggle={handleToggleDarkMode}
                        toggleValue={darkMode}
                        color="#8B5CF6"
                    />
                    <SettingItem 
                        icon={Video}
                        title={content.video_quality}
                        value={getVideoQualityText()}
                        onPress={toggleVideoQuality}
                        color="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.storage}</Text>
                    <SettingItem 
                        icon={Trash2}
                        title={content.clear_cache}
                        value={cacheSize}
                        onPress={handleClearCache}
                        color="#EF4444"
                        isLoading={isClearing}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.support}</Text>
                    <SettingItem 
                        icon={HelpCircle}
                        title={content.help}
                        onPress={handleSupport}
                        color="#10B981"
                    />
                    <SettingItem 
                        icon={Info}
                        title={content.about}
                        onPress={handleAbout}
                        color="#64748B"
                    />
                </View>
            </ScrollView>
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
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
    },
    scrollContent: {
        paddingTop: 16,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        marginBottom: 8,
        elevation: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    settingTitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#334155',
    },
    settingValue: {
        fontSize: 12,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        marginTop: 1,
    },
});

export default AppSettingsScreen;
