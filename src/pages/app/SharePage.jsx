import { useNavigate } from 'react-router-dom';
import ShareDialog from '@/components/app/ShareDialog';
import HomeFeed from './HomeFeed';

/* /share — the Share sheet over the Home feed, as drawn in Figma (1493:3285). */
export default function SharePage() {
  const navigate = useNavigate();
  return (
    <>
      <HomeFeed />
      <ShareDialog open onOpenChange={(o) => !o && navigate(-1)} />
    </>
  );
}
