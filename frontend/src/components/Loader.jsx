import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Đang xử lý..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-12 h-12 text-agri-green animate-spin" />
            <p className="text-agri-dark font-medium text-lg">{text}</p>
        </div>
    );
};

export default Loader;
