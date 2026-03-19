import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import LiveCamera from '../components/LiveCamera'; // Import the new component
import { Video, AlertTriangle, Upload, Radio } from 'lucide-react';

const MonitorPage = () => {
    // Tab State: 'upload' or 'live'
    const [activeTab, setActiveTab] = useState('live'); // Default to live for a "Monitor" feel

    // Logs state (Simulated)
    const [logs, setLogs] = useState([
        { id: 1, time: '10:45:12', msg: 'Hệ thống khởi động thành công', type: 'info' },
        { id: 2, time: '10:46:05', msg: 'Đang quét vùng giám sát Phía Đông', type: 'info' }
    ]);

    const handleLiveLog = (newLog) => {
        setLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    // Upload State
    const [video, setVideo] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setVideo(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/monitor/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
            setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg: `Đã xử lý xong file ${file.name}. Phát hiện ${response.data.alert_count} cảnh báo.`, type: 'alert' }, ...prev]);
        } catch (err) {
            console.error(err);
            setError("Lỗi khi phân tích video. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 mt-4">
                {/* Header Section: Now more compact */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
                            <Video className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-agri-dark">Giám Sát Vườn</h1>
                            <p className="text-xs text-gray-500 max-w-sm hidden md:block">Phân tích dữ liệu Live Cam & Drone thời gian thực.</p>
                        </div>
                    </div>

                    {/* Quick Tab Switcher and Status Group */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'live' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Radio className="w-3 h-3 inline mr-1" /> Live Cam
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'upload' ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Upload className="w-3 h-3 inline mr-1" /> Drone
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 ml-auto lg:ml-0">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Trạng thái vườn:</span>
                            <span className="text-xs font-bold text-[#3B82F6] uppercase">Rất Ổn Định</span>
                            <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* TAB CONTENT: UPLOAD VIDEO */}
                        {activeTab === 'upload' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-agri-dark text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Video className="w-4 h-4" /> Dữ liệu Drone
                                    </h3>
                                    {result && (
                                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center font-bold animate-pulse text-[10px] uppercase">
                                            <AlertTriangle className="w-3 h-3 mr-1.5" />
                                            {result.alert_count} Vùng Stress
                                        </div>
                                    )}
                                </div>

                                {!video && !loading && (
                                    <div className="glass-panel p-12 border-dashed border-2 border-[#3B82F6]/20">
                                        <FileUpload onFileSelect={handleUpload} accept={{ 'video/*': [] }} label="video drone/cctv" />
                                    </div>
                                )}

                                {loading && <Loader text="Đang xử lý luồng dữ liệu video..." />}

                                {result && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="glass-panel p-3">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Bản gốc</h4>
                                            <video src={video} controls className="w-full rounded-lg shadow-sm" />
                                        </div>

                                        <div className="glass-panel p-3 border-2 border-agri-blue/30">
                                            <h4 className="text-[10px] font-bold text-agri-blue uppercase mb-2">AI Phân tích</h4>
                                            <video
                                                src={`http://127.0.0.1:8000${result.video_url}`}
                                                controls
                                                autoPlay
                                                loop
                                                className="w-full rounded-lg shadow-md"
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex justify-center mt-2">
                                            <button
                                                onClick={() => { setVideo(null); setResult(null); }}
                                                className="text-xs font-bold text-[#3B82F6] hover:underline"
                                            >
                                                Phân tích bản ghi khác
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: LIVE CAMERA */}
                        {activeTab === 'live' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <LiveCamera onLogEvent={handleLiveLog} />
                            </div>
                        )}

                        {/* Disclaimer: Moved down */}
                        <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-blue-800 leading-relaxed italic">
                                <span className="font-bold">Ghi chú:</span> Kết quả phân tích dựa trên hình ảnh từ xa. Trong điều kiện ánh sáng yếu hoặc camera bị rung, độ chính xác có thể giảm. Vui lòng đối chiếu với dữ liệu từ <span className="font-bold underline">Bác Sĩ Cây Trồng</span> để có kết quả chính xác nhất.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar: Event Logs */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-4 bg-agri-dark text-white h-full min-h-[400px] flex flex-col border-0">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] mb-4 flex items-center gap-2">
                                <Radio className="w-3 h-3 animate-pulse" /> Nhật ký Live
                            </h3>
                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                {logs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-gray-600 pl-3 py-1">
                                        <div className="flex justify-between text-[9px] text-gray-500">
                                            <span>{log.time}</span>
                                            <span className={log.type === 'alert' ? 'text-red-400 font-bold' : ''}>
                                                {log.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 leading-snug">{log.msg}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-600 italic">
                                Cập nhật tự động...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorPage;
