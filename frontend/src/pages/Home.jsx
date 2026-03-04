import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Eye, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-agri-dark mb-6 tracking-tight">
                Smart Agriculture <br />
                <span className="text-agri-green">Made Simple</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mb-12">
                PlantGuard protects your crops using advanced AI. Detect diseases early and monitor field health in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link to="/monitor" className="group glass-panel p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-agri-dark mb-2">Monitor Mode</h2>
                    <p className="text-gray-500 mb-6">Analyze drone footage to detect crop stress and hotspots across large fields.</p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                        Start Monitoring <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link to="/doctor" className="group glass-panel p-8 hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                    <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-agri-dark mb-2">Doctor Mode</h2>
                    <p className="text-gray-500 mb-6">Diagnose specific leaf diseases and get instant treatment plans.</p>
                    <div className="flex items-center justify-center text-green-600 font-medium">
                        Diagnose Plant <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
