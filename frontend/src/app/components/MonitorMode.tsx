import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MonitorModeProps {
  onNavigate: (screen: string) => void;
}

interface Detection {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
  timestamp: string;
}

export function MonitorMode({ onNavigate }: MonitorModeProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [detectionCount, setDetectionCount] = useState(12);
  
  // Simulated detections on the video
  const detections: Detection[] = [
    { id: 1, x: 15, y: 25, width: 8, height: 12, confidence: 85, label: 'Stress', timestamp: '10:42 AM' },
    { id: 2, x: 45, y: 35, width: 10, height: 14, confidence: 92, label: 'Wilted', timestamp: '10:43 AM' },
    { id: 3, x: 72, y: 20, width: 9, height: 13, confidence: 78, label: 'Stress', timestamp: '10:44 AM' },
    { id: 4, x: 30, y: 60, width: 11, height: 15, confidence: 88, label: 'Disease', timestamp: '10:45 AM' },
    { id: 5, x: 60, y: 55, width: 8, height: 11, confidence: 81, label: 'Wilted', timestamp: '10:46 AM' },
  ];

  const detectionLog = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1598558188629-52e73c779cb9?w=200', time: '10:46 AM', status: 'Wilted' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1750016065255-cab6cc76c8d4?w=200', time: '10:45 AM', status: 'Disease' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1598558188629-52e73c779cb9?w=200', time: '10:44 AM', status: 'Stress' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1750016065255-cab6cc76c8d4?w=200', time: '10:43 AM', status: 'Wilted' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1598558188629-52e73c779cb9?w=200', time: '10:42 AM', status: 'Stress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] to-[#e8f5e9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-[#1B5E20]">Aerial Monitor</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#C0392B] text-white rounded-lg font-semibold">
              LIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Video Player Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Video Container with Detections */}
              <div className="relative aspect-video bg-black">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1599536798012-b5c7ab677195?w=1200"
                  alt="Drone footage of cornfield"
                  className="w-full h-full object-cover"
                />
                
                {/* Bounding Boxes Overlay */}
                {detections.map((detection) => (
                  <div
                    key={detection.id}
                    className="absolute border-4 border-[#C0392B] bg-[#C0392B]/10 animate-pulse"
                    style={{
                      left: `${detection.x}%`,
                      top: `${detection.y}%`,
                      width: `${detection.width}%`,
                      height: `${detection.height}%`,
                    }}
                  >
                    <div className="absolute -top-8 left-0 bg-[#C0392B] text-white px-2 py-1 rounded text-sm font-semibold whitespace-nowrap">
                      {detection.label} {detection.confidence}%
                    </div>
                  </div>
                ))}

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!isPlaying && (
                    <div className="bg-black/50 rounded-full p-6">
                      <Play className="w-16 h-16 text-white" fill="white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1B5E20] hover:bg-[#2e7d32] text-white rounded-lg font-semibold transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow border border-gray-200">
                    <AlertTriangle className="w-6 h-6 text-[#C0392B]" />
                    <div>
                      <p className="text-sm text-gray-600">Total Issues Found</p>
                      <p className="text-2xl font-bold text-[#C0392B]">{detectionCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Coverage Area</p>
                <p className="text-2xl font-bold text-gray-900">42.5 ha</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Flight Time</p>
                <p className="text-2xl font-bold text-gray-900">18:42</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Sectors Scanned</p>
                <p className="text-2xl font-bold text-gray-900">8/12</p>
              </div>
            </div>
          </div>

          {/* Detection Log Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detection Log</h3>
            <div className="space-y-3">
              {detectionLog.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ImageWithFallback
                    src={log.thumbnail}
                    alt={`Detection ${log.id}`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{log.status}</p>
                    <p className="text-sm text-gray-600">{log.time}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#C0392B] animate-pulse" />
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigate('map')}
              className="mt-6 w-full py-3 bg-[#2980B9] hover:bg-[#3498db] text-white rounded-lg font-semibold transition-colors"
            >
              View Field Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
