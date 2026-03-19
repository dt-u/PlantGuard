import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert, Modal, StatusBar, Keyboard } from 'react-native';
import { Radio, Upload, Play, Square, AlertTriangle, Activity, Maximize, Minimize, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import axios from 'axios';
import { API_BASE_URL, WS_BASE_URL, ENDPOINTS } from '../api/config';

// --- Sub-components to prevent full screen re-renders ---

const LiveClock = memo(() => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <View>
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter-Medium' }}>
                {time.toLocaleTimeString()}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 9, fontFamily: 'Inter-Regular', opacity: 0.8 }}>
                {time.toLocaleDateString()}
            </Text>
        </View>
    );
});

const SimpleBadge = memo(({ status, hasFrame }) => {
    const isConnected = status === 'connected' && hasFrame;
    return (
        <View style={styles.statusBanner}>
            <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: isConnected ? '#3B82F6' : '#9CA3AF' }]} />
            </View>
            <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Trạng thái vườn:</Text>
                <Text style={[styles.statusValue, { color: isConnected ? '#3B82F6' : '#9CA3AF' }]}>
                    {isConnected ? "ỔN ĐỊNH" : "CHƯA KẾT NỐI"}
                </Text>
            </View>
        </View>
    );
});

const LiveCameraView = memo(({ imageRef, isFullscreen }) => {
    return (
        <Image
            ref={imageRef}
            source={{ uri: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' }}
            style={isFullscreen ? { width: '100%', height: '100%' } : styles.frame}
            resizeMode={isFullscreen ? "cover" : "contain"}
            fadeDuration={0}
        />
    );
}, () => true); // Never re-render via props

const MonitorScreen = () => {
    const [activeTab, setActiveTab] = useState('live');
    const [cameraUrl, setCameraUrl] = useState("http://192.168.5.100:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected");
    const [liveLogs, setLiveLogs] = useState([]);
    const [droneLogs, setDroneLogs] = useState([]);
    const [liveAlertCount, setLiveAlertCount] = useState(0);

    const isStreamingRef = useRef(false);
    const reconnectTimeoutRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const frameImageRef = useRef(null);
    const fullscreenImageRef = useRef(null);
    const wsRef = useRef(null);
    const [hasFrame, setHasFrame] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Upload state
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(null);
    const uploadJobIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (uploadJobIntervalRef.current) clearInterval(uploadJobIntervalRef.current);
        };
    }, []);

    // Auto-rotate logic for Fullscreen
    useEffect(() => {
        async function changeOrientation() {
            try {
                if (isFullscreen) {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                } else {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                }
            } catch (err) {
                console.error("Orientation lock failed", err);
            }
        }
        changeOrientation();
    }, [isFullscreen]);

    const startStream = () => {
        Keyboard.dismiss();
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        setIsStreaming(true);
        isStreamingRef.current = true;
        setStatus("connecting");
        setHasFrame(false);

        const ws = new WebSocket(`${WS_BASE_URL}/api/monitor/ws/live`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("connected");
            ws.send(cameraUrl);
        };

        ws.onmessage = (event) => {
            try {
                const now = Date.now();
                // Throttle 16ms to keep CPU healthy while maintaining 30-60fps
                if (now - lastFrameTimeRef.current < 16) return;
                lastFrameTimeRef.current = now;

                let frameData = null;
                const rawData = event.data;
                
                // Fast check if it's JSON or raw string (raw string usually starts with base64 chars)
                if (rawData.startsWith('{')) {
                    const data = JSON.parse(rawData);
                    if (data.image) frameData = data.image;
                    if (data.detections && data.detections.length > 0) {
                        const newLogs = data.detections.map(d => ({
                            id: Date.now() + Math.random(),
                            time: new Date().toLocaleTimeString(),
                            msg: `Cảnh báo: [${d.label.toUpperCase()}] - ${Math.round(d.confidence*100)}%`,
                            type: 'alert'
                        }));
                        setLiveAlertCount(prev => prev + data.detections.length);
                        setLiveLogs(prev => [...newLogs, ...prev].slice(0, 50));
                    }
                } else {
                    frameData = rawData;
                }

                if (frameData) {
                    const uri = `data:image/jpeg;base64,${frameData}`;
                    // FORCE update native views without triggering React render cycle
                    if (frameImageRef.current) frameImageRef.current.setNativeProps({ source: [{ uri }] });
                    if (fullscreenImageRef.current) fullscreenImageRef.current.setNativeProps({ source: [{ uri }] });
                    
                    if (!hasFrame) setHasFrame(true);
                }
            } catch (e) {
                console.error("WS Message Error", e);
            }
        };

        ws.onclose = () => {
            setStatus("disconnected");
            setHasFrame(false);
            if (isStreamingRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isStreamingRef.current) startStream();
                }, 3000);
            }
        };
    };

    const stopStream = () => {
        isStreamingRef.current = false;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) wsRef.current.close();
        setIsStreaming(false);
        setStatus("disconnected");
        setHasFrame(false);
    };

    const handleClearLogs = () => {
        if (activeTab === 'live') {
            setLiveLogs([]);
            setLiveAlertCount(0);
        } else {
            setDroneLogs([]);
        }
    };

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) handleUpload(result.assets[0]);
    };

    const handleUpload = async (fileAsset) => {
        setUploadLoading(true);
        setUploadProgress(0);
        setUploadResult(null);
        setDroneLogs([]);

        const formData = new FormData();
        formData.append('file', {
            uri: fileAsset.uri,
            name: 'video.mp4',
            type: 'video/mp4',
        });

        try {
            const response = await axios.post(ENDPOINTS.ANALYZE_VIDEO, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const jobId = response.data.job_id;
            
            uploadJobIntervalRef.current = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`${API_BASE_URL}/api/monitor/job-status/${jobId}`);
                    if (statusRes.data.status === 'completed') {
                        clearInterval(uploadJobIntervalRef.current);
                        setUploadResult(statusRes.data.result);
                        setDroneLogs(statusRes.data.result.detailed_logs || []);
                        setUploadLoading(false);
                    } else if (statusRes.data.status === 'failed') {
                        clearInterval(uploadJobIntervalRef.current);
                        setUploadLoading(false);
                        Alert.alert("Lỗi", "Phân tích thất bại.");
                    } else {
                        setUploadProgress(statusRes.data.progress);
                    }
                } catch(e) {}
            }, 2000);
            
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể gửi video.');
            setUploadLoading(false);
        }
    };

    const currentLogs = activeTab === 'live' ? liveLogs : droneLogs;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Giám Sát Vườn</Text>
                    <Text style={styles.subtitle}>Theo dõi sức khỏe cây trồng thực địa</Text>
                </View>
            </View>

            <View style={styles.statusBannerContainer}>
                <SimpleBadge status={status} hasFrame={hasFrame} />
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.tab, activeTab === 'live' && styles.activeTab]} onPress={() => setActiveTab('live')}>
                    <Radio color={activeTab === 'live' ? '#FFFFFF' : '#6B7280'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live Cam</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'upload' && styles.activeTab]} onPress={() => setActiveTab('upload')}>
                    <Upload color={activeTab === 'upload' ? '#FFFFFF' : '#6B7280'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>Tải lên</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'live' ? (
                    <View style={styles.liveSection}>
                        <View style={styles.configBox}>
                            <Text style={styles.inputLabel}>URL Camera (IP / DroidCam)</Text>
                            <TextInput 
                                style={styles.input}
                                value={cameraUrl}
                                onChangeText={setCameraUrl}
                                placeholder="http://192.168.x.x:4747/video"
                                editable={!isStreaming}
                            />
                            {!isStreaming ? (
                                <TouchableOpacity style={styles.startBtn} onPress={startStream}>
                                    <Play color="#FFFFFF" size={20} />
                                    <Text style={styles.btnText}>Bắt đầu Giám sát</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.stopBtn} onPress={stopStream}>
                                    <Square color="#FFFFFF" size={20} />
                                    <Text style={styles.btnText}>Dừng Luồng</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Modal visible={isFullscreen} onRequestClose={() => setIsFullscreen(false)} statusBarTranslucent animationType="fade">
                            <StatusBar hidden={isFullscreen} />
                            <View style={{ flex: 1, backgroundColor: '#000' }}>
                                <LiveCameraView imageRef={fullscreenImageRef} isFullscreen={true} />
                                <TouchableOpacity
                                    onPress={() => setIsFullscreen(false)}
                                    style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#000000BA', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
                                >
                                    <Minimize color="#fff" size={24} />
                                </TouchableOpacity>
                                <View style={{ position: 'absolute', top: 40, left: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#000000AA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 12, zIndex: 100 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
                                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter-Bold' }}>TRỰC TIẾP</Text>
                                    </View>
                                    <LiveClock />
                                </View>
                            </View>
                        </Modal>

                        <View style={styles.monitorView}>
                            <LiveCameraView imageRef={frameImageRef} isFullscreen={false} />
                            
                            {!hasFrame && (
                                <View style={styles.placeholderContainer}>
                                    {status === 'connecting' ? <ActivityIndicator color="#3B82F6" size="large" /> : <Activity color="#D1D5DB" size={64} />}
                                    <Text style={styles.placeholderText}>{status === 'connecting' ? "Đang kết nối..." : "Chưa có tín hiệu"}</Text>
                                </View>
                            )}

                            {status === 'connected' && hasFrame && (
                                <View style={styles.liveOverlayBadge}>
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveLabel}>TRỰC TIẾP</Text>
                                    </View>
                                </View>
                            )}

                            {status === 'connected' && hasFrame && (
                                <TouchableOpacity onPress={() => setIsFullscreen(true)} style={styles.fullscreenBtn}>
                                    <Maximize color="#fff" size={18} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.uploadSection}>
                        {/* Render Upload logic remains the same to focus on Cam flicker fix */}
                        {!uploadLoading && !uploadResult ? (
                            <TouchableOpacity style={styles.mockUpload} onPress={pickVideo}>
                                <Upload color="#3B82F6" size={48} />
                                <Text style={styles.placeholderText}>Chọn Video từ máy</Text>
                            </TouchableOpacity>
                        ) : uploadLoading ? (
                            <View style={styles.mockUpload}>
                                <ActivityIndicator size="large" color="#3B82F6" />
                                <Text>Đang xử lý... {uploadProgress}%</Text>
                            </View>
                        ) : (
                            <View style={styles.resultCard}>
                                <Text style={styles.resultTitle}>Phân tích hoàn tất: {uploadResult?.alert_count || 0} cảnh báo</Text>
                                <TouchableOpacity onPress={() => setUploadResult(null)} style={styles.reuploadBtn}>
                                    <Text style={styles.reuploadBtnText}>Thử lại</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.logSection}>
                    <View style={styles.logHeader}>
                        <Text style={styles.logTitle}>Nhật ký sự kiện</Text>
                        {currentLogs.length > 0 && (
                            <TouchableOpacity onPress={handleClearLogs}>
                                <Trash2 color="#9CA3AF" size={16} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {currentLogs.map((log, index) => (
                        <View key={log.id || index} style={styles.logItem}>
                            <View style={styles.logMetaRow}>
                                <Text style={styles.logTime}>{log.time}</Text>
                                <View style={[styles.typeBadge, log.type === 'alert' ? styles.badgeAlert : styles.badgeInfo]}>
                                    <Text style={styles.badgeText}>{(log.type || 'info').toUpperCase()}</Text>
                                </View>
                            </View>
                            <Text style={styles.logMsg}>{log.msg}</Text>
                        </View>
                    ))}
                    {currentLogs.length === 0 && (
                        <Text style={styles.emptyLogsText}>
                            {activeTab === 'live' ? "Chưa có sự kiện nào được ghi nhận." : "Hiển thị lịch sử quét tại đây sau khi hoàn tất."}
                        </Text>
                    )}
                </View>

                {/* Technical Disclaimer */}
                <View style={styles.disclaimerSection}>
                    <View style={styles.disclaimerCard}>
                        <View style={styles.disclaimerHeader}>
                            <View style={styles.warningCircle}>
                                <Activity color="#92400E" size={14} />
                            </View>
                            <Text style={styles.disclaimerTitle}>KHUYẾN CÁO CÔNG NGHỆ</Text>
                        </View>
                        <Text style={styles.disclaimerBody}>
                            Kỹ thuật giám sát từ xa dựa trên mô hình học sâu. Kết quả có thể biến động tùy theo chất lượng camera và mạng.{"\n\n"}
                            <Text style={{ fontFamily: 'Inter-Bold', textDecorationLine: 'underline' }}>
                                Vui lòng đối chiếu với 'Bác Sĩ Cây Trồng' để đạt hiệu quả cao nhất.
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 28, fontFamily: 'Inter-Bold', color: '#111827' },
    subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    statusBannerContainer: { paddingHorizontal: 20, marginBottom: 15 },
    statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, elevation: 1 },
    dotContainer: { marginRight: 10 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    statusLabel: { fontSize: 11, color: '#6B7280' },
    statusValue: { fontSize: 11, fontFamily: 'Inter-Bold' },
    tabBar: { flexDirection: 'row', backgroundColor: '#E5E7EB66', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 15 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 6, borderRadius: 8 },
    activeTab: { backgroundColor: '#3B82F6' },
    tabText: { fontSize: 13, color: '#6B7280', fontFamily: 'Inter-SemiBold' },
    activeTabText: { color: '#FFFFFF' },
    content: { flex: 1, paddingHorizontal: 20 },
    configBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 15 },
    inputLabel: { fontSize: 11, fontFamily: 'Inter-Bold', color: '#6B7280', marginBottom: 6 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12 },
    startBtn: { backgroundColor: '#3B82F6', flexDirection: 'row', padding: 12, borderRadius: 10, justifyContent: 'center', gap: 8 },
    stopBtn: { backgroundColor: '#EF4444', flexDirection: 'row', padding: 12, borderRadius: 10, justifyContent: 'center', gap: 8 },
    btnText: { color: '#FFF', fontFamily: 'Inter-Bold' },
    monitorView: { backgroundColor: '#000', borderRadius: 16, height: 300, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    frame: { width: '100%', height: '100%' },
    placeholderContainer: { position: 'absolute', alignItems: 'center', gap: 10 },
    placeholderText: { color: '#6B7280', fontSize: 12 },
    liveOverlayBadge: { position: 'absolute', top: 12, left: 12 },
    liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00000080', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 5 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
    liveLabel: { color: '#FFF', fontSize: 9, fontFamily: 'Inter-Bold' },
    fullscreenBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#00000080', padding: 8, borderRadius: 20 },
    logSection: { marginTop: 20, paddingBottom: 40 },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    logTitle: { fontSize: 15, fontFamily: 'Inter-Bold' },
    logItem: { 
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
        paddingLeft: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    logMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeAlert: { backgroundColor: '#FEE2E2' },
    badgeInfo: { backgroundColor: '#F3F4F6' },
    badgeText: { fontSize: 8, fontFamily: 'Inter-Bold', color: '#4B5563' },
    logTime: { fontSize: 10, color: '#9CA3AF' },
    emptyLogsText: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 10,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    disclaimerSection: {
        paddingHorizontal: 10,
        paddingBottom: 40,
        marginTop: 10,
    },
    disclaimerCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disclaimerTitle: {
        fontSize: 10,
        fontFamily: 'Inter-Bold',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    disclaimerBody: {
        fontSize: 11,
        color: '#92400E',
        lineHeight: 16,
        fontFamily: 'Inter-Regular',
        opacity: 0.8,
    },
    logMsg: { fontSize: 13, color: '#4B5563', marginTop: 2 },
    mockUpload: { padding: 30, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', gap: 10 },
    resultCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16 },
    resultTitle: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#EF4444' },
    reuploadBtn: { marginTop: 10, padding: 10, alignItems: 'center' },
    reuploadBtnText: { color: '#3B82F6', fontSize: 12, fontFamily: 'Inter-Bold' }
});

export default MonitorScreen;
