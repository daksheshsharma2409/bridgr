"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function KarmaCounter({
    karma,
    className,
}: {
    karma: number;
    className?: string;
}) {
    const [prevKarma, setPrevKarma] = useState(karma);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        if (karma > prevKarma) {
            setDiff(karma - prevKarma);
            setPrevKarma(karma);
            const timer = setTimeout(() => setDiff(0), 4000);
            return () => clearTimeout(timer);
        } else if (karma < prevKarma) {
            setPrevKarma(karma);
        }
    }, [karma, prevKarma]);

    return (
        <div
            className={cn(
                "relative inline-flex items-center gap-2 font-heading font-bold text-text bg-karma px-4 py-2 border-[2px] border-border",
                className,
            )}
            style={{
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                boxShadow: "2px 2px 0px 0px #2d2d2d",
            }}
        >
            <Coins className="w-5 h-5 text-text" />
            <span className="text-base">{karma}</span>
            <AnimatePresence>
                {diff > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -25 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="absolute -top-8 right-0 text-sm font-bold bg-primary text-card px-2 py-1 border-[2px] border-border"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        +{diff}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
