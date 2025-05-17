export const Types = {
  // Deck structure
  Deck: {
    id: 'string',
    name: 'string',
    description: 'string',
    createdAt: 'string',
    lastReviewedAt: 'string or null'
  },

  // Card structure
  Card: {
    id: 'string',
    deckId: 'string',
    front: 'string',
    back: 'string',
    createdAt: 'string',
    lastReviewedAt: 'string or null',
    nextReviewDate: 'string',
    interval: 'number',
    easeFactor: 'number',
    repetitions: 'number'
  },

  // App statistics structure
  AppStats: {
    streakCount: 'number',
    lastStudyDate: 'string or null',
    totalReviews: 'number',
    correctReviews: 'number',
    studyDates: 'object'
  }
};