import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert, Modal, ScrollView, TextInput, Switch, Linking } from 'react-native';
import * as Calendar from 'expo-calendar';
import { AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Beaker, ShieldCheck, Zap, Info, Calendar as CalendarIcon, Leaf, Sprout, ShoppingBag } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../api/config';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TreatmentCard = ({ treatments = [], diseaseKey, onBuyPress, imageUrl }) => {
    const { t, language } = useLanguage();
    const { user, getUserId } = useAuth();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [routineModalVisible, setRoutineModalVisible] = useState(false);
    const [routineEvents, setRoutineEvents] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    
    // New fields for Smart Care Routine
    const [plantName, setPlantName] = useState('');
    const [isStrictTracking, setIsStrictTracking] = useState(true);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getDayNumber = (eventDate, firstEventDate) => {
        const start = new Date(firstEventDate);
        start.setHours(0, 0, 0, 0);
        const current = new Date(eventDate);
        current.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(current - start);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays + 1;
    };

    const openGoogleCalendar = async () => {
        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập lịch để đồng bộ lộ trình.');
                return;
            }

            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            
            // Tìm lịch phù hợp để lưu (Ưu tiên Gmail hoặc Lịch mặc định)
            let targetCalendar = calendars.find(cal => cal.allowsModifications && (cal.type === 'gmail' || cal.source?.name?.toLowerCase().includes('gmail')))
                              || calendars.find(cal => cal.allowsModifications && cal.isPrimary)
                              || calendars.find(cal => cal.allowsModifications);

            if (!targetCalendar) {
                Alert.alert('Lỗi', 'Không tìm thấy lịch khả dụng trên thiết bị này.');
                return;
            }

            setIsSaving(true);
            
            for (const ev of routineEvents) {
                const startDate = new Date(ev.date);
                startDate.setHours(8, 0, 0, 0); 
                const endDate = new Date(ev.date);
                endDate.setHours(9, 0, 0, 0);

                await Calendar.createEventAsync(targetCalendar.id, {
                    title: `[PlantGuard] ${ev.title} - ${plantName}`,
                    startDate,
                    endDate,
                    notes: ev.description,
                    location: 'Vườn của bạn',
                    timeZone: 'Asia/Ho_Chi_Minh',
                    alarms: [{ relativeOffset: -30 }], // Nhắc trước 30 phút
                });
            }

            Alert.alert(
                'Đồng bộ thành công',
                `Đã thêm ${routineEvents.length} lời nhắc chăm sóc vào lịch "${targetCalendar.title}" trên điện thoại của bạn.`,
                [
                    { 
                        text: 'Kiểm tra', 
                        onPress: () => {
                            setRoutineModalVisible(false);
                            const url = Platform.OS === 'ios' ? 'calshow:' : 'content://com.android.calendar/time/';
                            Linking.openURL(url).catch(() => {
                                Alert.alert('Thông báo', 'Không thể mở tự động ứng dụng Lịch, bạn hãy mở thủ công để kiểm tra nhé.');
                            });
                        } 
                    },
                    { text: 'Tuyệt vời', onPress: () => setRoutineModalVisible(false) }
                ]
            );
        } catch (error) {
            console.error('Calendar Sync Error:', error);
            Alert.alert('Lỗi', 'Không thể đồng bộ với lịch trên thiết bị. Vui lòng kiểm tra lại quyền truy cập.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveRoutineToDB = async () => {
        if (!plantName.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên cây (ví dụ: Cà chua ban công).');
            return;
        }

        try {
            setIsSaving(true);
            const userId = getUserId();
            
            const response = await axios.post(ENDPOINTS.ROUTINE_CREATE, {
                user_id: userId,
                plant_name: plantName,
                disease_name: diseaseKey || 'Bệnh chưa xác định',
                image_url: imageUrl,
                is_strict_tracking: isStrictTracking,
                events: routineEvents
            });

            if (response.data.status === 'success') {
                Alert.alert(
                    'Thành công',
                    'Đã lưu lịch trình chăm sóc vào hệ thống PlantGuard.',
                    [
                        { 
                            text: 'Đồng bộ Google Calendar', 
                            onPress: openGoogleCalendar 
                        },
                        { 
                            text: 'Xong', 
                            onPress: () => setRoutineModalVisible(false) 
                        }
                    ]
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lưu lịch trình. Vui lòng thử lại sau.');
        } finally {
            setIsSaving(false);
        }
    };

    const startRoutine = async (item) => {
        if (!user) {
            Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để sử dụng tính năng theo dõi tiến độ chăm sóc.');
            return;
        }

        try {
            const response = await axios.post(ENDPOINTS.ROUTINE_GENERATE, {
                disease_name: diseaseKey || 'Unknown',
                level: item.level || 'Moderate',
                action: item.action,
                product: item.product_name || item.product
            });
            if (response.data && response.data.events) {
                setRoutineEvents(response.data.events);
                setPlantName('');
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
        if (lowerLevel.includes('nhẹ') || lowerLevel.includes('mild')) {
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

    const getTranslatedTreatment = (item, index) => {
        if (language === 'vi') return item;
        const diseaseDetails = t(`disease_details.${diseaseKey}`);
        if (typeof diseaseDetails === 'object' && diseaseDetails.treatments) {
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
                const productName = item.product_name || item.product;

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
                                            <Text style={styles.productText}>{productName}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.routineSection}>
                                        <TouchableOpacity 
                                            style={styles.routineBtn} 
                                            onPress={() => startRoutine(item)}
                                        >
                                            <CalendarIcon size={16} color="#FFF" style={{ marginRight: 8 }} />
                                            <Text style={styles.routineBtnText}>Lập kế hoạch chăm sóc</Text>
                                        </TouchableOpacity>

                                        {productName && 
                                         productName !== 'N/A' && 
                                         productName !== 'n/a' && 
                                         productName !== 'Dọn dẹp tàn dư rơm rạ' && 
                                         productName !== 'Dừng canh tác cây họ cà một vụ' && 
                                         productName !== 'Không có thuốc chữa (Virus)' && 
                                         productName !== 'Luân canh cây không cùng họ (Đậu, Lạc)' && 
                                         productName !== 'Nước sạch' && 
                                         productName !== 'Vệ sinh đồng ruộng' && 
                                         productName !== 'Ánh sáng tự nhiên' && 
                                         onBuyPress && (
                                            <TouchableOpacity 
                                                style={[styles.buyButton, { backgroundColor: '#2980B9' }]}
                                                onPress={() => onBuyPress(item)}
                                                activeOpacity={0.8}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <ShoppingBag size={18} color="white" />
                                                    <Text style={styles.buyButtonText}>Mua ngay</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
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

        <Modal
            visible={routineModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setRoutineModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalHeader}>
                        <Sprout color="#2E7D32" size={24} />
                        <Text style={styles.modalTitle}>Lịch trình chăm sóc</Text>
                        <TouchableOpacity onPress={() => setRoutineModalVisible(false)}>
                            <XCircle size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Tên cây cần theo dõi</Text>
                            <View style={styles.inputWrapper}>
                                <Leaf size={18} color="#10B981" style={{ marginRight: 10 }} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Ví dụ: Cà chua ban công, Hoa hồng chậu 1..."
                                    value={plantName}
                                    onChangeText={setPlantName}
                                />
                            </View>
                        </View>

                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.settingTitle}>Theo dõi nghiêm ngặt</Text>
                                    <TouchableOpacity style={{ marginLeft: 6 }}>
                                        <Info size={14} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.settingDesc}>
                                    Yêu cầu xác nhận hoàn thành mỗi ngày để tính điểm tiến độ.
                                </Text>
                            </View>
                            <Switch
                                value={isStrictTracking}
                                onValueChange={setIsStrictTracking}
                                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <Text style={styles.sectionDivider}>Các mốc thời gian</Text>

                        {routineEvents.map((ev, idx) => (
                            <View key={idx} style={styles.eventCard}>
                                <View style={styles.eventDayBadge}>
                                    <Text style={styles.eventDayText}>
                                        Ngày {getDayNumber(ev.date, routineEvents[0].date)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.eventTitle}>{ev.title}</Text>
                                    <Text style={styles.eventDate}>{formatEventDate(ev.date)}</Text>
                                    <Text style={styles.eventDesc}>{ev.description}</Text>
                                </View>
                            </View>
                        ))}
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveAllBtn, isSaving && { opacity: 0.7 }]}
                        onPress={saveRoutineToDB}
                        disabled={isSaving}
                    >
                        <Text style={styles.saveAllBtnText}>
                            {isSaving ? 'Đang khởi tạo...' : 'Lưu lịch trình chăm sóc'}
                        </Text>
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
        gap: 8,
    },
    routineBtn: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    routineBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 13,
    },
    buyButton: {
        backgroundColor: '#ee4d2d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buyButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        fontWeight: 'bold',
    },
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
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
    },
    inputSection: {
        marginTop: 16,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    textInput: {
        flex: 1,
        paddingVertical: 12,
        fontFamily: 'Vietnam-Regular',
        fontSize: 14,
        color: '#1F2937',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    settingTitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
    },
    settingDesc: {
        fontSize: 12,
        fontFamily: 'Vietnam-Regular',
        color: '#6B7280',
        marginTop: 2,
    },
    sectionDivider: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 20,
        marginBottom: 10,
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
        marginTop: 20,
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveAllBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 15,
    },
});

export default TreatmentCard;