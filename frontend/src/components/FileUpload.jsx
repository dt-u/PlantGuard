import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ onFileSelect, accept, label }) => {
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

    return (
        <div
            {...getRootProps()}
            className={`glass-panel p-10 border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center
        ${isDragActive ? 'border-agri-green bg-green-50' : 'border-gray-300 hover:border-agri-green hover:bg-green-50/50'}`}
        >
            <input {...getInputProps()} />
            <div className="bg-green-100 p-4 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-agri-green" />
            </div>
            {isDragActive ? (
                <p className="text-agri-dark font-medium">Drop the {label} here ...</p>
            ) : (
                <div className="text-center">
                    <p className="text-lg font-medium text-agri-dark">Drag & drop {label} here</p>
                    <p className="text-sm text-gray-500 mt-2">or click to select file</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
