import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Activity, AlertCircle, Leaf, Clock, CalendarPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';
import treatmentService from '../services/treatmentService';

const DiagnosisDetailPage = () => {
    const { t, i18n } = useTranslation();
    const { translateDiseaseName, translateDescription, translateSymptoms, translateTreatments } = useDiseaseTranslator();
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [plantName, setPlantName] = useState('');
    const [isStrictTracking, setIsStrictTracking] = useState(true);
    const [remindViaEmail, setRemindViaEmail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const openRoutineModal = (treatment) => {
        if (!user) {
            alert("Vui lòng đăng nhập để sử dụng tính năng này.");
            return;
        }
        setSelectedTreatment(treatment);
        setSaveSuccess(false);
        setIsModalOpen(true);
    };

    const handleSaveRoutine = async () => {
        if (!plantName.trim()) {
            alert("Vui lòng nhập tên cây.");
            return;
        }

        try {
            setIsSaving(true);
            const genRes = await axios.post('http://127.0.0.1:8000/api/routine/generate', {
                disease_name: diagnosis.disease_name,
                level: selectedTreatment.level || selectedTreatment.severity || 'Moderate',
                action: selectedTreatment.action,
                product: selectedTreatment.product_name || selectedTreatment.product
            });

            if (genRes.data.status === 'success') {
                await axios.post('http://127.0.0.1:8000/api/routine/save', {
                    user_id: user.id,
                    plant_name: plantName,
                    disease_name: diagnosis.disease_name,
                    is_strict_tracking: isStrictTracking,
                    remind_via_email: remindViaEmail,
                    events: genRes.data.events
                });
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error("Error saving routine:", error);
            alert("Đã xảy ra lỗi khi lưu lịch trình.");
        } finally {
            setIsSaving(false);
        }
    };

    const downloadICS = () => {
        window.location.href = `http://127.0.0.1:8000/api/routine/export_ics?disease_name=${encodeURIComponent(diagnosis.disease_name)}&events=${encodeURIComponent(JSON.stringify(selectedTreatment))}`;
    };

    const handleBuyAction = (treatment) => {
        treatmentService.handlePurchase(treatment);
    };

    useEffect(() => {
        fetchDiagnosisDetail();
    }, [id]);

    const fetchDiagnosisDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/history/${id}`);
            setDiagnosis(response.data.data);
        } catch (err) {
            setError(t('detail.error_load'));
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: false
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('detail.loading')}</p>
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
                </div>
            </div>
        );
    }

    if (!diagnosis) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{t('detail.not_found')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 font-vietnam tracking-tight">{t('detail.title')}</h1>
                    <p className="text-gray-500 font-medium tracking-wide">{t('detail.subtitle')}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Image & Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="aspect-video bg-gray-50 relative">
                                <img
                                    src={`http://127.0.0.1:8000${diagnosis.image_url}`}
                                    alt="Hình ảnh chẩn đoán"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-agri-dark/80 backdrop-blur px-3 py-1 rounded-full">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">{t('detail.image_label')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis Result */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-agri-dark">
                                    {translateDiseaseName(diagnosis.disease_name, diagnosis.disease_slug || diagnosis.disease_name)}
                                </h2>
                                <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                                    diagnosis.is_healthy 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {diagnosis.is_healthy ? t('history.healthy_tag') : t('history.disease_tag')}
                                </span>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('detail.ai_confidence')}:</span>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-agri-green transition-all duration-1000 shadow-[0_0_10px_rgba(46,125,50,0.3)]"
                                                style={{ width: `${diagnosis.confidence * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-lg font-black text-agri-green">
                                            {(diagnosis.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-agri-green" /> {t('doctor.description')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-5 rounded-2xl italic border-l-4 border-agri-green/20">
                                    "{translateDescription(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.description)}"
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('doctor.symptoms')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {translateSymptoms(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.symptoms).map((symptom, index) => (
                                        <span 
                                            key={index}
                                            className="px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
                                        >
                                            <span className="text-agri-green">✓</span> {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metadata & Treatments */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> {t('detail.storage_info')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('detail.time_saved')}</p>
                                        <p className="text-xs font-bold text-agri-dark">{formatDate(diagnosis.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('detail.diagnostician')}</p>
                                        <p className="text-xs font-bold text-agri-dark">{user?.name || t('detail.anonymous')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('detail.category')}</p>
                                        <p className="text-xs font-bold text-agri-dark">
                                            {diagnosis.is_healthy ? t('detail.healthy_plant') : t('detail.need_intervention')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Plans */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Leaf className="w-3 h-3 text-agri-green" /> {t('detail.recommended_plan')}
                            </h3>
                            <div className="space-y-6">
                                {diagnosis.treatments && diagnosis.treatments.length > 0 ? (
                                    translateTreatments(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.treatments).map((treatment, index) => {
                                        const productName = treatment.product_name || treatment.product;
                                        return (
                                        <div key={index} className="relative pl-6 pb-6 border-l-2 border-gray-100 last:pb-0">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-agri-green border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-bold text-agri-dark mb-3">
                                                {(treatment.level || treatment.severity || 'Step')} - {treatment.name || treatment.action || 'Action'}
                                            </h4>
                                            <div className="space-y-3">
                                                {(treatment.description || treatment.identification_guide) && (
                                                    <p className="text-xs text-gray-500 leading-relaxed italic">
                                                        "{treatment.description || treatment.identification_guide}"
                                                    </p>
                                                )}
                                                
                                                {productName && (
                                                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                                        <p className="text-[10px] font-black text-green-800 uppercase mb-1">{t('detail.product_label')}:</p>
                                                        <p className="text-xs font-bold text-green-700">{productName}</p>
                                                    </div>
                                                )}
                                                
                                                {treatment.action && (
                                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                                                        <p className="text-[10px] font-black text-blue-800 uppercase mb-1">{t('detail.action_label')}:</p>
                                                        <p className="text-xs font-bold text-blue-700">{treatment.action}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-2 mt-3">
                                                    {!diagnosis.is_healthy && (
                                                        <button
                                                            onClick={() => openRoutineModal(treatment)}
                                                            className="w-full flex items-center justify-center gap-2 bg-agri-green/10 text-agri-green hover:bg-agri-green hover:text-white transition-all duration-300 py-2 px-3 rounded-lg font-bold text-xs"
                                                        >
                                                            <CalendarPlus size={14} />
                                                            Lưu lịch điều trị
                                                        </button>
                                                    )}

                                                    {productName && 
                                                     productName !== 'N/A' && 
                                                     productName !== 'n/a' && 
                                                     productName !== 'Dọn dẹp tàn dư rơm rạ' && 
                                                     productName !== 'Dừng canh tác cây họ cà một vụ' && 
                                                     productName !== 'Không có thuốc chữa (Virus)' && 
                                                     productName !== 'Luân canh cây không cùng họ (Đậu, Lạc)' && 
                                                     productName !== 'Nước sạch' && 
                                                     productName !== 'Vệ sinh đồng ruộng' && 
                                                     productName !== 'Ánh sáng tự nhiên' && (
                                                        <button
                                                            onClick={() => handleBuyAction(treatment)}
                                                            style={{ 
                                                                backgroundColor: '#ee4d2d', 
                                                                color: 'white', 
                                                                padding: '8px 16px', 
                                                                borderRadius: '8px',
                                                                fontSize: '11px',
                                                                fontWeight: 'bold',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                transition: 'all 0.2s ease',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            🛒 Mua ngay trên Shopee
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )})
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-400 text-xs italic">{t('detail.no_additional_plan')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{t('detail.expert_note')}</span>
                            </div>
                            <p className="text-[10px] text-amber-900/60 leading-relaxed">
                                {t('detail.expert_note_desc')}
                            </p>
                        </div>
                    </div>
                </div>

            {/* Routine Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-agri-green/5">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Leaf className="text-agri-green w-5 h-5" />
                                Lịch trình chăm sóc
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white rounded-full transition-colors">
                                <Clock size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto">
                            {saveSuccess ? (
                                <div className="text-center py-2">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Leaf className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="text-md font-bold text-gray-900 mb-1">Lưu thành công!</h4>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Lịch trình đã được lưu vào hệ thống PlantGuard.
                                    </p>
                                    <button 
                                        onClick={downloadICS}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-xl font-bold text-xs transition-colors mb-2"
                                    >
                                        <Calendar size={16} />
                                        Thêm vào Google Calendar (.ics)
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Tên cây cần theo dõi</label>
                                        <input 
                                            type="text" 
                                            value={plantName}
                                            onChange={(e) => setPlantName(e.target.value)}
                                            placeholder="Ví dụ: Cà chua ban công..."
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-agri-green/5 rounded-xl border border-agri-green/10">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900">Theo dõi nghiêm ngặt</p>
                                            <p className="text-[10px] text-gray-500">Xác nhận hoàn thành mỗi ngày.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={isStrictTracking}
                                            onChange={() => setIsStrictTracking(!isStrictTracking)}
                                            className="w-4 h-4 accent-agri-green"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900">Nhắc nhở qua Email</p>
                                            <p className="text-[10px] text-gray-500">Nhận thông báo qua Gmail.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={remindViaEmail}
                                            onChange={() => setRemindViaEmail(!remindViaEmail)}
                                            className="w-4 h-4 accent-purple-500"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 flex gap-2">
                            {saveSuccess ? (
                                <button onClick={() => setIsModalOpen(false)} className="w-full bg-agri-green text-white py-2.5 rounded-xl font-bold text-sm">Hoàn tất</button>
                            ) : (
                                <>
                                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 text-sm">Hủy</button>
                                    <button onClick={handleSaveRoutine} disabled={isSaving} className="flex-[2] bg-agri-green text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                                        {isSaving ? 'Đang lưu...' : 'Lưu lịch trình'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
                </div>
            </div>
        </>
    );
};

export default DiagnosisDetailPage;
