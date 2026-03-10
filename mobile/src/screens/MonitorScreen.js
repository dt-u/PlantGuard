import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Radio, Upload, Play, Square, AlertTriangle, Activity } from 'lucide-react-native';
import { WS_BASE_URL } from '../api/config';

const MonitorScreen = () => {
    const [activeTab, setActiveTab] = useState('live');
    const [cameraUrl, setCameraUrl] = useState("http://192.168.1.5:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected"); // disconnected, connecting, connected
    const [frame, setFrame] = useState(null);
    const [logs, setLogs] = useState([
        { id: 1, time: '10:45:12', msg: 'Hệ thống khởi động thành công', type: 'info' },
    ]);
    const wsRef = useRef(null);

    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const startStream = () => {
        setIsStreaming(true);
        setStatus("connecting");

        const ws = new WebSocket(`${WS_BASE_URL}/api/monitor/ws/live`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("connected");
            ws.send(cameraUrl);
            addLog("Đã kết nối với máy chủ giám sát", "info");
        };

        ws.onmessage = (event) => {
            setFrame(`data:image/jpeg;base64,${event.data}`);
        };

        ws.onclose = () => {
            setStatus("disconnected");
            setIsStreaming(false);
            setFrame(null);
            addLog("Đã ngắt kết nối", "info");
        };

        ws.onerror = (e) => {
            console.error(e);
            setStatus("disconnected");
            setIsStreaming(false);
            Alert.alert("Lỗi", "Không thể kết nối WebSocket. Kiểm tra IP trong config.js");
        };
    };

    const stopStream = () => {
        if (wsRef.current) wsRef.current.close();
    };

    const addLog = (msg, type) => {
        setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg, type }, ...prev]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Giám Sát Vườn</Text>
                
                <View style={styles.statusBanner}>
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusLabel}>Trạng thái vườn</Text>
                        <Text style={styles.statusValue}>Ổn định</Text>
                    </View>
                    <View style={styles.dotContainer}>
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'live' && styles.activeTab]}
                    onPress={() => setActiveTab('live')}
                >
                    <Radio color={activeTab === 'live' ? '#FFFFFF' : '#6B7280'} size={18} />
                    <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live Cam</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'upload' && styles.activeTab]}
                    onPress={() => setActiveTab('upload')}
                >
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

                        <View style={styles.monitorView}>
                            {status === 'connected' && frame ? (
                                <Image source={{ uri: frame }} style={styles.frame} resizeMode="contain" />
                            ) : (
                                <View style={styles.placeholder}>
                                    {status === 'connecting' ? (
                                        <ActivityIndicator color="#3B82F6" size="large" />
                                    ) : (
                                        <Activity color="#D1D5DB" size={64} />
                                    )}
                                    <Text style={styles.placeholderText}>
                                        {status === 'connecting' ? "Đang kết nối..." : "Chưa có tín hiệu video"}
                                    </Text>
                                </View>
                            )}
                            
                            {status === 'connected' && (
                                <View style={styles.liveOverlay}>
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveLabel}>TRỰC TIẾP</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.uploadSection}>
                        <View style={styles.mockUpload}>
                            <Upload color="#9CA3AF" size={48} />
                            <Text style={styles.placeholderText}>Tính năng tải lên Video sẽ khả dụng sớm trên Mobile</Text>
                            <Text style={styles.smallText}>(Vui lòng sử dụng bản Web để phân tích Drone footage phức tạp)</Text>
                        </View>
                    </View>
                )}

                {/* Event Logs */}
                <View style={styles.logSection}>
                    <Text style={styles.logTitle}>Nhật ký sự kiện</Text>
                    {logs.map(log => (
                        <View key={log.id} style={styles.logItem}>
                            <Text style={styles.logTime}>{log.time}</Text>
                            <Text style={styles.logMsg}>{log.msg}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#111827',
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 16,
        elevation: 2,
    },
    statusInfo: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    statusLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter-Bold',
    },
    statusValue: {
        fontSize: 12,
        color: '#3B82F6',
        fontFamily: 'Inter-Bold',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB66',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    configBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: '#6B7280',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginBottom: 15,
    },
    startBtn: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 10,
    },
    stopBtn: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 10,
    },
    btnText: {
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
        fontSize: 16,
    },
    monitorView: {
        backgroundColor: '#111827',
        borderRadius: 20,
        height: 350,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    frame: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
        gap: 15,
    },
    placeholderText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
    liveOverlay: {
        position: 'absolute',
        top: 15,
        left: 15,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000080',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    liveLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Inter-Bold',
        letterSpacing: 1,
    },
    logSection: {
        marginTop: 30,
        paddingBottom: 40,
    },
    logTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        marginBottom: 15,
    },
    logItem: {
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
        paddingLeft: 15,
        paddingVertical: 10,
        marginBottom: 5,
    },
    logTime: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter-Regular',
        marginBottom: 2,
    },
    logMsg: {
        fontSize: 12,
        color: '#4B5563',
        fontFamily: 'Inter-Medium',
    },
    uploadSection: {
        paddingTop: 40,
    },
    mockUpload: {
        alignItems: 'center',
        gap: 10,
        padding: 40,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 20,
    },
    smallText: {
        fontSize: 10,
        color: '#9CA3AF',
    }
});

export default MonitorScreen;
