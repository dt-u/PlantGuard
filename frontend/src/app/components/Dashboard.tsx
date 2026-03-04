import { Plane, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const alerts = [
    { icon: AlertTriangle, text: "Hotspot detected in Sector 4", type: "warning" },
    { icon: CheckCircle2, text: "Sector 2 Healthy", type: "success" },
    { icon: AlertTriangle, text: "Disease spread in North Field", type: "warning" },
    { icon: CheckCircle2, text: "Treatment applied successfully", type: "success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] to-[#e8f5e9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Plane className="w-8 h-8 text-[#1B5E20]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2980B9] rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-[#1B5E20]">PlantGuard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#2980B9] flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Operation Mode</h2>
          <p className="text-lg text-gray-600">Select your monitoring or diagnosis workflow</p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Aerial Monitor Card */}
          <div 
            onClick={() => onNavigate('monitor')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#1B5E20]"
          >
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#1B5E20] to-[#2e7d32] rounded-3xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Plane className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Aerial Monitor</h3>
              <p className="text-gray-600 text-center mb-6">
                Analyze wide-area video for disease hotspots using drone surveillance
              </p>
              <button className="w-full bg-[#1B5E20] hover:bg-[#2e7d32] text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Launch Monitor
              </button>
            </div>
          </div>

          {/* Leaf Doctor Card */}
          <div 
            onClick={() => onNavigate('doctor')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#2980B9]"
          >
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#2980B9] to-[#3498db] rounded-3xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Search className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Leaf Doctor</h3>
              <p className="text-gray-600 text-center mb-6">
                Close-up diagnosis & treatment guide for individual plants
              </p>
              <button className="w-full bg-[#2980B9] hover:bg-[#3498db] text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Open Diagnosis
              </button>
            </div>
          </div>
        </div>

        {/* Recent Alerts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Alerts</h3>
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-[scroll_20s_linear_infinite]">
              {[...alerts, ...alerts].map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg whitespace-nowrap ${
                    alert.type === 'warning' 
                      ? 'bg-red-50 text-red-900' 
                      : 'bg-green-50 text-green-900'
                  }`}
                >
                  <alert.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{alert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}