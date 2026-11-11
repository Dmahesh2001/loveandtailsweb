import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import HomeFeed from '@/pages/app/HomeFeed';
import ria from '@/assets/figma/settings/account-ria.png';
import oscar from '@/assets/figma/settings/account-oscar.png';
import shelter from '@/assets/figma/settings/account-shelter.png';
import iconClose from '@/assets/figma/shell/icon-close.svg';
import iconCheckWhite from '@/assets/figma/shell/icon-check-white.svg';
import iconPlus from '@/assets/figma/shell/icon-plus-20.svg';

/* Switch accounts — Figma 1493:2976 (1440 modal over Home) / 1493:3039 (768) / 1493:3100 (390) */

const ACCOUNTS = [
  { id: 'ria', handle: 'riamadrid', meta: 'Personal · 3 pets', avatar: ria },
  { id: 'oscar', handle: 'oscar.the.golden', meta: 'Pet profile', avatar: oscar },
  { id: 'shelter', handle: 'happytails.shelter', meta: 'Shelter · 2 new requests', avatar: shelter },
];

function AccountList({ onAdd }) {
  const [current, setCurrent] = useState('ria');
  return (
    <>
      <div role="radiogroup" aria-label="Accounts" className="flex flex-col gap-0.5 px-3 py-2">
        {ACCOUNTS.map((a) => {
          const selected = a.id === current;
          return (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setCurrent(a.id)}
              className={cn(
                'flex items-center gap-3 rounded-[14px] px-2 py-2.5 text-left transition-colors',
                selected ? 'bg-[#f6f6f6]' : 'hover:bg-black/[0.03]'
              )}
            >
              <img src={a.avatar} alt="" width={48} height={48} className="size-12 rounded-full" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-ink">{a.handle}</span>
                <span className="block truncate text-[13px] text-subtle">{a.meta}</span>
              </span>
              {selected ? (
                <span className="flex size-[22px] items-center justify-center rounded-full bg-brand">
                  <img src={iconCheckWhite} alt="" width={14} height={14} />
                </span>
              ) : (
                <span className="size-[22px] rounded-full border-2 border-[#eaeaeb]" />
              )}
            </button>
          );
        })}
      </div>
      <div className="px-5 pt-3 pb-5">
        <Button variant="outline-neutral" size="pill-lg" className="w-full border-[#d1d1d1]" onClick={onAdd}>
          <img src={iconPlus} alt="" width={20} height={20} />
          Add account
        </Button>
      </div>
    </>
  );
}

export default function SwitchAccounts() {
  const navigate = useNavigate();
  const desktop = useMediaQuery('(min-width: 768px)');
  const close = () => navigate('/home');
  const add = () => navigate('/login');

  const header = (Title, Description, Close) => (
    <div className="flex items-center border-b border-border py-3 pr-3 pl-5">
      <Title className="flex-1 text-[17px] font-semibold text-ink">Switch accounts</Title>
      <Description className="sr-only">Choose which account to use</Description>
      <Close aria-label="Close" className="flex size-10 items-center justify-center rounded-full bg-muted">
        <img src={iconClose} alt="" width={24} height={24} />
      </Close>
    </div>
  );

  return (
    <>
      <HomeFeed />
      {desktop ? (
        <Dialog open onOpenChange={(o) => !o && close()}>
          <DialogContent
            showCloseButton={false}
            className="gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:max-w-[400px]"
          >
            {header(DialogTitle, DialogDescription, DialogClose)}
            <AccountList onAdd={add} />
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open onOpenChange={(o) => !o && close()}>
          <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-3xl border-0 p-0">
            {header(SheetTitle, SheetDescription, SheetClose)}
            <AccountList onAdd={add} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
