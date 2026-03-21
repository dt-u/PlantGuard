import React from 'react';
import { User, AlertCircle } from 'lucide-react';

const RequireAuthDialog = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Dialog */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-white/20">
                {/* Gradient Header */}
                <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                
                {/* Content */}
                <div className="p-8">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100/50">
                        <AlertCircle className="w-10 h-10 text-amber-500" />
                    </div>

                    {/* Text */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-vietnam tracking-tight">Yêu cầu đăng nhập</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Vui lòng đăng nhập để lưu kết quả chẩn đoán vào lịch sử cá nhân của bạn.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Để sau
                        </button>
                        <button
                            onClick={onLogin}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-200/50 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <User className="w-5 h-5" />
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequireAuthDialog;
