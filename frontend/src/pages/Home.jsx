import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Eye, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 pt-4 md:pt-6">
            <h1 className="text-5xl md:text-7xl font-bold text-agri-dark mb-4 tracking-tight leading-[1.35]">
                Nông Nghiệp Thông Minh
                <span className="block mt-4 text-agri-green">Khởi Đầu Đơn Giản</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
                PlantGuard bảo vệ mùa màng của bạn bằng AI tiên tiến. Phát hiện sớm bệnh lý và giám sát sức khỏe đồng ruộng theo thời gian thực.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link to="/monitor" className="group glass-panel p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-agri-dark mb-2">Chế độ Giám sát</h2>
                    <p className="text-gray-500 mb-6">Phân tích dữ liệu từ Drone/Camera để phát hiện sớm các vùng cây bị stress trên diện rộng.</p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                        Bắt đầu Giám sát <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link to="/doctor" className="group glass-panel p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-agri-dark mb-2">Bác sĩ Cây trồng</h2>
                    <p className="text-gray-500 mb-6">Chẩn đoán chính xác các loại bệnh trên lá và nhận phác đồ điều trị tức thì.</p>
                    <div className="flex items-center justify-center text-green-600 font-medium">
                        Chẩn đoán ngay <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
