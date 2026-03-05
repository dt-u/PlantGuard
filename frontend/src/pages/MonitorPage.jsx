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
        <div className="min-h-screen pb-12 bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-agri-dark mb-2">Giám Sát Vườn (Monitor)</h1>
                        <p className="text-gray-600">Phân tích dữ liệu từ Drone hoặc Camera an ninh để phát hiện sớm các vùng cây bị stress.</p>
                    </div>

                    {/* Status Banner */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Trạng thái vườn</span>
                            <span className="text-sm font-bold text-agri-green">Rất Ổn Định</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-agri-green/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-agri-green rounded-full animate-ping"></div>
                        </div>
                    </div>
                </div>

                {/* Custom Tab Switcher */}
                <div className="flex p-1 bg-gray-200/50 backdrop-blur rounded-xl w-fit mb-8 mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'live'
                            ? 'bg-agri-green text-white shadow-md'
                            : 'text-gray-500 hover:text-agri-dark'
                            }`}
                    >
                        <Radio className="w-4 h-4" /> Giám sát Live Cam
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'upload'
                            ? 'bg-agri-green text-white shadow-md'
                            : 'text-gray-500 hover:text-agri-dark'
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Phân tích Drone/Footage
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                        <span className="font-bold">Ghi chú vận hành:</span> Hệ thống giám sát AI đang trong giai đoạn hỗ trợ nhận diện sớm dựa trên phân tích hình ảnh từ xa.
                        Do điều kiện ánh sáng và khoảng cách camera, kết quả có thể có sai số. Vui lòng sử dụng <span className="font-bold text-agri-green">Bác Sĩ Cây Trồng</span> để kiểm tra cận cảnh khi phát hiện dấu hiệu bất thường.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* TAB CONTENT: UPLOAD VIDEO */}
                        {activeTab === 'upload' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                {/* Existing Upload Logic */}
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-agri-dark">Dữ liệu ghi hình Drone</h3>
                                    {result && (
                                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center font-bold animate-pulse text-sm">
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Phát hiện {result.alert_count} vùng stress
                                        </div>
                                    )}
                                </div>

                                {!video && !loading && (
                                    <FileUpload onFileSelect={handleUpload} accept={{ 'video/*': [] }} label="video drone/cctv" />
                                )}

                                {loading && <Loader text="Đang xử lý luồng dữ liệu video (có thể mất vài phút)..." />}

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        {error}
                                    </div>
                                )}

                                {result && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="glass-panel p-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                                <Video className="w-3 h-3 mr-2" /> Phim gốc
                                            </h4>
                                            <video src={video} controls className="w-full rounded-lg shadow-sm" />
                                        </div>

                                        <div className="glass-panel p-4 border-2 border-agri-green/30">
                                            <h4 className="text-xs font-bold text-agri-green uppercase mb-3 flex items-center">
                                                <Video className="w-3 h-3 mr-2" /> Kết quả phân tích
                                            </h4>
                                            <video
                                                src={`http://127.0.0.1:8000${result.video_url}`}
                                                controls
                                                autoPlay
                                                loop
                                                className="w-full rounded-lg shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => { setVideo(null); setResult(null); }}
                                            className="btn-secondary"
                                        >
                                            Phân tích bản ghi khác
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: LIVE CAMERA */}
                        {activeTab === 'live' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <LiveCamera />
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Event Logs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-panel p-5 bg-agri-dark text-white min-h-[500px] flex flex-col">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-agri-green mb-4 flex items-center gap-2">
                                <Radio className="w-4 h-4 animate-pulse" /> Nhật ký sự kiện
                            </h3>
                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                                {logs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-gray-600 pl-3 py-1">
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>{log.time}</span>
                                            <span className={log.type === 'alert' ? 'text-red-400 font-bold' : ''}>
                                                {log.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-200 leading-snug">{log.msg}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700 text-[10px] text-gray-500 italic">
                                Tự động cập nhật mỗi khi có biến động...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MonitorPage;
