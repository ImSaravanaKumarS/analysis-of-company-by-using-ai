
import React from 'react';
import { SentimentIcon } from './icons/Icons';

interface SentimentAnalysisProps {
  score: number;
  reasoning: string[];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ score, reasoning }) => {
  // Don't render if score is not a valid number or reasoning is empty
  if (typeof score !== 'number' || !reasoning || reasoning.length === 0) {
    return null;
  }

  // Normalize score from [-1, 1] to [0, 1] and then to a rotation angle from -90 to 90 degrees
  const rotation = score * 90;

  let sentimentLabel = 'Neutral';
  let sentimentColor = 'text-yellow-400';

  if (score > 0.2) {
    sentimentLabel = 'Positive';
    sentimentColor = 'text-cyan-400';
  } else if (score < -0.2) {
    sentimentLabel = 'Negative';
    sentimentColor = 'text-red-400';
  }

  return (
    <div className={`bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700`}>
      <div className="flex items-center mb-4">
        <div className="bg-gray-700 p-2 rounded-lg mr-4">
          <SentimentIcon />
        </div>
        <h3 className="text-xl font-semibold text-cyan-400">Sentiment Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Gauge Section */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-24 overflow-hidden">
            {/* Gauge Background Arc */}
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-600 rounded-t-full border-b-0"></div>
            {/* Gauge Color Gradient Arc */}
            <div
              className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rose-500 via-yellow-400 to-cyan-400 rounded-t-full border-b-0`}
            ></div>
            {/* Gauge Inner Mask */}
            <div className="absolute top-0 left-0 w-full h-full bg-gray-800/50 rounded-t-full" style={{transform: 'scale(0.85)', transformOrigin: 'center top'}}></div>
            {/* Needle */}
            <div
              className="absolute bottom-0 left-1/2 w-0.5 h-[90%] bg-gray-200 origin-bottom transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
              <div className="w-3 h-3 bg-gray-200 rounded-full absolute -top-1.5 -left-1"></div>
            </div>
          </div>
          <div className={`mt-2 text-2xl font-bold ${sentimentColor}`}>{sentimentLabel}</div>
          <div className="text-sm text-gray-400">Score: {score.toFixed(2)}</div>
        </div>

        {/* Reasoning Section */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-2">Key Factors:</h4>
          <ul className="space-y-2 list-disc list-inside text-gray-300">
            {reasoning.map((point, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
