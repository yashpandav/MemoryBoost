import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTodayCards, getDeckCards, getMasteredCards } from '../../utils/spacedRepetition';
import { StatsCard } from './StatsCard';
import { ProgressChart } from './ProgressChart';
import { Calendar, Brain, CheckCircle2, Clock } from 'lucide-react';

export const Dashboard = () => {
  const { decks, cards, stats, setActiveDeckId, setActiveView } = useAppContext();

  const todayCards = getTodayCards(cards);
  const masteredCards = getMasteredCards(cards);
  
  const startReview = (deckId) => {
    if (deckId) {
      setActiveDeckId(deckId);
    }
    setActiveView('review');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Learning Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress and review cards due today.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Due Today"
          value={todayCards.length}
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          description="Cards to review"
          actionLabel={todayCards.length > 0 ? "Review Now" : undefined}
          onAction={() => todayCards.length > 0 && startReview()}
          color="bg-orange-100 dark:bg-orange-900/20"
        />
        
        <StatsCard 
          title="Total Cards"
          value={cards.length}
          icon={<Brain className="w-6 h-6 text-indigo-500" />}
          description="Across all decks"
          color="bg-indigo-100 dark:bg-indigo-900/20"
        />
        
        <StatsCard 
          title="Mastered"
          value={masteredCards.length}
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          description={`${cards.length ? Math.round((masteredCards.length / cards.length) * 100) : 0}% of all cards`}
          color="bg-green-100 dark:bg-green-900/20"
        />
        
        <StatsCard 
          title="Study Streak"
          value={stats.streakCount}
          icon={<Calendar className="w-6 h-6 text-purple-500" />}
          description="Days in a row"
          color="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-3">Progress Overview</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <ProgressChart studyData={stats.studyDates} />
        </div>
      </div>
      
      {decks.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Decks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map(deck => {
              const deckCards = getDeckCards(cards, deck.id);
              const deckDueCards = todayCards.filter(card => card.deckId === deck.id);
              
              return (
                <div key={deck.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <h4 className="font-bold text-lg truncate">{deck.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{deck.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>{deckCards.length} cards</span>
                      <span className="text-orange-500">{deckDueCards.length} due today</span>
                    </div>
                  </div>
                  <div className="flex divide-x divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setActiveDeckId(deck.id);
                        setActiveView('card-list');
                      }}
                      className="flex-1 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View Cards
                    </button>
                    <button
                      onClick={() => deckDueCards.length > 0 && startReview(deck.id)}
                      disabled={deckDueCards.length === 0}
                      className={`flex-1 py-2 text-sm transition-colors ${
                        deckDueCards.length > 0
                          ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                          : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Review Deck
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Welcome to MemoryBoost!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get started by creating your first flashcard deck.
          </p>
          <button
            onClick={() => setActiveView('deck-edit')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Create Your First Deck
          </button>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        {decks.length > 0 && (
          <button
            onClick={() => setActiveView('deck-edit')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Create New Deck
          </button>
        )}
      </div>
    </div>
  );
};