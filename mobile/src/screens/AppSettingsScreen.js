import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { ChevronLeft, Moon, HelpCircle, Info, Video, Database, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

const AppSettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { t, language } = useLanguage();
    const [darkMode, setDarkMode] = useState(false);
    const [videoQuality, setVideoQuality] = useState('auto'); // auto, high, low

    const content = {
        vi: {
            title: "Cài đặt ứng dụng",
            pref: "Tùy chọn",
            dark: "Chế độ tối",
            video_quality: "Chất lượng Video Camera",
            video_quality_auto: "Tự động",
            storage: "Quản lý Bộ nhớ",
            clear_cache: "Xóa bộ nhớ đệm",
            clear_cache_msg: "Bạn có muốn giải phóng 156 MB bộ nhớ đệm hình ảnh và video?",
            support: "Hỗ trợ",
            help: "Trợ giúp & Hỗ trợ",
            about: "Giới thiệu",
            success: "Thành công",
            cache_cleared: "Đã xóa 156 MB khỏi bộ nhớ đệm."
        },
        en: {
            title: "App Settings",
            pref: "Preferences",
            dark: "Dark Mode",
            video_quality: "Video Stream Quality",
            video_quality_auto: "Auto",
            storage: "Storage",
            clear_cache: "Clear Cache",
            clear_cache_msg: "Do you want to free up 156 MB of image and video cache?",
            support: "Support",
            help: "Help & Support",
            about: "About",
            success: "Success",
            cache_cleared: "Cleared 156 MB from cache."
        }
    }[language] || {
        title: "App Settings",
        pref: "Preferences",
        dark: "Dark Mode",
        video_quality: "Video Stream Quality",
        video_quality_auto: "Auto",
        storage: "Storage",
        clear_cache: "Clear Cache",
        clear_cache_msg: "Do you want to free up 156 MB of cache?",
        support: "Support",
        help: "Help & Support",
        about: "About",
        success: "Success",
        cache_cleared: "Cache cleared."
    };

    const handleClearCache = () => {
        Alert.alert(
            content.clear_cache,
            content.clear_cache_msg,
            [
                { text: t('common.cancel') || 'Hủy', style: 'cancel' },
                { text: t('common.ok') || 'Đồng ý', onPress: () => {
                    Alert.alert(content.success, content.cache_cleared);
                }, style: 'destructive' }
            ]
        );
    };

    const toggleVideoQuality = () => {
        if (videoQuality === 'auto') setVideoQuality('high');
        else if (videoQuality === 'high') setVideoQuality('low');
        else setVideoQuality('auto');
    };

    const getVideoQualityText = () => {
        if (videoQuality === 'auto') return content.video_quality_auto;
        if (videoQuality === 'high') return language === 'vi' ? 'Cao' : 'High';
        return language === 'vi' ? 'Thấp (Tiết kiệm data)' : 'Low (Data Saver)';
    };

    const SettingItem = ({ icon: Icon, title, value, onPress, onToggle, toggleValue, color }) => (
        <TouchableOpacity 
            style={styles.settingItem} 
            onPress={onPress} 
            disabled={onToggle !== undefined && !onPress}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '12' }]}>
                <Icon color={color} size={18} />
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
                        onToggle={() => setDarkMode(!darkMode)}
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
                        value="156 MB"
                        onPress={handleClearCache}
                        color="#EF4444"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.support}</Text>
                    <SettingItem 
                        icon={HelpCircle}
                        title={content.help}
                        onPress={() => {}}
                        color="#10B981"
                    />
                    <SettingItem 
                        icon={Info}
                        title={content.about}
                        onPress={() => {}}
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
