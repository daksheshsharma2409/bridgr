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
                ease: "power2.out",
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
            color:
                seedSkills[idx % seedSkills.length]?.color ??
                "border-primary text-primary bg-primary/10",
        }));
    }, [seedSkills, skillInput]);

    const handleCreateQuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        createQuest({
            title: title.trim(),
            description: description.trim(),
            partySize,
            skillsNeeded: skillsNeeded.length
                ? skillsNeeded
                : seedSkills.slice(0, 2),
        });
        setTitle("");
        setDescription("");
        setPartySize(3);
        setSkillInput("");
        setShowComposer(false);
    };

    return (
        <div
            ref={container}
            className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-8"
        >
            <section
                className="bg-card border-[3px] border-border p-5 md:p-6"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "4px 4px 0px 0px #2d2d2d",
                }}
            >
                <div className="flex justify-between items-end mb-4 md:mb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-text tracking-tight uppercase">
                            Quest Board
                        </h2>
                        <p className="text-sm text-text/70 mt-2 font-sans">
                            Active projects and open parties.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowComposer((v) => !v)}
                        className="bg-primary hover:translate-x-0.5 hover:translate-y-0.5 text-text px-5 py-2.5 text-sm font-heading font-bold flex items-center gap-2 transition-all duration-75 border-[2px] border-border active:translate-x-1 active:translate-y-1"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        <Plus className="w-4 h-4" /> New Quest
                    </button>
                </div>
            </section>
            {showComposer && (
                <form
                    onSubmit={handleCreateQuest}
                    className="bg-card border-[3px] border-border p-5 md:p-6 space-y-3"
                    style={{
                        borderRadius:
                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                        boxShadow: "4px 4px 0px 0px #2d2d2d",
                    }}
                >
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Quest title"
                        className="w-full bg-muted/20 border-[2px] border-border px-4 py-2.5 text-sm text-text font-sans"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                        }}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What needs to be built?"
                        className="w-full bg-muted/20 border-[2px] border-border px-4 py-2.5 text-sm text-text font-sans min-h-[88px]"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                        }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Needed skills (comma separated)"
                            className="w-full bg-muted/20 border-[2px] border-border px-4 py-2.5 text-sm text-text font-sans"
                            style={{
                                borderRadius:
                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                            }}
                        />
                        <input
                            type="number"
                            min={2}
                            max={8}
                            value={partySize}
                            onChange={(e) =>
                                setPartySize(Number(e.target.value))
                            }
                            className="w-full bg-muted/20 border-[2px] border-border px-4 py-2.5 text-sm text-text font-sans"
                            style={{
                                borderRadius:
                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-text px-5 py-2.5 text-sm font-heading font-bold border-[2px] border-border transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        Create Quest
                    </button>
                </form>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {["Open Quests", "My Quests", "Gang Wars (Events)"].map(
                    (filter, i) => (
                        <button
                            key={filter}
                            className={`whitespace-nowrap px-5 py-2 text-sm font-heading font-bold transition-all duration-75 border-[2px] ${
                                i === 0
                                    ? "bg-primary text-text border-border active:translate-x-1 active:translate-y-1"
                                    : "bg-card border-border text-text hover:translate-x-0.5 hover:translate-y-0.5"
                            }`}
                            style={{
                                borderRadius:
                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                boxShadow:
                                    i === 0
                                        ? "2px 2px 0px 0px #2d2d2d"
                                        : "1px 1px 0px 0px #2d2d2d",
                            }}
                        >
                            {filter}
                        </button>
                    ),
                )}
            </div>

            <div className="space-y-4 pt-4">
                {quests.map((q) => (
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
                    <p className="text-muted text-center py-10 font-mono text-sm">
                        No active quests found in your vicinity.
                    </p>
                )}
            </div>
        </div>
    );
}
