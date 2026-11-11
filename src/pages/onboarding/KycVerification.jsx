import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import FocusLayout from '@/components/onboarding/FocusLayout';
import kycPhone from '@/assets/figma/onboarding/kyc-phone.png';
import iconCameraWhite from '@/assets/figma/shell/icon-camera-white.svg';
import iconBack from '@/assets/figma/shell/icon-back.svg';

/* 18 · KYC verification — Figma 1491:2937 (1440) / 1491:2987 (768) / 1491:3037 (390) */

const STEPS = [
  { title: 'Take a live selfie', detail: 'Look at the camera in good light' },
  { title: 'Verify your pet', detail: 'A short video of you with your pet' },
  { title: 'Add an ID', detail: 'Aadhaar, passport or driving licence' },
];

// QR code mock from the design (1491:2970): 10px modules on a 64px tile.
const QR = [
  [6, 6], [6, 37.5], [6, 48], [16.5, 27], [16.5, 37.5], [27, 16.5], [27, 27],
  [37.5, 6], [37.5, 16.5], [37.5, 48], [48, 6], [48, 37.5], [48, 48],
];

function CameraPreview({ onClose, onCapture }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError('We couldn’t access your camera. Check your browser permissions and try again.'));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-3xl bg-black">
        {error ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">{error}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="size-full -scale-x-100 object-cover" />
        )}
        <div className="pointer-events-none absolute inset-[18%] rounded-[50%] border-2 border-white/70" />
      </div>
      <div className="flex w-full gap-3">
        <Button variant="ghost" size="pill-lg" onClick={onClose}>
          Cancel
        </Button>
        <Button size="pill-lg" className="flex-1" onClick={onCapture} disabled={Boolean(error)}>
          Capture
        </Button>
      </div>
    </div>
  );
}

export default function KycVerification() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [camera, setCamera] = useState(false);
  const done = current >= STEPS.length;

  return (
    <FocusLayout
      className="max-w-[492px] items-center pt-4 md:pt-0"
      header={
        <header className="flex h-16 items-center px-4 md:hidden">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full border border-[#e8e8eb] bg-white shadow-[0_2px_5px_rgba(13,18,38,0.08)]"
          >
            <img src={iconBack} alt="" width={24} height={24} />
          </button>
        </header>
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <img src={kycPhone} alt="" className="size-[180px] object-contain md:size-[220px]" />
        <h1 className="text-center text-[26px] font-semibold text-ink md:text-[30px]">
          {done ? 'You’re verified!' : 'Let’s make sure you’re you'}
        </h1>
        <p className="text-center text-[15px] text-subtle">
          {done
            ? 'Your verified badge now shows on your profile and adoption listings.'
            : 'Verified profiles get 3× more adoption replies. It takes about 2 minutes.'}
        </p>

        {camera ? (
          <CameraPreview
            onClose={() => setCamera(false)}
            onCapture={() => {
              setCamera(false);
              setCurrent((c) => c + 1);
            }}
          />
        ) : (
          <>
            <ol className="flex w-full flex-col rounded-[20px] bg-[#f6f6f6] px-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className={cn('flex items-center gap-3 py-3.5', i > 0 && 'border-t border-border')}>
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                      i === current ? 'bg-brand text-white' : 'bg-white text-icon',
                      i < current && 'bg-success text-white'
                    )}
                  >
                    {i < current ? '✓' : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">{s.title}</span>
                    <span className="block text-[13px] text-subtle">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            {done ? (
              <Button size="pill-lg" className="w-full" onClick={() => navigate('/profile')}>
                Go to my profile
              </Button>
            ) : (
              <Button size="pill-lg" className="w-full" onClick={() => setCamera(true)}>
                <img src={iconCameraWhite} alt="" width={20} height={20} />
                <span className="md:hidden">Open camera</span>
                <span className="hidden md:inline">Use this computer’s camera</span>
              </Button>
            )}

            <div className="hidden w-full items-center gap-3.5 rounded-2xl border border-border px-4 py-3.5 md:flex">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white" aria-hidden="true">
                {QR.map(([x, y]) => (
                  <span key={`${x}-${y}`} className="absolute size-2.5 bg-ink" style={{ left: x, top: y }} />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink">Prefer your phone?</p>
                <p className="text-[13px] text-subtle">Scan to continue verification in the app</p>
              </div>
            </div>
          </>
        )}
      </div>
    </FocusLayout>
  );
}
