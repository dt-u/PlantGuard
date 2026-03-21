import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import TreatmentCard from '../components/TreatmentCard';
import { AlertCircle, Save } from 'lucide-react';
import RequireAuthDialog from '../components/RequireAuthDialog';
import LoginDialog from '../components/LoginDialog';
import RegisterDialog from '../components/RegisterDialog';
import { useAuth } from '../contexts/AuthContext';

const Cross = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z" />
    </svg>
);

const Hospital = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 7v4" />
        <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
        <path d="M14 9h-4" />
        <path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
        <path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
    </svg>
);

const DoctorPage = () => {
    const { isAuthenticated, login, getUserId } = useAuth();
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedToHistory, setSavedToHistory] = useState(false);
    const [showRequireAuthDialog, setShowRequireAuthDialog] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [pendingSaveToHistory, setPendingSaveToHistory] = useState(false);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setImage(URL.createObjectURL(file)); // Preview

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Add timeout and better error handling
            const response = await axios.post('http://127.0.0.1:8000/api/doctor/diagnose', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000, // 30 seconds timeout
            });
            setResult(response.data);
            setSavedToHistory(false); // Reset save status
        } catch (err) {
            console.error(err);
            if (err.code === 'ECONNABORTED') {
                setError("Quá thời gian chờ. Vui lòng thử lại hoặc kiểm tra kết nối mạng.");
            } else if (err.response && err.response.status === 404) {
                setError(err.response.data.detail);
            } else if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Không thể kết nối với máy chủ phân tích. Vui lòng kiểm tra kết nối mạng.");
            }
        } finally {
            setLoading(false);
        }
    };

    const saveToHistory = async (skipAuthCheck = false) => {
        console.log('=== saveToHistory called ===');
        console.log('skipAuthCheck:', skipAuthCheck);
        console.log('Result exists:', !!result);
        console.log('Already saved:', savedToHistory);
        console.log('Is authenticated:', isAuthenticated());
        console.log('User ID:', getUserId());
        
        // Only check result existence, allow even if savedToHistory is true (for retry)
        if (!result) {
            console.log('No result to save');
            return;
        }
        
        // ALWAYS check authentication unless explicitly skipped
        if (!skipAuthCheck) {
            if (!isAuthenticated()) {
                console.log('Not authenticated, showing require auth dialog');
                setShowRequireAuthDialog(true);
                return;
            }
        }
        
        try {
            const historyRecord = {
                image_url: result.image_url,
                disease_name: result.disease.common_name,
                confidence: result.confidence,
                symptoms: result.disease.symptoms,
                description: result.disease.description,
                treatments: result.disease.treatments,
                is_healthy: result.disease.is_healthy,
                created_at: new Date().toISOString(),
                user_id: getUserId()
            };
            
            console.log('Saving history record:', historyRecord);
            
            const response = await axios.post('http://127.0.0.1:8000/api/history/save', historyRecord);
            console.log('Save response:', response.data);
            console.log('History saved successfully!');
            setSavedToHistory(true);
        } catch (error) {
            console.error('Error saving to history:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            // Don't show error to user as diagnosis was successful
        }
    };

    const handleLoginClick = () => {
        setShowRequireAuthDialog(false);
        setPendingSaveToHistory(true); // Mark that we need to save after login
        setShowLoginDialog(true); // Show login dialog
    };

    const handleSwitchToRegister = () => {
        setShowLoginDialog(false);
        setShowRegisterDialog(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterDialog(false);
        setShowLoginDialog(true);
        // Keep pendingSaveToHistory state as is (don't reset)
    };

    const handleLogin = (userData) => {
        console.log('handleLogin called with userData:', userData);
        login(userData);
        // Don't close dialog here - let LoginDialog handle it
        
        // If there's a pending save operation, execute it
        if (pendingSaveToHistory) {
            console.log('Pending save to history detected, executing...');
            setPendingSaveToHistory(false); // Reset pending state
            
            // Use a much longer delay to ensure auth state is updated
            setTimeout(() => {
                console.log('Executing delayed save to history...');
                console.log('Current result:', result);
                console.log('Current savedToHistory:', savedToHistory);
                console.log('Is authenticated:', isAuthenticated());
                console.log('User ID:', getUserId());
                
                // Double-check authentication before saving
                if (isAuthenticated() && getUserId() !== 'anonymous') {
                    console.log('Authentication confirmed, proceeding with save');
                    // Force save even if savedToHistory is true (in case of previous failed attempt)
                    setSavedToHistory(false);
                    saveToHistory(true);
                } else {
                    console.log('Authentication not ready, retrying...');
                    // Retry after another delay
                    setTimeout(() => {
                        console.log('Retry - Is authenticated:', isAuthenticated());
                        console.log('Retry - User ID:', getUserId());
                        if (isAuthenticated() && getUserId() !== 'anonymous') {
                            setSavedToHistory(false);
                            saveToHistory(true);
                        } else {
                            console.error('Authentication still not working after retry');
                        }
                    }, 1000);
                }
            }, 2000); // Increased to 2 seconds
        }
    };

    const handleRegister = (userData) => {
        // After successful registration, show login dialog
        setShowRegisterDialog(false);
        setShowLoginDialog(true);
    };

    const handleSaveToHistory = () => {
        console.log('=== handleSaveToHistory called ===');
        console.log('Current result:', result);
        console.log('Is authenticated:', isAuthenticated());
        console.log('Current savedToHistory:', savedToHistory);
        console.log('User ID:', getUserId());
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
            console.log('User not authenticated, setting pending save and showing auth dialog');
            setPendingSaveToHistory(true); // Mark that we need to save after auth
            setShowRequireAuthDialog(true);
            return;
        }
        
        console.log('User authenticated, proceeding with save');
        // If authenticated, proceed with save
        saveToHistory(false);
    };

    const resetPage = () => {
        setImage(null);
        setResult(null);
        setError(null);
        setLoading(false);
        setSavedToHistory(false);
        setPendingSaveToHistory(false); // Reset pending state
    };

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 mt-6">
                {!result && !loading && (
                    <div className="max-w-2xl mx-auto text-center mb-8">
                        <h1 className="text-4xl font-bold text-agri-dark mb-3 font-vietnam">Bác Sĩ Cây Trồng</h1>
                        <p className="text-gray-600 text-lg">Chẩn đoán sâu bệnh tức thì thông qua phân tích hình ảnh lá cây.</p>
                        <div className="mt-10">
                            <FileUpload onFileSelect={handleUpload} accept={{ 'image/*': [] }} label="ảnh lá cây" />
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="max-w-2xl mx-auto">
                        <Loader text="Đang phân tích cấu trúc lá và mầm bệnh..." />
                    </div>
                )}

                {error && (
                    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-2xl shadow-sm">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
                                <h3 className="text-lg font-bold">Xảy ra lỗi xử lý</h3>
                            </div>
                            <p className="mb-6 text-sm">{error}</p>
                            <button
                                onClick={resetPage}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors w-full md:w-auto text-sm"
                            >
                                Thử lại bằng ảnh khác
                            </button>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left: Quick Summary (Visible first) */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="glass-panel overflow-hidden border-0 shadow-xl">
                                    <div className="flex flex-col md:flex-row divide-x divide-gray-100">
                                        <div className="w-full md:w-1/2 p-2">
                                            <div className="relative group">
                                                <img
                                                    src={`http://127.0.0.1:8000${result.image_url}`}
                                                    alt="Ảnh đã phân tích"
                                                    className="rounded-xl shadow-inner w-full object-cover aspect-video bg-gray-50"
                                                />
                                                <div className="absolute top-3 left-3 bg-agri-dark/80 backdrop-blur px-3 py-1 rounded-full">
                                                    <span className="text-[10px] text-agri-green font-bold uppercase tracking-wider">Hình ảnh chẩn đoán</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white">
                                            <div className="mb-6">
                                                <span className="text-xs font-bold text-gray-400 uppercase">Kết quả AI nhận diện:</span>
                                                <h2 className="text-3xl font-bold text-agri-dark mt-1 leading-tight">{result.disease.common_name}</h2>

                                                <div className="mt-4 flex items-center gap-3">
                                                    <div className="h-2.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-agri-green transition-all duration-1000 shadow-[0_0_10px_rgba(46,125,50,0.5)]"
                                                            style={{ width: `${result.confidence * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-agri-green">{(result.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {result.disease.symptoms.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="text-[10px] font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
                                                        {s}
                                                    </span>
                                                ))}
                                                {result.disease.symptoms.length > 2 && (
                                                    <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full border border-gray-100">
                                                        +{result.disease.symptoms.length - 2} đặc điểm khác
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-3 mb-6">
                                                <button
                                                    onClick={handleSaveToHistory}
                                                    disabled={savedToHistory}
                                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                                        savedToHistory 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {savedToHistory ? '✓ Đã lưu' : 'Lưu vào lịch sử'}
                                                </button>
                                                <button
                                                    onClick={resetPage}
                                                    className="btn-primary py-3 rounded-xl text-sm"
                                                >
                                                    Kiểm tra lá khác
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Treatment Plan */}
                                <div className="glass-panel p-8 border-t-4 border-agri-green shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-agri-dark font-vietnam flex items-center gap-3">
                                            {result.disease.is_healthy ? (
                                                <>
                                                    <Cross className="w-7 h-7 text-green-500" />
                                                    <span>Kế hoạch Chăm sóc</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Hospital className="w-7 h-7" style={{ color: '#F56565' }} />
                                                    <span>Phác đồ Điều trị Hệ thống</span>
                                                </>
                                            )}
                                        </h3>
                                        <div className="hidden md:block h-px flex-1 bg-gray-100 mx-6"></div>
                                    </div>

                                    <TreatmentCard treatments={result.disease.treatments} />
                                </div>
                            </div>

                            {/* Right: Detailed Info & Disclaimer */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="glass-panel p-6 bg-white">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3 text-agri-green" /> Chi tiết kỹ thuật
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[11px] font-bold text-agri-dark uppercase mb-1 opacity-50">Mô tả bệnh lý:</p>
                                            <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-agri-green/20 pl-3">
                                                "{result.disease.description}"
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-50">
                                            <p className="text-[11px] font-bold text-agri-dark uppercase mb-2 opacity-50">Dấu hiệu nhận biết:</p>
                                            <ul className="space-y-2">
                                                {result.disease.symptoms.map((s, i) => (
                                                    <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                                                        <span className="text-agri-green mt-1">✓</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Disclaimer moved here */}
                                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center">
                                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                                        </div>
                                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Khuyến cáo chuyên môn</span>
                                    </div>
                                    <p className="text-[11px] text-amber-900/70 leading-relaxed">
                                        Kỹ thuật này dựa trên mô hình học sâu (Deep Learning). Kết quả có thể biến động tùy theo chất lượng ảnh và giống cây.
                                        <span className="font-bold underline decoration-amber-400/50 ml-1">Vui lòng tham vấn chuyên gia trước khi áp dụng hóa chất bảo vệ thực vật diện rộng.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Auth Dialogs */}
            <RequireAuthDialog
                isOpen={showRequireAuthDialog}
                onClose={() => setShowRequireAuthDialog(false)}
                onLogin={handleLoginClick}
            />
            
            <LoginDialog
                isOpen={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
                onLogin={handleLogin}
                onSwitchToRegister={handleSwitchToRegister}
            />
            
            <RegisterDialog
                isOpen={showRegisterDialog}
                onClose={() => setShowRegisterDialog(false)}
                onRegister={handleRegister}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </div>
    );
};

export default DoctorPage;
