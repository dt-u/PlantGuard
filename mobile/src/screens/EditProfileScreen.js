import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, Phone, Camera, ChevronLeft, Save } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const EditProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const insets = useSafeAreaInsets();

    const content = {
        vi: {
            title: "Chỉnh sửa hồ sơ",
            save: "Lưu thay đổi",
            name: "Tên hiển thị",
            email: "Email (Không thể đổi)",
            phone: "Số điện thoại",
            change_avatar: "Thay đổi ảnh đại diện",
            success: "Thành công",
            success_msg: "Đã cập nhật hồ sơ của bạn."
        },
        en: {
            title: "Edit Profile",
            save: "Save Changes",
            name: "Display Name",
            email: "Email (Cannot be changed)",
            phone: "Phone Number",
            change_avatar: "Change Avatar",
            success: "Success",
            success_msg: "Your profile has been updated."
        }
    }[language] || {
        title: "Edit Profile",
        save: "Save Changes",
        name: "Display Name",
        email: "Email",
        phone: "Phone Number",
        change_avatar: "Change Avatar",
        success: "Success",
        success_msg: "Profile updated."
    };

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '0912345678'); 

    const handleSave = () => {
        Alert.alert(content.success, content.success_msg, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1E293B" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{content.title}</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{t('common.save') || 'Lưu'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <User color="#94A3B8" size={36} />
                        <TouchableOpacity style={styles.cameraIcon}>
                            <Camera color="#FFFFFF" size={16} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changeAvatarText}>{content.change_avatar}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>{content.name}</Text>
                    <View style={styles.inputContainer}>
                        <User color="#64748B" size={20} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập tên của bạn"
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    <Text style={styles.label}>{content.email}</Text>
                    <View style={[styles.inputContainer, styles.inputDisabled]}>
                        <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: '#94A3B8' }]}
                            value={user?.email || 'user@example.com'}
                            editable={false}
                        />
                    </View>

                    <Text style={styles.label}>{content.phone}</Text>
                    <View style={styles.inputContainer}>
                        <Phone color="#64748B" size={20} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            placeholderTextColor="#94A3B8"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <LinearGradient colors={['#2E7D32', '#10B981']} style={styles.gradient}>
                            <Save color="#FFFFFF" size={20} />
                            <Text style={styles.saveButtonText}>{content.save}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
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
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { fontSize: 17, fontFamily: 'Vietnam-Bold', color: '#1E293B' },
    saveBtn: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
    saveBtnText: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#2E7D32' },
    content: { padding: 24, paddingBottom: 60 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatarContainer: {
        width: 80, height: 80, borderRadius: 24, backgroundColor: '#F1F5F9',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12, position: 'relative'
    },
    cameraIcon: {
        position: 'absolute', bottom: -6, right: -6,
        backgroundColor: '#2E7D32', width: 28, height: 28, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#FFFFFF'
    },
    changeAvatarText: { fontSize: 13, fontFamily: 'Vietnam-Medium', color: '#3B82F6' },
    form: { gap: 16 },
    label: { fontSize: 13, fontFamily: 'Vietnam-SemiBold', color: '#64748B', marginBottom: -8, marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
        borderRadius: 14, paddingHorizontal: 16, height: 52
    },
    inputDisabled: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 15, fontFamily: 'Vietnam-Medium', color: '#1E293B', padding: 0 },
    saveButton: { marginTop: 24, borderRadius: 14, overflow: 'hidden' },
    gradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
    saveButtonText: { fontSize: 15, fontFamily: 'Vietnam-Bold', color: '#FFFFFF' }
});

export default EditProfileScreen;
