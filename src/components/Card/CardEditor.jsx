import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export const CardEditor = () => {
  const { addCard, updateCard, cards, activeDeckId, activeCardId, setActiveView } = useAppContext();
  
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [frontError, setFrontError] = useState('');
  const [backError, setBackError] = useState('');
  
  useEffect(() => {
    if (activeCardId) {
      const card = cards.find(c => c.id === activeCardId);
      if (card) {
        setFront(card.front);
        setBack(card.back);
      }
    } else {
      setFront('');
      setBack('');
    }
  }, [activeCardId, cards]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!front.trim()) {
      setFrontError('Front side is required');
      isValid = false;
    } else {
      setFrontError('');
    }
    
    if (!back.trim()) {
      setBackError('Back side is required');
      isValid = false;
    } else {
      setBackError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (activeCardId) {
      // Update existing card
      updateCard(activeCardId, { front, back });
    } else if (activeDeckId) {
      addCard({ 
        deckId: activeDeckId,
        front, 
        back
      });
    }
    
    setActiveView('card-list');
  };
  
  if (!activeDeckId) {
    setActiveView('deck-list');
    return null;
  }
  
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {activeCardId ? 'Edit Card' : 'Add New Card'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="front" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Front (Question)
          </label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              frontError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g., What is the capital of France?"
          />
          {frontError && <p className="mt-1 text-sm text-red-500">{frontError}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="back" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Back (Answer)
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              backError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g., Paris"
          />
          {backError && <p className="mt-1 text-sm text-red-500">{backError}</p>}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setActiveView('card-list')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            {activeCardId ? 'Update Card' : 'Add Card'}
          </button>
        </div>
      </form>
    </div>
  );
};