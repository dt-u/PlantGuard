import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
    const [cameraUrl, setCameraUrl] = useState("http://192.168.1.34:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected");
    const [frame, setFrame] = useState(null);
    const [wsError, setWsError] = useState(null);
    const [isAutoScan, setIsAutoScan] = useState(false);
    const [liveLogs, setLiveLogs] = useState([]);
    const [liveAlertCount, setLiveAlertCount] = useState(0);
    
    const wsRef = useRef(null);
    const isStreamingRef = useRef(false);
    const reconnectTimeoutRef = useRef(null);

    // Dynamic API detection
    const host = window.location.hostname;
    const WS_BASE = `ws://${host}:8000`;

    const startStream = (targetUrl) => {
        const urlToUse = targetUrl || cameraUrl;
        if (!urlToUse) return;

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        setWsError(null);
        setIsStreaming(true);
        isStreamingRef.current = true;
        setStatus("connecting");

        const wsUrl = `${WS_BASE}/api/monitor/ws/live`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("connected");
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(urlToUse);
                }
            }, 500);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.image) {
                    setFrame(`data:image/jpeg;base64,${data.image}`);
                }
                if (data.detections && data.detections.length > 0) {
                    const newLogs = data.detections.map(d => ({
                        id: Date.now() + Math.random(),
                        time: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
                        msg: `Phát hiện: ${d.label.toUpperCase()} (${(d.confidence * 100).toFixed(0)}%)`,
                        label: d.label,
                        type: 'alert'
                    }));
                    setLiveLogs(prev => [...newLogs, ...prev].slice(0, 50));
                    setLiveAlertCount(prev => prev + newLogs.length);
                }
            } catch (e) {
                setFrame(`data:image/jpeg;base64,${event.data}`);
            }
        };

        ws.onclose = (e) => {
            setStatus("disconnected");
            if (isStreamingRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isStreamingRef.current) startStream(urlToUse);
                }, 3000);
            } else {
                setIsStreaming(false);
            }
        };

        ws.onerror = () => setStatus("disconnected");
    };

    const stopStream = () => {
        isStreamingRef.current = false;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) wsRef.current.close();
        setIsStreaming(false);
        setStatus("disconnected");
        setFrame(null);
    };

    const value = {
        cameraUrl, setCameraUrl,
        isStreaming, setIsStreaming,
        status, setStatus,
        frame, setFrame,
        wsError, setWsError,
        isAutoScan, setIsAutoScan,
        liveLogs, setLiveLogs,
        liveAlertCount, setLiveAlertCount,
        startStream, stopStream
    };

    return (
        <CameraContext.Provider value={value}>
            {children}
        </CameraContext.Provider>
    );
};
