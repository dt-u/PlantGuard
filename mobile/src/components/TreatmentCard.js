import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert, Switch } from 'react-native';
import { AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Beaker, ShieldCheck, Zap, Calendar as CalendarIcon } from 'lucide-react-native';
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
    const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const startRoutine = async (item) => {
        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
                const defaultCalendar = calendars.find(c => c.isPrimary) || calendars[0];
                
                if (!defaultCalendar) {
                    Alert.alert("Lỗi", "Không tìm thấy ứng dụng Lịch trên thiết bị.");
                    return;
                }

                // Get routine events from backend
                const response = await axios.post(`${API_BASE_URL}/api/routine/generate`, {
                    disease_name: t(`disease_names.${diseaseKey}`, diseaseKey),
                    level: item.level || 'Moderate',
                    action: item.action,
                    product: item.product,
                    is_tracking_enabled: isTrackingEnabled
                });

                if (response.data && response.data.events) {
                    let eventsAdded = 0;
                    for (const ev of response.data.events) {
                        await Calendar.createEventAsync(defaultCalendar.id, {
                            title: ev.title,
                            startDate: new Date(ev.date),
                            endDate: new Date(new Date(ev.date).getTime() + 60 * 60 * 1000), // 1 hour
                            notes: ev.description,
                            allDay: false
                        });
                        eventsAdded++;
                    }
                    Alert.alert("Thành công", `Đã lên lịch ${eventsAdded} sự kiện chăm sóc vào Lịch của thiết bị!`);
                }
            } else {
                Alert.alert("Cấp quyền", "Vui lòng cấp quyền truy cập Lịch để PlantGuard có thể nhắc nhở bạn.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo lịch.");
        }
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
                                        <Text style={styles.routineTitle}>Tự động hóa chăm sóc</Text>
                                        <View style={styles.trackingRow}>
                                            <Text style={styles.trackingText}>Lưu tiến độ vào "Vườn của tôi"</Text>
                                            <Switch 
                                                value={isTrackingEnabled} 
                                                onValueChange={setIsTrackingEnabled}
                                                trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                                                thumbColor={isTrackingEnabled ? '#10B981' : '#9CA3AF'}
                                            />
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.routineBtn} 
                                            onPress={() => startRoutine(item)}
                                        >
                                            <CalendarIcon size={16} color="#FFFFFF" />
                                            <Text style={styles.routineBtnText}>Bắt đầu Lộ trình</Text>
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
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    routineTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
        marginBottom: 8,
    },
    trackingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trackingText: {
        fontSize: 12,
        fontFamily: 'Vietnam-Regular',
        color: '#6B7280',
    },
    routineBtn: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    routineBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 13,
    }
});

export default TreatmentCard;