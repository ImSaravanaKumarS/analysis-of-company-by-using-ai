
import React from 'react';
import type { NewsArticle } from '../types';

interface NewsSectionProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  isNewsLoading: boolean;
  isMoreNewsLoading: boolean;
  noMoreNews: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  articles, 
  onArticleClick, 
  onRefresh, 
  onLoadMore, 
  isNewsLoading, 
  isMoreNewsLoading, 
  noMoreNews 
}) => {
  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-center mb-6 relative">
        <h2 className="text-2xl font-bold text-center text-white">
          Today's Financial Headlines from India
        </h2>
        <button 
          onClick={onRefresh} 
          disabled={isNewsLoading || isMoreNewsLoading}
          className="absolute right-0 text-gray-400 p-2 rounded-full hover:bg-gray-700/50 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Refresh news"
        >
          <svg className={`h-5 w-5 ${isNewsLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <button 
            key={index}
            onClick={() => onArticleClick(article)}
            className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-lg text-left hover:bg-gray-800 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label={`Read summary for ${article.headline}`}
          >
            <h3 className="text-lg font-semibold text-gray-100 leading-tight">
              {article.headline}
            </h3>
            <span className="mt-4 inline-block text-sm text-cyan-400 font-semibold">
              View Summary &rarr;
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        {noMoreNews ? (
          <p className="text-gray-500">No more news to load.</p>
        ) : (
          <button
            onClick={onLoadMore}
            disabled={isMoreNewsLoading || isNewsLoading}
            className="w-full sm:w-auto px-8 py-3 bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 font-semibold rounded-lg hover:bg-cyan-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 flex items-center justify-center space-x-2 mx-auto"
          >
            {isMoreNewsLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
