import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert, Linking, Modal, ScrollView } from 'react-native';
import { AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Beaker, ShieldCheck, Zap } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import * as Calendar from 'expo-calendar';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TreatmentCard = ({ treatments = [], diseaseKey }) => {
    const { t, language } = useLanguage();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [routineModalVisible, setRoutineModalVisible] = useState(false);
    const [routineEvents, setRoutineEvents] = useState([]);
    const [isSavingCalendar, setIsSavingCalendar] = useState(false);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Format a JS Date to Google Calendar date string: YYYYMMDDTHHmmss
    const toGCalDate = (date) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    };

    const saveAllToCalendar = async () => {
        try {
            setIsSavingCalendar(true);
            
            // 1. Request Permissions
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập lịch để sử dụng tính năng này.');
                setIsSavingCalendar(false);
                return;
            }

            if (Platform.OS === 'ios') {
                const { status: remindersStatus } = await Calendar.requestRemindersPermissionsAsync();
                if (remindersStatus !== 'granted') {
                    Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập lời nhắc.');
                    setIsSavingCalendar(false);
                    return;
                }
            }

            // 2. Find the best calendar to save to (Prefer Google Calendar)
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            
            // Priority 1: A calendar that is already synced with Google
            // Priority 2: The default calendar of the device
            // Priority 3: Any writeable calendar
            let targetCalendar = calendars.find(cal => 
                cal.allowsModifications && 
                (cal.source?.type === 'com.google' || cal.source?.name?.includes('@gmail.com'))
            );

            if (!targetCalendar) {
                targetCalendar = await Calendar.getDefaultCalendarAsync();
            }

            if (!targetCalendar || !targetCalendar.allowsModifications) {
                targetCalendar = calendars.find(cal => cal.allowsModifications);
            }

            if (!targetCalendar) {
                Alert.alert('Lỗi', 'Không tìm thấy lịch nào có quyền ghi trên thiết bị.');
                setIsSavingCalendar(false);
                return;
            }

            // 3. Create all events in that calendar
            for (const event of routineEvents) {
                const startDate = new Date(event.date);
                const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
                
                await Calendar.createEventAsync(targetCalendar.id, {
                    title: `[PlantGuard] ${event.title}`,
                    startDate,
                    endDate,
                    notes: event.description,
                    location: 'Khu vườn của bạn',
                    alarms: [{ relativeOffset: -60, method: Calendar.AlarmMethod.ALERT }] // Notify 1 hour before
                });
            }

            Alert.alert(
                'Thành công', 
                `Đã lưu ${routineEvents.length} mốc chăm sóc vào lịch "${targetCalendar.title}". Mở Google Calendar để kiểm tra nhé!`
            );
            setRoutineModalVisible(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lưu vào lịch. Vui lòng thử lại.');
        } finally {
            setIsSavingCalendar(false);
        }
    };

    const startRoutine = async (item) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/routine/generate`, {
                disease_name: diseaseKey || 'Unknown',
                level: item.level || 'Moderate',
                action: item.action,
                product: item.product,
                is_tracking_enabled: false
            });
            if (response.data && response.data.events) {
                setRoutineEvents(response.data.events);
                setRoutineModalVisible(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo lịch. Kiểm tra kết nối mạng.');
        }
    };

    const formatEventDate = (isoString) => {
        const d = new Date(isoString);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    };

    const getSeverityStyles = (level) => {
        const lowerLevel = (level || '').toLowerCase();
        if (lowerLevel.includes('nhẹ') || lowerLevel.includes('mild') || lowerLevel.includes('duy trì') || lowerLevel.includes('maintenance')) {
            return { color: '#10B981', bg: '#F0FDF4', icon: <CheckCircle2 size={18} color="#10B981" />, label: t('treatment.mild') };
        }
        if (lowerLevel.includes('trung bình') || lowerLevel.includes('moderate')) {
            return { color: '#F59E0B', bg: '#FFFBEB', icon: <AlertCircle size={18} color="#F59E0B" />, label: t('treatment.moderate') };
        }
        if (lowerLevel.includes('nặng') || lowerLevel.includes('severe')) {
            return { color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={18} color="#EF4444" />, label: t('treatment.severe') };
        }
        return { color: '#6B7280', bg: '#F3F4F6', icon: <Zap size={18} color="#6B7280" />, label: level };
    };

    // Helper to get translated treatment item
    const getTranslatedTreatment = (item, index) => {
        if (language === 'vi') return item;

        const diseaseDetails = t(`disease_details.${diseaseKey}`);
        if (typeof diseaseDetails === 'object' && diseaseDetails.treatments) {
            // Find corresponding treatment by level index or level name
            const translatedItem = diseaseDetails.treatments[index] || 
                                 diseaseDetails.treatments.find(tr => tr.level.toLowerCase() === (item.level || '').toLowerCase());
            
            if (translatedItem) {
                return {
                    ...item,
                    identification_guide: translatedItem.identification_guide || item.identification_guide,
                    action: translatedItem.action || item.action,
                    product: translatedItem.product || item.product,
                    level: translatedItem.level || item.level
                };
            }
        }
        return item;
    };

    return (
        <>
        <View style={styles.container}>
            {treatments.map((rawItem, index) => {
                const item = getTranslatedTreatment(rawItem, index);
                const isExpanded = expandedIndex === index;
                const severity = getSeverityStyles(item.level || item.severity);

                return (
                    <View key={index} style={[styles.card, isExpanded && styles.expandedCard]}>
                        <TouchableOpacity 
                            style={[styles.header, { backgroundColor: severity.bg }]} 
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                {severity.icon}
                                <Text style={[styles.levelText, { color: severity.color }]}>
                                    {severity.label}
                                </Text>
                            </View>
                            {isExpanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
                        </TouchableOpacity>

                        <View style={styles.content}>
                            <Text style={styles.actionText} numberOfLines={isExpanded ? 0 : 2}>
                                {item.action || item.name}
                            </Text>
                            
                            {isExpanded && (
                                <View style={styles.details}>
                                    <View style={styles.divider} />
                                    
                                    <View style={styles.detailItem}>
                                        <View style={styles.detailHeader}>
                                            <ShieldCheck size={14} color="#6B7280" />
                                            <Text style={styles.detailLabel}>{t('treatment.id_guide')}</Text>
                                        </View>
                                        <Text style={styles.detailText}>{item.identification_guide || item.description}</Text>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <View style={styles.detailHeader}>
                                            <Beaker size={14} color="#6B7280" />
                                            <Text style={styles.detailLabel}>{t('treatment.product')}</Text>
                                        </View>
                                        <View style={styles.productBadge}>
                                            <Text style={styles.productText}>{item.product}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.routineSection}>
                                        <TouchableOpacity 
                                            style={styles.routineBtn} 
                                            onPress={() => startRoutine(item)}
                                        >
                                            <Text style={styles.routineBtnText}>Lưu lịch điều trị</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {!isExpanded && (
                                <Text style={styles.clickHint}>{t('treatment.click_detail')}</Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>

        {/* Routine Schedule Modal */}
        <Modal
            visible={routineModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setRoutineModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                    <Text style={styles.modalTitle}>Lịch chăm sóc đề xuất</Text>
                    <Text style={styles.modalSubtitle}>3 mốc thời gian được tự động tính từ hôm nay</Text>

                    <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
                        {routineEvents.map((ev, idx) => (
                            <View key={idx} style={styles.eventCard}>
                                <View style={styles.eventDayBadge}>
                                    <Text style={styles.eventDayText}>{idx === 0 ? 'Ngày 1' : idx === 1 ? 'Ngày 3' : 'Ngày 7'}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.eventTitle}>{ev.title}</Text>
                                    <Text style={styles.eventDate}>{formatEventDate(ev.date)}</Text>
                                    <Text style={styles.eventDesc}>{ev.description}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveAllBtn, isSavingCalendar && { opacity: 0.7 }]}
                        onPress={saveAllToCalendar}
                        disabled={isSavingCalendar}
                    >
                        <Text style={styles.saveAllBtnText}>
                            {isSavingCalendar ? 'Đang lưu...' : 'Lưu vào Google Calendar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={() => setRoutineModalVisible(false)}
                    >
                        <Text style={styles.modalCloseBtnText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </>  
    );
};

const styles = StyleSheet.create({
    container: { gap: 12 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    expandedCard: {
        borderColor: '#E5E7EB',
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    levelText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
    actionText: {
        fontSize: 15,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
        lineHeight: 22,
    },
    clickHint: {
        fontSize: 11,
        fontFamily: 'Vietnam-Medium',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 12,
    },
    details: {
        marginTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    detailItem: {
        marginBottom: 16,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 11,
        fontFamily: 'Vietnam-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Regular',
        color: '#4B5563',
        lineHeight: 18,
        paddingLeft: 20,
    },
    productBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginLeft: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    productText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        color: '#065F46',
    },
    routineSection: {
        marginTop: 16,
    },
    routineBtn: {
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
    routineBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 13,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Regular',
        color: '#9CA3AF',
        marginBottom: 8,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    eventDayBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        minWidth: 52,
        alignItems: 'center',
    },
    eventDayText: {
        fontSize: 11,
        fontFamily: 'Vietnam-Bold',
        color: '#10B981',
    },
    eventTitle: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    eventDate: {
        fontSize: 11,
        fontFamily: 'Vietnam-Regular',
        color: '#9CA3AF',
        marginBottom: 4,
    },
    eventDesc: {
        fontSize: 11,
        fontFamily: 'Vietnam-Regular',
        color: '#6B7280',
        lineHeight: 16,
    },
    saveAllBtn: {
        marginTop: 16,
        backgroundColor: '#4285F4',
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveAllBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 14,
    },
    modalCloseBtn: {
        marginTop: 16,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseBtnText: {
        fontFamily: 'Vietnam-Bold',
        fontSize: 14,
        color: '#374151',
    },
});

export default TreatmentCard;