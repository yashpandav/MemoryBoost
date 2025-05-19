import { Types } from "../models/types";

// Constants for spaced repetition algorithm
const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;
const MASTERY_THRESHOLD = 3; // Number of consecutive correct answers needed for mastery
const MASTERED_INTERVAL = 60; // 60 seconds for mastered cards
const MASTERED_FAIL_INTERVAL = 50; // 50 seconds for failed mastered cards
const CORRECT_INTERVAL = 40; // 40 seconds for correct answers
const INCORRECT_INTERVAL = 30; // 30 seconds for incorrect answers

const formatDate = (date) => {
    return date.toISOString().replace('T', ' ').slice(0, 19);
};

const getCurrentTime = () => new Date();

// Get all cards due for review now
export const getTodayCards = (cards, deckId = null) => {
    const now = getCurrentTime();
    return cards.filter((card) => {
        const isDue = new Date(card.nextReviewDate) <= now;
        return deckId ? (card.deckId === deckId && isDue) : isDue;
    });
};

// Get all cards due for a specific deck
export const getDeckDueCards = (cards, deckId) => {
    return getTodayCards(cards, deckId);
};

// Get cards for a specific deck
export const getDeckCards = (cards, deckId) => {
    return cards.filter((card) => card.deckId === deckId);
};

// Get mastered cards
export const getMasteredCards = (cards, deckId = null) => {
    return cards.filter((card) => {
        return deckId ? (card.deckId === deckId && card.isMastered) : card.isMastered;
    });
};

// Calculate mastery percentage for a deck
export const getDeckMasteryPercentage = (cards, deckId) => {
    const deckCards = getDeckCards(cards, deckId);
    if (deckCards.length === 0) return 0;

    const masteredCards = deckCards.filter((card) => card.isMastered);
    return Math.round((masteredCards.length / deckCards.length) * 100);
};

// Calculate overall mastery percentage
export const getOverallMasteryPercentage = (cards) => {
    if (cards.length === 0) return 0;
    const masteredCards = getMasteredCards(cards);
    return Math.round((masteredCards.length / cards.length) * 100);
};

// Get next review time as a formatted string
export const getNextReviewDateString = (card) => {
    const nextReview = new Date(card.nextReviewDate);
    const now = getCurrentTime();
    const diffTime = nextReview.getTime() - now.getTime();
    const diffSeconds = Math.ceil(diffTime / 1000);
    if (diffSeconds < 0) {
        const overdueSeconds = Math.abs(diffSeconds);
        if (overdueSeconds < 60) return `Overdue by ${overdueSeconds} seconds`;
        if (overdueSeconds < 3600) return `Overdue by ${Math.ceil(overdueSeconds / 60)} minutes`;
        if (overdueSeconds < 86400) return `Overdue by ${Math.ceil(overdueSeconds / 3600)} hours`;
        return `Overdue by ${Math.ceil(overdueSeconds / 86400)} days`;
    }
    if (diffSeconds === 0) return "Now";
    if (diffSeconds < 60) return `In ${diffSeconds} seconds`;
    if (diffSeconds < 3600) return `In ${Math.ceil(diffSeconds / 60)} minutes`;
    if (diffSeconds < 86400) return `In ${Math.ceil(diffSeconds / 3600)} hours`;
    return `In ${Math.ceil(diffSeconds / 86400)} days`;
};

// Get card status text
export const getCardStatus = (card) => {
    if (card.repetitions === 0 && card.lastReviewedAt === null) return "New";
    if (card.isMastered) return "Mastered";
    if (card.consecutiveCorrect > 0) return "Learning";
    return "Review";
};

// Get card status color
export const getCardStatusColor = (card) => {
    const status = getCardStatus(card);
    switch (status) {
        case "New":
            return "bg-blue-500";
        case "Learning":
            return "bg-yellow-500";
        case "Review":
            return "bg-purple-500";
        case "Mastered":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};

// Calculate next review time based on interval (in seconds)
const calculateNextReviewDate = (interval) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + interval);
    return formatDate(date);
};

// Update card after review
export const updateCardAfterReview = (card, knewAnswer) => {
    const newCard = { ...card };
    const now = getCurrentTime();

    if (knewAnswer) {
        // Correct answer
        newCard.consecutiveCorrect = (card.consecutiveCorrect || 0) + 1;

        // Check for mastery
        if (newCard.consecutiveCorrect >= MASTERY_THRESHOLD) {
            newCard.isMastered = true;
            newCard.interval = MASTERED_INTERVAL;
        } else {
            newCard.interval = CORRECT_INTERVAL;
        }
    } else {
        // Incorrect answer
        newCard.consecutiveCorrect = 0;
        newCard.isMastered = false;
        newCard.interval = card.isMastered ? MASTERED_FAIL_INTERVAL : INCORRECT_INTERVAL;
    }

    // Update review dates
    newCard.lastReviewedAt = formatDate(now);
    newCard.nextReviewDate = calculateNextReviewDate(newCard.interval);

    return newCard;
};

// Create a new card with initial spaced repetition values
export const createNewCard = (deckId, front, back) => ({
    id: crypto.randomUUID(),
    deckId,
    front,
    back,
    createdAt: formatDate(getCurrentTime()),
    lastReviewedAt: null,
    nextReviewDate: formatDate(getCurrentTime()), // Due immediately
    interval: 0, // Due immediately
    consecutiveCorrect: 0,
    isMastered: false,
    repetitions: 0,
    easeFactor: INITIAL_EASE_FACTOR,
});
