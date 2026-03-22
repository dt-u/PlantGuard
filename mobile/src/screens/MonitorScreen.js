import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert, Modal, StatusBar, Keyboard } from 'react-native';
import { Radio, Upload, Play, Square, AlertTriangle, Activity, Maximize, Minimize, Trash2, Download, Video as VideoIcon, FileText, Archive, ChevronRight, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Video } from 'expo-av';
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
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'Vietnam-Medium' }}>
                {time.toLocaleTimeString()}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 9, fontFamily: 'Vietnam-Regular', opacity: 0.8 }}>
                {time.toLocaleDateString()}
            </Text>
        </View>
    );
});

const SimpleBadge = memo(({ status, hasFrame }) => {
    const { t } = useLanguage();
    const isConnected = status === 'connected' && hasFrame;
    return (
        <View style={styles.statusBanner}>
            <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: isConnected ? '#3B82F6' : '#9CA3AF' }]} />
            </View>
            <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>{t('monitor.garden_status')}</Text>
                <Text style={[styles.statusValue, { color: isConnected ? '#3B82F6' : '#9CA3AF' }]}>
                    {isConnected ? t('monitor.stable') : t('monitor.not_connected')}
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
}, () => true);

const MonitorScreen = () => {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
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
    const [currentJobId, setCurrentJobId] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const videoRef = useRef(null);
    const uploadJobIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (uploadJobIntervalRef.current) clearInterval(uploadJobIntervalRef.current);
        };
    }, []);

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

    const translateDiseaseLabel = (label) => {
        const translated = t(`diseases.${label}`);
        if (typeof translated === 'object') {
            return translated.name || label;
        }
        return translated || label;
    };

    const translateLogMsg = (msg) => {
        // Match: "Tại 00:05: phát hiện rủi ro [Corn Common Rust]"
        const droneRegex = /(?:Tại|At) ([\d:]+):?\s*(?:phát hiện rủi ro|detected risk) \[(.+)\]/;
        const droneMatch = msg.match(droneRegex);
        if (droneMatch) {
            const time = droneMatch[1];
            const label = droneMatch[2];
            return t('logs.detected_at')
                .replace('{{time}}', time)
                .replace('{{label}}', translateDiseaseLabel(label));
        }

        // Match: "Cảnh báo: [Apple Scab] - 85%"
        const liveRegex = /(?:Cảnh báo|Alert): \[(.+)\] - (\d+)%/;
        const liveMatch = msg.match(liveRegex);
        if (liveMatch) {
            const label = liveMatch[1];
            const confidence = liveMatch[2];
            return t('logs.live_alert')
                .replace('{{label}}', translateDiseaseLabel(label))
                .replace('{{confidence}}', confidence);
        }

        return msg;
    };

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
                if (now - lastFrameTimeRef.current < 16) return;
                lastFrameTimeRef.current = now;

                let frameData = null;
                const rawData = event.data;
                
                if (rawData.startsWith('{')) {
                    const data = JSON.parse(rawData);
                    if (data.image) frameData = data.image;
                    if (data.detections && data.detections.length > 0) {
                        const newLogs = data.detections.map(d => ({
                            id: Date.now() + Math.random(),
                            time: new Date().toLocaleTimeString(),
                            msg: `Cảnh báo: [${d.label}] - ${Math.round(d.confidence*100)}%`,
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
            setCurrentJobId(jobId);
            
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
                        Alert.alert(t('common.error'), t('monitor.job_failed'));
                    } else {
                        setUploadProgress(statusRes.data.progress);
                    }
                } catch(e) {}
            }, 2000);
            
        } catch (err) {
            console.error(err);
            Alert.alert(t('common.error'), t('monitor.upload_error'));
            setUploadLoading(false);
        }
    };

    const downloadFile = async (type) => {
        if (!uploadResult || !currentJobId) return;
        
        setShowDownloadModal(false);
        let url = '';
        let fileName = '';
        const shortId = currentJobId.slice(0, 8);

        if (type === 'video') {
            url = `${API_BASE_URL}${uploadResult.video_url}`;
            fileName = `PG_Video_${shortId}.mp4`;
        } else if (type === 'excel') {
            url = `${API_BASE_URL}/api/monitor/logs/excel/${currentJobId}`;
            fileName = `PG_Logs_${shortId}.xlsx`;
        } else if (type === 'zip') {
            url = `${API_BASE_URL}/api/monitor/zip/${currentJobId}`;
            fileName = `PG_Full_${shortId}.zip`;
        }

        try {
            const fileUri = FileSystem.cacheDirectory + fileName;
            const downloadRes = await FileSystem.downloadAsync(url, fileUri);
            
            if (downloadRes.status === 200) {
                await Sharing.shareAsync(downloadRes.uri);
            } else {
                Alert.alert(t('common.error'), t('monitor.download_error'));
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t('common.error'), t('monitor.sharing_error'));
        }
    };

    const seekToTime = async (timeStr) => {
        if (!videoRef.current || activeTab !== 'upload') return;
        const [m, s] = timeStr.split(':').map(Number);
        const totalMillis = (m * 60 + s) * 1000;
        try {
            await videoRef.current.setPositionAsync(totalMillis);
            await videoRef.current.playAsync();
        } catch (e) {
            console.error("Seek Error:", e);
        }
    };

    const currentLogs = activeTab === 'live' ? liveLogs : droneLogs;

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top + 20, 60) }]}>
            <View style={[styles.header, { marginBottom: 25 }]}>
                <View>
                    <Text style={styles.title}>{t('monitor.title')}</Text>
                    <Text style={styles.subtitle}>{t('monitor.subtitle')}</Text>
                </View>
            </View>

            <View style={styles.statusBannerContainer}>
                <SimpleBadge status={status} hasFrame={hasFrame} />
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.tab, activeTab === 'live' && styles.activeTab]} onPress={() => setActiveTab('live')}>
                    <Radio color={activeTab === 'live' ? '#FFFFFF' : '#6B7280'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>{t('monitor.live_cam')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'upload' && styles.activeTab]} onPress={() => setActiveTab('upload')}>
                    <Upload color={activeTab === 'upload' ? '#FFFFFF' : '#6B7280'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>{t('monitor.upload')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'live' ? (
                    <View style={styles.liveSection}>
                        <View style={styles.configBox}>
                            <Text style={styles.inputLabel}>{t('monitor.url_label')}</Text>
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
                                    <Text style={styles.btnText}>{t('monitor.start_monitor')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.stopBtn} onPress={stopStream}>
                                    <Square color="#FFFFFF" size={20} />
                                    <Text style={styles.btnText}>{t('monitor.stop_stream')}</Text>
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
                                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'Vietnam-Bold' }}>{t('monitor.live')}</Text>
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
                                    <Text style={styles.placeholderText}>{status === 'connecting' ? t('monitor.connecting') : t('monitor.no_signal')}</Text>
                                </View>
                            )}

                            {status === 'connected' && hasFrame && (
                                <View style={styles.liveOverlayBadge}>
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveLabel}>{t('monitor.live')}</Text>
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
                        {!uploadLoading && !uploadResult ? (
                            <TouchableOpacity style={styles.mockUpload} onPress={pickVideo}>
                                <Upload color="#3B82F6" size={48} />
                                <Text style={styles.placeholderText}>{t('monitor.pick_video')}</Text>
                            </TouchableOpacity>
                        ) : uploadLoading ? (
                            <View style={styles.mockUpload}>
                                <ActivityIndicator size="large" color="#3B82F6" />
                                <Text>{t('monitor.analyzing_video')} {uploadProgress}%</Text>
                            </View>
                        ) : (
                            <View style={styles.resultCard}>
                                <View style={styles.resultHeader}>
                                    <View style={styles.resultStatus}>
                                        <View style={styles.successDot} />
                                        <Text style={styles.resultLabel}>{t('monitor.analysis_complete')}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.mainDownloadBtn} onPress={() => setShowDownloadModal(true)}>
                                        <Download color="#FFFFFF" size={14} />
                                        <Text style={styles.mainDownloadText}>{t('monitor.download')}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                {uploadResult?.video_url && (
                                    <View style={styles.mobileVideoContainer}>
                                        <Video
                                            key={`${API_BASE_URL}${uploadResult.video_url}`}
                                            ref={videoRef}
                                            source={{ uri: `${API_BASE_URL}${uploadResult.video_url}` }}
                                            useNativeControls
                                            resizeMode="contain"
                                            isLooping={false}
                                            shouldPlay={false}
                                            style={styles.mobileVideo}
                                        />
                                    </View>
                                )}

                                <View style={styles.resultSummary}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryValue}>{uploadResult?.alert_count || 0}</Text>
                                        <Text style={styles.summaryLabel}>{t('monitor.alerts')}</Text>
                                    </View>
                                    <View style={styles.summaryDivider} />
                                    <TouchableOpacity onPress={() => setUploadResult(null)} style={styles.summaryAction}>
                                        <Text style={styles.reuploadText}>{t('common.retry')}</Text>
                                        <ChevronRight color="#3B82F6" size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Download Modal */}
                <Modal visible={showDownloadModal} transparent animationType="slide" onRequestClose={() => setShowDownloadModal(false)}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDownloadModal(false)}>
                        <View style={styles.bottomSheet}>
                            <View style={styles.sheetHandle} />
                            <Text style={styles.sheetTitle}>{t('monitor.download_options')}</Text>
                            
                            <TouchableOpacity style={styles.sheetItem} onPress={() => downloadFile('video')}>
                                <View style={[styles.sheetIconBox, { backgroundColor: '#DBEAFE' }]}>
                                    <VideoIcon color="#3B82F6" size={20} />
                                </View>
                                <View style={styles.sheetItemText}>
                                    <Text style={styles.sheetItemTitle}>{t('monitor.video_only')}</Text>
                                    <Text style={styles.sheetItemDesc}>{t('monitor.video_desc')}</Text>
                                </View>
                                <ChevronRight color="#D1D5DB" size={18} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sheetItem} onPress={() => downloadFile('excel')}>
                                <View style={[styles.sheetIconBox, { backgroundColor: '#DCFCE7' }]}>
                                    <FileText color="#10B981" size={20} />
                                </View>
                                <View style={styles.sheetItemText}>
                                    <Text style={styles.sheetItemTitle}>{t('monitor.logs_only')}</Text>
                                    <Text style={styles.sheetItemDesc}>{t('monitor.logs_desc')}</Text>
                                </View>
                                <ChevronRight color="#D1D5DB" size={18} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sheetItem} onPress={() => downloadFile('zip')}>
                                <View style={[styles.sheetIconBox, { backgroundColor: '#F3E8FF' }]}>
                                    <Archive color="#8B5CF6" size={20} />
                                </View>
                                <View style={styles.sheetItemText}>
                                    <Text style={styles.sheetItemTitle}>{t('monitor.full_set')}</Text>
                                    <Text style={styles.sheetItemDesc}>{t('monitor.full_set_desc')}</Text>
                                </View>
                                <ChevronRight color="#D1D5DB" size={18} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeSheetBtn} onPress={() => setShowDownloadModal(false)}>
                                <Text style={styles.closeSheetText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.logSection}>
                    <View style={styles.logHeader}>
                        <Text style={styles.logTitle}>{t('monitor.event_logs')}</Text>
                        {currentLogs.length > 0 && (
                            <TouchableOpacity onPress={handleClearLogs}>
                                <Trash2 color="#9CA3AF" size={16} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {currentLogs.map((log, index) => (
                        <TouchableOpacity 
                            key={log.id || index} 
                            style={styles.logItem}
                            onPress={() => activeTab === 'upload' && seekToTime(log.time)}
                            activeOpacity={activeTab === 'upload' ? 0.6 : 1}
                        >
                            <View style={styles.logMetaRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    {activeTab === 'upload' && <Zap color="#3B82F6" size={10} />}
                                    <Text style={[styles.logTime, activeTab === 'upload' && { color: '#3B82F6', fontFamily: 'Vietnam-Bold' }]}>{log.time}</Text>
                                </View>
                                <View style={[styles.typeBadge, log.type === 'alert' ? styles.badgeAlert : styles.badgeInfo]}>
                                    <Text style={styles.badgeText}>{(log.type || 'info').toUpperCase()}</Text>
                                </View>
                            </View>
                            <Text style={styles.logMsg}>{translateLogMsg(log.msg)}</Text>
                        </TouchableOpacity>
                    ))}
                    {currentLogs.length === 0 && (
                        <Text style={styles.emptyLogsText}>
                            {activeTab === 'live' ? t('monitor.empty_logs') : t('monitor.empty_upload_logs')}
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
                            <Text style={styles.disclaimerTitle}>{t('monitor.tech_disclaimer')}</Text>
                        </View>
                        <Text style={styles.disclaimerBody}>
                            {t('monitor.tech_desc')}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 28, fontFamily: 'Vietnam-Bold', color: '#111827' },
    subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    statusBannerContainer: { paddingHorizontal: 20, marginBottom: 15 },
    statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, elevation: 1 },
    dotContainer: { marginRight: 10 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    statusLabel: { fontSize: 11, color: '#6B7280' },
    statusValue: { fontSize: 11, fontFamily: 'Vietnam-Bold' },
    tabBar: { flexDirection: 'row', backgroundColor: '#E5E7EB66', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 15 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 6, borderRadius: 8 },
    activeTab: { backgroundColor: '#3B82F6' },
    tabText: { fontSize: 13, color: '#6B7280', fontFamily: 'Vietnam-SemiBold' },
    activeTabText: { color: '#FFFFFF' },
    content: { flex: 1, paddingHorizontal: 20 },
    configBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 15 },
    inputLabel: { fontSize: 11, fontFamily: 'Vietnam-Bold', color: '#6B7280', marginBottom: 6 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12 },
    startBtn: { backgroundColor: '#3B82F6', flexDirection: 'row', padding: 12, borderRadius: 10, justifyContent: 'center', gap: 8 },
    stopBtn: { backgroundColor: '#EF4444', flexDirection: 'row', padding: 12, borderRadius: 10, justifyContent: 'center', gap: 8 },
    btnText: { color: '#FFF', fontFamily: 'Vietnam-Bold' },
    monitorView: { backgroundColor: '#000', borderRadius: 16, height: 240, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
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
        fontFamily: 'Vietnam-Bold',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    disclaimerBody: {
        fontSize: 11,
        color: '#92400E',
        lineHeight: 16,
        fontFamily: 'Vietnam-Regular',
        opacity: 0.8,
    },
    logMsg: { fontSize: 13, color: '#4B5563', marginTop: 2, fontFamily: 'Vietnam-Regular' },
    mockUpload: { padding: 30, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', gap: 10 },
    resultCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    resultStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    successDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' },
    resultLabel: { fontSize: 10, fontFamily: 'Vietnam-Bold', color: '#3B82F6', letterSpacing: 0.5 },
    mainDownloadBtn: { backgroundColor: '#3B82F6', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
    mainDownloadText: { color: '#FFF', fontSize: 12, fontFamily: 'Vietnam-Bold' },
    resultSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryValue: { fontSize: 20, fontFamily: 'Vietnam-Bold', color: '#111827' },
    summaryLabel: { fontSize: 11, color: '#6B7280', fontFamily: 'Vietnam-Medium' },
    summaryDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB', marginHorizontal: 10 },
    summaryAction: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
    reuploadText: { color: '#3B82F6', fontSize: 13, fontFamily: 'Vietnam-Bold' },

    mobileVideoContainer: { height: 200, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
    mobileVideo: { width: '100%', height: '100%' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
    sheetHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { fontSize: 18, fontFamily: 'Vietnam-Bold', color: '#111827', marginBottom: 20, textAlign: 'center' },
    sheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    sheetIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    sheetItemText: { flex: 1 },
    sheetItemTitle: { fontSize: 15, fontFamily: 'Vietnam-Bold', color: '#374151' },
    sheetItemDesc: { fontSize: 12, color: '#6B7280', fontFamily: 'Vietnam-Regular', marginTop: 2 },
    closeSheetBtn: { marginTop: 20, paddingVertical: 15, backgroundColor: '#F3F4F6', borderRadius: 14, alignItems: 'center' },
    closeSheetText: { fontSize: 15, fontFamily: 'Vietnam-Bold', color: '#4B5563' }
});

export default MonitorScreen;