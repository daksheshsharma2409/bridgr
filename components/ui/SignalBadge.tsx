import { cn } from "@/lib/utils";

export type SignalStatus = "open" | "flow" | "offline" | "quest" | "sos";

interface SignalBadgeProps {
    status: SignalStatus;
    className?: string;
    showText?: boolean;
}

const statusConfig = {
    open: {
        color: "bg-online",
        text: "Open for Help",
        dotClass: "animate-pulse",
    },
    flow: {
        color: "bg-yellow-400",
        text: "In Flow (DND)",
        dotClass: "",
    },
    offline: {
        color: "bg-gray-500",
        text: "Offline",
        dotClass: "opacity-50",
    },
    quest: {
        color: "bg-primary",
        text: "In Quest",
        dotClass: "",
    },
    sos: {
        color: "bg-alert",
        text: "SOS Mode",
        dotClass: "animate-ping",
    },
};

export function SignalBadge({
    status,
    className,
    showText = false,
}: SignalBadgeProps) {
    const config = statusConfig[status];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div
                className={cn(
                    "h-3.5 w-3.5 border-[1.5px] border-border",
                    config.color,
                    config.dotClass,
                )}
                style={{ borderRadius: "50%" }}
            />
            {showText && (
                <span className="text-sm font-heading font-bold text-text">
                    {config.text}
                </span>
            )}
        </div>
    );
}
