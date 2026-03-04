import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import LiveCamera from '../components/LiveCamera'; // Import the new component
import { Video, AlertTriangle, Upload, Radio } from 'lucide-react';

const MonitorPage = () => {
    // Tab State: 'upload' or 'live'
    const [activeTab, setActiveTab] = useState('upload');

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
        } catch (err) {
            console.error(err);
            setError("Failed to analyze video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-agri-dark mb-2">Monitor Mode</h1>
                        <p className="text-gray-600">Analyze drone or CCTV footage for crop stress detection.</p>
                    </div>
                </div>

                {/* Custom Tab Switcher */}
                <div className="flex p-1 bg-white/50 backdrop-blur rounded-xl border border-white/20 shadow-sm w-fit mb-8 mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'upload'
                                ? 'bg-agri-green text-white shadow-md'
                                : 'text-gray-500 hover:text-agri-dark hover:bg-green-50'
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Upload Video
                    </button>
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'live'
                                ? 'bg-agri-green text-white shadow-md'
                                : 'text-gray-500 hover:text-agri-dark hover:bg-green-50'
                            }`}
                    >
                        <Radio className="w-4 h-4" /> Live Camera
                    </button>
                </div>

                {/* TAB CONTENT: UPLOAD VIDEO */}
                {activeTab === 'upload' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        {/* Existing Upload Logic */}
                        <div className="flex justify-end mb-4">
                            {result && (
                                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center font-bold animate-pulse text-sm">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    {result.alert_count} Alerts Detected
                                </div>
                            )}
                        </div>

                        {!video && !loading && (
                            <FileUpload onFileSelect={handleUpload} accept={{ 'video/*': [] }} label="video footage" />
                        )}

                        {loading && <Loader text="Processing video stream (this may take a moment)..." />}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                <div className="glass-panel p-6">
                                    <h3 className="font-semibold text-gray-500 mb-4 flex items-center">
                                        <Video className="w-4 h-4 mr-2" /> Original Footage
                                    </h3>
                                    <video
                                        src={video}
                                        controls
                                        className="w-full rounded-lg shadow-sm"
                                    />
                                </div>

                                <div className="glass-panel p-6 border-2 border-agri-green/30">
                                    <h3 className="font-semibold text-agri-green mb-4 flex items-center">
                                        <Video className="w-4 h-4 mr-2" /> Processed Analysis
                                    </h3>
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
                                    Analyze New Footage
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
        </div>
    );
};

export default MonitorPage;
