import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Đang xử lý..." }) => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState("Đang tải ảnh lên...");

    useEffect(() => {
        const steps = [
            { text: "Đang tải ảnh lên...", duration: 2000 },
            { text: "Đang phân tích hình ảnh...", duration: 5000 },
            { text: "Đang nhận dạng bệnh...", duration: 3000 },
            { text: "Đang tạo kết quả...", duration: 2000 }
        ];

        let currentStepIndex = 0;
        let stepProgress = 0;

        const interval = setInterval(() => {
            stepProgress += 100;
            
            // Check if current step exists
            if (currentStepIndex < steps.length) {
                if (stepProgress >= steps[currentStepIndex].duration / 50) {
                    currentStepIndex++;
                    stepProgress = 0;
                    
                    if (currentStepIndex < steps.length) {
                        setCurrentStep(steps[currentStepIndex].text);
                        setProgress((currentStepIndex + 1) * 25);
                    } else {
                        // Keep at 100% when complete
                        setProgress(100);
                        setCurrentStep("Hoàn thành!");
                    }
                }
            } else {
                // Clear interval when all steps are done
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 max-w-md mx-auto">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
            </div>
            
            <div className="text-center space-y-3">
                <p className="text-gray-700 font-semibold text-lg">{text}</p>
                <p className="text-gray-500 text-sm animate-pulse">{currentStep}</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="h-full bg-white bg-opacity-30 animate-pulse"></div>
                </div>
            </div>
            
            <p className="text-gray-400 text-xs">Đừng đóng trình duyệt, quá trình đang diễn ra...</p>
        </div>
    );
};

export default Loader;
