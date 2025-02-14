import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { QuoteCard } from './components/QuoteCard';
import { useQuotes } from './hooks/useQuotes';
import { Quote as QuoteIcon, Heart } from 'lucide-react';

function App() {
  const { 
    currentQuote, 
    favorites, 
    isLoading, 
    fetchNewQuote, 
    toggleFavorite, 
    isQuoteFavorite 
  } = useQuotes();
  const [showFavorites, setShowFavorites] = useState(false);

  const handleShare = async (quote: Quote) => {
    const shareText = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
        toast.success('Quote shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share quote');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Quote copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="bottom-center" />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QuoteIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quote of the Day</h1>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowFavorites(false)}
              className={`px-4 py-2 rounded-full ${
                !showFavorites 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Daily Quote
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                showFavorites 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites ({favorites.length})
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center gap-6">
          {!showFavorites ? (
            isLoading ? (
              <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto"></div>
              </div>
            ) : currentQuote && (
              <QuoteCard
                quote={currentQuote}
                onFavorite={() => toggleFavorite(currentQuote)}
                onShare={() => handleShare(currentQuote)}
                onRefresh={fetchNewQuote}
                isFavorite={isQuoteFavorite(currentQuote)}
                showRefresh
              />
            )
          ) : (
            <div className="w-full max-w-xl space-y-6">
              {favorites.length === 0 ? (
                <div className="text-center text-gray-600">
                  <p>No favorite quotes yet.</p>
                  <p className="mt-2">
                    Heart a quote to add it to your favorites!
                  </p>
                </div>
              ) : (
                favorites.map(quote => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    onFavorite={() => toggleFavorite(quote)}
                    onShare={() => handleShare(quote)}
                    isFavorite={true}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;