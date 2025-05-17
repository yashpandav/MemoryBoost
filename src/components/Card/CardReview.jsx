import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getDeckDueCards, getTodayCards } from '../../utils/spacedRepetition';
import { FlashCard } from './FlashCard';
import { Confetti } from '../UI/Confetti';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

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

  // Timer effect
  useEffect(() => {
    if (!showAnswer && currentCardIndex < dueCards.length) {
      const currentCard = dueCards[currentCardIndex];
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
  }, [currentCardIndex, dueCards, showAnswer]);
  
  // Handle review completion
  useEffect(() => {
    if (dueCards.length === 0 || currentCardIndex >= dueCards.length) {
      setReviewComplete(true);
      
      if (dueCards.length > 0 && currentCardIndex >= dueCards.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [currentCardIndex, dueCards.length]);
  
  // Handle card answer
  const handleAnswer = (knewAnswer) => {
    if (currentCardIndex < dueCards.length) {
      const currentCard = dueCards[currentCardIndex];
      
      // Update review stats
      setReviewStats(prev => ({
        correct: prev.correct + (knewAnswer ? 1 : 0),
        incorrect: prev.incorrect + (knewAnswer ? 0 : 1),
      }));
      
      // Update card review data
      reviewCard(currentCard.id, knewAnswer);
      
      // Move to the next card
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
      setTimeLeft(null);
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
      <div className="max-w-xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Cards Due</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Great job! You've completed all your reviews for today.
        </p>
        <button
          onClick={exitReview}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to {activeDeckId ? 'Deck' : 'Dashboard'}
        </button>
      </div>
    );
  }
  
  // If review is complete
  if (reviewComplete) {
    const totalCards = reviewStats.correct + reviewStats.incorrect;
    const correctPercentage = Math.round((reviewStats.correct / totalCards) * 100);
    
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        {showConfetti && <Confetti />}
        
        <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You've reviewed all cards in {deckName}.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Correct</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{reviewStats.correct}</p>
            </div>
            <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">Incorrect</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">{reviewStats.incorrect}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-green-500 h-4 rounded-full" 
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Return to {activeDeckId ? 'Deck' : 'Dashboard'}
          </button>
          <button
            onClick={restartReview}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Study Again
          </button>
        </div>
      </div>
    );
  }
  
  // Review in progress
  const currentCard = dueCards[currentCardIndex];
  const consecutiveCorrect = currentCard.consecutiveCorrect || 0;
  const isMastered = currentCard.isMastered;
  
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Reviewing {deckName}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Card {currentCardIndex + 1} of {dueCards.length}
          </p>
        </div>
        
        <button
          onClick={exitReview}
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          Exit Review
        </button>
      </div>
      
      {/* Progress and Timer */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {timeLeft !== null ? `${timeLeft}s until next review` : 'Ready to review'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {consecutiveCorrect > 0 && (
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {consecutiveCorrect} correct
                </span>
              </div>
            )}
            {isMastered && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                Mastered
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
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