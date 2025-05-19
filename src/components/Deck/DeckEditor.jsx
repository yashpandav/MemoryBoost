import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BookOpen, ArrowLeft, Save, X } from 'lucide-react';

export const DeckEditor = () => {
  const { addDeck, updateDeck, decks, activeDeckId, setActiveDeckId, setActiveView } = useAppContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [isNewDeck, setIsNewDeck] = useState(true);

  // Load deck
  useEffect(() => {
    if (activeDeckId) {
      const deck = decks.find(d => d.id === activeDeckId);
      if (deck) {
        setName(deck.name);
        setDescription(deck.description);
        setIsNewDeck(false);
      }
    } else {
      // new deck
      setName('');
      setDescription('');
      setIsNewDeck(true);
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
      // Update deck
      updateDeck(activeDeckId, { name, description });
      setActiveView('card-list');
    } else {
      // Create deck
      const newDeckId = addDeck({ name, description });
      setActiveDeckId(null);
      setActiveView('deck-list');
    }
  };

  const handleCancel = () => {
    // Clear deck id
    setActiveDeckId(null);
    setActiveView('deck-list');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
          {isNewDeck ? 'Create New Deck' : 'Edit Deck'}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          {isNewDeck ? 'Start by creating a new deck for your flashcards.' : 'Update your deck details below.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-sm"></div>
              <BookOpen className="relative w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <label htmlFor="name" className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
              Deck Name
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:text-white transition-all duration-300 ${nameError ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              placeholder="e.g., Spanish Vocabulary"
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full"></div>
          </div>
          {nameError && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
              {nameError}
            </p>
          )}
        </div>

        <div className="mb-8 sm:mb-10">
          <label htmlFor="description" className="block text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-300"
              placeholder="Optional description for your deck"
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-4 sm:px-5 py-3 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/0 via-gray-200/50 to-gray-200/0 dark:from-gray-600/0 dark:via-gray-600/50 dark:to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative">Back to Decks</span>
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-4 sm:px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Save className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
            <span className="relative transform group-hover:scale-105 transition-transform duration-300">
              {isNewDeck ? 'Create Deck' : 'Update Deck'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};