import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, Stethoscope, User, LogOut, History, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const location = useLocation();
    const { user, logout, openLogin } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? "bg-agri-green text-white" : "text-agri-dark hover:bg-green-100";
    };

    return (
        <nav className="glass-panel sticky top-4 z-50 mx-4 mb-8 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-agri-dark">
                <Sprout className="w-8 h-8 text-agri-green" />
                <span>PlantGuard</span>
            </Link>

            <div className="flex items-center space-x-4">
                <Link to="/monitor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/monitor')}`}>
                    <Activity className="w-4 h-4" />
                    <span>Giám sát</span>
                </Link>
                <Link to="/doctor" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isActive('/doctor')}`}>
                    <Stethoscope className="w-4 h-4" />
                    <span>Bác sĩ</span>
                </Link>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-agri-dark hover:bg-green-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-agri-green/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-agri-green" />
                            </div>
                            <span className="max-w-[100px] truncate">{user.name}</span>
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <Link
                                        to="/history"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-agri-green"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Lịch sử chẩn đoán</span>
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={openLogin}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-bold bg-agri-green text-white hover:bg-green-700 transition-all shadow-md shadow-green-500/20"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>Đăng nhập</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
