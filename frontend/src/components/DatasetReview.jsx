import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Check, X, Info, Camera, Clock, BarChart3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';

const DatasetReview = () => {
    const { t } = useTranslation();
    const { getUserId } = useAuth();
    const { translateDiseaseName } = useDiseaseTranslator();
    const [captures, setCaptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const userId = getUserId();

    const fetchCaptures = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://127.0.0.1:8000/api/monitor/pending-captures?user_id=${userId}`);
            setCaptures(res.data);
        } catch (error) {
            console.error("Error fetching pending captures:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaptures();
    }, [userId]);

    const handleVerify = async (captureId, isCorrect) => {
        try {
            setActionLoading(captureId);
            await axios.post('http://127.0.0.1:8000/api/monitor/verify-capture', {
                capture_id: captureId,
                is_correct: isCorrect
            });
            // Remove from local state with animation
            setCaptures(prev => prev.filter(c => c.capture_id !== captureId));
        } catch (error) {
            console.error("Error verifying capture:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">{t('monitor.dataset_loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-agri-dark flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                        {t('monitor.dataset_title')}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">{t('monitor.dataset_subtitle')}</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <span className="text-xs font-bold text-[#3B82F6] uppercase">{t('monitor.dataset_stats')}:</span>
                    <span className="text-lg font-black text-[#3B82F6]">{captures.length}</span>
                </div>
            </div>

            {captures.length === 0 ? (
                <div className="glass-panel py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-gray-700 font-bold mb-1">{t('monitor.dataset_empty')}</h3>
                    <p className="text-xs text-gray-400">AI vẫn đang tiếp tục trực canh vườn cho bạn.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {captures.map((cap) => (
                            <motion.div
                                key={cap.capture_id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
                            >
                                {/* Image Preview */}
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    <img 
                                        src={`http://127.0.0.1:8000${cap.image_url}`} 
                                        alt="AI Capture" 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Camera className="w-3 h-3" />
                                            {cap.confidence ? `${(cap.confidence * 100).toFixed(0)}%` : '??%'}
                                        </div>
                                        <div className="bg-[#3B82F6]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                            {t('monitor.dataset_pending')}
                                        </div>
                                    </div>
                                    
                                    {/* Disease Highlight Overlay (Mock-ish but looks pro) */}
                                    <div 
                                        className="absolute border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-md animate-pulse"
                                        style={{
                                            left: `${(cap.coordinates.cx - cap.coordinates.w/2) * 100}%`,
                                            top: `${(cap.coordinates.cy - cap.coordinates.h/2) * 100}%`,
                                            width: `${cap.coordinates.w * 100}%`,
                                            height: `${cap.coordinates.h * 100}%`
                                        }}
                                    ></div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                                                {translateDiseaseName(cap.disease_name || `Class ${cap.class_id}`)}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(cap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <Info className="w-3 h-3" />
                                                    ID: {cap.capture_id.slice(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex gap-3">
                                        <button
                                            disabled={actionLoading === cap.capture_id}
                                            onClick={() => handleVerify(cap.capture_id, true)}
                                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === cap.capture_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-4 h-4" />}
                                            {t('monitor.dataset_confirm_correct')}
                                        </button>
                                        <button
                                            disabled={actionLoading === cap.capture_id}
                                            onClick={() => handleVerify(cap.capture_id, false)}
                                            className="flex-1 bg-white border border-red-100 hover:bg-red-50 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === cap.capture_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-4 h-4" />}
                                            {t('monitor.dataset_reject_wrong')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default DatasetReview;
