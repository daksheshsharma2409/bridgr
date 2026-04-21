import { cn } from "@/lib/utils";
import { Users, Flame } from "lucide-react";

export interface QuestCardProps {
  id?: string;
  title: string;
  description: string;
  skillsNeeded: Array<{ name: string; color: string; emoji: string }>;
  partySize: number;
  currentMembers: number;
  className?: string;
  onJoin?: (id: string) => void;
}

export function QuestCard({ id, title, description, skillsNeeded, partySize, currentMembers, className, onJoin }: QuestCardProps) {
  const isFull = currentMembers >= partySize;
  
  return (
    <div className={cn(
      "bg-card rounded-card p-4 border border-quest/30 shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)] relative overflow-hidden transition-all duration-200 hover:border-quest/60 hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.3)] cursor-pointer",
      className
    )}>
      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/40">
        <div 
          className="h-full bg-quest transition-all duration-500 rounded-r-full" 
          style={{ width: `${(currentMembers / partySize) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-start mb-2 mt-1">
        <h3 className="font-heading text-xl font-bold flex items-center gap-2 text-text">
          {title} <Flame className="w-4 h-4 text-quest" />
        </h3>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md border",
          isFull ? "bg-online/10 text-online border-online/20" : "bg-quest/10 text-quest border-quest/20"
        )}>
          <Users className="w-3.5 h-3.5" />
          {currentMembers}/{partySize}
        </div>
      </div>
      <p className="text-sm text-muted mb-4 line-clamp-2">{description}</p>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {skillsNeeded.map((s, i) => (
            <span key={i} className={cn("text-xs font-heading font-semibold px-2 py-0.5 rounded border border-border-subtle text-text bg-opacity-20", s.color)}>
              {s.emoji} {s.name}
            </span>
          ))}
        </div>
        {onJoin && !isFull && (
          <button 
            onClick={(e) => { e.stopPropagation(); id && onJoin(id); }}
            className="text-xs font-heading font-bold text-black bg-quest px-4 py-1.5 rounded-lg active:scale-95 transition-transform hover:bg-quest/80"
          >
            Join Party
          </button>
        )}
        {isFull && (
          <span className="text-xs font-heading font-bold text-muted border border-border-subtle px-4 py-1 rounded-lg">Party Full</span>
        )}
      </div>
    </div>
  );
}
