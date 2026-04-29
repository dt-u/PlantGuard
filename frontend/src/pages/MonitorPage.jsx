import React, { useState, useRef } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import LiveCamera from '../components/LiveCamera';
import DatasetReview from '../components/DatasetReview';
import { Video, AlertTriangle, Upload, Radio, Download, Trash2, Zap, Database, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';
import { useAuth } from '../contexts/AuthContext';

import { useCamera } from '../contexts/CameraContext';

const MonitorPage = ({ jobState, setJobState }) => {
    const { t } = useTranslation();
    const { user, getUserId } = useAuth();
    const { translateDiseaseName } = useDiseaseTranslator();
    const { 
        status, frame, liveLogs, setLiveLogs, 
        liveAlertCount, setLiveAlertCount,
        cameraUrl, setCameraUrl,
        isStreaming, setIsStreaming
    } = useCamera();
    const location = useLocation();

    const [cameraHistory, setCameraHistory] = useState([]);
    const [toastConfig, setToastConfig] = useState({ show: false, title: '', message: '', type: 'success' });

    const showToastMsg = (title, message, type = 'success') => {
        setToastConfig({ show: true, title, message, type });
        setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3000);
    };

    // Fetch saved camera URL if logged in
    React.useEffect(() => {
        const fetchSavedUrl = async () => {
            const userId = getUserId();
            if (userId && userId !== 'anonymous') {
                try {
                    const res = await axios.get(`http://127.0.0.1:8000/api/monitor/camera-url/${userId}`);
                    if (res.data.camera_url) {
                        setCameraUrl(res.data.camera_url);
                    }
                    if (res.data.history) {
                        setCameraHistory(res.data.history);
                    }
                } catch (e) {
                    console.error("Error fetching saved URL:", e);
                }
            }
        };
        fetchSavedUrl();
    }, [getUserId, setCameraUrl]);

    const handleSaveUrl = async () => {
        const userId = getUserId();
        if (!userId || userId === 'anonymous') {
            showToastMsg('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để lưu URL camera vào danh sách của bạn.', 'error');
            return;
        }
        
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/monitor/camera-url/save', {
                user_id: userId,
                camera_url: cameraUrl
            });
            if (res.data.urls) setCameraHistory(res.data.urls);
            
            showToastMsg('Thành công!', 'Đã lưu URL camera vào danh sách của bạn.', 'success');
        } catch (e) {
            console.error("Error saving URL:", e);
            showToastMsg('Lỗi', 'Không thể lưu URL camera lúc này.', 'error');
        }
    };
    
    // Tab State: 'upload', 'live', or 'dataset'
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'live'); // Default to live

    const handleLiveLog = (newLog) => {
        // Log is already managed by CameraContext, but we can add local UI logic here if needed
    };

    // Upload State
    const [video, setVideo] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const videoRef = useRef(null);

    const seekToVideoTime = (timeStr) => {
        if (!videoRef.current) return;
        const [m, s] = timeStr.split(':').map(Number);
        videoRef.current.currentTime = m * 60 + s;
        videoRef.current.play();
    };

    const result = jobState?.result;
    const loading = jobState?.status === 'processing';

    const handleUpload = async (file) => {
        setUploadError(null);
        setVideo(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/monitor/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setJobState(prev => ({ ...prev, jobId: response.data.job_id, status: 'processing', progress: 0, result: null }));
        } catch (err) {
            console.error(err);
            setUploadError(t('monitor.error_upload'));
        }
    };

    const handleCancel = () => {
        setVideo(null);
        setJobState({ status: 'idle', jobId: null, progress: 0, result: null });
    };

    const handleClearLogs = () => {
        if (activeTab === 'live') {
            setLiveLogs([]);
            setLiveAlertCount(0);
        } else if (result) {
            setJobState(prev => ({
                ...prev,
                result: { ...prev.result, detailed_logs: [] }
            }));
        }
    };

    // Derived Status based on Active Tab
    const currentLogs = activeTab === 'live' ? liveLogs : (result?.detailed_logs || []);
    const currentAlertCount = activeTab === 'live' ? liveAlertCount : (result?.alert_count || 0);
    const isNoData = currentLogs.length === 0 && (activeTab === 'live' ? true : !result);
    const hasIssues = currentAlertCount > 0;
    
    const gardenStatus = isNoData ? t('monitor.status.disconnected') : (hasIssues ? t('monitor.status.risk') : t('monitor.status.stable'));
    const statusColor = isNoData ? "text-gray-400" : (hasIssues ? "text-red-500" : "text-[#3B82F6]");
    const dotColor = isNoData ? "bg-gray-400" : (hasIssues ? "bg-red-500" : "bg-[#3B82F6]");

    const getLocationName = (x, y) => {
        if (x === undefined || y === undefined) return 'center';
        const horizontal = x < 0.33 ? 'left' : (x > 0.66 ? 'right' : 'center');
        const vertical = y < 0.33 ? 'top' : (y > 0.66 ? 'bottom' : 'center');
        if (horizontal === 'center' && vertical === 'center') return 'center';
        if (horizontal === 'center') return `${vertical}_center`;
        if (vertical === 'center') return `${horizontal}_center`;
        return `${vertical}_${horizontal}`;
    };

    return (
        <div className="min-h-screen pb-12 relative">
            {/* Custom Toast Notification */}
            {toastConfig.show && (
                <div className="fixed top-20 right-4 z-[9999] animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className={`${toastConfig.type === 'error' ? 'bg-red-500 shadow-red-200' : 'bg-[#10B981] shadow-green-200'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md`}>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            {toastConfig.type === 'error' ? <AlertTriangle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-wide">{toastConfig.title}</p>
                            <p className="text-[10px] opacity-90">{toastConfig.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 mt-4">
                {/* Header Section: Now more compact */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
                            <Video className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-agri-dark">{t('monitor.title')}</h1>
                            <p className="text-xs text-gray-500 max-w-sm hidden md:block">{t('monitor.subtitle')}</p>
                        </div>
                    </div>

                    {/* Quick Tab Switcher and Status Group */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'live' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Radio className="w-3 h-3 inline mr-1" /> {t('monitor.live_cam')}
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'upload' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Upload className="w-3 h-3 inline mr-1" /> {t('monitor.drone')}
                            </button>
                            <button
                                onClick={() => setActiveTab('dataset')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'dataset' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Database className="w-3 h-3 inline mr-1" /> {t('monitor.dataset')}
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 ml-auto lg:ml-0">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{t('monitor.garden_status')}:</span>
                            <span className={`text-xs font-bold ${statusColor} uppercase`}>{gardenStatus}</span>
                            <div className={`w-2 h-2 ${dotColor} rounded-full animate-pulse`}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* TAB CONTENT: UPLOAD VIDEO */}
                        <div className={`${activeTab !== 'upload' ? 'hidden' : 'animate-in fade-in zoom-in-95 duration-300'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-agri-dark text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Video className="w-4 h-4" /> {t('monitor.drone_data')}
                                    </h3>
                                    {result && (
                                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center font-bold animate-pulse text-[10px] uppercase">
                                            <AlertTriangle className="w-3 h-3 mr-1.5" />
                                            {result.alert_count} {t('monitor.stress_zones')}
                                        </div>
                                    )}
                                </div>

                                {!video && !loading && !result && (
                                    <div className="glass-panel p-12 border-dashed border-2 border-[#3B82F6]/20">
                                        <FileUpload onFileSelect={handleUpload} accept={{ 'video/*': [] }} label={t('monitor.upload_label')} theme="blue" />
                                    </div>
                                )}

                                {loading && (
                                    <div className="glass-panel p-8 text-center animate-in fade-in zoom-in-95">
                                        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#3B82F6] rounded-full animate-spin mx-auto mb-4"></div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-2">{t('monitor.processing')} {jobState?.progress || 0}%</h4>
                                        <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2.5 mb-2">
                                            <div className="bg-[#3B82F6] h-2.5 rounded-full transition-all duration-500" style={{ width: `${jobState?.progress || 0}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic mt-2">{t('monitor.processing_desc')}</p>
                                        <button
                                            onClick={handleCancel}
                                            className="mt-4 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-1.5 rounded-lg transition-all"
                                        >
                                            {t('monitor.cancel_btn')}
                                        </button>
                                    </div>
                                )}

                                {result && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2">
                                        <div className="glass-panel p-3 border-2 border-[#3B82F6]/30">
                                            <div className="flex justify-between items-center mb-3 px-1">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase flex items-center gap-2">
                                                    <Video className="w-4 h-4" /> {t('monitor.analysis_complete')}
                                                </h4>
                                                
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                                                        className="text-[10px] font-bold text-white bg-[#3B82F6] hover:bg-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/20"
                                                    >
                                                        <Download className="w-3.5 h-3.5" /> {t('monitor.download')}
                                                    </button>
                                                    
                                                    {showDownloadDropdown && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-40" 
                                                                onClick={() => setShowDownloadDropdown(false)}
                                                            ></div>
                                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <div className="px-3 py-1 mb-1 border-b border-gray-50">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('monitor.download_options')}</span>
                                                                </div>
                                                                <button
                                                                    onClick={async () => {
                                                                        setShowDownloadDropdown(false);
                                                                        try {
                                                                            const response = await fetch(`http://127.0.0.1:8000${result.video_url}`);
                                                                            const blob = await response.blob();
                                                                            const url = window.URL.createObjectURL(blob);
                                                                            const a = document.createElement('a');
                                                                            a.href = url;
                                                                            a.download = `PG_Video_${jobState.jobId.slice(0, 8)}.mp4`;
                                                                            a.click();
                                                                        } catch (e) { console.error(e); }
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors flex items-center gap-2"
                                                                >
                                                                    <Video className="w-3.5 h-3.5" /> {t('monitor.download_video')}
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        setShowDownloadDropdown(false);
                                                                        window.open(`http://127.0.0.1:8000/api/monitor/logs/excel/${jobState.jobId}`, '_blank');
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors flex items-center gap-2"
                                                                >
                                                                    <div className="w-3.5 h-3.5 bg-green-100 rounded text-green-600 flex items-center justify-center text-[8px] font-bold">X</div>
                                                                    {t('monitor.download_logs')}
                                                                </button>
                                                                <div className="h-px bg-gray-50 my-1"></div>
                                                                <button
                                                                    onClick={async () => {
                                                                        setShowDownloadDropdown(false);
                                                                        window.open(`http://127.0.0.1:8000/api/monitor/zip/${jobState.jobId}`, '_blank');
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-bold text-[#3B82F6] hover:bg-blue-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" /> {t('monitor.download_all')}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <video
                                                ref={videoRef}
                                                src={`http://127.0.0.1:8000${result.video_url}`}
                                                controls
                                                className="w-full max-h-[60vh] object-contain rounded-lg shadow-md mb-2 bg-black"
                                                key={result.video_url}
                                            />
                                            <div className="flex justify-end items-center mt-2 px-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{result.alert_count} {t('monitor.alerts_detected')}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-6">
                                            <button
                                                onClick={() => { setVideo(null); setJobState({status: 'idle', jobId: null, result: null, progress: 0}); }}
                                                className="text-sm font-bold bg-[#3B82F6] hover:bg-blue-600 text-white px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                                            >
                                                <Upload className="w-4 h-4" /> {t('monitor.analyze_another')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* TAB CONTENT: LIVE CAMERA */}
                        <div className={`${activeTab !== 'live' ? 'hidden' : 'animate-in fade-in zoom-in-95 duration-300'}`}>
                            <LiveCamera 
                                onLogEvent={handleLiveLog} 
                                onSaveUrl={handleSaveUrl}
                                cameraHistory={cameraHistory}
                                externalUrl={cameraUrl} 
                                setExternalUrl={setCameraUrl}
                                externalIsStreaming={isStreaming}
                                setExternalIsStreaming={setIsStreaming}
                            />
                        </div>

                        {/* TAB CONTENT: DATASET REVIEW */}
                        <div className={`${activeTab !== 'dataset' ? 'hidden' : 'animate-in fade-in zoom-in-95 duration-300'}`}>
                            <DatasetReview isActive={activeTab === 'dataset'} />
                        </div>

                        {/* Disclaimer: Moved down */}
                        <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-blue-800 leading-relaxed italic">
                                {t('monitor.disclaimer')}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar: Event Logs */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-4 bg-agri-dark text-white h-full min-h-[400px] flex flex-col border-0">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] flex items-center gap-2">
                                    <Radio className={`w-3 h-3 ${activeTab === 'live' ? 'animate-pulse' : ''}`} /> 
                                    {activeTab === 'live' ? t('monitor.logs_live') : t('monitor.logs_analysis')}
                                </h3>
                                {currentLogs.length > 0 && (
                                    <button 
                                        onClick={handleClearLogs}
                                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                                        title="Xóa nhật ký"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                {currentLogs.map((log, idx) => (
                                    <div key={log.id || idx} className="border-l-2 border-gray-600 pl-3 py-1 animate-in fade-in slide-in-from-right-2">
                                        <div className="flex justify-between text-[9px] text-gray-500">
                                            {activeTab === 'upload' ? (
                                                <button 
                                                    onClick={() => seekToVideoTime(log.time)}
                                                    className="text-[10px] font-bold text-[#3B82F6] hover:underline cursor-pointer flex items-center gap-1"
                                                >
                                                    <Zap className="w-2.5 h-2.5" /> {log.time}
                                                </button>
                                            ) : (
                                                <span>{log.time}</span>
                                            )}
                                            <span className={log.type === 'alert' ? 'text-red-400 font-bold' : ''}>
                                                {(log.type || '').toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 leading-snug">
                                            {log.type === 'alert'
                                                ? t('logs.detected_at', { 
                                                    time: log.time, 
                                                    location: t(`monitor_location.${log.location || getLocationName(log.x, log.y)}`) 
                                                  })
                                                : log.msg}
                                        </p>
                                    </div>
                                ))}
                                {currentLogs.length === 0 && (
                                     <p className="text-[10px] text-gray-500 text-center mt-10 italic">{t('monitor.no_data')}</p>
                                )}
                            </div>
                            {activeTab === 'live' && (
                                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-600 italic">
                                    {t('monitor.auto_update')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorPage;
