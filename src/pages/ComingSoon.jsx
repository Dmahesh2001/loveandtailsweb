import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import IntroAnimation from '@/components/IntroAnimation';
import Building from './Building';

const HAS_SEEN_INTRO_KEY = 'loveandtails:hasSeenIntro';

function readSeenIntro() {
  try {
    return Boolean(localStorage.getItem(HAS_SEEN_INTRO_KEY));
  } catch {
    return true;
  }
}

/*
 * The original "coming soon" page, kept with its header + one-time intro
 * animation (the intro flies the logo into the header, so they stay together).
 */
function ComingSoon() {
  const [showIntro, setShowIntro] = useState(() => !readSeenIntro());

  const handleIntroComplete = () => {
    try {
      localStorage.setItem(HAS_SEEN_INTRO_KEY, 'true');
    } catch {
      /* storage unavailable — the intro just shows again next time */
    }
    setShowIntro(false);
  };

  return (
    <>
      <Header />
      {showIntro ? (
        <IntroAnimation onComplete={handleIntroComplete} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Building />
        </motion.div>
      )}
    </>
  );
}

export default ComingSoon;
