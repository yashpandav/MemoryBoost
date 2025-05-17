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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 max-w-5xl">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'deck-list' && <DeckList />}
        {activeView === 'deck-edit' && <DeckEditor />}
        {activeView === 'card-list' && <CardList />}
        {activeView === 'card-edit' && <CardEditor />}
        {activeView === 'review' && <CardReview />}
      </main>
    </div>
  );
};