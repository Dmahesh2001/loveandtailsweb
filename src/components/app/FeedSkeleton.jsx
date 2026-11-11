import { cn } from '@/lib/utils';

/* Loading — Figma 1495:13238 (1440) / 1495:13316 (768) / 1495:13374 (390): skeleton of the Home feed. */
const Bone = ({ className }) => <div className={cn('animate-pulse bg-[#f6f6f6]', className)} />;

function PostBone() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Bone className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Bone className="h-3 w-40 rounded-md" />
          <Bone className="h-2.5 w-24 rounded-md" />
        </div>
      </div>
      <Bone className="h-[320px] rounded-2xl md:h-[448px]" />
      <Bone className="h-3 w-2/3 rounded-md" />
    </div>
  );
}

export default function FeedSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1036px] gap-[156px] px-4 pt-8 md:px-6" aria-busy="true" aria-label="Loading feed">
      <div className="flex w-full max-w-[560px] flex-col gap-8">
        <Bone className="h-14 rounded-2xl" />
        <PostBone />
        <PostBone />
      </div>
      <aside className="hidden w-[300px] shrink-0 flex-col gap-5 xl:flex">
        <Bone className="h-5 rounded-md" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Bone className="size-12 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Bone className="h-3 w-36 rounded-md" />
              <Bone className="h-2.5 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
