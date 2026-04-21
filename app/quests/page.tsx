"use client";

import { QuestCard } from "@/components/ui/QuestCard";
import { Plus } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { initializeMockData } from "@/lib/mockDataGenerator";

export default function QuestsBoard() {
  const { quests, joinQuest, createQuest } = useMockData();
  const container = useRef<HTMLDivElement>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [partySize, setPartySize] = useState(3);
  const [skillInput, setSkillInput] = useState("");
  const seedSkills = initializeMockData().initialUsers[0].superpowers;

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

  const skillsNeeded = useMemo(() => {
    const parsed = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return parsed.map((name, idx) => ({
      name,
      emoji: seedSkills[idx % seedSkills.length]?.emoji ?? "⚡",
      color: seedSkills[idx % seedSkills.length]?.color ?? "border-primary text-primary bg-primary/10",
    }));
  }, [seedSkills, skillInput]);

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    createQuest({
      title: title.trim(),
      description: description.trim(),
      partySize,
      skillsNeeded: skillsNeeded.length ? skillsNeeded : seedSkills.slice(0, 2),
    });
    setTitle("");
    setDescription("");
    setPartySize(3);
    setSkillInput("");
    setShowComposer(false);
  };

  return (
    <div ref={container} className="space-y-4 md:space-y-6 max-w-3xl mx-auto pb-6 md:pb-10">
      <div className="flex justify-between items-end mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text tracking-tight uppercase">Quest Board</h2>
          <p className="text-sm text-quest mt-1 font-medium select-none">Active projects and open parties.</p>
        </div>
        <button
          onClick={() => setShowComposer((v) => !v)}
          className="bg-quest hover:bg-quest/90 text-black px-4 py-2 rounded-button text-sm font-heading font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]"
        >
          <Plus className="w-4 h-4" /> New Quest
        </button>
      </div>
      {showComposer && (
        <form onSubmit={handleCreateQuest} className="bg-card border border-border-subtle rounded-3xl p-4 md:p-5 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quest title" className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-sm text-text" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs to be built?" className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-sm text-text min-h-[88px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Needed skills (comma separated)" className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-sm text-text" />
            <input type="number" min={2} max={8} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-sm text-text" />
          </div>
          <button type="submit" className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-heading font-bold">Create Quest</button>
        </form>
      )}

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
