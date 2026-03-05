import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import TreatmentCard from '../components/TreatmentCard';
import { AlertCircle } from 'lucide-react';

const DoctorPage = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setImage(URL.createObjectURL(file)); // Preview

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/doctor/diagnose', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
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

    const resetPage = () => {
        setImage(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-agri-dark mb-2">Bác Sĩ Cây Trồng</h1>
                <p className="text-gray-600 mb-8">Tải lên hình ảnh lá cây để nhận diện bệnh và nhận phản hồi về phương pháp điều trị.</p>

                {!image && !loading && (
                    <FileUpload onFileSelect={handleUpload} accept={{ 'image/*': [] }} label="ảnh lá cây" />
                )}

                {loading && <Loader text="Đang phân tích sức khỏe của lá..." />}

                {error && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
                                <h3 className="text-lg font-bold">Xảy ra lỗi</h3>
                            </div>
                            <p className="mb-6">{error}</p>
                            <button
                                onClick={resetPage}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center w-full md:w-auto"
                            >
                                Thử lại bằng ảnh khác
                            </button>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Disclaimer Section */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                            <div className="text-sm text-amber-900 leading-relaxed">
                                <span className="font-bold">Lưu ý chuyên môn:</span> Kết quả phân tích được thực hiện bởi AI và chỉ mang tính chất tham khảo.
                                Hệ thống có thể chưa nhận diện được tuyệt đối chính xác tất cả các giống cây hoặc các biến thể bệnh mới.
                                Để có kết quả tốt nhất, hãy kết hợp với quan sát thực tế và tham vấn kỹ thuật từ chuyên gia nông nghiệp.
                            </div>
                        </div>

                        <div className="glass-panel p-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-1/2">
                                    <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-2">Hình ảnh đã phân tích</h3>
                                    <img
                                        src={`http://127.0.0.1:8000${result.image_url}`}
                                        alt="Analyzed"
                                        className="rounded-lg shadow-md w-full object-cover aspect-video bg-gray-100"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-agri-dark leading-tight">{result.disease.common_name}</h2>
                                        <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {result.disease.name}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-agri-green transition-all duration-1000"
                                                    style={{ width: `${result.confidence * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-agri-green">{(result.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-700 font-bold flex items-center gap-2">
                                            <span className="w-1 h-4 bg-agri-green rounded-full"></span>
                                            Mô tả bệnh lý:
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{result.disease.description}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-700 font-bold flex items-center gap-2">
                                            <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
                                            Triệu chứng nhận biết:
                                        </p>
                                        <ul className="grid grid-cols-1 gap-1">
                                            {result.disease.symptoms.map((s, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-agri-green">●</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={`p-3 rounded-lg border mt-4 ${result.disease.is_healthy ? 'bg-agri-green/10 border-agri-green/20' : 'bg-green-50 border-green-100'}`}>
                                        <p className={`${result.disease.is_healthy ? 'text-agri-green' : 'text-green-800'} text-xs leading-relaxed`}>
                                            <span className="font-bold">Nhận xét:</span> {result.disease.is_healthy
                                                ? "Cây của bạn đang ở trạng thái sức khỏe tốt! Hãy kiểm tra định kỳ để duy trì năng suất."
                                                : "Hệ thống đã nhận diện được dấu hiệu bệnh. Vui lòng kiểm tra các gợi ý xử lý bên dưới."}
                                        </p>
                                    </div>

                                    <button
                                        onClick={resetPage}
                                        className="btn-secondary w-full border-2 border-agri-dark/10 hover:border-agri-green hover:text-agri-green transition-all"
                                    >
                                        Phân tích lá khác
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 border-t-4 border-agri-green shadow-lg">
                            <h3 className="text-xl font-bold text-agri-dark mb-4 flex items-center gap-2">
                                {result.disease.is_healthy ? "Kế hoạch Chăm sóc" : "Phác đồ Điều trị"}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                {result.disease.is_healthy
                                    ? "Dưới đây là các biện pháp duy trì giúp cây phát triển bền vững:"
                                    : "Vui lòng đối chiếu với tình trạng cây thực tế để chọn mức độ xử lý phù hợp:"}
                            </p>
                            <TreatmentCard treatments={result.disease.treatments} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPage;
