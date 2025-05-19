# MemoryBoost: Spaced Repetition Flashcard Engine

A modern, responsive, and educational flashcard app built with **Vite**, **React**, **Tailwind CSS**, and **JavaScript**. MemoryBoost helps you master knowledge efficiently using a spaced repetition algorithm, persistent local storage, and a beautiful, motivational UI.

## 🚀 Features

### 1. Flashcard Review Interface
- **Flip Animation:** Smooth 3D flip between question (front) and answer (back).
- **User Feedback:** "I knew it" and "I didn't know it" buttons update the review schedule.
- **Accessible:** Keyboard navigation and ARIA-friendly.

### 2. Spaced Repetition Logic
- **Algorithm:** Simplified spaced repetition (SR) logic:
  - "I knew it" → increases review interval and tracks consecutive successes.
  - "I didn't know it" → resets or shortens interval.
- **Persistence:** All flashcard states (intervals, next review date, success count, etc.) are stored in `localStorage` for session persistence.

### 3. Progress Dashboard
- **Stats:** See total cards, cards due today, and mastered cards.
- **Charts:** Visualize your review progress over time with a line chart.
- **Streaks:** Daily study streak counter to encourage consistent learning.

### 4. Deck Management
- **Multiple Decks:** Create, edit, and delete decks/categories.
- **Card Management:** Add, edit, or delete flashcards within each deck.
- **Per-Deck Stats:** Track progress and mastery for each deck.

### 5. Motivational UI Elements
- **Progress Visualization:** Calendar heatmap and progress bars.

### 6. Responsive & Accessible Design
- **Tailwind CSS:** Clean, modern, and mobile-friendly UI.
- **Dark Mode:** Toggle between light and dark themes.
- **Accessibility:** ARIA labels and keyboard navigation.

## 🛠️ Technical Stack

- **Frontend:** [Vite](https://vitejs.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Context API
- **Persistence:** Browser `localStorage`
- **Charts:** [Chart-js](https://react-chartjs-2.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/icons/)

## 📁 Project Structure

```
src/
  components/
    Card/         # Flashcard UI, review, and editor components
    Dashboard/    # Dashboard, stats, and progress chart
    Deck/         # Deck list and editor
    Layout/       # Header and layout components
    Home.jsx      # Main navigation and view switcher
  context/
    AppContext.jsx # Global state, localStorage sync, dark mode, etc.
  models/
    types.js      # Data models for Deck, Card, and AppStats
  utils/
    spacedRepetition.js # Spaced repetition logic and helpers
  App.jsx         # App root, context provider
  main.jsx        # Entry point, ReactDOM render
  index.css       # Tailwind CSS and custom styles
```

## 🧠 How Spaced Repetition Works

- Each card tracks:
  - `consecutiveCorrect`: Number of times answered correctly in a row.
  - `isMastered`: Becomes true after 3 consecutive correct answers.
  - `interval`: Time (in seconds) until the next review.
  - `nextReviewDate`: When the card will next appear.
- **Review Flow:**
  - "I knew it": Increases `consecutiveCorrect`, lengthens interval, eventually marks as mastered.
  - "I didn't know it": Resets `consecutiveCorrect`, shortens interval, removes mastery if needed.
- **Persistence:** All progress is saved in `localStorage` and restored on reload.

## ⏰ Card Review Timing & Scheduling

The timing for when a card will next be added for review is determined by a set of intervals (in seconds) and the user's feedback during review. The logic is as follows:

- **When a new card is created:**
  - `nextReviewDate` is set to the current time, so it is due immediately.
  - `interval` is set to 0.

- **When reviewing a card:**
  - If you click **"I knew it"**:
    - The card's `consecutiveCorrect` count increases by 1.
    - If `consecutiveCorrect` reaches 3, the card is marked as mastered and the interval is set to **60 seconds** (MASTERED_INTERVAL).
    - Otherwise, the interval is set to **40 seconds** (CORRECT_INTERVAL).
  - If you click **"I didn't know it"**:
    - The card's `consecutiveCorrect` is reset to 0.
    - If the card was previously mastered, the interval is set to **50 seconds** (MASTERED_FAIL_INTERVAL).
    - Otherwise, the interval is set to **30 seconds** (INCORRECT_INTERVAL).

- **After each review:**
  - The card's `lastReviewedAt` is updated to the current time.
  - The `nextReviewDate` is set to the current time plus the new interval.

- **How the app determines which cards are due:**
  - Cards are considered "due" if their `nextReviewDate` is less than or equal to the current time.
  - The dashboard and review interface will only show cards that are due for review.

**Example:**
- If you answer a card correctly twice, it will be shown again after 40 seconds each time. On the third consecutive correct answer, it will be shown again after 60 seconds and marked as mastered.
- If you answer incorrectly, the interval shortens to 30 seconds (or 50 seconds if it was mastered), and the mastery is reset.

This logic ensures that cards you know well appear less frequently, while cards you struggle with are shown more often, helping you focus on what needs more practice.

## 🖥️ Usage

### 1. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. User Flow

1. **Create a Deck:** Start by creating a new deck from the dashboard.
2. **Add Flashcards:** Add cards (front = question/term, back = answer/explanation).
3. **Review:** Click "Review" to start a session. Flip cards, then mark "I knew it" or "I didn't know it".
4. **Track Progress:** View your stats, streaks, and mastery on the dashboard.
5. **Edit/Manage:** Add, edit, or delete decks and cards as needed.

## 🎨 UI/UX Highlights

- **Modern Animations:** Card flips, button transitions, and progress bars.
- **Dark Mode:** Toggle in the header for eye comfort.
- **Mobile Friendly:** Responsive layouts for all devices.
- **Motivational Feedback:** Progress bars, streaks, and (planned) confetti for milestones.

## 📚 Data Models

- **Deck**
  - `id`, `name`, `description`, `createdAt`, `lastReviewedAt`
- **Card**
  - `id`, `deckId`, `front`, `back`, `createdAt`, `lastReviewedAt`, `nextReviewDate`, `interval`, `easeFactor`, `repetitions`, `consecutiveCorrect`, `isMastered`
- **AppStats**
  - `streakCount`, `lastStudyDate`, `totalReviews`, `correctReviews`, `studyDates`

## 📄 License

MIT

**MemoryBoost** – Supercharge your memory, one card at a time!