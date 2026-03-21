import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Activity, AlertCircle, Leaf, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DiagnosisDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDiagnosisDetail();
    }, [id]);

    const fetchDiagnosisDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/history/${id}`);
            setDiagnosis(response.data.data);
        } catch (err) {
            setError("Không thể tải chi tiết chẩn đoán");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const formatRealTime = () => {
        return currentTime.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải chi tiết chẩn đoán...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/history')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Quay lại Lịch sử</span>
                    </button>
                </div>
            </div>
        );
    }

    if (!diagnosis) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Không tìm thấy bản ghi chẩn đoán</p>
                    <button 
                        onClick={() => navigate('/history')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Quay lại Lịch sử</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/history')}
                        className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        <span className="font-semibold">Quay lại Lịch sử</span>
                    </button>
                    
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi Tiết Chẩn Đoán</h1>
                        <p className="text-gray-600">Thông tin chi tiết về lần chẩn đoán bệnh cây trồng</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Image & Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gray-50 relative">
                                <img
                                    src={`http://127.0.0.1:8000${diagnosis.image_url}`}
                                    alt="Hình ảnh chẩn đoán"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur px-3 py-1 rounded-full">
                                    <span className="text-white text-xs font-bold">Hình ảnh gốc</span>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis Result */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{diagnosis.disease_name}</h2>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    diagnosis.is_healthy 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {diagnosis.is_healthy ? 'Lành mạnh' : 'Bệnh'}
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Độ tin cậy:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-600 transition-all duration-1000"
                                                style={{ width: `${diagnosis.confidence * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-green-600">
                                            {(diagnosis.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả</h3>
                                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                    {diagnosis.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Triệu chứng</h3>
                                <div className="flex flex-wrap gap-2">
                                    {diagnosis.symptoms.map((symptom, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                        >
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metadata & Treatments */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-600" />
                                Thông tin chẩn đoán
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Thời gian</p>
                                        <p className="text-sm font-medium text-gray-900">{formatRealTime()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Người dùng</p>
                                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Anonymous'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Trạng thái</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {diagnosis.is_healthy ? 'Khỏe mạnh' : 'Cần điều trị'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Plans */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-green-600" />
                                Phác đồ điều trị
                            </h3>
                            <div className="space-y-4">
                                {diagnosis.treatments && diagnosis.treatments.length > 0 ? (
                                    diagnosis.treatments.map((treatment, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            {treatment.level || treatment.severity || 'Điều trị'} - {treatment.name || treatment.action || 'Phương pháp điều trị'}
                                        </h4>
                                        <div className="space-y-3">
                                            {/* Main description */}
                                            {(treatment.description || treatment.identification_guide) && (
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {treatment.description || treatment.identification_guide}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Action/Method */}
                                            {treatment.action && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <p className="text-xs font-medium text-blue-800 mb-1">Hành động:</p>
                                                    <p className="text-xs text-blue-700">{treatment.action}</p>
                                                </div>
                                            )}
                                            
                                            {/* Product */}
                                            {treatment.product && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <p className="text-xs font-medium text-green-800 mb-1">Sản phẩm đề xuất:</p>
                                                    <p className="text-xs text-green-700">{treatment.product}</p>
                                                </div>
                                            )}
                                            
                                            {/* Steps if available */}
                                            {treatment.steps && treatment.steps.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700">Cách thực hiện:</p>
                                                    <ul className="text-xs text-gray-600 space-y-1 mt-1">
                                                        {treatment.steps.map((step, stepIndex) => (
                                                            <li key={stepIndex} className="flex items-start gap-2">
                                                                <span className="text-green-600 mt-0.5">•</span>
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {/* Fallback if no detailed info */}
                                            {!treatment.action && !treatment.product && !treatment.steps && treatment.description && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                    <p className="text-xs text-amber-800">
                                                        ℹ️ Chi tiết về phương pháp điều trị đã được mô tả ở trên
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Legacy products array support */}
                                        {treatment.products && treatment.products.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-medium text-gray-700">Sản phẩm khác:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {treatment.products.map((product, productIndex) => (
                                                        <span key={productIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            {product}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Không có phác đồ điều trị nào</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiagnosisDetailPage;
