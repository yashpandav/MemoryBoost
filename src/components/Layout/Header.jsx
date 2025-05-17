import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Brain, List, Home, Sun, Moon } from 'lucide-react';

export const Header = () => {
  const { setActiveView, toggleDarkMode, darkMode } = useAppContext();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MemoryBoost</h1>
        </div>
        
        <nav className="flex space-x-4">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveView('deck-list')}
            className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <List className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Decks</span>
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
};