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
          <div className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center backface-hidden">
            <div className="text-center">
              <p className="text-xl font-medium">{front}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Click to flip
              </p>
            </div>
          </div>
          
          {/* Card Back */}
          <div className="absolute w-full h-full bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow-lg p-6 flex items-center justify-center rotate-y-180 backface-hidden">
            <div className="text-center">
              <p className="text-xl font-medium">{back}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Click to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answer Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        {!showAnswer ? (
          <button
            onClick={handleFlip}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Show Answer
          </button>
        ) : (
          <>
            <button
              onClick={() => onAnswer(false)}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 font-medium rounded-md transition-colors"
            >
              <XCircle className="w-5 h-5 mr-2" />
              I Didn't Know
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 font-medium rounded-md transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I Knew It
            </button>
          </>
        )}
      </div>
    </div>
  );
};