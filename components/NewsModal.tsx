
import React from 'react';
import type { NewsArticle } from '../types';

interface NewsModalProps {
  article: NewsArticle;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 id="news-modal-title" className="text-2xl font-bold text-cyan-400 mb-4 pr-8">{article.headline}</h2>
        
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Key Points:</h3>
          <ul className="space-y-3 list-disc list-inside text-gray-300">
            {article.summary.map((point, index) => (
              <li key={index} className="leading-relaxed">{point}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 border-t border-gray-700 pt-4">
          <a 
            href={article.source} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Read Full Article
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
