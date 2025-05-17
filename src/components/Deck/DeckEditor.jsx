import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export const DeckEditor = () => {
  const { addDeck, updateDeck, decks, activeDeckId, setActiveView } = useAppContext();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Load deck if editing existing
  useEffect(() => {
    if (activeDeckId) {
      const deck = decks.find(d => d.id === activeDeckId);
      if (deck) {
        setName(deck.name);
        setDescription(deck.description);
      }
    } else {
      setName('');
      setDescription('');
    }
  }, [activeDeckId, decks]);
  
  const validateForm = () => {
    if (!name.trim()) {
      setNameError('Deck name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (activeDeckId) {
      // Update existing deck
      updateDeck(activeDeckId, { name, description });
      setActiveView('card-list');
    } else {
      // Create new deck
      addDeck({ name, description });
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {activeDeckId ? 'Edit Deck' : 'Create New Deck'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deck Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              nameError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g., Spanish Vocabulary"
          />
          {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Optional description for your deck"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setActiveView('deck-list')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            {activeDeckId ? 'Update Deck' : 'Create Deck'}
          </button>
        </div>
      </form>
    </div>
  );
};