import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, X, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginDialog = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Fallback to localStorage if backend is not available
            let userData = null;
            
            try {
                // Try backend API first
                const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                    email: email,
                    password: password
                });

                if (response.data) {
                    userData = {
                        id: response.data.id,
                        email: response.data.email,
                        name: response.data.name
                    };
                }
            } catch (apiError) {
                // Fallback to localStorage
                console.log('Backend not available, using localStorage fallback');
                const users = JSON.parse(localStorage.getItem('plantguard_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    userData = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                }
            }

            if (userData) {
                onLogin(userData);
                // Delay closing dialog to allow parent component to process login
                setTimeout(() => {
                    onClose();
                    setEmail('');
                    setPassword('');
                    setShowPassword(false);
                }, 500); 
            } else {
                setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Dialog */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Visual Accent */}
                <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-600" />
                
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 transition-all active:scale-90 z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="p-7 pt-8">
                    {/* Icon Section */}
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-sm border border-green-100/50">
                        <User className="w-8 h-8 text-green-600" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 font-vietnam tracking-tight">Chào mừng trở lại</h3>
                        <p className="text-gray-400 text-xs">Đăng nhập để tiếp tục bảo vệ khu vườn của bạn</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake-in duration-300">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <p className="text-red-600 text-[11px] font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all text-sm"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-200/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] text-sm"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Đang xác thực...</span>
                                    </>
                                ) : (
                                    'Đăng nhập ngay'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center pt-5 border-t border-gray-50">
                        <p className="text-xs text-gray-500">
                            Chưa có tài khoản? 
                            <button
                                onClick={onSwitchToRegister}
                                className="text-green-600 hover:text-green-700 font-bold ml-2 transition-colors underline-offset-4 hover:underline"
                            >
                                Tạo tài khoản mới
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginDialog;
