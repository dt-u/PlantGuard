import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DoctorModeProps {
  onNavigate: (screen: string) => void;
}

interface BoundingBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export function DoctorMode({ onNavigate }: DoctorModeProps) {
  const [hasImage, setHasImage] = useState(true);

  // Bounding boxes for disease spots on the leaf
  const boundingBoxes: BoundingBox[] = [
    { id: 1, x: 25, y: 20, width: 15, height: 12, label: 'Lesion' },
    { id: 2, x: 55, y: 35, width: 18, height: 14, label: 'Lesion' },
    { id: 3, x: 40, y: 60, width: 12, height: 10, label: 'Lesion' },
    { id: 4, x: 70, y: 55, width: 14, height: 13, label: 'Lesion' },
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
            <h1 className="text-2xl font-bold text-[#2980B9]">Leaf Doctor</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#2980B9] hover:bg-[#3498db] text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Image
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Viewer - Left Side */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Image Analysis</h3>
            
            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1769613638072-08fafd8c9f9e?w=800"
                alt="Tomato leaf with disease"
                className="w-full h-full object-cover"
              />
              
              {/* Bounding Boxes for Disease Spots */}
              {boundingBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute border-4 border-[#C0392B] bg-[#C0392B]/10"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-[#C0392B] text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                    {box.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>YOLOv8 Object Detection:</strong> {boundingBoxes.length} disease spots detected on leaf surface
              </p>
            </div>
          </div>

          {/* Analysis Result - Right Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-[#C0392B] rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Early Blight</h2>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">AI Confidence: 94%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Pathogen Information</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Early blight is caused by the fungus <em>Alternaria solani</em>. It primarily affects tomato and potato plants, causing dark brown to black concentric lesions on older leaves.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Symptoms Detected</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#C0392B] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">Circular to irregular brown spots with concentric rings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#C0392B] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">Yellowing around lesions (chlorosis)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#C0392B] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">Multiple infection sites on lower leaves</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Environmental Factors</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-700 mb-1">Temperature</p>
                      <p className="font-bold text-orange-900">24-29°C</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-700 mb-1">Humidity</p>
                      <p className="font-bold text-orange-900">High</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('treatment')}
                className="mt-6 w-full py-4 bg-[#2980B9] hover:bg-[#3498db] text-white rounded-lg font-bold text-lg transition-colors shadow-lg"
              >
                View Treatment Guide
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Detection Time</p>
                <p className="text-xl font-bold text-gray-900">0.8s</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Severity Level</p>
                <p className="text-xl font-bold text-[#C0392B]">Moderate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
