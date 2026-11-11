import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import FocusLayout from '@/components/onboarding/FocusLayout';
import { ProgressBar } from '@/components/onboarding/StepLayout';
import badge from '@/assets/figma/onboarding/badge-responsible-parent.png';
import iconBack from '@/assets/figma/shell/icon-back.svg';

/*
 * 16 · Badge quiz — Figma 1490:2871 (1440) / 1490:2904 (768) / 1490:2936 (390)
 * Voice answer — Figma 1490:2968 (390): mic-first mode with "Type instead".
 */

const QUESTIONS = [
  'Your pet suddenly stops eating for a day. What do you do first?',
  'Your work hours suddenly double. How will your pet get their daily exercise and breaks?',
  'You’re going away for a week. Who looks after your pet, and how do you prepare them?',
  'A neighbour complains your dog barks while you’re out. How do you handle it?',
  'What does a healthy weekly routine look like for your pet?',
  'How would you introduce a new pet to the animals already at home?',
];

const SpeechRecognition =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

function useVoice(onText) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => () => recRef.current?.stop(), []);

  const toggle = () => {
    if (!SpeechRecognition) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .slice(e.resultIndex)
        .map((r) => r[0].transcript)
        .join(' ');
      onText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return { supported: Boolean(SpeechRecognition), listening, toggle };
}

function Segments({ total, current }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn('h-1 flex-1 rounded-sm', i <= current ? 'bg-brand' : 'bg-[#eaeaeb]')} />
      ))}
    </div>
  );
}

export default function BadgeQuiz() {
  const navigate = useNavigate();
  const { q } = useParams();
  const index = Math.min(Math.max((Number(q) || 1) - 1, 0), QUESTIONS.length - 1);
  const [answers, setAnswers] = useState(() => QUESTIONS.map(() => ''));
  const [voiceMode, setVoiceMode] = useState(false);
  const answer = answers[index];
  const setAnswer = (v) => setAnswers((a) => a.map((x, i) => (i === index ? v : x)));
  const voice = useVoice((text) => setAnswers((a) => a.map((x, i) => (i === index ? `${x} ${text}`.trim() : x))));
  const last = index === QUESTIONS.length - 1;

  const next = () => (last ? navigate('/profile') : navigate(`/badge-quiz/${index + 2}`));
  const back = () => (index === 0 ? navigate(-1) : navigate(`/badge-quiz/${index}`));

  return (
    <FocusLayout
      exitTo="/home"
      className="max-w-[672px] md:pt-2"
      header={
        <header className="flex h-16 items-center gap-4 px-4 md:hidden">
          <button
            type="button"
            aria-label="Back"
            onClick={back}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconBack} alt="" width={24} height={24} />
          </button>
          <ProgressBar value={(index + 1) / QUESTIONS.length} className="mx-auto w-full max-w-[184px]" />
          <button type="button" onClick={next} className="text-[15px] font-semibold text-brand">
            Next
          </button>
        </header>
      }
    >
      <img src={badge} alt="Responsible Parent badge" className="mx-auto hidden size-40 object-contain md:block" />

      <div className="mt-5 flex flex-col gap-[18px]">
        <div className="hidden items-center gap-3 md:flex">
          <p className="flex-1 text-sm font-medium text-brand">
            Question {index + 1} of {QUESTIONS.length}
          </p>
          <p className="text-[13px] text-subtle">Earn your Responsible Parent badge</p>
        </div>
        <div className="hidden md:block">
          <Segments total={QUESTIONS.length} current={index} />
        </div>

        <h1
          className={cn(
            'text-[22px] leading-snug font-semibold text-ink md:text-left md:text-[28px]',
            voiceMode && 'text-center'
          )}
        >
          {QUESTIONS[index]}
        </h1>

        {voiceMode ? (
          /* Mobile voice-answer mode (1490:2968) */
          <div className="relative flex min-h-[420px] flex-col items-center justify-center md:min-h-[240px]">
            <div className="pointer-events-none absolute inset-x-[-16px] bottom-[-40px] h-[260px] bg-[radial-gradient(ellipse_at_bottom,rgba(206,44,44,0.28),transparent_70%)]" />
            <p className="relative px-4 text-center text-lg text-[#9ca3af]">
              {answer || (voice.listening ? 'Listening…' : 'Tap the mic and answer out loud')}
            </p>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setVoiceMode(false)}
                className="rounded-full bg-white/90 px-5 py-3 text-[15px] font-medium text-ink shadow-sm"
              >
                Type instead
              </button>
              <button
                type="button"
                aria-label={voice.listening ? 'Stop recording' : 'Start recording'}
                onClick={voice.toggle}
                disabled={!voice.supported}
                className="flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg disabled:opacity-50"
              >
                {voice.listening ? <Square className="size-5 fill-white" /> : <Mic className="size-6" />}
              </button>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer…"
              aria-label="Your answer"
              className="h-[180px] w-full resize-none rounded-xl border border-[#d1d1d1] px-4 py-3.5 text-base leading-6 text-ink outline-none placeholder:text-[#9ca3af] focus:border-ink"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setVoiceMode(true);
                  if (!voice.listening) voice.toggle();
                }}
                className="flex items-center gap-2 rounded-full bg-[#fceeed] py-2.5 pr-4 pl-3.5 text-sm font-medium text-brand"
              >
                <span className={cn('size-2.5 rounded-full bg-brand', voice.listening && 'animate-pulse')} />
                Answer with your voice
              </button>
              <span className="flex-1" />
              <p className="text-[13px] text-subtle">No AI-generated answers, please.</p>
            </div>
          </>
        )}

        <div className="hidden gap-3 md:flex">
          <Button variant="ghost" size="pill-lg" onClick={back}>
            Back
          </Button>
          <Button size="pill-lg" className="flex-1" onClick={next} disabled={!answer.trim()}>
            {last ? 'Finish' : 'Next question'}
          </Button>
        </div>
        {!voiceMode && (
          <Button size="pill-lg" className="w-full md:hidden" onClick={next} disabled={!answer.trim()}>
            {last ? 'Finish' : 'Next question'}
          </Button>
        )}
      </div>
    </FocusLayout>
  );
}
