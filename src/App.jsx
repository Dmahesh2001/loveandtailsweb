import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import IntroAnimation from './components/IntroAnimation';
import Building from './pages/Building';
import NotFound from './pages/NotFound';

const HAS_SEEN_INTRO_KEY = 'loveandtails:hasSeenIntro';

function App() {
  // First-ever visit gets the intro animation as a one-time welcome. Returning
  // visitors skip straight to the app — this is purely a first-visit
  // experience, not a stand-in for real data loading (see Loading for that).
  const [showIntro, setShowIntro] = useState(
    () => !localStorage.getItem(HAS_SEEN_INTRO_KEY)
  );

  const handleIntroComplete = () => {
    localStorage.setItem(HAS_SEEN_INTRO_KEY, 'true');
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      <Header />
      {showIntro ? (
        <IntroAnimation onComplete={handleIntroComplete} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Routes>
            <Route path="/" element={<Building />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      )}
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
