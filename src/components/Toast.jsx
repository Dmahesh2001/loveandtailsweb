import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Toast.css';

const Toast = ({ show, message }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {show && (
          <motion.div
            className="toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
