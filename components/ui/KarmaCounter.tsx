"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function KarmaCounter({ karma, className }: { karma: number, className?: string }) {
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
    <div className={cn("relative inline-flex items-center gap-1.5 font-heading font-bold text-karma", className)}>
      <Coins className="w-5 h-5 text-karma" />
      <span className="text-xl">{karma}</span>
      <AnimatePresence>
        {diff > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -25 }}
            className="absolute -right-6 top-0 text-sm text-karma font-bold bg-background/80 px-1 rounded"
          >
            +{diff}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
