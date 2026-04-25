import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, StatusBar, Switch } from 'react-native';
import { ChevronLeft, Calendar, CheckCircle2, Circle, Clock, AlertCircle, ShieldCheck } from 'lucide-react-native';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../api/config';

const RoutineDetailScreen = ({ route, navigation }) => {
    const { routineId } = route.params;
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const fetchRoutineDetail = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(ENDPOINTS.ROUTINE_DETAIL(routineId));
            setRoutine(response.data);
        } catch (error) {
            console.error('Error fetching routine detail:', error);
            Alert.alert('Lỗi', 'Không thể tải chi tiết lịch trình chăm sóc.');
        } finally {
            setLoading(false);
        }
    }, [routineId]);

    useEffect(() => {
        fetchRoutineDetail();
    }, [fetchRoutineDetail]);

    const toggleStrictTracking = async (value) => {
        try {
            // Optimistic update
            setRoutine(prev => ({ ...prev, is_strict_tracking: value }));
            
            await axios.put(ENDPOINTS.ROUTINE_UPDATE_SETTINGS(routineId), {
                is_strict_tracking: value
            });
        } catch (error) {
            console.error('Error updating tracking mode:', error);
            // Revert on error
            setRoutine(prev => ({ ...prev, is_strict_tracking: !value }));
            Alert.alert('Lỗi', 'Không thể cập nhật chế độ theo dõi.');
        }
    };

    const updateEventStatus = async (eventId, newStatus) => {
        try {
            setUpdatingStatus(eventId);
            await axios.put(ENDPOINTS.ROUTINE_UPDATE_EVENT(routineId, eventId), {
                status: newStatus
            });
            
            // Cập nhật state cục bộ để UI phản hồi ngay lập tức
            setRoutine(prev => ({
                ...prev,
                events: prev.events.map(e => e.id === eventId ? { ...e, status: newStatus } : e)
            }));
            
            if (newStatus === 'completed') {
                Alert.alert('Tuyệt vời!', 'Bạn đã hoàn thành công việc chăm sóc hôm nay. Hãy tiếp tục duy trì nhé!');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const isToday = (dateStr) => {
        const today = new Date();
        const d = new Date(dateStr);
        return today.getDate() === d.getDate() && 
               today.getMonth() === d.getMonth() && 
               today.getFullYear() === d.getFullYear();
    };

    const formatEventDate = (isoString) => {
        const d = new Date(isoString);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Đang tải lộ trình...</Text>
            </SafeAreaView>
        );
    }

    if (!routine) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <AlertCircle size={48} color="#9CA3AF" />
                <Text style={styles.errorText}>Không tìm thấy dữ liệu lộ trình.</Text>
                <TouchableOpacity style={styles.backBtnLarge} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết lộ trình</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topCard}>
                    <View style={styles.plantHeader}>
                        <View style={styles.imagePlaceholder}>
                             <ShieldCheck size={32} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.plantName}>{routine.plant_name}</Text>
                            <Text style={styles.diseaseName}>{routine.disease_name}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    
                    <View style={styles.settingsRow}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.settingLabel}>Theo dõi nghiêm ngặt</Text>
                                {routine.is_strict_tracking ? (
                                    <View style={[styles.miniBadge, styles.strictBadge]}>
                                        <Text style={styles.miniBadgeText}>ON</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.miniBadge, styles.relaxedBadge]}>
                                        <Text style={styles.miniBadgeText}>OFF</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.settingHint}>
                                {routine.is_strict_tracking 
                                    ? 'Yêu cầu xác nhận hoàn thành mỗi ngày.' 
                                    : 'Chế độ nhắc nhở linh hoạt, không bắt buộc.'}
                            </Text>
                        </View>
                        <Switch
                            value={routine.is_strict_tracking}
                            onValueChange={toggleStrictTracking}
                            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Dòng thời gian chăm sóc</Text>
                
                <View style={styles.timelineContainer}>
                    {routine.events.map((event, index) => {
                        const today = isToday(event.date);
                        const isLast = index === routine.events.length - 1;
                        
                        let statusIcon = <Circle size={22} color="#D1D5DB" fill="#FFFFFF" />;
                        let statusColor = '#9CA3AF';
                        let statusLabel = 'Chờ tới ngày';
                        
                        if (event.status === 'completed') {
                            statusIcon = <CheckCircle2 size={22} color="#10B981" fill="#F0FDF4" />;
                            statusColor = '#10B981';
                            statusLabel = 'Đã hoàn thành';
                        } else if (event.status === 'missed') {
                            statusIcon = <AlertCircle size={22} color="#EF4444" fill="#FEF2F2" />;
                            statusColor = '#EF4444';
                            statusLabel = 'Đã bỏ lỡ';
                        } else if (event.status === 'skipped') {
                            statusIcon = <Clock size={22} color="#F59E0B" fill="#FFFBEB" />;
                            statusColor = '#F59E0B';
                            statusLabel = 'Đã bỏ qua';
                        } else if (today) {
                            statusIcon = <Circle size={22} color="#3B82F6" strokeWidth={3} fill="#EFF6FF" />;
                            statusColor = '#3B82F6';
                            statusLabel = 'Cần thực hiện hôm nay';
                        }

                        return (
                            <View key={event.id || index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={styles.iconContainer}>{statusIcon}</View>
                                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: '#E5E7EB' }]} />}
                                </View>
                                
                                <View style={[styles.timelineRight, today && event.status === 'pending' && styles.todayCard]}>
                                    <View style={styles.eventHeader}>
                                        <Text style={[styles.eventTitle, { color: today && event.status === 'pending' ? '#1E40AF' : '#374151' }]}>
                                            {event.title}
                                        </Text>
                                        <Text style={styles.eventDateText}>{formatEventDate(event.date)}</Text>
                                    </View>
                                    <Text style={styles.eventDesc}>{event.description}</Text>
                                    
                                    {today && event.status === 'pending' && (
                                        <TouchableOpacity 
                                            style={styles.pendingBtn}
                                            onPress={() => updateEventStatus(event.id, 'completed')}
                                            disabled={updatingStatus === event.id}
                                        >
                                            {updatingStatus === event.id ? (
                                                <ActivityIndicator size="small" color="#10B981" />
                                            ) : (
                                                <>
                                                    <View style={styles.pendingCircle} />
                                                    <Text style={styles.pendingBtnText}>Xác nhận hoàn thành</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    )}

                                    {event.status !== 'pending' && (
                                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                                            <Text style={[styles.statusText, { color: statusColor }]}>
                                                {statusLabel}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
    loadingText: { marginTop: 12, fontSize: 14, fontFamily: 'Vietnam-Medium', color: '#6B7280' },
    errorText: { marginTop: 16, fontSize: 16, fontFamily: 'Vietnam-Bold', color: '#4B5563', textAlign: 'center' },
    backBtnLarge: { marginTop: 24, backgroundColor: '#10B981', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
    backBtnText: { color: '#FFF', fontFamily: 'Vietnam-Bold' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginLeft: 16,
    },
    scrollContent: { padding: 16 },
    topCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    plantHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantName: { fontSize: 20, fontFamily: 'Vietnam-Bold', color: '#111827' },
    diseaseName: { fontSize: 14, fontFamily: 'Vietnam-Medium', color: '#6B7280', marginTop: 2 },
    badgeRow: { flexDirection: 'row' },
    modeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    strictBadge: { backgroundColor: '#FEF2F2' },
    relaxedBadge: { backgroundColor: '#F0FDF4' },
    modeText: { fontSize: 12, fontFamily: 'Vietnam-Bold' },
    strictText: { color: '#EF4444' },
    relaxedText: { color: '#10B981' },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
        marginBottom: 16,
        marginLeft: 4,
    },
    timelineContainer: { paddingLeft: 8 },
    timelineItem: { flexDirection: 'row' },
    timelineLeft: { alignItems: 'center', width: 40 },
    iconContainer: { zIndex: 1, backgroundColor: '#F9FAFB', paddingVertical: 2 },
    timelineLine: { flex: 1, width: 2, marginVertical: 2 },
    timelineRight: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginLeft: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
    },
    todayCard: {
        borderColor: '#3B82F6',
        borderWidth: 1.5,
        backgroundColor: '#F0F9FF',
    },
    eventHeader: {
        marginBottom: 8,
    },
    eventTitle: { 
        fontSize: 15, 
        fontFamily: 'Vietnam-Bold', 
        marginBottom: 2 
    },
    eventDateText: { 
        fontSize: 11, 
        fontFamily: 'Vietnam-Medium', 
        color: '#9CA3AF',
        marginBottom: 4
    },
    eventDesc: { fontSize: 13, fontFamily: 'Vietnam-Regular', color: '#4B5563', lineHeight: 20 },
    pendingBtn: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#10B981',
        backgroundColor: '#FFFFFF',
    },
    pendingCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#10B981',
        marginRight: 8,
    },
    pendingBtnText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        color: '#10B981',
    },
    completeBtn: {
        marginTop: 16,
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    completeBtnText: { color: '#FFFFFF', fontFamily: 'Vietnam-Bold', fontSize: 14 },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 12,
    },
    statusText: { fontSize: 11, fontFamily: 'Vietnam-Bold' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
    settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    settingLabel: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#374151' },
    settingHint: { fontSize: 12, fontFamily: 'Vietnam-Regular', color: '#6B7280', marginTop: 2 },
    miniBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
    miniBadgeText: { fontSize: 9, fontFamily: 'Vietnam-Bold' },
});

export default RoutineDetailScreen;
