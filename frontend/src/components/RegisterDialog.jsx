import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, X, User, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RegisterDialog = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setShowPassword(false);
        setShowConfirmPassword(false);
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
                setError(t('auth.error_required'));
                return;
            }

            if (!validateEmail(email)) {
                setError(t('auth.error_email_invalid'));
                return;
            }

            if (!validatePassword(password)) {
                setError(t('auth.error_password_invalid'));
                return;
            }

            if (password !== confirmPassword) {
                setError(t('auth.error_password_mismatch'));
                return;
            }

            if (name.trim().length < 2) {
                setError(t('auth.error_name_short'));
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
                    const errorMessage = apiError.response.data.detail || t('auth.error_email_exists');
                    setError(errorMessage);
                    return;
                }
                
                // Fallback to localStorage only if backend is truly unavailable
                console.log('Backend not available, using localStorage fallback');
                
                // Check if email already exists in localStorage
                const users = JSON.parse(localStorage.getItem('plantguard_users') || '[]');
                if (users.find(u => u.email === email.toLowerCase())) {
                    setError(t('auth.error_email_exists'));
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
                setError(t('auth.error_register_failed'));
            }
        } catch (err) {
            setError(t('auth.error_register_failed'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Show success popup
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={handleClose}
                />
                
                {/* Success Dialog */}
                <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-white/20">
                    <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
                    
                    {/* Content */}
                    <div className="p-8 pt-10">
                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100/50">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        {/* Success Text */}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-vietnam tracking-tight">{t('auth.register_success')}</h3>
                            <p className="text-gray-500 text-sm">
                                {t('auth.register_success_desc')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
                            >
                                {t('auth.close')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    onSwitchToLogin();
                                }}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <User className="w-5 h-5" />
                                {t('auth.login_now')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={handleClose}
            />
            
            {/* Dialog */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-white/20 max-h-[98vh] overflow-y-auto custom-scrollbar">
                {/* Visual Accent */}
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-600" />
                
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-all active:scale-90 z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="px-8 py-5">
                    {/* Icon Section */}
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100/50">
                        <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-0.5 font-vietnam tracking-tight">{t('auth.register_title')}</h3>
                        <p className="text-gray-400 text-[11px]">{t('auth.register_desc')}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        {error && (
                            <div className="p-2 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in shake-in duration-300">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <p className="text-red-600 text-[10px] font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-0.5">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('auth.fullname')} *
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('auth.email')} *
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('auth.password')} *
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-1.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('auth.password_confirm')} *
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-1.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t('auth.registering')}</span>
                                    </>
                                ) : (
                                    t('auth.register_btn')
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-4 text-center pt-3 border-t border-gray-50">
                        <p className="text-[11px] text-gray-500">
                            {t('auth.have_account')} 
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors underline-offset-4 hover:underline"
                            >
                                {t('auth.login_now')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterDialog;
