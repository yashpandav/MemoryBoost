import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export const FlashCard = ({
  front,
  back,
  showAnswer,
  setShowAnswer,
  onAnswer
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  
  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setShowAnswer(!showAnswer);
        setIsFlipping(false);
      }, 300);
    }
  };
  
  return (
    <div className="mb-6">
      {/* Card */}
      <div 
        className={`cursor-pointer mb-8 w-full aspect-[3/2] perspective-1000`}
        onClick={handleFlip}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-300 transform-style-3d ${
            isFlipping 
              ? 'rotate-y-180' 
              : showAnswer 
                ? 'rotate-y-180' 
                : ''
          }`}
        >
          {/* Card Front */}
          <div className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 flex items-center justify-center backface-hidden border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-100">{front}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Click to reveal answer
              </p>
            </div>
          </div>
          
          {/* Card Back */}
          <div className="absolute w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 rounded-2xl shadow-lg p-6 flex items-center justify-center rotate-y-180 backface-hidden border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-100">{back}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Click to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answer Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        {!showAnswer ? (
          <button
            onClick={handleFlip}
            className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <RotateCcw className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">Show Answer</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => onAnswer(false)}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/40 dark:hover:to-red-800/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-100/0 via-red-100/50 to-red-100/0 dark:from-red-600/0 dark:via-red-600/50 dark:to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <XCircle className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="relative transform group-hover:scale-105 transition-transform duration-300">I Didn't Know</span>
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-300 font-medium rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/0 via-green-100/50 to-green-100/0 dark:from-green-600/0 dark:via-green-600/50 dark:to-green-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CheckCircle className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="relative transform group-hover:scale-105 transition-transform duration-300">I Knew It</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};