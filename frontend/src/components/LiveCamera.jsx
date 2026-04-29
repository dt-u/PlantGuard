import React, { useState, useEffect, useRef } from 'react';
import { Camera, Unplug, Play, Square, AlertCircle, Radio, Maximize, Minimize, Zap, Info, Save, ChevronDown, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useCamera } from '../contexts/CameraContext';

const LiveCamera = ({ onLogEvent, onSaveUrl, cameraHistory = [] }) => {
    const { t, i18n } = useTranslation();
    const { translateDiseaseName } = useDiseaseTranslator();
    const { user } = useAuth();
    
    // Use Global Camera Context
    const {
        cameraUrl, setCameraUrl,
        isStreaming,
        status,
        frame,
        wsError, setWsError,
        isAutoScan, setIsAutoScan,
        startStream, stopStream,
        liveLogs
    } = useCamera();

    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const historyRef = useRef(null);
    
    // Dynamic API Base URL detection
    const host = window.location.hostname;
    const API_BASE = `http://${host}:8000`;

    // Load initial auto-scan status from backend
    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_BASE}/api/monitor/auto-scan/status/${user.id}`)
                .then(res => setIsAutoScan(res.data.active))
                .catch(console.error);
        }
    }, [user, API_BASE, setIsAutoScan]);

    // Close history dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (historyRef.current && !historyRef.current.contains(event.target)) {
                setShowHistory(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleAutoScan = async () => {
        if (!user || (!user.id && user.id !== 'tmp')) return;
        const uId = user.id || "anonymous";
        const targetState = !isAutoScan;
        const endpoint = targetState ? 'start' : 'stop';

        setIsAutoScan(targetState);
        try {
            await axios.post(`${API_BASE}/api/monitor/auto-scan/${endpoint}`, {
                camera_url: cameraUrl,
                user_id: uId
            });
        } catch (e) {
            setIsAutoScan(!targetState); // Revert on error
            console.error(e);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4 bg-white/90 shadow-lg border-blue-50 relative z-[30]">
                <div className="flex-1 w-full relative flex items-center gap-3">
                    <div className="flex-1 relative" ref={historyRef}>
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
                            <Camera className="w-3 h-3" /> {t('monitor.camera_url')}
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    value={cameraUrl}
                                    onChange={(e) => setCameraUrl(e.target.value)}
                                    placeholder={t('monitor.camera_placeholder')}
                                    className="w-full px-4 py-2 pr-10 rounded-xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-xs font-medium bg-white shadow-sm"
                                    disabled={isStreaming}
                                />
                                {cameraHistory.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => !isStreaming && setShowHistory(!showHistory)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                        disabled={isStreaming}
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                                
                                {showHistory && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-3 py-1 mb-1 border-b border-gray-50 flex items-center gap-2">
                                            <History className="w-3 h-3 text-gray-400" />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lịch sử URL</span>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                            {cameraHistory.map((url, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setCameraUrl(url);
                                                        setShowHistory(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors truncate border-l-2 border-transparent hover:border-blue-400"
                                                >
                                                    {url}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {user && (
                                <button
                                    onClick={onSaveUrl}
                                    title="Lưu URL này"
                                    className="p-2 rounded-xl bg-gray-50 border-2 border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm active:scale-90 flex items-center justify-center shrink-0"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {wsError && <p className="absolute -bottom-4 left-1 text-red-500 text-[9px] font-bold flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" /> {wsError}</p>}
                    </div>

                    {/* COMPACT AUTO SCAN TOGGLE */}
                    {user && (
                        <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-xl bg-blue-50/50 border border-blue-100/50 group relative">
                            <div className="group/tooltip relative">
                                <Info className="w-3.5 h-3.5 text-blue-400 cursor-help hover:text-blue-600 transition-colors" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none border border-white/10">
                                    <div className="font-bold text-blue-300 mb-1 flex items-center gap-1">
                                        <Zap className="w-3 h-3 fill-current" /> {t('monitor.auto_scan.title')}
                                    </div>
                                    <p className="leading-relaxed opacity-90">{t('monitor.auto_scan.tooltip')}</p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Zap className={`w-3.5 h-3.5 ${isAutoScan ? 'text-blue-500 fill-current' : 'text-gray-300'}`} />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter whitespace-nowrap">{t('monitor.auto_scan.title')}</span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer ml-1">
                                <input type="checkbox" className="sr-only peer" checked={isAutoScan} onChange={handleToggleAutoScan} />
                                <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto pt-1 md:pt-4">
                    {!isStreaming ? (
                        <button
                            onClick={() => startStream(cameraUrl)}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-black py-2 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 text-xs"
                        >
                            <Play className="w-4 h-4 fill-current" /> {t('monitor.start_btn')}
                        </button>
                    ) : (
                        <button
                            onClick={stopStream}
                            className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white font-black py-2 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-50 active:scale-95 text-xs"
                        >
                            <Square className="w-4 h-4 fill-current" /> {t('monitor.stop_btn')}
                        </button>
                    )}
                </div>
            </div>

            <div ref={containerRef} className={`relative glass-panel bg-slate-900 overflow-hidden border-4 border-slate-800 shadow-2xl transition-all group ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl h-[450px]'}`}>
                {status === "connected" && frame ? (
                    <img src={frame} alt="Live" className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                        <div className={`p-4 rounded-full ${status === 'connecting' ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
                            {status === "connecting" ? (
                                <Radio className="w-10 h-10 text-blue-500 animate-pulse" />
                            ) : (
                                <Unplug className="w-10 h-10 text-slate-600" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-slate-400 font-black tracking-widest uppercase text-[10px]">
                                {status === "connecting" ? t('monitor.status.connecting') : t('monitor.camera_disconnected')}
                            </p>
                            <p className="text-slate-600 text-[9px] mt-1 font-medium">{t('monitor.camera_desc')}</p>
                        </div>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg text-white bg-slate-800/80 hover:bg-slate-700 backdrop-blur-xl border border-white/10 transition-all"
                    >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 backdrop-blur-xl border border-white/10 text-white flex items-center gap-2 shadow-2xl">
                        <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-[9px] font-black tracking-widest uppercase">
                            {status === 'connected' ? t('monitor.status.online') : t('monitor.status.offline')}
                        </span>
                    </div>
                </div>

                {/* VISUAL INDICATORS WHEN AUTO SCAN IS ON */}
                {isAutoScan && (
                    <div className="absolute inset-0 pointer-events-none border-[8px] border-blue-500/10 z-0 animate-pulse"></div>
                )}

                {isAutoScan && (
                    <div className="absolute top-4 left-4 p-2 backdrop-blur-xl text-white shadow-2xl z-10 animate-in fade-in zoom-in">
                        <Zap className="w-4 h-4 fill-current animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveCamera;
