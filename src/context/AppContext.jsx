import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTodayCards } from '../utils/spacedRepetition';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [decks, setDecks] = useState(() => {
    const savedDecks = localStorage.getItem('flashcards-decks');
    return savedDecks ? JSON.parse(savedDecks) : [];
  });

  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('flashcards-cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('flashcards-stats');
    return savedStats ? JSON.parse(savedStats) : {
      streakCount: 0,
      lastStudyDate: null,
      totalReviews: 0,
      correctReviews: 0,
      studyDates: {}
    };
  });

  const [activeDeckId, setActiveDeckId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('flashcards-darkmode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('flashcards-decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('flashcards-cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('flashcards-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('flashcards-darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Streak Check
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    
    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate.toLocaleDateString() !== yesterday.toLocaleDateString() &&
        lastDate.toLocaleDateString() !== today &&
        getTodayCards(cards).length > 0) {
        setStats(prev => ({ ...prev, streakCount: 0 }));
      }
    }
  }, [cards, stats.lastStudyDate]);

  const addDeck = (deck) => {
    const newDeck = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastReviewedAt: null,
      ...deck
    };
    setDecks([...decks, newDeck]);
    return newDeck.id;
  };

  const updateDeck = (id, deckUpdate) => {
    setDecks(decks.map(deck =>
      deck.id === id ? { ...deck, ...deckUpdate } : deck
    ));
  };

  const deleteDeck = (id) => {
    setDecks(decks.filter(deck => deck.id !== id));
    setCards(cards.filter(card => card.deckId !== id));
    if (activeDeckId === id) {
      setActiveDeckId(null);
      setActiveView('deck-list');
    }
  };

  const addCard = (card) => {
    const newCard = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastReviewedAt: null,
      nextReviewDate: new Date().toISOString(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      ...card
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id, cardUpdate) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, ...cardUpdate } : card
    ));
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
    if (activeCardId === id) {
      setActiveCardId(null);
    }
  };

  const reviewCard = (id, knewAnswer) => {
    const today = new Date().toISOString();
    const todayStr = new Date().toLocaleDateString();
    const cardToUpdate = cards.find(card => card.id === id);
    
    if (!cardToUpdate) return;

    setCards(cards.map(card => {
      if (card.id === id) {
        const updatedCard = {
          ...card,
          lastReviewedAt: today,
          repetitions: card.repetitions + 1
        };

        if (knewAnswer) {
          updatedCard.consecutiveCorrect = (card.consecutiveCorrect || 0) + 1;
          
          if (updatedCard.consecutiveCorrect >= 3) {
            updatedCard.isMastered = true;
            updatedCard.interval = 60; // 60 seconds for mastered cards
          } else {
            updatedCard.interval = 40; // 40 seconds for correct answers
          }
        } else {
          updatedCard.consecutiveCorrect = 0;
          updatedCard.isMastered = false;
          updatedCard.interval = card.isMastered ? 50 : 30; // 50s for failed mastered, 30s for others
        }
        
        const nextDate = new Date();
        nextDate.setSeconds(nextDate.getSeconds() + updatedCard.interval);
        updatedCard.nextReviewDate = nextDate.toISOString();
        
        return updatedCard;
      }
      return card;
    }));

    // Update deck's last reviewed timestamp
    updateDeck(cardToUpdate.deckId, { lastReviewedAt: today });
    
    // Update stats
    setStats(prev => {
      const studyDates = { ...prev.studyDates };
      studyDates[todayStr] = (studyDates[todayStr] || 0) + 1;
      
      let newStreakCount = prev.streakCount;
      if (prev.lastStudyDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();
        
        if (prev.lastStudyDate === yesterdayStr || prev.lastStudyDate === null) {
          newStreakCount += 1;
        }
      }

      return {
        ...prev,
        lastStudyDate: todayStr,
        totalReviews: prev.totalReviews + 1,
        correctReviews: prev.correctReviews + (knewAnswer ? 1 : 0),
        streakCount: newStreakCount,
        studyDates
      };
    });

    // Check if there are more cards to review in the current deck
    const remainingCards = getTodayCards(cards, cardToUpdate.deckId);
    if (remainingCards.length === 0) {
      // If no more cards to review in current deck, switch to deck list
      setActiveView('deck-list');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const value = {
    decks,
    cards,
    stats,
    activeDeckId,
    setActiveDeckId,
    activeView,
    setActiveView,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    activeCardId,
    setActiveCardId,
    darkMode,
    toggleDarkMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};