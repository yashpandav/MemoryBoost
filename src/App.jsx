import React from 'react';
import { AppProvider } from './context/AppContext';
import { Home } from './components/Home';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Home />
      </div>
    </AppProvider>
  );
}

export default App;