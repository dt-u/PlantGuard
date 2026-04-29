import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { WS_BASE_URL } from '../api/config';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
    const [cameraUrl, setCameraUrl] = useState("http://192.168.1.34:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected");
    const [hasFrame, setHasFrame] = useState(false);
    const [droneLogs, setDroneLogs] = useState([]);
    const [isAutoScan, setIsAutoScan] = useState(false);
    
    const wsRef = useRef(null);
    const isStreamingRef = useRef(false);

    const startStream = (targetUrl) => {
        const urlToUse = targetUrl || cameraUrl;
        if (!urlToUse) return;

        setIsStreaming(true);
        isStreamingRef.current = true;
        setStatus("connecting");
        setHasFrame(false);

        wsRef.current = new WebSocket(`${WS_BASE_URL}/api/monitor/ws/live`);
        
        wsRef.current.onopen = () => {
            wsRef.current.send(urlToUse);
            setStatus("connected");
        };

        wsRef.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.image || data.frame) setHasFrame(true);
                if (data.detections && data.detections.length > 0) {
                    const newLogs = data.detections.map(d => ({
                        id: Math.random().toString(),
                        time: new Date().toLocaleTimeString(),
                        label: d.label,
                        conf: (d.confidence * 100).toFixed(1)
                    }));
                    setDroneLogs(prev => [...newLogs, ...prev].slice(0, 50));
                }
            } catch (err) {
                setHasFrame(true);
            }
        };

        wsRef.current.onerror = () => setStatus("error");
        
        wsRef.current.onclose = () => {
            if (isStreamingRef.current) {
                // Potential auto-reconnect logic could go here
                setStatus("disconnected");
            } else {
                setIsStreaming(false);
                setStatus("disconnected");
                setHasFrame(false);
            }
        };
    };

    const stopStream = () => {
        isStreamingRef.current = false;
        if (wsRef.current) wsRef.current.close();
        setIsStreaming(false);
        setStatus("disconnected");
        setHasFrame(false);
    };

    const value = {
        cameraUrl, setCameraUrl,
        isStreaming, setIsStreaming,
        status, setStatus,
        hasFrame, setHasFrame,
        droneLogs, setDroneLogs,
        isAutoScan, setIsAutoScan,
        startStream, stopStream
    };

    return (
        <CameraContext.Provider value={value}>
            {children}
        </CameraContext.Provider>
    );
};
