import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import logoColor from '../assets/logos/Love&Tails.svg';
import logoWhite from '../assets/logos/Love&Tails_white.svg';
import './IntroAnimation.css';

const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1];
const HEADER_LOGO_ID = 'app-header-logo';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The red-sweep / circle-reveal / header-dock animation shown once to
// first-time visitors as an intro to the brand. This is purely a first-visit
// experience, not tied to any real data loading — see Loading for that.
const IntroAnimation = ({ onComplete }) => {
  const panelRef = useRef(null);
  const patchRef = useRef(null);
  const coloredLogoRef = useRef(null);
  const coloredLogoImgRef = useRef(null);
  const whiteLogoRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const patch = patchRef.current;
    const coloredLogo = coloredLogoRef.current;
    const coloredLogoImg = coloredLogoImgRef.current;
    const whiteLogo = whiteLogoRef.current;
    const percent = percentRef.current;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Radius (in px) needed for a circle centered on screen to fully cover the
    // viewport — the reveal animation stops exactly here, so it finishes the
    // instant coverage completes with no lingering "fully revealed" frame.
    const maxRevealRadius = Math.hypot(window.innerWidth / 2, window.innerHeight / 2) + 2;

    const setSweepProgress = (edge) => {
      panel.style.transform = `translateY(${edge - 100}%)`;
      whiteLogo.style.clipPath = `inset(0 0 ${100 - edge}% 0)`;
      coloredLogo.style.clipPath = `inset(${edge}% 0 0 0)`;

      // The counter rides just above the descending edge of the red panel.
      percent.style.top = `calc(${edge}% - 34px)`;
      percent.textContent = `${Math.round(edge)}%`;
    };

    const setRevealProgress = (radius) => {
      patch.style.clipPath = `circle(${radius}px at 50% 50%)`;
      coloredLogo.style.clipPath = `circle(${radius}px at 50% 50%)`;
    };

    let cancelled = false;
    // Tracks whichever framer-motion animation is currently in flight so cleanup
    // can force-stop it immediately — without this, a stale run (e.g. from React
    // StrictMode's dev-only double-invoke of effects) could keep writing styles
    // for the rest of its duration at the same time as a fresh run, producing
    // two overlapping animations on the same DOM nodes.
    let activeControls = null;

    const runAnimate = (from, to, options) => {
      const controls = animate(from, to, options);
      activeControls = controls;
      return controls;
    };

    const runSequence = async () => {
      // Step 1 — logo in original colors on white
      setSweepProgress(0);
      await sleep(900);
      if (cancelled) return;

      // Step 2 — red panel sweeps in, repainting the logo white as it passes,
      // with a percentage counter riding the sweeping edge
      percent.style.opacity = '1';
      await runAnimate(0, 100, {
        duration: 1.6,
        ease: EASE_IN_OUT_CUBIC,
        onUpdate: setSweepProgress,
      });
      if (cancelled) return;
      percent.style.opacity = '0';

      // Step 3 — hold full red screen, logo fully white
      await sleep(700);
      if (cancelled) return;

      // White logo becomes the unclipped base layer for the reveal phase.
      // At edge === 100 this is visually identical to its current clip, so the switch is invisible.
      whiteLogo.style.clipPath = 'none';

      // Step 4 — white reveal radiates outward from the logo, repainting it back to color
      await runAnimate(0, maxRevealRadius, {
        duration: 1.6,
        ease: EASE_IN_OUT_CUBIC,
        onUpdate: setRevealProgress,
      });
      if (cancelled) return;

      // Step 5 — the logo docks into the header's logo slot instead of just
      // vanishing. We measure both rects and animate translate+scale so the
      // splash logo ends up exactly overlapping the header logo — by the time
      // we hand off, the two are pixel-aligned and the swap is invisible.
      const headerLogoEl = document.getElementById(HEADER_LOGO_ID);
      if (headerLogoEl && coloredLogoImg) {
        const from = coloredLogoImg.getBoundingClientRect();
        const to = headerLogoEl.getBoundingClientRect();
        const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
        const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
        const scale = to.width / from.width;

        await runAnimate(0, 1, {
          duration: 1.5,
          ease: EASE_IN_OUT_CUBIC,
          onUpdate: (t) => {
            const s = 1 + (scale - 1) * t;
            coloredLogo.style.transform = `translate(${dx * t}px, ${dy * t}px) scale(${s})`;
          },
        });
        if (cancelled) return;
      }

      onComplete?.();
    };

    runSequence();

    return () => {
      cancelled = true;
      activeControls?.stop();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div className="intro-animation-overlay">
      <div className="intro-animation-panel" ref={panelRef} />
      <div className="intro-animation-patch" ref={patchRef} />
      <div className="intro-animation-logo-layer" ref={whiteLogoRef} style={{ clipPath: 'inset(0 0 100% 0)' }}>
        <img src={logoWhite} alt="" aria-hidden="true" draggable={false} />
      </div>
      <div className="intro-animation-logo-layer" ref={coloredLogoRef}>
        <img ref={coloredLogoImgRef} src={logoColor} alt="Love & Tails" draggable={false} />
      </div>
      <span
        className="intro-animation-percent-tracker"
        ref={percentRef}
        style={{ top: 'calc(0% - 34px)' }}
      >
        0%
      </span>
    </div>
  );
};

export default IntroAnimation;
