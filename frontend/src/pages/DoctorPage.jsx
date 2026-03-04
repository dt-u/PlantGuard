import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import TreatmentCard from '../components/TreatmentCard';
import { AlertCircle } from 'lucide-react';

const DoctorPage = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setImage(URL.createObjectURL(file)); // Preview

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/doctor/diagnose', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-agri-dark mb-2">Doctor Mode</h1>
                <p className="text-gray-600 mb-8">Upload a leaf image to detect diseases and get treatment recommendations.</p>

                {!image && !loading && (
                    <FileUpload onFileSelect={handleUpload} accept={{ 'image/*': [] }} label="leaf image" />
                )}

                {loading && <Loader text="Analyzing leaf health..." />}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="glass-panel p-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-1/2">
                                    <h3 className="font-semibold text-gray-500 mb-2">Analyzed Image</h3>
                                    <img
                                        src={`http://127.0.0.1:8000${result.image_url}`}
                                        alt="Analyzed"
                                        className="rounded-lg shadow-md w-full object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-agri-dark">{result.disease.name}</h2>
                                        <p className="text-sm text-gray-500">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-blue-800 text-sm">
                                            <span className="font-bold">AI Note:</span> Disease detected. Please review the treatment options below.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setImage(null); setResult(null); }}
                                        className="btn-secondary w-full"
                                    >
                                        Analyze Another
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6">
                            <h3 className="text-xl font-bold text-agri-dark mb-4">Treatment Plan</h3>
                            <p className="text-gray-600 mb-4">Select the severity level based on your visual inspection:</p>
                            <TreatmentCard treatments={result.disease.treatments} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPage;
