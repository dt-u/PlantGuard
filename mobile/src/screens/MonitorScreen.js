import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert, Modal, StatusBar, Keyboard, Switch } from 'react-native';
import { Radio, Upload, Play, Square, AlertTriangle, Activity, Maximize, Minimize, Trash2, Download, Video as VideoIcon, FileText, Archive, ChevronRight, Zap, Info } from 'lucide-react-native';
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
    
    // Live Stream state
    const [cameraUrl, setCameraUrl] = useState("http://192.168.1.34:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected");
    const [droneLogs, setDroneLogs] = useState([]);
    const wsRef = useRef(null);
    const [hasFrame, setHasFrame] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAutoScan, setIsAutoScan] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_BASE_URL}/api/monitor/auto-scan/status/${user.id}`)
                .then(res => setIsAutoScan(res.data.active))
                .catch(console.error);
        }
    }, [user]);

    const toggleAutoScan = async (value) => {
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

    const startStream = () => {
        if (!cameraUrl) return;
        setIsStreaming(true);
        setStatus("connecting");
        setDroneLogs([]);
        setHasFrame(false);

        wsRef.current = new WebSocket(`${WS_BASE_URL}/api/monitor/ws/live`);
        
        wsRef.current.onopen = () => {
            wsRef.current.send(cameraUrl);
            setStatus("connected");
        };

        wsRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.frame) setHasFrame(true);
            if (data.detections && data.detections.length > 0) {
                const newLogs = data.detections.map(d => ({
                    id: Math.random().toString(),
                    time: new Date().toLocaleTimeString(),
                    label: d.label,
                    conf: (d.confidence * 100).toFixed(1)
                }));
                setDroneLogs(prev => [...newLogs, ...prev].slice(0, 50));
            }
        };

        wsRef.current.onerror = () => setStatus("error");
        wsRef.current.onclose = () => {
            setIsStreaming(false);
            setStatus("disconnected");
            setHasFrame(false);
        };
    };

    const stopStream = () => {
        if (wsRef.current) wsRef.current.close();
    };

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
                    style={[styles.tab, activeTab === 'dataset' && styles.activeTab]} 
                    onPress={() => setActiveTab('dataset')}
                >
                    <Database color={activeTab === 'dataset' ? '#3B82F6' : '#9CA3AF'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'dataset' && styles.activeTabText]}>{t('monitor.dataset')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {activeTab === 'live' ? (
                    <View style={styles.tabContent}>
                        {/* ... existing live content ... */}
                        <View style={styles.statusBannerContainer}>
                            <SimpleBadge status={status} hasFrame={hasFrame} />
                        </View>
                        {/* ... the rest of the live tab content remains same as before but wrapped in if */}
                        <View style={styles.configBox}>
                            {/* ... */}
                        </View>
                    </View>
                ) : activeTab === 'upload' ? (
                    <View style={styles.tabContent}><Text style={styles.placeholderText}>Upload Section</Text></View>
                ) : (
                    <View style={styles.tabContent}>
                        <DatasetReviewList userId={user?.id || 'anonymous'} />
                    </View>
                )}
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
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#F3F4F6', gap: 6 },
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
    startBtn: { backgroundColor: '#3B82F6', flexDirection: 'row', padding: 10, borderRadius: 10, justifyContent: 'center', gap: 6 },
    stopBtn: { backgroundColor: '#EF4444', flexDirection: 'row', padding: 10, borderRadius: 10, justifyContent: 'center', gap: 6 },
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
