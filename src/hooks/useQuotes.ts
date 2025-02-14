import { useState, useEffect } from 'react';
import { Quote } from '../types';

const STORAGE_KEY = 'favorite-quotes';
const LAST_QUOTE_DATE_KEY = 'last-quote-date';
const CURRENT_QUOTE_KEY = 'current-quote';

// Fallback quote in case the API fails
const FALLBACK_QUOTE: Quote = {
  id: 'fallback',
  text: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs'
};

export function useQuotes() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    checkAndUpdateDailyQuote();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const saveFavorites = (quotes: Quote[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    setFavorites(quotes);
  };

  const checkAndUpdateDailyQuote = async () => {
    const lastQuoteDate = localStorage.getItem(LAST_QUOTE_DATE_KEY);
    const today = new Date().toDateString();
    const storedQuote = localStorage.getItem(CURRENT_QUOTE_KEY);

    if (lastQuoteDate !== today || !storedQuote) {
      await fetchNewQuote();
    } else {
      setCurrentQuote(JSON.parse(storedQuote));
      setIsLoading(false);
    }
  };

  const fetchNewQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const quote: Quote = {
        id: data._id,
        text: data.content,
        author: data.author
      };

      localStorage.setItem(CURRENT_QUOTE_KEY, JSON.stringify(quote));
      localStorage.setItem(LAST_QUOTE_DATE_KEY, new Date().toDateString());
      setCurrentQuote(quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Use fallback quote if API fails
      setCurrentQuote(FALLBACK_QUOTE);
      localStorage.setItem(CURRENT_QUOTE_KEY, JSON.stringify(FALLBACK_QUOTE));
      localStorage.setItem(LAST_QUOTE_DATE_KEY, new Date().toDateString());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (quote: Quote) => {
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    if (isFavorite) {
      saveFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      saveFavorites([...favorites, quote]);
    }
  };

  const isQuoteFavorite = (quote: Quote) => {
    return favorites.some(fav => fav.id === quote.id);
  };

  return {
    currentQuote,
    favorites,
    isLoading,
    fetchNewQuote,
    toggleFavorite,
    isQuoteFavorite
  };
}