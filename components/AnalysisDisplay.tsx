import React, { useState } from 'react';
import type { AnalysisData } from '../types';
import { 
  FutureScopeIcon, 
  InvestIcon, 
  LimitationsIcon, 
  PredictionsIcon,
  OngoingProjectsIcon,
  UpcomingProjectsIcon,
  BidsIcon,
  InvestorsIcon,
  VisualInsightsIcon,
  MajorNewsIcon,
  ReferencesIcon,
} from './icons/Icons';

interface AnalysisDisplayProps {
  analysis: AnalysisData;
}

const AnalysisCard: React.FC<{ title: string; content: string[]; icon: React.ReactNode }> = ({ title, content, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render the card if there's no content to show
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 shadow-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-expanded={isOpen}
        aria-controls={`content-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center">
          <div className="bg-gray-700 p-2 rounded-lg mr-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-cyan-400">{title}</h3>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-gray-400 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={`content-${title.replace(/\s+/g, '-')}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="px-6 pb-6 pt-2">
          <ul className="space-y-3 list-disc list-inside text-gray-300 border-t border-gray-700 pt-4">
            {content.map((point, index) => (
              <li key={index} className="leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-4">
      <AnalysisCard title="Future Scope" content={analysis.futureScope} icon={<FutureScopeIcon />} />
      <AnalysisCard title="Why Invest" content={analysis.whyInvest} icon={<InvestIcon />} />
      <AnalysisCard title="Limitations" content={analysis.limitations} icon={<LimitationsIcon />} />
      <AnalysisCard title="Predictions" content={analysis.predictions} icon={<PredictionsIcon />} />
      <AnalysisCard title="Recent Major News" content={analysis.majorNews} icon={<MajorNewsIcon />} />
      <AnalysisCard title="Visual Insights" content={analysis.visualInsights} icon={<VisualInsightsIcon />} />
      <AnalysisCard title="Ongoing Projects" content={analysis.ongoingProjects} icon={<OngoingProjectsIcon />} />
      <AnalysisCard title="Upcoming Projects" content={analysis.upcomingProjects} icon={<UpcomingProjectsIcon />} />
      <AnalysisCard title="Upcoming Bids" content={analysis.upcomingBids} icon={<BidsIcon />} />
      <AnalysisCard title="Key Investors" content={analysis.investorDetails} icon={<InvestorsIcon />} />
      <AnalysisCard title="References" content={analysis.references} icon={<ReferencesIcon />} />
    </div>
  );
};

export default AnalysisDisplay;