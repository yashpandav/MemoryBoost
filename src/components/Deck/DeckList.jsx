import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckCards, getDeckDueCards } from '../../utils/spacedRepetition';
import { Plus, Pencil, Trash2, ChevronRight, BookOpen } from 'lucide-react';

export const DeckList = () => {
  const { decks, cards, setActiveDeckId, setActiveView, deleteDeck } = useAppContext();
  
  const confirmDelete = (deckId, deckName) => {
    if (window.confirm(`Are you sure you want to delete the deck "${deckName}" and all its cards?`)) {
      deleteDeck(deckId);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Your Decks</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Manage and review your flashcard decks.
        </p>
      </div>
      
      {decks.length === 0 ? (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">No Decks Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Create your first deck to start learning with spaced repetition.
          </p>
          <button
            onClick={() => setActiveView('deck-edit')}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="h-[calc(100%-8rem)]">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setActiveView('deck-edit')}
              className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-indigo-200 dark:hover:bg-indigo-900/40"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Create New Deck</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto pb-6">
            {decks.map(deck => {
              const deckCards = getDeckCards(cards, deck.id);
              const dueCards = getDeckDueCards(cards, deck.id);
              const masteryPercentage = deckCards.length > 0
                ? Math.round((deckCards.filter(card => card.masteryLevel === 5).length / deckCards.length) * 100)
                : 0;
              
              return (
                <div
                  key={deck.id}
                  className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            {deckCards.length} cards
                          </span>
                        </div>
                        <h3 
                          className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                          onClick={() => {
                            setActiveDeckId(deck.id);
                            setActiveView('card-list');
                          }}
                        >
                          {deck.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">{deck.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            {dueCards.length} due today
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {masteryPercentage}% mastered
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${masteryPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setActiveDeckId(deck.id);
                        setActiveView('card-list');
                      }}
                      className="group/btn py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 flex flex-col items-center justify-center space-y-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <ChevronRight className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveDeckId(deck.id);
                        setActiveView('deck-edit');
                      }}
                      className="group/btn py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 flex flex-col items-center justify-center space-y-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Pencil className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(deck.id, deck.name)}
                      className="group/btn py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 flex flex-col items-center justify-center space-y-1"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};