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
            <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Camera URL (DroidCam/IP Webcam)</label>
                    <input
                        type="text"
                        value={cameraUrl}
                        onChange={(e) => setCameraUrl(e.target.value)}
                        placeholder="http://192.168.x.x:4747/video"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all"
                        disabled={isStreaming}
                    />
                </div>

                <div className="flex items-end gap-2">
                    {!isStreaming ? (
                        <button
                            onClick={startStream}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <Play className="w-4 h-4" /> Start Stream
                        </button>
                    ) : (
                        <button
                            onClick={stopStream}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Square className="w-4 h-4" /> Stop Stream
                        </button>
                    )}
                </div>
            </div>

            <div className="relative glass-panel p-2 min-h-[400px] flex items-center justify-center bg-black/5 overflow-hidden">
                {status === "connected" && frame ? (
                    <img src={frame} alt="Live Stream" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        {status === "connecting" ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <Camera className="w-16 h-16 mb-4" />
                                <p>Connecting to server...</p>
                            </div>
                        ) : (
                            <>
                                <Unplug className="w-16 h-16 mb-4" />
                                <p>Camera Disconnected</p>
                                <p className="text-sm mt-2">Enter URL and click Start to begin detection</p>
                            </>
                        )}
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 bg-white/90 backdrop-blur">
                    <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    {status}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-800 border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                    <strong>Note:</strong> If the provided URL is unreachable, the system will switch to
                    <span className="font-bold"> Simulation Mode</span> (generating dummy frames) so you can still test the UI.
                </p>
            </div>
        </div>
    );
};

export default LiveCamera;
