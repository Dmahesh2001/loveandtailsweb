import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import iconChevronDown from '@/assets/figma/shell/icon-chevron-down.svg';

/*
 * Text Field, Filled state with trailing chevron (Figma 1279:35) used as a select:
 * 56px box, 12px floating label, 16px value.
 */
export default function SelectField({ label, value, onChange, options, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          'h-14! w-full items-center gap-3 rounded-xl border-[#d1d1d1] px-4 py-1.5 text-left shadow-none [&>svg]:hidden',
          className
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-xs leading-4 font-medium text-[#9ca3af]">{label}</span>
          <span className="truncate text-base leading-[22px] text-black">
            <SelectValue placeholder="Select" />
          </span>
        </span>
        <img src={iconChevronDown} alt="" width={20} height={20} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
