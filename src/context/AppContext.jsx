import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTodayCards } from '../utils/spacedRepetition';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load data from localStorage
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
    if (savedStats) {
      return JSON.parse(savedStats);
    } else {
      return {
        streakCount: 0,
        lastStudyDate: null,
        totalReviews: 0,
        correctReviews: 0,
        studyDates: {}
      };
    }
  });

  const [activeDeckId, setActiveDeckId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('flashcards-darkmode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  // Set initial dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Run only on mount

  // Save to localStorage when data changes
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

  // Check for streak
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    
    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toLocaleDateString() !== yesterday.toLocaleDateString() &&
          lastDate.toLocaleDateString() !== today &&
          getTodayCards(cards).length > 0) {
        setStats(prev => ({
          ...prev,
          streakCount: 0
        }));
      }
    }
  }, [cards, stats.lastStudyDate]);

  // CRUD operations for decks
  const addDeck = (deck) => {
    const newDeck = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastReviewedAt: null,
      ...deck
    };
    setDecks([...decks, newDeck]);
    setActiveDeckId(newDeck.id);
    setActiveView('card-list');
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

  // CRUD operations for cards
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

  // Review functionality
  const reviewCard = (id, knewAnswer) => {
    const today = new Date().toISOString();
    const todayStr = new Date().toLocaleDateString();
    
    setCards(cards.map(card => {
      if (card.id === id) {
        const updatedCard = {
          ...card,
          lastReviewedAt: today,
          repetitions: card.repetitions + 1
        };

        if (knewAnswer) {
          // Correct answer
          updatedCard.consecutiveCorrect = (card.consecutiveCorrect || 0) + 1;
          
          // Check for mastery
          if (updatedCard.consecutiveCorrect >= 3) {
            updatedCard.isMastered = true;
            updatedCard.interval = 60; // 60 seconds for mastered cards
          } else {
            updatedCard.interval = 40; // 40 seconds for correct answers
          }
        } else {
          // Incorrect answer
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
    
    const cardToUpdate = cards.find(card => card.id === id);
    if (cardToUpdate) {
      updateDeck(cardToUpdate.deckId, { lastReviewedAt: today });
    }
    
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