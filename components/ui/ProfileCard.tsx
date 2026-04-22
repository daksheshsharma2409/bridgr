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

export function ProfileCard({
    displayName,
    username,
    status,
    primaryCategoryColor,
    skills,
    karma,
    className,
    onClick,
}: ProfileCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-card border-[3px] border-border p-5 overflow-hidden flex flex-col relative transition-all duration-200",
                onClick &&
                    "cursor-pointer hover:translate-x-1 hover:translate-y-1",
                className,
            )}
            style={{
                borderRadius: "200px 30px 210px 20px / 20px 210px 30px 200px",
                boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <div className="w-12 h-12 bg-muted border-[2px] border-border rounded-full flex items-center justify-center font-heading text-lg font-bold text-text">
                            {displayName.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-[2px] border border-border">
                            <SignalBadge status={status} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-heading text-lg font-bold leading-tight text-text">
                            {displayName}
                        </h3>
                        <p className="font-sans text-xs text-text/60">
                            @{username}
                        </p>
                    </div>
                </div>
                <div
                    className="flex items-center gap-1 text-text font-heading font-bold text-sm bg-karma px-3 py-1 border-[2px] border-border"
                    style={{
                        borderRadius:
                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                >
                    <span>{karma}</span>
                    <span className="text-xs">✨</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                {skills.slice(0, 3).map((s, i) => (
                    <SkillBadge
                        key={i}
                        name={s.name}
                        emoji={s.emoji}
                        categoryColorClass={s.color}
                    />
                ))}
                {skills.length > 3 && (
                    <span className="text-xs text-text/60 flex items-center px-2 font-heading">
                        +{skills.length - 3}
                    </span>
                )}
            </div>
        </div>
    );
}
