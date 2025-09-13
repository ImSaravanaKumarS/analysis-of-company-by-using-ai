import React from 'react';

const Welcome: React.FC = () => {
    return (
        <div className="mt-12 text-center bg-gray-800/30 p-8 rounded-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-3">Unlock AI-Powered Market Insights</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Enter a company name or stock ticker for a deep-dive analysis. Our AI analyzes market data to provide forecasts, investment rationale, financials, and operational details.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-400 mb-1">Holistic Analysis</h4>
                    <p className="text-sm text-gray-300">Evaluate future scope, risks, major news, and key visual insights.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-400 mb-1">AI Predictions</h4>
                    <p className="text-sm text-gray-300">See AI-driven forecasts and stock price trends.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-400 mb-1">Deep Dive Financials</h4>
                    <p className="text-sm text-gray-300">Analyze quarterly and annual revenue performance.</p>
                </div>
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-400 mb-1">Operational Overview</h4>
                    <p className="text-sm text-gray-300">Discover projects, bids, and key investor details.</p>
                </div>
            </div>
        </div>
    );
}

export default Welcome;