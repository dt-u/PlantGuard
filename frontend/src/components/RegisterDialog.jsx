import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, X, User, CheckCircle } from 'lucide-react';

const RegisterDialog = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setError('');
        setLoading(false);
        setShowSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        // Password must be at least 6 characters, contain at least one letter and one number
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        return re.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validation
            if (!email || !password || !confirmPassword || !name) {
                setError('Vui lòng điền đầy đủ thông tin');
                return;
            }

            if (!validateEmail(email)) {
                setError('Email không hợp lệ. Vui lòng nhập email đúng định dạng.');
                return;
            }

            if (!validatePassword(password)) {
                setError('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Mật khẩu xác nhận không khớp');
                return;
            }

            if (name.trim().length < 2) {
                setError('Họ và tên phải có ít nhất 2 ký tự');
                return;
            }

            // Try backend API first, fallback to localStorage
            let registrationSuccess = false;
            
            try {
                // Try backend API
                const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
                    email: email,
                    name: name.trim(),
                    password: password
                });

                if (response.data) {
                    registrationSuccess = true;
                }
            } catch (apiError) {
                // Handle specific backend errors
                if (apiError.response && apiError.response.status === 400) {
                    const errorMessage = apiError.response.data.detail || 'Email này đã được sử dụng. Vui lòng chọn email khác.';
                    setError(errorMessage);
                    return;
                }
                
                // Fallback to localStorage only if backend is truly unavailable
                console.log('Backend not available, using localStorage fallback');
                
                // Check if email already exists in localStorage
                const users = JSON.parse(localStorage.getItem('plantguard_users') || '[]');
                if (users.find(u => u.email === email.toLowerCase())) {
                    setError('Email này đã được sử dụng. Vui lòng chọn email khác.');
                    return;
                }
                
                // Create new user in localStorage
                const newUser = {
                    id: 'user_' + Date.now(),
                    email: email,
                    password: password,
                    name: name.trim(),
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('plantguard_users', JSON.stringify(users));
                registrationSuccess = true;
            }

            if (registrationSuccess) {
                // Registration successful, show success popup
                setShowSuccess(true);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
            } else {
                setError('Đăng ký thất bại');
            }
        } catch (err) {
            setError('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Show success popup
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                />
                
                {/* Success Dialog */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                    {/* Content */}
                    <div className="p-6">
                        {/* Success Icon */}
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        {/* Success Text */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h3>
                            <p className="text-gray-600">
                                Tài khoản của bạn đã được tạo thành công.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    onSwitchToLogin();
                                }}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            
            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-blue-600" />
                    </div>

                    {/* Text */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự, bao gồm chữ và số</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đăng ký'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản? 
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterDialog;
