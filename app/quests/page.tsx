"use client";

import { QuestCard } from "@/components/ui/QuestCard";
import { Plus } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export default function QuestsBoard() {
  const { quests, joinQuest } = useMockData();
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".quest-anim", {
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
    <div ref={container} className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-text tracking-tight uppercase">Quest Board</h2>
          <p className="text-sm text-quest mt-1 font-medium select-none">Active projects and open parties.</p>
        </div>
        <button className="bg-quest hover:bg-quest/90 text-black px-4 py-2 rounded-button text-sm font-heading font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">
          <Plus className="w-4 h-4" /> New Quest
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Open Quests", "My Quests", "Gang Wars (Events)"].map((filter, i) => (
          <button 
            key={filter} 
            className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-sm font-heading font-bold transition-colors ${
              i === 0 ? "bg-quest text-black" : "bg-card border border-border-subtle text-muted hover:text-text"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        {quests.map(q => (
          <div key={q.id} className="quest-anim">
            <QuestCard 
              id={q.id}
              title={q.title}
              description={q.description}
              partySize={q.partySize}
              currentMembers={q.currentMembers}
              skillsNeeded={q.skillsNeeded}
              onJoin={joinQuest}
            />
          </div>
        ))}
        {quests.length === 0 && (
          <p className="text-muted text-center py-10 font-mono text-sm">No active quests found in your vicinity.</p>
        )}
      </div>
    </div>
  );
}
