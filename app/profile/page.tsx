"use client";

import { SignalBadge } from "@/components/ui/SignalBadge";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { Settings, ShieldAlert } from "lucide-react";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Chamber() {
  const [signal, setSignal] = useState<"open" | "flow" | "offline">("open");
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".anim-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="max-w-2xl mx-auto pb-10 space-y-6">
      {/* Profile Header Block */}
      <div className="anim-item relative mb-16">
        <div className="h-32 bg-primary/20 bg-gradient-to-br from-primary/40 to-transparent rounded-t-2xl border border-white/5" />
        <div className="absolute -bottom-10 left-6 flex items-end gap-5">
          <div className="w-24 h-24 bg-card border-4 border-bg rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--primary)] backdrop-blur-md">
            <span className="text-4xl">😎</span>
          </div>
          <div className="pb-1">
            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-white drop-shadow-md">Dakshesh S.</h2>
            <p className="font-mono text-primary font-bold">@bridgr_newbie</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Signal Toggle Card */}
        <div className="anim-item bg-card border border-white/5 p-5 rounded-card shadow-lg">
          <h3 className="text-sm font-heading font-bold text-muted uppercase tracking-wider mb-4">Your Broadcast Signal</h3>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setSignal("open")}
              className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                signal === "open" ? "bg-online/20 border-online/50 text-white" : "border-white/5 hover:bg-white/5 text-muted"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${signal === "open" ? "bg-online shadow-[0_0_10px_var(--online)]" : "bg-gray-500"}`} />
              <span className="text-sm font-heading font-bold">Open</span>
            </button>
            <button 
              onClick={() => setSignal("flow")}
              className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                signal === "flow" ? "bg-yellow-400/20 border-yellow-400/50 text-white" : "border-white/5 hover:bg-white/5 text-muted"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${signal === "flow" ? "bg-yellow-400 shadow-[0_0_10px_#FACC15]" : "bg-gray-500"}`} />
              <span className="text-sm font-heading font-bold">In Flow</span>
            </button>
            <button 
              onClick={() => setSignal("offline")}
              className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                signal === "offline" ? "bg-gray-500/20 border-gray-500/50 text-white" : "border-white/5 hover:bg-white/5 text-muted"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${signal === "offline" ? "bg-gray-500" : "bg-gray-500"}`} />
              <span className="text-sm font-heading font-bold">Offline</span>
            </button>
          </div>
        </div>

        {/* Loadout (Skills) */}
        <div className="anim-item bg-card border border-white/5 p-5 rounded-card flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-heading font-bold text-muted uppercase tracking-wider mb-1">My Loadout (Skills)</h3>
            <button className="text-xs text-primary font-bold hover:underline">Edit</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <SkillBadge name="Framer Motion" emoji="🚀" categoryColorClass="bg-primary border border-white/10 text-black shadow-md" />
            <SkillBadge name="React.js" emoji="💻" categoryColorClass="bg-transparent border border-white/20 text-white" />
            <button className="px-3 py-1 rounded-pill border border-dashed border-white/20 text-muted text-sm font-heading hover:bg-white/5">
              + Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
