import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckDueCards, getTodayCards } from '../../utils/spacedRepetition';
import { FlashCard } from './FlashCard';
import { Clock, ArrowLeft } from 'lucide-react';

export const CardReview = () => {
  const { cards, decks, activeDeckId, reviewCard, setActiveView } = useAppContext();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Get cards due for review 
  const dueCards = activeDeckId
    ? getDeckDueCards(cards, activeDeckId)
    : getTodayCards(cards);

  // Get current deck name
  const deckName = activeDeckId
    ? decks.find(d => d.id === activeDeckId)?.name || 'Cards'
    : 'All Decks';

  // Initialize review state when dueCards changes
  useEffect(() => {
    if (dueCards.length > 0) {
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setTimeLeft(null);
    }
  }, [dueCards.length]);

  // Timer effect
  useEffect(() => {
    if (!showAnswer && currentCardIndex < dueCards.length) {
      const currentCard = dueCards[currentCardIndex];
      if (!currentCard) return;

      const nextReview = new Date(currentCard.nextReviewDate);
      const now = new Date();
      const diffSeconds = Math.ceil((nextReview - now) / 1000);

      if (diffSeconds > 0) {
        setTimeLeft(diffSeconds);
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [currentCardIndex, showAnswer, dueCards]);

  // Handle card answer
  const handleAnswer = (knewAnswer) => {
    if (currentCardIndex < dueCards.length) {
      const currentCard = dueCards[currentCardIndex];

      // Update card review data
      reviewCard(currentCard.id, knewAnswer);

      // Move to the next card if there are more cards
      if (currentCardIndex + 1 < dueCards.length) {
        setCurrentCardIndex(prev => prev + 1);
        setShowAnswer(false);
        setTimeLeft(null);
      } else {
        // If this was the last card, return to deck list
        if (activeDeckId) {
          setActiveView('card-list');
        } else {
          setActiveView('dashboard');
        }
      }
    }
  };

  // Exit review
  const exitReview = () => {
    if (activeDeckId) {
      setActiveView('card-list');
    } else {
      setActiveView('dashboard');
    }
  };

  // If no cards are due
  if (dueCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            No Cards Due
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Great job! You've completed all your reviews for today.
          </p>
          <button
            onClick={exitReview}
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">
              Return to {activeDeckId ? 'Deck' : 'Dashboard'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Review in progress
  const currentCard = dueCards[currentCardIndex];

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            No Cards Available
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            There are no cards available for review at this time.
          </p>
          <button
            onClick={exitReview}
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">
              Return to {activeDeckId ? 'Deck' : 'Dashboard'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Review Your Card
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={exitReview}
            className="group relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative">Exit Review</span>
          </button>
        </div>
      </div>

      {currentCard && (
        <FlashCard
          front={currentCard.front}
          back={currentCard.back}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};