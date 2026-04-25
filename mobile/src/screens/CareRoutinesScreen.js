import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { ChevronLeft, Calendar, ChevronRight, Leaf, AlertCircle, Trash2 } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { Alert } from 'react-native';

const CareRoutinesScreen = ({ navigation }) => {
    const { getUserId } = useAuth();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRoutines = useCallback(async () => {
        try {
            const userId = getUserId();
            const response = await axios.get(`${API_BASE_URL}/api/routine/user/${userId}`);
            setRoutines(response.data);
        } catch (error) {
            console.error('Error fetching routines:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [getUserId]);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRoutines();
    };

    const deleteRoutine = async (id) => {
        Alert.alert(
            'Xóa lộ trình',
            'Bạn có chắc chắn muốn xóa lộ trình chăm sóc này không? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await axios.delete(`${API_BASE_URL}/api/routine/${id}`);
                            setRoutines(prev => prev.filter(r => r._id !== id));
                        } catch (error) {
                            console.error('Error deleting routine:', error);
                            Alert.alert('Lỗi', 'Không thể xóa lộ trình lúc này.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getProgress = (events) => {
        if (!events || events.length === 0) return 0;
        const completed = events.filter(e => e.status === 'completed' || e.status === 'skipped').length;
        return completed / events.length;
    };

    const renderRoutineItem = ({ item }) => {
        const progress = getProgress(item.events);
        const latestEvent = item.events.find(e => e.status === 'pending') || item.events[item.events.length - 1];
        
        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('RoutineDetail', { routineId: item._id })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.plantInfo}>
                        <View style={styles.iconCircle}>
                            <Leaf size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.plantName} numberOfLines={1}>{item.plant_name}</Text>
                            <Text style={styles.diseaseName} numberOfLines={1}>{item.disease_name}</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Tiến độ chăm sóc</Text>
                        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Calendar size={14} color="#6B7280" />
                        <Text style={styles.footerText} numberOfLines={1}>
                            Tiếp theo: {latestEvent?.title}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.deleteBtn} 
                        onPress={() => deleteRoutine(item._id)}
                    >
                        <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tiến độ chăm sóc</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : routines.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/628/628283.png' }} 
                        style={styles.emptyImage} 
                    />
                    <Text style={styles.emptyTitle}>Chưa có lịch trình nào</Text>
                    <Text style={styles.emptyDesc}>
                        Hãy sử dụng tính năng Bác sĩ AI để chẩn đoán và lập lịch trình chăm sóc cho cây của bạn.
                    </Text>
                    <TouchableOpacity 
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('Bác sĩ')}
                    >
                        <Text style={styles.actionBtnText}>Bắt đầu ngay</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={routines}
                    renderItem={renderRoutineItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10B981"]} />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
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
    listContent: { padding: 16, gap: 16 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    plantInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1,
        marginRight: 8,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantName: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
    },
    diseaseName: {
        fontSize: 12,
        fontFamily: 'Vietnam-Medium',
        color: '#6B7280',
    },
    progressSection: { marginBottom: 16 },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        width: '100%',
    },
    progressLabel: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
    },
    progressPercent: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#10B981',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerText: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'Vietnam-Medium',
        color: '#6B7280',
        marginLeft: 8,
    },
    deleteBtn: {
        padding: 6,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyImage: { width: 120, height: 120, marginBottom: 24, opacity: 0.6 },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    actionBtn: {
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Vietnam-Bold',
        fontSize: 15,
    },
});

export default CareRoutinesScreen;
