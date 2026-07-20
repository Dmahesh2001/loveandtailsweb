import React from 'react';
import './Loading.css';

// The real "an operation is in progress" indicator — use this whenever the app
// is actually waiting on something (initial data bootstrap, an API call, a
// page-level refresh). Not to be confused with IntroAnimation, which is a
// one-time first-visit experience unrelated to whether anything is loading.
const Loading = ({ message = 'Loading...', fullScreen = true, className = '' }) => {
  return (
    <div
      className={[
        'loading-indicator',
        fullScreen && 'loading-indicator--fullscreen',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className="loading-indicator__spinner" aria-hidden="true" />
      {message && <p className="loading-indicator__message">{message}</p>}
    </div>
  );
};

export default Loading;
