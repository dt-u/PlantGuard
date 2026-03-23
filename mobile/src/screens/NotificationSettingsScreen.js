import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { ChevronLeft, Bell, MessageSquare, ShieldAlert, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationSettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { t, language } = useLanguage();
    
    const [settings, setSettings] = useState({
        push: true,
        detection: true,
        report: false,
        news: true
    });

    const toggleSwitch = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Nội dung dịch trực tiếp để đảm bảo luôn hoạt động
    const content = {
        vi: {
            title: "Thông báo",
            general: "Chung",
            push: "Thông báo đẩy",
            push_desc: "Nhận cảnh báo trên màn hình khóa",
            monitor: "Cảnh báo giám sát",
            disease: "Phát hiện bệnh",
            disease_desc: "Thông báo ngay khi thấy rủi ro",
            realtime: "Cập nhật trực tiếp",
            realtime_desc: "Dữ liệu liên tục từ Drone/Camera",
            other: "Khác",
            report: "Báo cáo tuần",
            report_desc: "Tóm tắt tình hình vườn cây"
        },
        en: {
            title: "Notifications",
            general: "General",
            push: "Push Notifications",
            push_desc: "Receive alerts on lock screen",
            monitor: "Monitoring Alerts",
            disease: "Disease Detection",
            disease_desc: "Instant alerts on detection",
            realtime: "Real-time Updates",
            realtime_desc: "Continuous data from devices",
            other: "Other",
            report: "Weekly Report",
            report_desc: "Weekly summary of crop health"
        }
    }[language] || {
        title: "Notifications",
        general: "General",
        push: "Push Notifications",
        push_desc: "Receive alerts on lock screen",
        monitor: "Monitoring Alerts",
        disease: "Disease Detection",
        disease_desc: "Instant alerts on detection",
        realtime: "Real-time Updates",
        realtime_desc: "Continuous data from devices",
        other: "Other",
        report: "Weekly Report",
        report_desc: "Weekly summary of crop health"
    };

    const SettingItem = ({ icon: Icon, title, description, value, onToggle, color }) => (
        <View style={styles.settingItem}>
            <View style={[styles.iconContainer, { backgroundColor: color + '12' }]}>
                <Icon color={color} size={18} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingDescription}>{description}</Text>
            </View>
            <Switch
                trackColor={{ false: "#CBD5E1", true: "#2E7D32" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => onToggle()}
                value={value}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Thu nhỏ Switch cho gọn
            />
        </View>
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
                    <Text style={styles.sectionTitle}>{content.general}</Text>
                    <SettingItem 
                        icon={Bell}
                        title={content.push}
                        description={content.push_desc}
                        value={settings.push}
                        onToggle={() => toggleSwitch('push')}
                        color="#3B82F6"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.monitor}</Text>
                    <SettingItem 
                        icon={ShieldAlert}
                        title={content.disease}
                        description={content.disease_desc}
                        value={settings.detection}
                        onToggle={() => toggleSwitch('detection')}
                        color="#EF4444"
                    />
                    <SettingItem 
                        icon={Zap}
                        title={content.realtime}
                        description={content.realtime_desc}
                        value={settings.news}
                        onToggle={() => toggleSwitch('news')}
                        color="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.other}</Text>
                    <SettingItem 
                        icon={MessageSquare}
                        title={content.report}
                        description={content.report_desc}
                        value={settings.report}
                        onToggle={() => toggleSwitch('report')}
                        color="#10B981"
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
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
        marginBottom: 1,
    },
    settingDescription: {
        fontSize: 12,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
    },
});

export default NotificationSettingsScreen;
