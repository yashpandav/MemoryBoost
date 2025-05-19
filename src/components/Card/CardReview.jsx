import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckDueCards, getTodayCards } from '../../utils/spacedRepetition';
import { FlashCard } from './FlashCard';
import { Confetti } from '../UI/Confetti';
import { Clock, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export const CardReview = () => {
  const { cards, decks, activeDeckId, reviewCard, setActiveView } = useAppContext();
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [reviewStats, setReviewStats] = useState({ correct: 0, incorrect: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
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
    // Only reset if we have cards and we're not already in the middle of a review
    if (dueCards.length > 0 && !reviewComplete) {
      console.log('Initializing review with cards:', dueCards.length); // Debug log
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setReviewStats({ correct: 0, incorrect: 0 });
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
  
  // Handle review completion
  useEffect(() => {
    if (dueCards.length === 0 || currentCardIndex >= dueCards.length) {
      console.log('Marking review as complete:', {
        currentCardIndex,
        totalCards: dueCards.length,
        reviewStats
      });
      setReviewComplete(true);
      
      if (dueCards.length > 0 && currentCardIndex >= dueCards.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [currentCardIndex, dueCards.length, reviewStats]);
  
  // Handle card answer
  const handleAnswer = (knewAnswer) => {
    if (currentCardIndex < dueCards.length) {
      const currentCard = dueCards[currentCardIndex];
      
      // Update review stats
      setReviewStats(prev => {
        const newStats = {
          correct: prev.correct + (knewAnswer ? 1 : 0),
          incorrect: prev.incorrect + (knewAnswer ? 0 : 1),
        };
        console.log('Updated review stats:', newStats); // Debug log
        return newStats;
      });
      
      // Update card review data
      reviewCard(currentCard.id, knewAnswer);
      
      // Move to the next card if there are more cards
      if (currentCardIndex + 1 < dueCards.length) {
        setCurrentCardIndex(prev => prev + 1);
        setShowAnswer(false);
        setTimeLeft(null);
      } else {
        // If this was the last card, mark review as complete
        setReviewComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
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
  
  // Restart review
  const restartReview = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewComplete(false);
    setReviewStats({ correct: 0, incorrect: 0 });
    setTimeLeft(null);
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
  
  // If review is complete
  if (reviewComplete) {
    const totalCards = reviewStats.correct + reviewStats.incorrect;
    const correctPercentage = totalCards > 0 ? Math.round((reviewStats.correct / totalCards) * 100) : 0;
    
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {showConfetti && <Confetti />}
        
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Review Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            You've reviewed all cards in {deckName}.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-sm"></div>
                  <CheckCircle2 className="relative w-8 h-8 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{reviewStats.correct}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Correct</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl p-6 border border-red-200/50 dark:border-red-700/50">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-500/30 rounded-full blur-sm"></div>
                  <XCircle className="relative w-8 h-8 text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">{reviewStats.incorrect}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Incorrect</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${correctPercentage}%` }}
              ></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {correctPercentage}% Accuracy
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={exitReview}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 dark:from-gray-600/0 dark:via-gray-600/50 dark:to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="relative transform group-hover:scale-105 transition-transform duration-300">
                Return to {activeDeckId ? 'Deck' : 'Dashboard'}
              </span>
            </button>
            <button
              onClick={restartReview}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <RotateCcw className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="relative transform group-hover:scale-105 transition-transform duration-300">Study Again</span>
            </button>
          </div>
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

  const consecutiveCorrect = currentCard.consecutiveCorrect || 0;
  const isMastered = currentCard.isMastered;
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Reviewing {deckName}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Card {currentCardIndex + 1} of {dueCards.length}
          </p>
        </div>
        
        <button
          onClick={exitReview}
          className="group relative inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative">Exit Review</span>
        </button>
      </div>
      
      {/* Progress and Timer */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mb-8 transition-all duration-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-sm"></div>
              <Clock className="relative w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {timeLeft !== null ? `${timeLeft}s until next review` : 'Ready to review'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {consecutiveCorrect > 0 && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-sm"></div>
                  <CheckCircle2 className="relative w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {consecutiveCorrect} correct
                </span>
              </div>
            )}
            {isMastered && (
              <span className="px-3 py-1 text-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full border border-green-200/50 dark:border-green-700/50">
                Mastered
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex) / dueCards.length) * 100}%` }}
          ></div>
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