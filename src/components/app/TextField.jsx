import { useId } from 'react';
import { cn } from '@/lib/utils';

/*
 * Text Field — Filled state (Figma 1279:35): 56px box, label floats above the value.
 */
export default function TextField({ label, className, inputClassName, ...props }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex h-14 cursor-text flex-col justify-center gap-0.5 rounded-xl border border-[#d1d1d1] px-4 py-1.5 focus-within:border-ink',
        className
      )}
    >
      <span className="text-xs leading-4 font-medium text-[#9ca3af]">{label}</span>
      <input
        id={id}
        className={cn('w-full bg-transparent text-base leading-[22px] text-black outline-none', inputClassName)}
        {...props}
      />
    </label>
  );
}
