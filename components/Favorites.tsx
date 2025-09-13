import React from 'react';
import { StarIcon, TrashIcon } from './icons/Icons';

interface FavoritesProps {
  favorites: string[];
  onSelect: (company: string) => void;
  onRemove: (company: string) => void;
  isLoading: boolean;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onRemove, isLoading }) => {
  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-xl animate-fade-in">
      <div className="flex items-center mb-4">
         <div className="bg-gray-700 p-2 rounded-lg mr-4">
            <StarIcon filled />
          </div>
        <h3 className="text-xl font-semibold text-cyan-400">Favorite Companies</h3>
      </div>
      {favorites.length === 0 ? (
        <p className="text-gray-400 text-center py-4">
          Your saved companies will appear here. Analyze a company and click the star icon to save it.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {favorites.map((company) => (
            <div
              key={company}
              className="group bg-gray-700/50 rounded-full flex items-center gap-2 border border-gray-600"
            >
              <button
                onClick={() => onSelect(company)}
                disabled={isLoading}
                className="pl-4 pr-3 py-1.5 text-sm text-gray-200 hover:text-white rounded-l-full transition-colors disabled:cursor-not-allowed disabled:text-gray-500"
              >
                {company}
              </button>
              <button
                onClick={() => onRemove(company)}
                className="pr-3 py-1.5 text-gray-500 hover:text-red-400 transition-colors"
                aria-label={`Remove ${company} from favorites`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
