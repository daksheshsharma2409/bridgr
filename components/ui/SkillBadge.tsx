import { cn } from "@/lib/utils";

interface SkillBadgeProps {
    name: string;
    categoryColorClass: string;
    emoji?: string;
    className?: string;
}

export function SkillBadge({
    name,
    categoryColorClass,
    emoji,
    className,
}: SkillBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-heading font-bold text-text border-[2px] border-border bg-muted/20",
                className,
            )}
            style={{
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            }}
        >
            {emoji && <span>{emoji}</span>}
            {name}
        </span>
    );
}
