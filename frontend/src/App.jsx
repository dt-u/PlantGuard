import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MonitorPage from './pages/MonitorPage';
import DoctorPage from './pages/DoctorPage';
import HistoryPage from './pages/HistoryPage';
import DiagnosisDetailPage from './pages/DiagnosisDetailPage';
import ConditionalNavbar from './components/ConditionalNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
    const location = useLocation();
    
    return (
        <div className="min-h-screen bg-gray-50">
            <ConditionalNavbar />
            <main className={location.pathname === '/' ? '' : 'pt-16'}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/monitor" element={<MonitorPage />} />
                    <Route path="/doctor" element={<DoctorPage />} />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/history/:id" element={
                        <ProtectedRoute>
                            <DiagnosisDetailPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
