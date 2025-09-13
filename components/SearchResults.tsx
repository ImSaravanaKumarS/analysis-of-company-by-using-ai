import React from 'react';
import type { GroundingChunk } from '../types';
import { SearchIcon } from './icons/Icons';

interface SearchResultsProps {
  results: GroundingChunk[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="bg-gray-700 p-2 rounded-lg mr-4">
          <SearchIcon />
        </div>
        <h3 className="text-xl font-semibold text-cyan-400">Information Sources</h3>
      </div>
      <p className="text-gray-400 mb-4 text-sm">
        This analysis is informed by the latest information from Google Search.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {results.map((result, index) => (
          <li key={index} className="list-none">
            <a
              href={result.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200 block truncate"
              title={result.web.title || result.web.uri}
            >
              {result.web.title || result.web.uri}
            </a>
          </li>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
