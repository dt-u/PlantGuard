import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const TreatmentCard = ({ treatments = [], diseaseName = "Unknown" }) => {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);

    if (!treatments || treatments.length === 0) return null;

    const downloadRoutine = async (treatment, e) => {
        e.stopPropagation();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/routine/download.ics', {
                disease_name: diseaseName,
                level: treatment.level,
                action: treatment.action,
                product: treatment.product,
                is_tracking_enabled: false
            }, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `plantguard_routine_${diseaseName.replace(/\s+/g, '_')}.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading routine:", error);
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
                                onClick={(e) => downloadRoutine(treatment, e)}
                                className="w-full flex items-center justify-center gap-2 bg-agri-green/10 text-agri-green hover:bg-agri-green hover:text-white transition-colors duration-300 py-2.5 px-4 rounded-lg font-bold text-sm"
                            >
                                <CalendarIcon className="w-4 h-4" />
                                Lưu vào Lịch cá nhân (Web/PC)
                            </button>
                        </div>
                    </div>

                    {expandedId !== index && (
                        <p className="text-center text-sm text-gray-400 mt-2">{t('treatment.click_detail')}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TreatmentCard;
