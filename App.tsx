import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisData, GroundingChunk, NewsArticle } from './types';
import { getCompanyAnalysis, generateAnalysisVisual, getIndianFinancialNews } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import StockChart from './components/StockChart';
import Loader from './components/Loader';
import Welcome from './components/Welcome';
import RevenueDisplay from './components/RevenueDisplay';
import SearchResults from './components/SearchResults';
import NewsSection from './components/NewsSection';
import NewsModal from './components/NewsModal';
import SentimentAnalysis from './components/SentimentAnalysis';
import Favorites from './components/Favorites';
import { StarIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [company, setCompany] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [searchResults, setSearchResults] = useState<GroundingChunk[] | null>(null);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for news feature
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [isMoreNewsLoading, setIsMoreNewsLoading] = useState<boolean>(false);
  const [noMoreNews, setNoMoreNews] = useState<boolean>(false);

  // State for favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('companyFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('companyFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  }, [favorites]);

  const handleToggleFavorite = (companyName: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(companyName);
      if (isFavorite) {
        return prev.filter(fav => fav !== companyName);
      } else {
        // Add new favorite and sort alphabetically
        return [...prev, companyName].sort();
      }
    });
  };

  const handleRemoveFavorite = (companyName: string) => {
    setFavorites(prev => prev.filter(fav => fav !== companyName));
  };


  // Fetch initial news
  const fetchInitialNews = useCallback(async () => {
    try {
      setIsNewsLoading(true);
      setNoMoreNews(false);
      setNewsArticles([]); // Clear existing articles
      const news = await getIndianFinancialNews();
      setNewsArticles(news);
      if (news.length < 5) {
        setNoMoreNews(true);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setIsNewsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchInitialNews();
  }, [fetchInitialNews]);

  const handleAnalysis = useCallback(async (companyName: string) => {
    if (!companyName.trim()) {
      setError('Please enter a company name or stock ticker.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setVisualUrl(null);
    setSearchResults(null);
    setCompany(companyName);

    try {
      const { analysis: result, searchResults: sources } = await getCompanyAnalysis(companyName);
      setAnalysis(result);
      setSearchResults(sources ?? null);

      // Kick off visual generation without blocking the main UI update
      (async () => {
        try {
          const imageData = await generateAnalysisVisual(result.visualSummaryPrompt);
          setVisualUrl(`data:image/png;base64,${imageData}`);
        } catch (visError) {
          console.error("Failed to generate analysis visual:", visError);
          // Don't set a user-facing error for this, as it's a supplementary feature.
        }
      })();

    } catch (err) {
      console.error(err);
      setError('Failed to retrieve analysis. The AI may be busy or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadMoreNews = useCallback(async () => {
    setIsMoreNewsLoading(true);
    try {
      const existingHeadlines = newsArticles.map(a => a.headline);
      const newArticles = await getIndianFinancialNews(existingHeadlines);
      if (newArticles.length === 0) {
        setNoMoreNews(true);
      } else {
        setNewsArticles(prev => [...prev, ...newArticles]);
      }
    } catch (err) {
      console.error("Failed to fetch more news:", err);
    } finally {
      setIsMoreNewsLoading(false);
    }
  }, [newsArticles]);

  const handleRefreshNews = useCallback(() => {
    fetchInitialNews();
  }, [fetchInitialNews]);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedNews(article);
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
  };

  const renderWelcomeContent = () => (
    <>
      {isNewsLoading && newsArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-12 text-center">
          <svg className="animate-spin h-8 w-8 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-white">Fetching Today's Headlines...</h3>
        </div>
      ) : (
        newsArticles.length > 0 && (
          <NewsSection 
            articles={newsArticles} 
            onArticleClick={handleArticleClick}
            onRefresh={handleRefreshNews}
            onLoadMore={handleLoadMoreNews}
            isNewsLoading={isNewsLoading}
            isMoreNewsLoading={isMoreNewsLoading}
            noMoreNews={noMoreNews}
          />
        )
      )}
      <Welcome />
    </>
  );

  const renderAnalysisContent = () => analysis && (
    <div className="mt-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-center gap-4">
        <h2 className="text-3xl font-bold text-center text-white capitalize">Analysis for {company}</h2>
        <button
          onClick={() => handleToggleFavorite(company)}
          className={`p-2 rounded-full transition-colors duration-300 ${favorites.includes(company) ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-gray-300'}`}
          aria-label={favorites.includes(company) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <StarIcon filled={favorites.includes(company)} />
        </button>
      </div>
      
      {searchResults && searchResults.length > 0 && <SearchResults results={searchResults} />}

      {/* Visual Summary Section */}
      <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 aspect-[16/9] flex items-center justify-center overflow-hidden">
        {visualUrl ? (
          <img 
            src={visualUrl} 
            alt={`AI-generated visual summary for ${company}`}
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="text-center text-gray-400 animate-pulse">
            <svg className="w-12 h-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">Generating Visual Summary...</p>
            <p className="text-sm">The AI is creating an artistic representation.</p>
          </div>
        )}
      </div>

      <SentimentAnalysis score={analysis.sentimentScore} reasoning={analysis.sentimentReasoning} />

      <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
        <StockChart data={analysis.historicalData} currencySymbol={analysis.currencySymbol} />
      </div>

      <RevenueDisplay 
        quarterlyData={analysis.quarterlyRevenue} 
        annualData={analysis.annualRevenue} 
        currencySymbol={analysis.currencySymbol} 
      />
      
      <AnalysisDisplay analysis={analysis} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SearchForm onSearch={handleAnalysis} isLoading={isLoading} />
          
          <Favorites 
            favorites={favorites} 
            onSelect={handleAnalysis} 
            onRemove={handleRemoveFavorite} 
            isLoading={isLoading} 
          />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : analysis ? (
            renderAnalysisContent()
          ) : (
            renderWelcomeContent()
          )}
        </div>
      </main>
      
      {selectedNews && <NewsModal article={selectedNews} onClose={handleCloseModal} />}

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini AI with Google Search. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;