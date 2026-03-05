import React, { useState, useEffect, useRef } from 'react';
import { Camera, Unplug, Play, Square, AlertCircle } from 'lucide-react';

const LiveCamera = () => {
    const [cameraUrl, setCameraUrl] = useState("http://192.168.1.5:4747/video");
    const [isStreaming, setIsStreaming] = useState(false);
    const [status, setStatus] = useState("disconnected"); // disconnected, connecting, connected
    const [frame, setFrame] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const startStream = () => {
        setIsStreaming(true);
        setStatus("connecting");

        // Connect to WebSocket
        const ws = new WebSocket("ws://127.0.0.1:8000/api/monitor/ws/live");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setStatus("connected");
            // Send the camera URL to the server
            ws.send(cameraUrl);
        };

        ws.onmessage = (event) => {
            // Received base64 frame
            setFrame(`data:image/jpeg;base64,${event.data}`);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
            setStatus("disconnected");
            setIsStreaming(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
            setStatus("disconnected");
            setIsStreaming(false);
        };
    };

    const stopStream = () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
        setIsStreaming(false);
        setStatus("disconnected");
        setFrame(null);
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
                        placeholder="http://192.168.x.x:4747/video"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all text-sm shadow-inner bg-gray-50"
                        disabled={isStreaming}
                    />
                </div>

                <div className="flex items-end gap-2 pt-2 md:pt-6">
                    {!isStreaming ? (
                        <button
                            onClick={startStream}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap shadow-agri-green/20 shadow-lg"
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

            <div className="relative glass-panel p-2 min-h-[450px] flex items-center justify-center bg-agri-dark/95 overflow-hidden border-4 border-agri-dark shadow-2xl">
                {/* Surveillance Overlays */}
                {status === "connected" && (
                    <>
                        <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                            <span className="text-white text-xs font-mono font-bold tracking-widest drop-shadow-md">LIVE RECAP</span>
                        </div>
                        <div className="absolute bottom-6 right-6 z-10">
                            <span className="text-white/80 text-xs font-mono drop-shadow-md">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                        </div>
                    </>
                )}

                {status === "connected" && frame ? (
                    <img src={frame} alt="Live Stream" className="w-full h-full object-contain rounded shadow-inner" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        {status === "connecting" ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <Radio className="w-16 h-16 mb-4 text-agri-green" />
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

                {/* Status Badge */}
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-md flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                    <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-400 animate-ping' : 'bg-red-500'}`}></span>
                    {status === 'connected' ? 'Trực tuyến' : status === 'connecting' ? 'Đang kết nối' : 'Ngoại tuyến'}
                </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-900 border border-amber-100 shadow-sm transition-all hover:shadow-md">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed">
                    <strong>Thông tin kỹ thuật:</strong> Nếu URL camera không khả dụng (do mạng hoặc thiết bị), hệ thống sẽ tự động chuyển sang
                    <span className="font-extrabold text-amber-700"> Chế độ Giả lập (Simulation)</span> để bạn có thể kiểm thử giao diện và luồng dữ liệu AI.
                </p>
            </div>
        </div>
    );
};

export default LiveCamera;
