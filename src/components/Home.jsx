import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Dashboard } from './Dashboard/Dashboard';
import { DeckList } from './Deck/DeckList';
import { DeckEditor } from './Deck/DeckEditor';
import { CardList } from './Card/CardList';
import { CardEditor } from './Card/CardEditor';
import { CardReview } from './Card/CardReview';
import { Header } from './Layout/Header';

export const Home = () => {
  const { activeView } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <main className="flex-1 w-full">
        <div className="relative w-full min-h-[calc(100vh-4rem)] px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="relative h-full">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'deck-list' && <DeckList />}
            {activeView === 'deck-edit' && <DeckEditor />}
            {activeView === 'card-list' && <CardList />}
            {activeView === 'card-edit' && <CardEditor />}
            {activeView === 'review' && <CardReview />}
          </div>
        </div>
      </main>
    </div>
  );
};