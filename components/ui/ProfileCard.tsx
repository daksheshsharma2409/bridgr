import { cn } from "@/lib/utils";
import { SignalBadge, SignalStatus } from "./SignalBadge";
import { SkillBadge } from "./SkillBadge";

export interface ProfileCardProps {
  displayName: string;
  username: string;
  status: SignalStatus;
  primaryCategoryColor: string; // Tailwind class like 'border-primary'
  skills: Array<{ name: string; emoji: string; color: string }>;
  karma: number;
  className?: string;
  onClick?: () => void;
}

export function ProfileCard({ displayName, username, status, primaryCategoryColor, skills, karma, className, onClick }: ProfileCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-card rounded-card p-4 border-l-4 overflow-hidden flex flex-col relative transition-all duration-200", 
        "shadow-lg border-l border-t border-b border-r-0 border-white/5",
        onClick && "cursor-pointer hover:border-l-8 hover:brightness-110",
        primaryCategoryColor,
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <div className="w-12 h-12 bg-background border border-white/10 rounded-full flex items-center justify-center font-heading text-lg font-bold">
              {displayName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-[2px]">
              <SignalBadge status={status} />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold leading-tight">{displayName}</h3>
            <p className="font-mono text-xs text-muted">@{username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-karma font-heading font-bold text-sm bg-karma/10 px-2 py-1 rounded-md border border-karma/20">
          <span>{karma}</span>
          <span className="text-xs">✨</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {skills.slice(0, 3).map((s, i) => (
          <SkillBadge key={i} name={s.name} emoji={s.emoji} categoryColorClass={s.color} />
        ))}
        {skills.length > 3 && (
          <span className="text-xs text-muted flex items-center px-1 font-mono">+{skills.length - 3}</span>
        )}
      </div>
    </div>
  );
}
