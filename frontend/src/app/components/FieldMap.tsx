import { useState } from 'react';
import { ArrowLeft, MapPin, Filter, Calendar, AlertTriangle } from 'lucide-react';

interface FieldMapProps {
  onNavigate: (screen: string) => void;
}

interface Hotspot {
  id: number;
  x: number;
  y: number;
  title: string;
  issue: string;
  coordinates: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
}

export function FieldMap({ onNavigate }: FieldMapProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(42);
  const [dateFilter, setDateFilter] = useState('today');
  const [issueFilter, setIssueFilter] = useState('all');

  const hotspots: Hotspot[] = [
    { id: 42, x: 35, y: 40, title: 'Hotspot #42', issue: 'Wilted Corn', coordinates: '21.02, 105.83', severity: 'high', time: '10:45 AM' },
    { id: 38, x: 65, y: 25, title: 'Hotspot #38', issue: 'Disease Spread', coordinates: '21.03, 105.85', severity: 'high', time: '10:30 AM' },
    { id: 27, x: 50, y: 60, title: 'Hotspot #27', issue: 'Nutrient Stress', coordinates: '21.01, 105.84', severity: 'medium', time: '09:15 AM' },
    { id: 19, x: 20, y: 70, title: 'Hotspot #19', issue: 'Pest Activity', coordinates: '21.00, 105.82', severity: 'medium', time: '08:42 AM' },
    { id: 15, x: 75, y: 55, title: 'Hotspot #15', issue: 'Water Stress', coordinates: '21.02, 105.86', severity: 'low', time: '08:20 AM' },
    { id: 12, x: 45, y: 30, title: 'Hotspot #12', issue: 'Early Blight', coordinates: '21.03, 105.83', severity: 'high', time: '07:55 AM' },
  ];

  const selectedHotspotData = hotspots.find(h => h.id === selectedHotspot);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] to-[#e8f5e9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('monitor')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-[#1B5E20]">Field Map</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
              {hotspots.length} Issues Detected
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Map Container */}
            <div className="relative h-[600px] bg-gradient-to-br from-green-100 via-green-50 to-yellow-50">
              {/* Simulated Satellite Map */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(45deg, #1B5E20 25%, transparent 25%),
                    linear-gradient(-45deg, #1B5E20 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #1B5E20 75%),
                    linear-gradient(-45deg, transparent 75%, #1B5E20 75%)
                  `,
                  backgroundSize: '40px 40px',
                  backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
                  opacity: 0.05
                }} />
              </div>

              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1B5E20" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Field Boundary */}
              <div className="absolute inset-8 border-4 border-[#1B5E20] border-dashed rounded-lg opacity-30" />

              {/* Sector Labels */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg shadow text-sm font-semibold text-gray-700">
                North Field
              </div>
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg shadow text-sm font-semibold text-gray-700">
                South Field
              </div>

              {/* Hotspot Pins */}
              {hotspots.map((hotspot) => {
                const isSelected = selectedHotspot === hotspot.id;
                const pinColor = hotspot.severity === 'high' ? '#C0392B' : hotspot.severity === 'medium' ? '#f97316' : '#eab308';
                
                return (
                  <div
                    key={hotspot.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    onClick={() => setSelectedHotspot(hotspot.id)}
                  >
                    {/* Pin Icon */}
                    <div className={`relative ${isSelected ? 'scale-125' : 'scale-100'} transition-transform`}>
                      <MapPin 
                        className={`w-10 h-10 ${isSelected ? 'animate-bounce' : ''}`}
                        fill={pinColor}
                        stroke="white"
                        strokeWidth={2}
                      />
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-xs">
                        {hotspot.id}
                      </div>
                    </div>

                    {/* Tooltip */}
                    {isSelected && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur rounded-xl shadow-2xl p-4 border-2 border-[#C0392B] z-10">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-6 h-6 text-[#C0392B] flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-gray-900">{hotspot.title}</h4>
                            <p className="text-sm text-[#C0392B] font-semibold">{hotspot.issue}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coordinates:</span>
                            <span className="font-mono font-semibold text-gray-900">{hotspot.coordinates}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold text-gray-900">{hotspot.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Severity:</span>
                            <span className={`font-semibold uppercase ${
                              hotspot.severity === 'high' ? 'text-red-600' : 
                              hotspot.severity === 'medium' ? 'text-orange-600' : 
                              'text-yellow-600'
                            }`}>
                              {hotspot.severity}
                            </span>
                          </div>
                        </div>
                        <button className="mt-3 w-full py-2 bg-[#2980B9] hover:bg-[#3498db] text-white rounded-lg text-sm font-semibold transition-colors">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#C0392B] rounded-full" />
                  <span className="text-sm font-semibold text-gray-700">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-700">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-700">Low Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Filters & Hotspot List */}
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select 
                    value={issueFilter}
                    onChange={(e) => setIssueFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="all">All Issues</option>
                    <option value="disease">Disease</option>
                    <option value="stress">Stress</option>
                    <option value="pest">Pest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hotspot List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Hotspots</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {hotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    onClick={() => setSelectedHotspot(hotspot.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedHotspot === hotspot.id 
                        ? 'bg-[#C0392B] text-white' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold">{hotspot.title}</span>
                    </div>
                    <p className={`text-sm ${selectedHotspot === hotspot.id ? 'text-white/90' : 'text-gray-600'}`}>
                      {hotspot.issue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
