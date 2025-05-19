import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Brain, List, Home, Sun, Moon, Menu, X, HelpCircle } from 'lucide-react';

export const Header = () => {
  const { setActiveView, toggleDarkMode, darkMode } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />
      <div className="relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => setActiveView('dashboard')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/30 dark:to-purple-500/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
                <Brain className="relative h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">MemoryBoost</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <Home className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => setActiveView('deck-list')}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <List className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span>Decks</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => setActiveView('how-to-use')}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <HelpCircle className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span>How to Use</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="group relative flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`
                      absolute inset-0 w-5 h-5 transform transition-all duration-300
                      ${darkMode ? 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-0'}
                    `}
                  />
                  <Moon
                    className={`
                      absolute inset-0 w-5 h-5 transform transition-all duration-300
                      ${darkMode ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-0' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'}
                    `}
                  />
                </div>
              </button>
            </nav>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="group relative flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`
                      absolute inset-0 w-5 h-5 transform transition-all duration-300
                      ${darkMode ? 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-0'}
                    `}
                  />
                  <Moon
                    className={`
                      absolute inset-0 w-5 h-5 transform transition-all duration-300
                      ${darkMode ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-0' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'}
                    `}
                  />
                </div>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300`}>
          <div className="absolute inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2 p-4">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => {
                  setActiveView('deck-list');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <List className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Decks</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => {
                  setActiveView('how-to-use');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:text-indigo-400 transition-all duration-300 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <HelpCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>How to Use</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};