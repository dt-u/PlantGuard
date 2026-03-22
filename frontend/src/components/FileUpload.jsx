import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ onFileSelect, accept, label, theme = "green" }) => {
    const { t } = useTranslation();
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept,
        multiple: false
    });

    const isBlue = theme === 'blue';
    const borderActive = isBlue ? 'border-[#3B82F6] bg-blue-50' : 'border-agri-green bg-green-50';
    const borderInactive = isBlue ? 'border-gray-300 hover:border-[#3B82F6] hover:bg-blue-50/50' : 'border-gray-300 hover:border-agri-green hover:bg-green-50/50';
    const iconWrapperClass = isBlue ? 'bg-blue-100' : 'bg-green-100';
    const iconClass = isBlue ? 'text-[#3B82F6]' : 'text-agri-green';

    return (
        <div
            {...getRootProps()}
            className={`glass-panel p-10 border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center ${isDragActive ? borderActive : borderInactive}`}
        >
            <input {...getInputProps()} />
            <div className={`${iconWrapperClass} p-4 rounded-full mb-4`}>
                <UploadCloud className={`w-8 h-8 ${iconClass}`} />
            </div>
            {isDragActive ? (
                <p className="text-agri-dark font-medium">{t('common.drop')} {label} {t('common.here')} ...</p>
            ) : (
                <div className="text-center">
                    <p className="text-lg font-medium text-agri-dark">{t('common.drag_drop')} {label} {t('common.here')}</p>
                    <p className="text-sm text-gray-500 mt-2">{t('common.or_click')}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
