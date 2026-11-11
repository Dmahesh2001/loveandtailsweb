import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import HomeFeed from './HomeFeed';
import illustration from '@/assets/figma/onboarding/kyc-phone.png';

/*
 * Permissions — Figma 1495:13056 (1440) / 1495:13112 (768) / 1495:13163 (390).
 * "Notifications primer" over Home. "Turn on notifications" triggers the real
 * browser permission prompt (drawn in Figma as "Browser prompt (after Turn on)").
 */
export default function Permissions() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const done = () => navigate('/home');

  const turnOn = async () => {
    if (typeof Notification === 'undefined') return done();
    try {
      const result = await Notification.requestPermission();
      setStatus(result);
      if (result !== 'denied') done();
    } catch {
      done();
    }
  };

  return (
    <>
      <HomeFeed />
      <Dialog open onOpenChange={(o) => !o && done()}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col items-center gap-0 rounded-3xl border-0 px-7 pt-7 pb-6 text-center sm:max-w-[400px]"
        >
          <img src={illustration} alt="" className="size-40 object-contain" />
          <DialogTitle className="mt-3.5 text-2xl font-semibold text-ink">Never miss a match</DialogTitle>
          <DialogDescription className="mt-3 text-[15px] text-subtle">
            Get a ping when an adopter replies, a pet you saved is still looking, or your application moves forward.
          </DialogDescription>
          {status === 'denied' && (
            <p className="mt-3 text-[13px] text-brand">
              Notifications are blocked. You can turn them on from your browser’s site settings.
            </p>
          )}
          <Button size="pill-lg" className="mt-3.5 w-full" onClick={turnOn}>
            Turn on notifications
          </Button>
          <Button variant="ghost" size="pill-lg" className="mt-3.5 w-full" onClick={done}>
            Not now
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
