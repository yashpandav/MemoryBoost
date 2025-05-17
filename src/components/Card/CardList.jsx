import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckCards, getDeckDueCards, getCardStatus, getCardStatusColor, getNextReviewDateString } from '../../utils/spacedRepetition';
import { Plus, Filter, Edit, Trash2, Play } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{deck.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{deck.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {dueCards.length > 0 && (
            <button
              onClick={startReview}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <Play className="w-4 h-4 mr-1" />
              Review {dueCards.length} Due
            </button>
          )}
          
          <button
            onClick={() => {
              setActiveCardId(null);
              setActiveView('card-edit');
            }}
            className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {['all', 'due', 'new', 'learning', 'mastered'].map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`text-sm px-3 py-1 rounded-full capitalize transition-colors ${
                filter === option
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          {deckCards.length === 0 ? (
            <>
              <h3 className="text-xl font-semibold mb-2">No Cards Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add your first card to this deck to start learning.
              </p>
              <button
                onClick={() => {
                  setActiveCardId(null);
                  setActiveView('card-edit');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Add Your First Card
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">No Matching Cards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No cards match the current filter: <span className="capitalize font-medium">{filter}</span>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map(card => {
            const status = getCardStatus(card);
            const statusColor = getCardStatusColor(card);
            const nextReview = getNextReviewDateString(card);
            
            return (
              <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{card.front}</h3>
                    <span className={`${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
                      {status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{card.back}</p>
                  
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
                        className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Edit card"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(card.id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Delete card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={() => setActiveView('deck-list')}
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          ← Back to Decks
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCards.length} of {deckCards.length} cards
        </div>
      </div>
    </div>
  );
};