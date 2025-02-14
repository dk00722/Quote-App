import React from 'react';
import { Quote } from '../types';
import { Heart, Share2, RefreshCw } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote;
  onFavorite: () => void;
  onShare: () => void;
  onRefresh?: () => void;
  isFavorite: boolean;
  showRefresh?: boolean;
}

export function QuoteCard({ 
  quote, 
  onFavorite, 
  onShare, 
  onRefresh, 
  isFavorite,
  showRefresh = false 
}: QuoteCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
      <div className="mb-4">
        <blockquote className="text-xl font-medium text-gray-800 mb-4">
          "{quote.text}"
        </blockquote>
        <p className="text-gray-600 text-right">- {quote.author}</p>
      </div>
      
      <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onFavorite}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        
        <button
          onClick={onShare}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share quote"
        >
          <Share2 className="w-6 h-6 text-gray-600" />
        </button>

        {showRefresh && onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Get new quote"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}