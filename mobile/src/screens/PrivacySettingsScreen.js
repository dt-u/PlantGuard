import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ChevronLeft, Lock, Eye, Server, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacySettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    
    const [privacy, setPrivacy] = useState({
        dataSharing: false,
        profileVisible: true,
        historyLog: true
    });

    const toggleSwitch = (key) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const content = {
        vi: {
            title: "Quyền riêng tư",
            intro_title: "Bảo mật dữ liệu",
            intro_desc: "Chúng tôi cam kết bảo vệ thông tin của bạn.",
            mgmt: "Quản lý dữ liệu",
            history: "Lịch sử chẩn đoán",
            history_desc: "Lưu kết quả AI để xem lại",
            sharing: "Chia sẻ dữ liệu ẩn danh",
            sharing_desc: "Giúp cộng đồng cảnh báo dịch bệnh",
            account: "Tài khoản",
            profile: "Hồ sơ công khai",
            profile_desc: "Cho phép chuyên gia xem hồ sơ",
            delete: "Xóa tài khoản và dữ liệu"
        },
        en: {
            title: "Privacy",
            intro_title: "Data Secure",
            intro_desc: "We protect your personal information.",
            mgmt: "Data Management",
            history: "Diagnosis History",
            history_desc: "Save AI results for later",
            sharing: "Anonymous Sharing",
            sharing_desc: "Help community with warnings",
            account: "Account Privacy",
            profile: "Public Profile",
            profile_desc: "Allow experts to view profile",
            delete: "Delete Account and Data"
        }
    }[language] || {
        title: "Privacy",
        intro_title: "Data Secure",
        intro_desc: "We protect your personal information.",
        mgmt: "Data Management",
        history: "Diagnosis History",
        history_desc: "Save AI results for later",
        sharing: "Anonymous Sharing",
        sharing_desc: "Help community with warnings",
        account: "Account Privacy",
        profile: "Public Profile",
        profile_desc: "Allow experts to view profile",
        delete: "Delete Account and Data"
    };

    const PrivacyItem = ({ icon: Icon, title, description, value, onToggle, color }) => (
        <View style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: color + '12' }]}>
                <Icon color={color} size={18} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDescription}>{description}</Text>
            </View>
            <Switch
                trackColor={{ false: "#CBD5E1", true: "#2E7D32" }}
                onValueChange={() => onToggle()}
                value={value}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#1E293B" size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{content.title}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 60 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.introBox}>
                    <ShieldCheck color="#2E7D32" size={36} />
                    <Text style={styles.introTitle}>{content.intro_title}</Text>
                    <Text style={styles.introDesc}>{content.intro_desc}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.mgmt}</Text>
                    <PrivacyItem 
                        icon={Server}
                        title={content.history}
                        description={content.history_desc}
                        value={privacy.historyLog}
                        onToggle={() => toggleSwitch('historyLog')}
                        color="#3B82F6"
                    />
                    <PrivacyItem 
                        icon={Lock}
                        title={content.sharing}
                        description={content.sharing_desc}
                        value={privacy.dataSharing}
                        onToggle={() => toggleSwitch('dataSharing')}
                        color="#10B981"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{content.account}</Text>
                    <PrivacyItem 
                        icon={Eye}
                        title={content.profile}
                        description={content.profile_desc}
                        value={privacy.profileVisible}
                        onToggle={() => toggleSwitch('profileVisible')}
                        color="#8B5CF6"
                    />
                </View>
                
                <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>{content.delete}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
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
    backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 16, fontFamily: 'Vietnam-Bold', color: '#1E293B' },
    scroll: { paddingTop: 0 }, // Giảm padding top của ScrollView
    introBox: {
        alignItems: 'center',
        paddingVertical: 16, // Giảm padding dọc để đưa icon lên cao
        paddingHorizontal: 24,
        marginBottom: 4,
    },
    introTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginTop: 8,
        textAlign: 'center',
    },
    introDesc: {
        fontSize: 13,
        fontFamily: 'Vietnam-Regular',
        color: '#64748B',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 18,
    },
    section: { marginBottom: 20, paddingHorizontal: 16 },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#94A3B8',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        marginBottom: 8,
        elevation: 1,
    },
    iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1, marginRight: 8 },
    itemTitle: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#334155', marginBottom: 1 },
    itemDescription: { fontSize: 12, fontFamily: 'Vietnam-Regular', color: '#64748B', lineHeight: 16 },
    deleteBtn: {
        marginHorizontal: 16,
        marginTop: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FECACA',
        alignItems: 'center',
    },
    deleteText: { fontSize: 13, fontFamily: 'Vietnam-Bold', color: '#EF4444' }
});

export default PrivacySettingsScreen;
