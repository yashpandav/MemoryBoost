import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckCards, getDeckDueCards, getCardStatus, getCardStatusColor, getNextReviewDateString } from '../../utils/spacedRepetition';
import { Plus, Filter, Edit, Trash2, Play, ArrowLeft } from 'lucide-react';

export const CardList = () => {
  const { cards, decks, activeDeckId, setActiveCardId, setActiveView, deleteCard } = useAppContext();
  
  const [filter, setFilter] = useState('all');
  
  if (!activeDeckId) {
    setActiveView('deck-list');
    return null;
  }
  
  const deck = decks.find(d => d.id === activeDeckId);
  if (!deck) {
    setActiveView('deck-list');
    return null;
  }
  
  const deckCards = getDeckCards(cards, activeDeckId);
  const dueCards = getDeckDueCards(cards, activeDeckId);
  
  let filteredCards = deckCards;
  if (filter === 'due') {
    filteredCards = dueCards;
  } else if (filter !== 'all') {
    filteredCards = deckCards.filter(card => getCardStatus(card).toLowerCase() === filter);
  }
  
  const confirmDelete = (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const startReview = () => {
    if (dueCards.length > 0) {
      setActiveView('review');
    }
  };
  
  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            {deck.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">{deck.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {dueCards.length > 0 && (
            <button
              onClick={startReview}
              className="group relative inline-flex items-center px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Play className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="relative transform group-hover:scale-105 transition-transform duration-300">
                Review {dueCards.length} Due
              </span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveCardId(null);
              setActiveView('card-edit');
            }}
            className="group relative inline-flex items-center px-4 sm:px-5 py-2.5 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 dark:from-gray-600/0 dark:via-gray-600/50 dark:to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">Add Card</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {['all', 'due', 'new', 'learning', 'mastered'].map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`text-sm px-3 py-1.5 rounded-full capitalize transition-all duration-300 ${
                filter === option
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center transition-all duration-300 shadow-sm">
          {deckCards.length === 0 ? (
            <>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">No Cards Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Add your first card to this deck to start learning.
              </p>
              <button
                onClick={() => {
                  setActiveCardId(null);
                  setActiveView('card-edit');
                }}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Plus className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="relative transform group-hover:scale-105 transition-transform duration-300">Add Your First Card</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">No Matching Cards</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No cards match the current filter: <span className="capitalize font-medium">{filter}</span>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => {
            const status = getCardStatus(card);
            const statusColor = getCardStatusColor(card);
            const nextReview = getNextReviewDateString(card);
            
            return (
              <div 
                key={card.id} 
                className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md shadow-sm flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">{card.front}</h3>
                    <span className={`${statusColor} text-white text-xs px-3 py-1 rounded-full shadow-sm flex-shrink-0 ml-2`}>
                      {status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">{card.back}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Next review: {nextReview}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setActiveCardId(card.id);
                            setActiveView('card-edit');
                          }}
                          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                          aria-label="Edit card"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(card.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                          aria-label="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
        <button
          onClick={() => setActiveView('deck-list')}
          className="group relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative">Back to Decks</span>
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCards.length} of {deckCards.length} cards
        </div>
      </div>
    </div>
  );
};