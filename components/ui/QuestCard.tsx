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

export function QuestCard({
    id,
    title,
    description,
    skillsNeeded,
    partySize,
    currentMembers,
    className,
    onJoin,
}: QuestCardProps) {
    const isFull = currentMembers >= partySize;

    return (
        <div
            className={cn(
                "bg-card border-[3px] border-border p-5 relative overflow-hidden transition-all duration-200 cursor-pointer group hover:translate-x-1 hover:translate-y-1",
                className,
            )}
            style={{
                borderRadius: "200px 30px 210px 20px / 20px 210px 30px 200px",
                boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
        >
            {/* Progress Bar Top - Dashed for sketch effect */}
            <div className="absolute top-0 left-0 w-full h-2 bg-muted/30 border-b-2 border-dashed border-border/50">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentMembers / partySize) * 100}%` }}
                />
            </div>

            <div className="flex justify-between items-start mb-3 mt-2">
                <h3 className="font-heading text-xl font-bold flex items-center gap-2 text-text">
                    {title}{" "}
                    <Flame className="w-4 h-4 text-primary animate-gentle-bounce" />
                </h3>
                <div
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-heading font-bold px-3 py-1 border-[2px]",
                        isFull
                            ? "bg-muted/30 text-text border-border"
                            : "bg-primary/10 text-text border-primary",
                    )}
                    style={{
                        borderRadius:
                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                >
                    <Users className="w-3.5 h-3.5" />
                    {currentMembers}/{partySize}
                </div>
            </div>
            <p className="text-sm font-sans text-text mb-4 line-clamp-2">
                {description}
            </p>

            <div className="flex justify-between items-end gap-3 flex-wrap">
                <div className="flex flex-wrap gap-2">
                    {skillsNeeded.map((s, i) => (
                        <span
                            key={i}
                            className={cn(
                                "text-xs font-heading font-semibold px-2 py-1 border-[2px] border-border text-text",
                            )}
                            style={{
                                borderRadius:
                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                            }}
                        >
                            {s.emoji} {s.name}
                        </span>
                    ))}
                </div>
                {onJoin && !isFull && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            id && onJoin(id);
                        }}
                        className="text-xs font-heading font-bold text-card bg-primary px-4 py-2 border-[2px] border-border active:translate-x-1 active:translate-y-1 transition-transform duration-75 hover:translate-x-0.5 hover:translate-y-0.5"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        Join Party
                    </button>
                )}
                {isFull && (
                    <span
                        className="text-xs font-heading font-bold text-text border-[2px] border-border px-4 py-1.5"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        Party Full
                    </span>
                )}
            </div>
        </div>
    );
}
