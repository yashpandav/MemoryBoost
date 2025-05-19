import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTodayCards, getDeckCards, getMasteredCards } from '../../utils/spacedRepetition';
import { StatsCard } from './StatsCard';
import { ProgressChart } from './ProgressChart';
import { Calendar, Brain, CheckCircle2, Clock, Plus } from 'lucide-react';

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

  const handleCreateNewDeck = () => {
    setActiveDeckId(null);
    setActiveView('deck-edit');
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Learning Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Track your progress and review cards due today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Due Today"
          value={todayCards.length}
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          description="Cards to review"
          actionLabel={todayCards.length > 0 ? "Review Now" : undefined}
          onAction={() => todayCards.length > 0 && startReview()}
          color="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30"
        />

        <StatsCard
          title="Total Cards"
          value={cards.length}
          icon={<Brain className="w-6 h-6 text-indigo-500" />}
          description="Across all decks"
          color="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30"
        />

        <StatsCard
          title="Mastered"
          value={masteredCards.length}
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          description={`${cards.length ? Math.round((masteredCards.length / cards.length) * 100) : 0}% of all cards`}
          color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
        />

        <StatsCard
          title="Study Streak"
          value={stats.streakCount}
          icon={<Calendar className="w-6 h-6 text-purple-500" />}
          description="Days in a row"
          color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
        />
      </div>

      <div className="rounded-xl p-6 transition-all duration-300">
        <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight py-1">Progress Overview</h3>
        <ProgressChart studyData={stats.studyDates} />
      </div>

      {decks.length > 0 ? (
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Your Decks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {decks.map(deck => {
              const deckCards = getDeckCards(cards, deck.id);
              const deckDueCards = todayCards.filter(card => card.deckId === deck.id);
              const masteryPercentage = deckCards.length > 0
                ? Math.round((getMasteredCards(deckCards).length / deckCards.length) * 100)
                : 0;

              return (
                <div
                  key={deck.id}
                  className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate pr-4">{deck.name}</h4>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {deckCards.length} cards
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2">{deck.description}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            {deckDueCards.length} due today
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

                  <div className="flex divide-x divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setActiveDeckId(deck.id);
                        setActiveView('card-list');
                      }}
                      className="flex-1 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>View Cards</span>
                    </button>
                    <button
                      onClick={() => deckDueCards.length > 0 && startReview(deck.id)}
                      disabled={deckDueCards.length === 0}
                      className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${deckDueCards.length > 0
                        ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Review Deck</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Welcome to MemoryBoost!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Get started by creating your first flashcard deck.
          </p>
          <button
            onClick={handleCreateNewDeck}
            className="group relative inline-flex items-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/50 to-indigo-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">Create Your First Deck</span>
          </button>
        </div>
      )}

      {decks.length > 0 && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add More Content</h3>
            <button
              onClick={handleCreateNewDeck}
              className="group relative inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/0 via-indigo-200/50 to-indigo-200/0 dark:from-indigo-600/0 dark:via-indigo-600/50 dark:to-indigo-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Plus className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="relative">Create New Deck</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};