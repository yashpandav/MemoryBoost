import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckCards, getDeckDueCards } from '../../utils/spacedRepetition';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';

export const DeckList = () => {
  const { decks, cards, setActiveDeckId, setActiveView, deleteDeck } = useAppContext();
  
  const confirmDelete = (deckId, deckName) => {
    if (window.confirm(`Are you sure you want to delete the deck "${deckName}" and all its cards?`)) {
      deleteDeck(deckId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Decks</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and review your flashcard decks.
          </p>
        </div>
        <button
          onClick={() => setActiveView('deck-edit')}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Deck
        </button>
      </div>
      
      {decks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">No Decks Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create your first deck to start learning with spaced repetition.
          </p>
          <button
            onClick={() => setActiveView('deck-edit')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {decks.map(deck => {
              const deckCards = getDeckCards(cards, deck.id);
              const dueCards = getDeckDueCards(cards, deck.id);
              
              return (
                <li key={deck.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0 mr-4">
                      <div 
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveDeckId(deck.id);
                          setActiveView('card-list');
                        }}
                      >
                        <h3 className="text-lg font-semibold truncate">{deck.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1">{deck.description}</p>
                        <div className="flex mt-1 text-sm">
                          <span className="text-gray-500 dark:text-gray-400 mr-3">{deckCards.length} cards</span>
                          {dueCards.length > 0 && (
                            <span className="text-orange-500 dark:text-orange-400">{dueCards.length} due today</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setActiveDeckId(deck.id);
                          setActiveView('deck-edit');
                        }}
                        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Edit deck"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(deck.id, deck.name)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Delete deck"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveDeckId(deck.id);
                          setActiveView('card-list');
                        }}
                        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="View deck"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};