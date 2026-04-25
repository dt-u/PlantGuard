import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Calendar as CalendarIcon, Leaf, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TreatmentCard = ({ treatments = [], diseaseName = "Unknown" }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [expandedId, setExpandedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [plantName, setPlantName] = useState('');
    const [isStrictTracking, setIsStrictTracking] = useState(true);
    const [remindViaEmail, setRemindViaEmail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    if (!treatments || treatments.length === 0) return null;

    const openRoutineModal = (treatment, e) => {
        e.stopPropagation();
        if (!user) {
            alert("Vui lòng đăng nhập để sử dụng tính năng này.");
            return;
        }
        setSelectedTreatment(treatment);
        setSaveSuccess(false);
        setIsModalOpen(true);
    };

    const downloadICS = (events) => {
        const encodedFilename = encodeURIComponent(`routine_${diseaseName.replace(/ /g, '_')}.ics`);
        window.location.href = `http://127.0.0.1:8000/api/routine/export_ics?disease_name=${encodeURIComponent(diseaseName)}&events=${encodeURIComponent(JSON.stringify(events))}`;
    };

    const handleSaveRoutine = async () => {
        if (!plantName.trim()) {
            alert("Vui lòng nhập tên cây.");
            return;
        }

        try {
            setIsSaving(true);
            
            // 1. Generate events
            const genRes = await axios.post('http://127.0.0.1:8000/api/routine/generate', {
                disease_name: diseaseName,
                level: selectedTreatment.level,
                action: selectedTreatment.action,
                product: selectedTreatment.product
            });

            if (genRes.data.status === 'success') {
                // 2. Save to DB
                await axios.post('http://127.0.0.1:8000/api/routine/save', {
                    user_id: user.id,
                    plant_name: plantName,
                    disease_name: diseaseName,
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

    const translateLevel = (level) => {
        switch (level.toLowerCase()) {
            case 'mild': return t('treatment.mild');
            case 'moderate': return t('treatment.moderate');
            case 'severe': return t('treatment.severe');
            case 'maintenance': return t('treatment.maintenance');
            default: return level;
        }
    };

    const getLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'mild': return 'bg-green-100 border-green-200 text-green-800';
            case 'moderate': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
            case 'severe': return 'bg-red-100 border-red-200 text-red-800';
            case 'maintenance': return 'bg-agri-green/10 border-agri-green/20 text-agri-green';
            default: return 'bg-gray-100 border-gray-200 text-gray-800';
        }
    };

    const getIcon = (level) => {
        switch (level.toLowerCase()) {
            case 'mild': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'moderate': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'severe': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'maintenance': return <CheckCircle2 className="w-5 h-5 text-agri-green" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {treatments.map((treatment, index) => (
                    <div
                        key={index}
                        onClick={() => setExpandedId(expandedId === index ? null : index)}
                        className={`glass-panel p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2 ${expandedId === index ? 'ring-2 ring-offset-2 ring-agri-green scale-[1.02]' : 'border-transparent'
                            }`}
                    >
                        <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${getLevelColor(treatment.level)}`}>
                            <div className="flex flex-col">
                                {treatment.level.toLowerCase() === 'maintenance' ? (
                                    <span className="font-bold uppercase tracking-wide text-[14px] whitespace-nowrap">{t('treatment.maintenance')}</span>
                                ) : (
                                    <>
                                        <span className="text-[12px] opacity-70 font-semibold uppercase">{t('treatment.suggestion')}</span>
                                        <span className="font-bold uppercase tracking-wide text-lg -mt-1">
                                            {translateLevel(treatment.level)}
                                        </span>
                                    </>
                                )}
                            </div>
                            {getIcon(treatment.level)}
                        </div>

                        <div className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedId === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                            }`}>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                    {t('treatment.id_guide')}
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed italic">"{treatment.identification_guide}"</p>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{t('treatment.action')}</p>
                                <p className="text-gray-800 text-sm">{treatment.action}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{t('treatment.product')}</p>
                                <p className="text-agri-green font-medium text-sm">{treatment.product}</p>
                            </div>
                            <div className="pt-4 pb-1">
                                <button 
                                    onClick={(e) => openRoutineModal(treatment, e)}
                                    className="w-full flex items-center justify-center gap-2 bg-agri-green/10 text-agri-green hover:bg-agri-green hover:text-white transition-colors duration-300 py-2.5 px-4 rounded-lg font-bold text-sm"
                                >
                                    <CalendarIcon size={16} />
                                    Lập kế hoạch chăm sóc
                                </button>
                            </div>
                        </div>

                        {expandedId !== index && (
                            <p className="text-center text-sm text-gray-400 mt-2">{t('treatment.click_detail')}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Routine Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-agri-green/5">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Leaf className="text-agri-green w-5 h-5" />
                                Lịch trình chăm sóc
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white rounded-full transition-colors">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto">
                            {saveSuccess ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Lưu thành công!</h4>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Lịch trình đã được lưu vào hệ thống Smart Care của PlantGuard.
                                    </p>
                                    <button 
                                        onClick={() => downloadICS(selectedTreatment)}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-xl font-bold text-sm transition-colors mb-3"
                                    >
                                        <CalendarIcon size={18} />
                                        Thêm vào Google Calendar (.ics)
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tên cây cần theo dõi</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={plantName}
                                                onChange={(e) => setPlantName(e.target.value)}
                                                placeholder="Ví dụ: Cà chua ban công, Hoa hồng chậu 1..."
                                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-agri-green/5 rounded-2xl border border-agri-green/10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-gray-900">Theo dõi nghiêm ngặt</span>
                                                <Info size={14} className="text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Yêu cầu xác nhận hoàn thành mỗi ngày để tính điểm tiến độ.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={isStrictTracking}
                                                onChange={() => setIsStrictTracking(!isStrictTracking)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-green"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-gray-900">Nhắc nhở qua Email</span>
                                                <Info size={14} className="text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Nhận thông báo lịch chăm sóc hàng ngày qua Gmail (hữu ích khi không mở Web).
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={remindViaEmail}
                                                onChange={() => setRemindViaEmail(!remindViaEmail)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            {saveSuccess ? (
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full bg-agri-green text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-agri-green/30 transition-all"
                                >
                                    Hoàn tất
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        onClick={handleSaveRoutine}
                                        disabled={isSaving}
                                        className="flex-[2] bg-agri-green text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-agri-green/30 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? 'Đang lưu...' : 'Lưu lịch trình'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TreatmentCard;
