import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import MonitorPage from './pages/MonitorPage';
import DoctorPage from './pages/DoctorPage';

function GlobalProgressIndicator({ jobState, setJobState }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        let interval;
        if (jobState.jobId && jobState.status === 'processing') {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`http://127.0.0.1:8000/api/monitor/job-status/${jobState.jobId}`);
                    if (res.data.status === 'completed') {
                        setJobState(prev => ({ ...prev, status: 'completed', progress: 100, result: res.data.result }));
                        clearInterval(interval);
                    } else if (res.data.status === 'failed') {
                        setJobState(prev => ({ ...prev, status: 'failed', result: null }));
                        clearInterval(interval);
                    } else {
                        setJobState(prev => ({ ...prev, progress: res.data.progress }));
                    }
                } catch(e) {}
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [jobState.jobId, jobState.status]);

    if (!jobState.jobId || jobState.status === 'idle') return null;
    
    // Hide progress box if we are already on the Monitor Page's Drone (Upload) tab
    // We check the pathname (robustly) and the jobState's current tab
    const isMonitorPage = location.pathname === '/monitor' || location.pathname === '/monitor/';
    const isDroneTab = jobState.monitorTab === 'upload';
    
    if (isMonitorPage && isDroneTab) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 z-50 w-80 animate-in slide-in-from-bottom">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Phân Tích Drone Footage</h4>
            {jobState.status === 'processing' ? (
                 <>
                     <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-[#3B82F6] h-2.5 rounded-full transition-all duration-500" style={{ width: `${jobState.progress}%` }}></div>
                     </div>
                     <p className="text-[10px] text-gray-500 text-center font-bold">Đang xử lý... {jobState.progress}%</p>
                 </>
            ) : jobState.status === 'completed' ? (
                 <>
                     <div className="w-full bg-green-500 rounded-full h-2.5 mb-2"></div>
                     <p className="text-[10px] text-green-700 font-bold text-center mb-3">Phân tích hoàn tất!</p>
                     <div className="flex gap-2">
                         <button onClick={() => navigate('/monitor', { state: { tab: 'upload', ts: Date.now() }})} className="flex-1 bg-[#3B82F6] text-white text-[10px] font-bold py-2 rounded-lg transition-transform hover:scale-105 shadow-md shadow-[#3B82F6]/30">Xem Kết Quả</button>
                         <button onClick={() => setJobState(prev => ({ ...prev, status: 'idle', jobId: null }))} className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold transition-all">Đóng</button>
                     </div>
                 </>
            ) : (
                <p className="text-[10px] text-red-500 font-bold text-center mt-2">Có lỗi xảy ra khi phân tích.</p>
            )}
        </div>
    );
}

function MainApp() {
    const [jobState, setJobState] = useState({ 
        jobId: null, 
        status: 'idle', 
        progress: 0, 
        result: null,
        monitorTab: 'live' // Default to live tab
    });
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/monitor" element={<MonitorPage jobState={jobState} setJobState={setJobState} />} />
                <Route path="/doctor" element={<DoctorPage />} />
            </Routes>
            <GlobalProgressIndicator jobState={jobState} setJobState={setJobState} />
        </>
    );
}

function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

export default App;
