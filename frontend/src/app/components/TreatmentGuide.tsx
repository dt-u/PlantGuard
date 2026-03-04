import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Droplet, Scissors, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TreatmentGuideProps {
  onNavigate: (screen: string) => void;
}

interface SeverityLevel {
  id: number;
  level: string;
  coverage: string;
  image: string;
  action: string;
  details: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: any;
}

export function TreatmentGuide({ onNavigate }: TreatmentGuideProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const severityLevels: SeverityLevel[] = [
    {
      id: 1,
      level: 'Level 1: Mild',
      coverage: '<10%',
      image: 'https://images.unsplash.com/photo-1749464501743-c4ea8ca5bb1a?w=400',
      action: 'Prune infected leaves',
      details: 'Remove affected leaves and destroy them. Monitor plant regularly for new symptoms.',
      color: 'green',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      icon: Scissors,
    },
    {
      id: 2,
      level: 'Level 2: Moderate',
      coverage: '10-40%',
      image: 'https://images.unsplash.com/photo-1769613638072-08fafd8c9f9e?w=400',
      action: 'Spray organic fungicide',
      details: 'Apply copper-based or sulfur fungicide. Repeat every 7-10 days. Improve air circulation.',
      color: 'orange',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50',
      icon: Droplet,
    },
    {
      id: 3,
      level: 'Level 3: Severe',
      coverage: '>40%',
      image: 'https://images.unsplash.com/photo-1716725330092-be290229e5f5?w=400',
      action: 'Remove plant immediately',
      details: 'Plant is beyond saving. Remove and destroy to prevent spread. Sanitize area before replanting.',
      color: 'red',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] to-[#e8f5e9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('doctor')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-[#2980B9]">Treatment Guide</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Headline */}
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Determine Disease Severity & Solution</h2>
          <p className="text-lg text-gray-600">
            Compare your leaf with the reference images below to choose the right action
          </p>
        </div>

        {/* Severity Level Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {severityLevels.map((severity) => {
            const Icon = severity.icon;
            const isSelected = selectedLevel === severity.id;
            
            return (
              <div
                key={severity.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  isSelected ? `ring-4 ${severity.borderColor} scale-105` : 'hover:shadow-xl'
                }`}
              >
                {/* Reference Image */}
                <div className="relative h-64">
                  <ImageWithFallback
                    src={severity.image}
                    alt={`${severity.level} disease severity`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 ${severity.bgColor} border-2 ${severity.borderColor} rounded-full font-bold text-sm`}>
                    {severity.coverage}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{severity.level}</h3>
                  
                  <div className={`flex items-start gap-3 p-4 ${severity.bgColor} rounded-lg mb-4`}>
                    <Icon className={`w-6 h-6 text-${severity.color}-700 flex-shrink-0 mt-1`} />
                    <div>
                      <p className={`font-bold text-${severity.color}-900 mb-1`}>{severity.action}</p>
                      <p className={`text-sm text-${severity.color}-800`}>{severity.details}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLevel(severity.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? `bg-${severity.color}-600 text-white`
                        : `bg-${severity.color}-100 text-${severity.color}-900 hover:bg-${severity.color}-200`
                    }`}
                    style={{
                      backgroundColor: isSelected 
                        ? severity.color === 'green' ? '#16a34a' : severity.color === 'orange' ? '#f97316' : '#dc2626'
                        : severity.color === 'green' ? '#dcfce7' : severity.color === 'orange' ? '#ffedd5' : '#fee2e2',
                      color: isSelected ? '#ffffff' : severity.color === 'green' ? '#166534' : severity.color === 'orange' ? '#9a3412' : '#991b1b'
                    }}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Selected
                      </span>
                    ) : (
                      'Select This Level'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Panel */}
        {selectedLevel && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Treatment Plan</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Immediate Actions</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Isolate affected plants from healthy ones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Document current condition with photos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Apply selected treatment method</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Prevention Tips</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#2980B9] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Water at base of plant, avoid wetting leaves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#2980B9] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Ensure adequate spacing for air circulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#2980B9] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Remove plant debris regularly</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-3 bg-[#1B5E20] hover:bg-[#2e7d32] text-white rounded-lg font-semibold transition-colors"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => onNavigate('doctor')}
                className="flex-1 py-3 bg-[#2980B9] hover:bg-[#3498db] text-white rounded-lg font-semibold transition-colors"
              >
                Analyze Another Leaf
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
