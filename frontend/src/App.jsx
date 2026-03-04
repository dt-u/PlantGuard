import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MonitorPage from './pages/MonitorPage';
import DoctorPage from './pages/DoctorPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/monitor" element={<MonitorPage />} />
                <Route path="/doctor" element={<DoctorPage />} />
            </Routes>
        </Router>
    );
}

export default App;
