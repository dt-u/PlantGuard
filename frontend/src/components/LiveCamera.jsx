import React, { useState, useEffect, useRef } from 'react';
import { Camera, Unplug, Play, Square, AlertCircle, Radio, Maximize, Minimize } from 'lucide-react';

const LiveCamera = ({ onLogEvent }) => {
    const [cameraUrl, setCameraUrl] = useState("http://192.168.5.100:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected"); // disconnected, connecting, connected
    const [frame, setFrame] = useState(null);
    const [wsError, setWsError] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const wsRef = useRef(null);
    const containerRef = useRef(null);
    const isStreamingRef = useRef(false);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const startStream = () => {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        setWsError(null);
        setIsStreaming(true);
        isStreamingRef.current = true;
        setStatus("connecting");

        // Tự động xác định backend host (localhost hoặc 127.0.0.1) khớp với trình duyệt
        const host = window.location.hostname;
        const wsUrl = `ws://${host}:8000/api/monitor/ws/live`;
        console.log("Connecting to:", wsUrl);

        // Connect to WebSocket
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setStatus("connected");
            
            // Thêm delay nhỏ để socket ổn định trước khi gửi dữ liệu (fix lỗi 1006 trên một số môi trường Windows)
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(cameraUrl);
                }
            }, 500);
        };

        ws.onmessage = (event) => {
            try {
                // Thử parse dữ liệu trả về dưới dạng JSON
                const data = JSON.parse(event.data);
                if (data.image) {
                    setFrame(`data:image/jpeg;base64,${data.image}`);
                }
                if (data.detections && data.detections.length > 0 && onLogEvent) {
                    data.detections.forEach(d => {
                        onLogEvent({
                            id: Date.now() + Math.random(),
                            time: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
                            msg: `Cảnh báo đối tượng: [${d.label.toUpperCase()}] - Confidence: ${(d.confidence * 100).toFixed(0)}%`,
                            type: 'alert'
                        });
                    });
                }
            } catch (e) {
                // Nếu không phải JSON, mặc định xử lý như luồng ảnh cũ
                setFrame(`data:image/jpeg;base64,${event.data}`);
            }
        };

        ws.onclose = (e) => {
            console.log("Disconnected from WebSocket", e);
            setStatus("disconnected");
            if (isStreamingRef.current) {
                setWsError("Kết nối bị ngắt quãng. Đang thử tự động kết nối lại...");
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isStreamingRef.current) startStream();
                }, 3000);
            } else {
                setIsStreaming(false);
                if (!e.wasClean) {
                    setWsError("Kết nối bị ngắt. Hãy kiểm tra URL DroidCam.");
                }
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
            setStatus("disconnected");
            setWsError("Lỗi kết nối tín hiệu video...");
        };
    };

    const stopStream = () => {
        isStreamingRef.current = false;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) {
            wsRef.current.close();
        }
        setIsStreaming(false);
        setStatus("disconnected");
        setFrame(null);
        setWsError(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-4 bg-white/80">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đường dẫn Camera (IP/DroidCam)</label>
                    <input
                        type="text"
                        value={cameraUrl}
                        onChange={(e) => setCameraUrl(e.target.value)}
                        placeholder="Ví dụ: http://192.168.1.100:4747/video"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition-all text-sm shadow-inner bg-gray-50"
                        disabled={isStreaming}
                    />
                    {wsError && <p className="text-red-500 text-[10px] mt-1 font-bold animate-pulse">{wsError}</p>}
                </div>

                <div className="flex items-end gap-2 pt-2 md:pt-6">
                    {!isStreaming ? (
                        <button
                            onClick={startStream}
                            className="btn-monitor flex items-center gap-2 whitespace-nowrap shadow-[#3B82F6]/20 shadow-lg"
                        >
                            <Play className="w-4 h-4" /> Bắt đầu Giám sát
                        </button>
                    ) : (
                        <button
                            onClick={stopStream}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-red-200 shadow-lg"
                        >
                            <Square className="w-4 h-4" /> Dừng Luồng
                        </button>
                    )}
                </div>
            </div>

            <div ref={containerRef} className={`relative glass-panel p-2 flex items-center justify-center bg-agri-dark/95 overflow-hidden border-4 border-agri-dark shadow-2xl transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[450px]'}`}>
                {/* Surveillance Overlays */}
                {status === "connected" && (
                    <>
                        <div className="absolute bottom-6 right-6 z-10">
                            <span className="text-white/80 text-xs font-mono drop-shadow-md">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                        </div>
                    </>
                )}

                {status === "connected" && frame ? (
                    <img src={frame} alt="Luồng trực tiếp" className={`w-full object-contain rounded shadow-inner ${isFullscreen ? 'h-screen' : 'h-full'}`} />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        {status === "connecting" ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <Radio className="w-16 h-16 mb-4 text-[#3B82F6]" />
                                <p className="text-gray-400 font-medium">Đang thiết lập kết nối video...</p>
                            </div>
                        ) : (
                            <>
                                <Unplug className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-gray-400 font-bold">Camera chưa kết nối</p>
                                <p className="text-xs mt-2 opacity-50">Nhập URL và nhấn Bắt đầu để quét thực địa</p>
                            </>
                        )}
                    </div>
                )}

                {/* Status Badge & Fullscreen */}
                <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all shadow-md"
                        title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                    >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <div className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-md flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-blue-400 animate-ping' : 'bg-red-500'}`}></span>
                        {status === 'connected' ? 'Trực tuyến' : status === 'connecting' ? 'Đang kết nối' : 'Ngoại tuyến'}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LiveCamera;
