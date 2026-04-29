import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert, Modal, StatusBar, Keyboard, Switch } from 'react-native';
import { Radio, Upload, Play, Square, AlertTriangle, Activity, Maximize, Minimize, Trash2, Download, Video as VideoIcon, FileText, Archive, ChevronRight, Zap, Info, Database, Clock, Check, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Video } from 'expo-av';
import axios from 'axios';
import { API_BASE_URL, WS_BASE_URL } from '../api/config';
import { LinearGradient } from 'expo-linear-gradient';

const SimpleBadge = memo(({ status, hasFrame }) => {
    const { t } = useLanguage();
    const isConnected = status === 'connected' && hasFrame;
    return (
        <View style={styles.statusBanner}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#9CA3AF' }]} />
            <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>{t('monitor.garden_status')}</Text>
                <Text style={[styles.statusValue, { color: isConnected ? '#3B82F6' : '#9CA3AF' }]}>
                    {isConnected ? t('monitor.stable') : t('monitor.not_connected')}
                </Text>
            </View>
        </View>
    );
});

import { useRoute } from '@react-navigation/native';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';
import { useCamera } from '../contexts/CameraContext';

const DatasetReviewList = ({ userId }) => {
    const { t } = useLanguage();
    const { translateDiseaseName } = useDiseaseTranslator();
    const [captures, setCaptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    const fetchCaptures = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/monitor/pending-captures?user_id=${userId}`);
            setCaptures(res.data);
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCaptures(); }, [userId]);

    const handleVerify = async (id, correct) => {
        setActionId(id);
        try {
            await axios.post(`${API_BASE_URL}/api/monitor/verify-capture`, { capture_id: id, is_correct: correct });
            setCaptures(prev => prev.filter(c => c.capture_id !== id));
        } catch (e) { Alert.alert("Lỗi", "Không thể thực hiện xác nhận."); }
        finally { setActionId(null); }
    };

    if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
    if (captures.length === 0) return (
        <View style={styles.emptyDataset}>
            <Database size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>{t('monitor.dataset_empty')}</Text>
        </View>
    );

    return (
        <View style={styles.datasetGrid}>
            {captures.map(cap => (
                <View key={cap.capture_id} style={styles.datasetCard}>
                    <Image source={{ uri: `${API_BASE_URL}${cap.image_url}` }} style={styles.datasetImg} />
                    <View style={styles.datasetInfo}>
                        <Text style={styles.datasetDisease}>{translateDiseaseName(cap.disease_name || `Class ${cap.class_id}`)}</Text>
                        <View style={styles.datasetMeta}>
                            <Clock size={10} color="#9CA3AF" />
                            <Text style={styles.datasetTime}>{new Date(cap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                    </View>
                    <View style={styles.datasetActions}>
                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.confirmBtn]} 
                            onPress={() => handleVerify(cap.capture_id, true)}
                            disabled={actionId === cap.capture_id}
                        >
                            <Check color="#FFF" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.rejectBtn]} 
                            onPress={() => handleVerify(cap.capture_id, false)}
                            disabled={actionId === cap.capture_id}
                        >
                            <X color="#FFF" size={16} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
};

const MonitorScreen = () => {
    const insets = useSafeAreaInsets();
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const route = useRoute();
    
    // Tab state
    const [activeTab, setActiveTab] = useState(route.params?.tab || 'live'); // 'live', 'upload' or 'dataset'
    
    useEffect(() => {
        if (route.params?.tab) setActiveTab(route.params.tab);
    }, [route.params?.tab]);
    
    // Use Camera Context
    const {
        cameraUrl, setCameraUrl,
        isStreaming,
        status,
        hasFrame,
        droneLogs,
        isAutoScan, setIsAutoScan,
        startStream, stopStream
    } = useCamera();

    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_BASE_URL}/api/monitor/auto-scan/status/${user.id}`)
                .then(res => setIsAutoScan(res.data.active))
                .catch(console.error);
        }
    }, [user, setIsAutoScan]);

    const handleToggleAutoScan = async (value) => {
        if (!user || (!user.id && user.id !== 'tmp')) return;
        const uId = user.id || "anonymous";
        const endpoint = value ? 'start' : 'stop';
        
        setIsAutoScan(value);
        try {
            await axios.post(`${API_BASE_URL}/api/monitor/auto-scan/${endpoint}`, {
                camera_url: cameraUrl,
                user_id: uId
            });
        } catch (e) {
            setIsAutoScan(!value); 
            console.error(e);
        }
    };

    // Upload state
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(null);
    const [showDownloadSheet, setShowDownloadSheet] = useState(false);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>{t('monitor.title')}</Text>
                    <Text style={styles.headerSubtitle}>{t('monitor.subtitle')}</Text>
                </View>
                <TouchableOpacity style={styles.historyBtn} onPress={() => setDroneLogs([])}>
                    <Trash2 color="#6B7280" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'live' && styles.activeTab]} 
                    onPress={() => setActiveTab('live')}
                >
                    <Radio color={activeTab === 'live' ? '#3B82F6' : '#9CA3AF'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>{t('monitor.live_cam')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'upload' && styles.activeTab]} 
                    onPress={() => setActiveTab('upload')}
                >
                    <Upload color={activeTab === 'upload' ? '#3B82F6' : '#9CA3AF'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>{t('monitor.drone')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'dataset' && styles.activeTab, { flex: 1.4 }]} 
                    onPress={() => setActiveTab('dataset')}
                >
                    <Database color={activeTab === 'dataset' ? '#3B82F6' : '#9CA3AF'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'dataset' && styles.activeTabText]}>{t('monitor.dataset')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* LIVE TAB */}
                <View style={[styles.tabContent, { display: activeTab === 'live' ? 'flex' : 'none' }]}>
                    <View style={styles.statusBannerContainer}>
                        <SimpleBadge status={status} hasFrame={hasFrame} />
                    </View>

                    <View style={styles.configBox}>
                        <View style={styles.inputRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>{t('monitor.url_label')}</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={cameraUrl}
                                    onChangeText={setCameraUrl}
                                    placeholder="http://192.168.x.x:4747/video"
                                    editable={!isStreaming}
                                />
                            </View>
                            
                            {user && (
                                <View style={styles.autoScanMiniContainer}>
                                    <TouchableOpacity 
                                        style={styles.infoBtn}
                                        onPress={() => Alert.alert("Trực canh AI", "Hệ thống sẽ tự động giám sát vườn qua camera ngay cả khi bạn đóng ứng dụng.")}
                                    >
                                        <Info size={14} color="#3B82F6" />
                                    </TouchableOpacity>
                                    <Zap size={14} color={isAutoScan ? "#3B82F6" : "#D1D5DB"} />
                                    <Switch
                                        trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
                                        thumbColor={isAutoScan ? '#3B82F6' : '#9CA3AF'}
                                        onValueChange={handleToggleAutoScan}
                                        value={isAutoScan}
                                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                                    />
                                </View>
                            )}
                        </View>

                        {!isStreaming ? (
                            <TouchableOpacity style={styles.startBtn} onPress={() => startStream(cameraUrl)}>
                                <Play color="#FFFFFF" size={18} />
                                <Text style={styles.btnText}>{t('monitor.start_monitor')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.stopBtn} onPress={stopStream}>
                                <Square color="#FFFFFF" size={16} />
                                <Text style={styles.btnText}>{t('monitor.stop_stream')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.monitorView}>
                        {!hasFrame ? (
                            <View style={styles.placeholder}>
                                {status === 'connecting' ? <ActivityIndicator color="#3B82F6" size="large" /> : <Activity color="#D1D5DB" size={48} />}
                                <Text style={styles.placeholderText}>{status === 'connecting' ? t('monitor.connecting') : t('monitor.no_signal')}</Text>
                            </View>
                        ) : (
                            <View style={styles.liveWrapper}>
                                <Image 
                                    source={{ uri: `${cameraUrl}?${new Date().getTime()}` }} 
                                    style={styles.liveFrame} 
                                    resizeMode="cover" 
                                />
                                <View style={styles.liveBadge}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveLabel}>{t('monitor.live')}</Text>
                                </View>
                                
                                {isAutoScan && (
                                    <View style={styles.autoScanBadge}>
                                        <Zap size={14} color="#FFF" />
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.logsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.logTitle}>{t('monitor.event_logs')}</Text>
                            <Zap color="#F59E0B" size={16} />
                        </View>
                        
                        {droneLogs.length === 0 ? (
                            <View style={styles.emptyLogs}>
                                <Text style={styles.emptyText}>{t('monitor.empty_logs')}</Text>
                            </View>
                        ) : (
                            droneLogs.map((log) => (
                                <View key={log.id} style={styles.logItem}>
                                    <AlertTriangle color="#EF4444" size={16} />
                                    <View style={styles.logContent}>
                                        <Text style={styles.logText}>
                                            Phát hiện rủi ro: <Text style={styles.logTarget}>[{log.label}]</Text>
                                        </Text>
                                        <Text style={styles.logTime}>{log.time} • Tin cậy: {log.conf}%</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* UPLOAD TAB */}
                <View style={[styles.tabContent, { display: activeTab === 'upload' ? 'flex' : 'none' }]}>
                    <Text style={styles.placeholderText}>Chức năng Drone đang được hoàn thiện trên Mobile.</Text>
                </View>

                {/* DATASET TAB */}
                <View style={[styles.tabContent, { display: activeTab === 'dataset' ? 'flex' : 'none' }]}>
                    <DatasetReviewList userId={user?.id || 'anonymous'} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: 24, fontFamily: 'Vietnam-Bold', color: '#111827' },
    headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    historyBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#F3F4F6', gap: 4 },
    activeTab: { backgroundColor: '#EBF5FF', borderWidth: 1, borderColor: '#BFDBFE' },
    tabText: { fontSize: 12, fontFamily: 'Vietnam-Medium', color: '#6B7280' },
    activeTabText: { color: '#3B82F6', fontFamily: 'Vietnam-Bold' },
    tabContent: { paddingHorizontal: 20 },
    statusBannerContainer: { marginBottom: 15 },
    statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 1 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
    statusInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    statusLabel: { fontSize: 10, color: '#6B7280' },
    statusValue: { fontSize: 10, fontFamily: 'Vietnam-Bold' },
    configBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 2 },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 10 },
    inputContainer: { flex: 1 },
    inputLabel: { fontSize: 10, fontFamily: 'Vietnam-Bold', color: '#6B7280', marginBottom: 4 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 8, fontSize: 12 },
    autoScanMiniContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 6, borderRadius: 10, height: 36, borderWidth: 1, borderColor: '#DBEAFE' }, 
    infoBtn: { padding: 4, marginRight: 2 },
    startBtn: { backgroundColor: '#3B82F6', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, justifyContent: 'center', gap: 6 },
    stopBtn: { backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, justifyContent: 'center', gap: 6 },
    btnText: { color: '#FFF', fontFamily: 'Vietnam-Bold', fontSize: 13 },
    monitorView: { backgroundColor: '#000', borderRadius: 16, height: 220, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    placeholder: { alignItems: 'center', gap: 8 },
    placeholderText: { color: '#6B7280', fontSize: 12 },
    liveWrapper: { width: '100%', height: '100%' },
    liveFrame: { width: '100%', height: '100%' },
    liveBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(239, 68, 68, 0.9)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 4 },
    liveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF' },
    liveLabel: { color: '#FFF', fontSize: 9, fontFamily: 'Vietnam-Bold' },
    autoScanBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(59, 130, 246, 0.9)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 4 },
    autoScanBadgeText: { color: '#FFF', fontSize: 9, fontFamily: 'Vietnam-Bold' },
    fullscreenBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 8 },
    logsSection: { marginTop: 15 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    logTitle: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#374151' },
    emptyLogs: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
    emptyText: { color: '#9CA3AF', fontSize: 12 },
    logItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginBottom: 8, gap: 10 },
    logContent: { flex: 1 },
    logText: { fontSize: 12, color: '#374151', fontFamily: 'Vietnam-Medium' },
    logTarget: { fontFamily: 'Vietnam-Bold', color: '#EF4444' },
    logTime: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
    // Dataset Styles
    emptyDataset: { padding: 40, alignItems: 'center', gap: 10 },
    datasetGrid: { gap: 15, marginTop: 10 },
    datasetCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    datasetImg: { width: '100%', height: 160, backgroundColor: '#F3F4F6' },
    datasetInfo: { padding: 12 },
    datasetDisease: { fontSize: 14, fontFamily: 'Vietnam-Bold', color: '#1F2937' },
    datasetMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    datasetTime: { fontSize: 11, color: '#9CA3AF' },
    datasetActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    actionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    confirmBtn: { backgroundColor: '#10B981' },
    rejectBtn: { backgroundColor: '#EF4444' }
});

export default MonitorScreen;
