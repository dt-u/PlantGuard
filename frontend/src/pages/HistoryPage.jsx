import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, Leaf, Trash2, Filter, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';

const HistoryPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login, getUserId } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, healthy, disease
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, recordId: null });

    useEffect(() => {
        // Check authentication before fetching history
        if (!isAuthenticated()) {
            // Redirect to home page instead of showing dialog
            navigate('/');
            return;
        }
        fetchHistory();
    }, [pagination.page, filter, isAuthenticated, navigate]);

    const fetchHistory = async () => {
        if (!isAuthenticated()) return;
        
        try {
            setLoading(true);
            const skip = (pagination.page - 1) * pagination.limit;
            const response = await axios.get(`http://127.0.0.1:8000/api/history/all`, {
                params: {
                    user_id: getUserId(),
                    limit: pagination.limit,
                    skip: skip
                }
            });
            
            setHistory(response.data.data);
            setPagination(prev => ({ ...prev, total: response.data.total }));
        } catch (err) {
            setError("Không thể tải lịch sử chẩn đoán");
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id) => {
        setDeleteDialog({ isOpen: true, recordId: id });
    };

    const cancelDelete = () => {
        setDeleteDialog({ isOpen: false, recordId: null });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/history/${deleteDialog.recordId}`);
            setDeleteDialog({ isOpen: false, recordId: null });
            fetchHistory(); // Refresh
        } catch (err) {
            setError("Không thể xóa bản ghi");
        }
    };

    const filteredHistory = history.filter(record => {
        const matchesSearch = record.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (filter === 'healthy') return matchesSearch && record.is_healthy;
        if (filter === 'disease') return matchesSearch && !record.is_healthy;
        return matchesSearch;
    });

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

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải lịch sử...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={fetchHistory}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch Sử Chẩn Đoán</h1>
                    <p className="text-gray-600">Xem lại tất cả các lần chẩn đoán bệnh cây trồng của bạn</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh, triệu chứng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'all' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setFilter('disease')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'disease' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Bệnh
                            </button>
                            <button
                                onClick={() => setFilter('healthy')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'healthy' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Lành mạnh
                            </button>
                        </div>
                    </div>
                </div>

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Chưa có lịch sử chẩn đoán nào</p>
                        <p className="text-gray-400 mt-2">Hãy bắt đầu bằng cách chẩn đoán lá cây đầu tiên</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((record) => (
                            <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="md:w-48">
                                        <img
                                            src={`http://127.0.0.1:8000${record.image_url}`}
                                            alt="Chẩn đoán"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <Link 
                                                    to={`/history/${record.id}`}
                                                    className="block hover:text-green-600 transition-colors"
                                                >
                                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                                        {record.disease_name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        record.is_healthy 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {record.is_healthy ? 'Lành mạnh' : 'Bệnh'}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Độ tin cậy: {(record.confidence * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/history/${record.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteRecord(record.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa bản ghi"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {record.symptoms.slice(0, 3).map((symptom, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {symptom}
                                                </span>
                                            ))}
                                            {record.symptoms.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded text-xs">
                                                    +{record.symptoms.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatDate(record.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Trước
                        </button>
                        
                        <span className="text-sm text-gray-600">
                            Trang {pagination.page} / {totalPages}
                        </span>
                        
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                            disabled={pagination.page === totalPages}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
            
            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Xóa bản ghi chẩn đoán"
                message="Bạn có chắc muốn xóa bản ghi chẩn đoán này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
            />
        </div>
    );
};

export default HistoryPage;
