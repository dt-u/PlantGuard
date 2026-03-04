import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Dashboard } from './components/Dashboard';
import { MonitorMode } from './components/MonitorMode';
import { DoctorMode } from './components/DoctorMode';
import { TreatmentGuide } from './components/TreatmentGuide';
import { FieldMap } from './components/FieldMap';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get('/history');
        setIsConnected(true);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-full text-white text-sm font-medium z-50 ${isConnected ? 'bg-green-500' : isConnected === false ? 'bg-red-500' : 'bg-gray-500'}`}>
        {isConnected === null ? 'Connecting...' : isConnected ? 'System Online' : 'Backend Custom Disconnected'}
      </div>
      {currentScreen === 'dashboard' && (
        <Dashboard onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'monitor' && (
        <MonitorMode onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'doctor' && (
        <DoctorMode onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'treatment' && (
        <TreatmentGuide onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'map' && (
        <FieldMap onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}