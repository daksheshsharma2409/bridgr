import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  name: string;
  categoryColorClass: string; 
  emoji?: string;
  className?: string;
}

export function SkillBadge({ name, categoryColorClass, emoji, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-sm font-heading font-semibold text-white",
        categoryColorClass,
        className
      )}
    >
      {emoji && <span>{emoji}</span>}
      {name}
    </span>
  );
}
