import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, CheckCircle2, Circle, Clock, AlertCircle, ShieldCheck, ChevronRight, Leaf, ArrowLeft, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CareRoutinesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const fetchRoutines = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/routine/user/${user.id}`);
            setRoutines(response.data);
        } catch (error) {
            console.error('Error fetching routines:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    const handleToggleStrict = async (routineId, currentValue) => {
        try {
            const newValue = !currentValue;
            // Optimistic update
            setRoutines(prev => prev.map(r => r._id === routineId ? { ...r, is_strict_tracking: newValue } : r));
            if (selectedRoutine?._id === routineId) {
                setSelectedRoutine(prev => ({ ...prev, is_strict_tracking: newValue }));
            }

            await axios.put(`http://127.0.0.1:8000/api/routine/${routineId}/settings`, {
                is_strict_tracking: newValue
            });
        } catch (error) {
            console.error('Error toggling strict mode:', error);
            // Revert on error
            fetchRoutines();
        }
    };

    const confirmDelete = (routine) => {
        setRoutineToDelete(routine);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteRoutine = async () => {
        if (!routineToDelete) return;
        
        try {
            setIsDeleting(true);
            setDeleteError(null);
            await axios.delete(`http://127.0.0.1:8000/api/routine/${routineToDelete._id}`);
            setRoutines(prev => prev.filter(r => r._id !== routineToDelete._id));
            if (selectedRoutine?._id === routineToDelete._id) {
                setSelectedRoutine(null);
            }
            setIsDeleteModalOpen(false);
            setRoutineToDelete(null);
        } catch (error) {
            console.error('Error deleting routine:', error);
            setDeleteError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateStatus = async (routineId, eventId, newStatus) => {
        try {
            setUpdatingStatus(eventId);
            await axios.put(`http://127.0.0.1:8000/api/routine/${routineId}/event/${eventId}`, {
                status: newStatus
            });
            
            // Update local state for the list
            setRoutines(prev => prev.map(r => {
                if (r._id === routineId) {
                    return {
                        ...r,
                        events: r.events.map(e => e.id === eventId ? { ...e, status: newStatus } : e)
                    };
                }
                return r;
            }));

            // Update selected routine if open
            if (selectedRoutine && selectedRoutine._id === routineId) {
                setSelectedRoutine(prev => ({
                    ...prev,
                    events: prev.events.map(e => e.id === eventId ? { ...e, status: newStatus } : e)
                }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getProgress = (events) => {
        if (!events || events.length === 0) return 0;
        const completed = events.filter(e => e.status === 'completed' || e.status === 'skipped').length;
        return (completed / events.length) * 100;
    };

    const isToday = (dateStr) => {
        const today = new Date();
        const d = new Date(dateStr);
        return today.toDateString() === d.toDateString();
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    if (loading && !selectedRoutine) {
        return (
            <div className="min-h-screen py-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('routines.title') || 'Tiến độ chăm sóc'}</h1>
                    <p className="text-gray-600">{t('routines.subtitle') || 'Theo dõi và quản lý quá trình điều trị cho cây của bạn'}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Routine List */}
                    <div className="lg:col-span-1 space-y-4">
                        {routines.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Chưa có lộ trình nào được tạo.</p>
                            </div>
                        ) : (
                            routines.map((routine) => (
                                <motion.div
                                    key={routine._id}
                                    layoutId={routine._id}
                                    onClick={() => setSelectedRoutine(routine)}
                                    className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                                        selectedRoutine?._id === routine._id ? 'border-agri-green shadow-lg shadow-agri-green/10' : 'border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-agri-green/10 flex-shrink-0 flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-agri-green" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-gray-900 truncate">{routine.plant_name}</h3>
                                                <p className="text-xs text-gray-500 truncate">{routine.disease_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(routine);
                                                }}
                                                className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-500">Tiến độ</span>
                                            <span className="text-agri-green">{Math.round(getProgress(routine.events))}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-agri-green h-full transition-all duration-500" 
                                                style={{ width: `${getProgress(routine.events)}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Routine Detail */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode='wait'>
                            {selectedRoutine ? (
                                <motion.div
                                    key={selectedRoutine._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-agri-green/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-8 h-8 text-agri-green" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-2xl font-bold text-gray-900 truncate">{selectedRoutine.plant_name}</h2>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-gray-500 text-sm truncate">{selectedRoutine.disease_name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                            <div className="px-3 py-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chế độ theo dõi</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold ${selectedRoutine.is_strict_tracking ? 'text-red-500' : 'text-agri-green'}`}>
                                                        {selectedRoutine.is_strict_tracking ? 'Nghiêm ngặt' : 'Linh hoạt'}
                                                    </span>
                                                    <button
                                                        onClick={() => handleToggleStrict(selectedRoutine._id, selectedRoutine.is_strict_tracking)}
                                                        className={`w-12 h-6 rounded-full transition-colors relative ${
                                                            selectedRoutine.is_strict_tracking ? 'bg-red-500' : 'bg-agri-green'
                                                        }`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                                            selectedRoutine.is_strict_tracking ? 'left-7' : 'left-1'
                                                        }`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {selectedRoutine.events.map((event, index) => {
                                            const today = isToday(event.date);
                                            const isLast = index === selectedRoutine.events.length - 1;
                                            
                                            let icon = <Circle className="w-6 h-6 text-gray-300" />;
                                            let colorClass = "text-gray-400";
                                            let bgClass = "bg-white";
                                            
                                            if (event.status === 'completed') {
                                                icon = <CheckCircle2 className="w-6 h-6 text-agri-green" />;
                                                colorClass = "text-agri-green";
                                                bgClass = "bg-agri-green/5";
                                            } else if (event.status === 'missed') {
                                                icon = <AlertCircle className="w-6 h-6 text-red-500" />;
                                                colorClass = "text-red-500";
                                                bgClass = "bg-red-50";
                                            } else if (event.status === 'skipped') {
                                                icon = <Clock className="w-6 h-6 text-amber-500" />;
                                                colorClass = "text-amber-500";
                                                bgClass = "bg-amber-50";
                                            } else if (today) {
                                                icon = <Circle className="w-6 h-6 text-blue-500 fill-blue-500/20" />;
                                                colorClass = "text-blue-600";
                                                bgClass = "bg-blue-50 border-blue-100";
                                            }

                                            return (
                                                <div key={event.id} className="relative flex gap-6">
                                                    {!isLast && (
                                                        <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-100 -mb-8"></div>
                                                    )}
                                                    <div className="z-10 bg-white p-0.5 rounded-full">{icon}</div>
                                                    <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                                                        today && event.status === 'pending' ? 'border-blue-200 bg-blue-50/50 shadow-sm shadow-blue-500/10' : 'border-gray-50 ' + bgClass
                                                    }`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                                            <h4 className={`font-bold ${colorClass}`}>{event.title}</h4>
                                                            <span className="text-xs font-medium text-gray-400">{formatDate(event.date)}</span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                                                        
                                                        {today && event.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(selectedRoutine._id, event.id, 'completed')}
                                                                disabled={updatingStatus === event.id}
                                                                className="mt-4 w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-agri-green text-agri-green px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-agri-green hover:text-white transition-all group disabled:opacity-50"
                                                            >
                                                                {updatingStatus === event.id ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-4 border-2 border-agri-green border-t-transparent rounded-full animate-spin"></div>
                                                                        Đang cập nhật...
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-5 h-5 rounded-full border-2 border-agri-green group-hover:border-white transition-colors flex items-center justify-center">
                                                                            <Check className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                        </div>
                                                                        Xác nhận hoàn thành
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}

                                                        {event.status !== 'pending' && (
                                                            <div className={`mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                                                event.status === 'completed' ? 'bg-agri-green/10 text-agri-green' : 
                                                                event.status === 'missed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                                {event.status === 'completed' ? 'Thành công' : 
                                                                 event.status === 'missed' ? 'Đã lỡ' : 'Bỏ qua'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <Calendar className="w-16 h-16 text-gray-200 mb-6" />
                                    <h3 className="text-xl font-bold text-gray-400">Chọn một lộ trình để xem chi tiết</h3>
                                    <p className="text-gray-400 mt-2 max-w-xs">Tất cả các mốc thời gian chăm sóc và điều trị sẽ được hiển thị tại đây.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                                    <Trash2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Xác nhận xóa?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Bạn có chắc chắn muốn xóa lộ trình <span className="font-bold text-gray-700">"{routineToDelete?.plant_name}"</span>? 
                                    Hành động này không thể hoàn tác.
                                </p>

                                {deleteError && (
                                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                                        {deleteError}
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleDeleteRoutine}
                                        disabled={isDeleting}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Đang xóa...
                                            </div>
                                        ) : 'Vẫn muốn xóa'}
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        disabled={isDeleting}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        Hủy bỏ
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareRoutinesPage;
