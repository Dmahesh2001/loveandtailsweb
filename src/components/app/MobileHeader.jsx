import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import notificationsIcon from '@/assets/figma/shell/header-notifications.svg';
import messagesIcon from '@/assets/figma/shell/header-messages.svg';

/* Web / Mobile header (Figma 1475:153) — messages & notifications live here on mobile. */
export default function MobileHeader({ className }) {
  return (
    <header
      className={cn(
        'flex h-[60px] items-center border-b border-line bg-white pr-2 pl-5',
        className
      )}
    >
      <Link to="/home" className="flex-1 font-brand text-[22px] leading-normal text-brand">
        Love&amp;Tails
      </Link>
      <Link to="/notifications" aria-label="Notifications">
        <img src={notificationsIcon} alt="" width={48} height={48} />
      </Link>
      <Link to="/messages" aria-label="Messages">
        <img src={messagesIcon} alt="" width={48} height={48} />
      </Link>
    </header>
  );
}
