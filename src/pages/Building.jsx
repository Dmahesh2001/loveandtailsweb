import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';
import './Building.css';

const STORY_LINES = [
  "Care. Connect. Adopt. That's what we're building",
];

const STORY_BASE_DELAY = 0.2;
const LINE_DURATION = 2.1; // fade in, hold, fade out — only one line visible at a time
const BAND_DELAY = STORY_BASE_DELAY + STORY_LINES.length * LINE_DURATION + 0.2;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Building = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="building-page">
      <div className="building-stage">
        <section className="building-hero">
          <div className="building-hero__story">
            {STORY_LINES.map((line, index) => (
              <motion.p
                key={line}
                className="building-hero__line"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -24] }}
                transition={{
                  duration: LINE_DURATION,
                  delay: STORY_BASE_DELAY + index * LINE_DURATION,
                  times: [0, 0.22, 0.78, 1],
                  ease: 'easeInOut',
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </section>

        <motion.section
          className="building-band"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: BAND_DELAY, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="building-band__inner">
            <p className="building-band__eyebrow">Join the waitlist</p>
            <h2 className="building-band__heading">Building a Community for Pets & PetOwners</h2>
            <p className="building-band__description">
              Share memories, discover pet-friendly places, meet nearby pet parents, and stay
              updated with exclusive events.
            </p>

            {/* Both states stay mounted and share a grid cell so the card's
                height is set by the taller of the two — switching between
                them never resizes the banner. */}
            <div className="building-band__content">
              <p
                className={`building-band__success${submitted ? '' : ' is-hidden'}`}
                aria-hidden={!submitted}
              >
                You're on the list! We'll be in touch soon.
              </p>
              <form
                className={`building-band__form${submitted ? ' is-hidden' : ''}`}
                onSubmit={handleSubmit}
                noValidate
                aria-hidden={submitted}
              >
                <InputField
                  aria-label="Email address"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  error={error}
                  disabled={submitting || submitted}
                />
                <PrimaryButton
                  type="submit"
                  variant="inverse"
                  loading={submitting}
                  disabled={submitted}
                  className="building-band__cta"
                >
                  Join the Pack →
                </PrimaryButton>
                <p className="building-band__helper">No spam • Cancel anytime • Early access</p>
              </form>
            </div>
          </div>
        </motion.section>
      </div>
      <Toast show={showToast} message="Email sent! You're on the list." />
    </div>
  );
};

export default Building;
