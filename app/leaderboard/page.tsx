"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Trophy } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import Link from "next/link";

const RANK_TITLES: [number, string][] = [
  [0, "Noob"],
  [10, "2 Brain Cells Left"],
  [50, "Still Loading..."],
  [150, "NPC Escaped"],
  [300, "Main Character"],
  [500, "Keyboard Warrior"],
  [750, "Gigabrain"],
  [1000, "Try Hard 🔥"],
];

function getRankTitle(karma: number) {
  let title = RANK_TITLES[0][1];
  for (const [threshold, name] of RANK_TITLES) {
    if (karma >= threshold) title = name;
  }
  return title;
}

function KarmaCount({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.innerText = Math.round(obj.val).toLocaleString();
      },
    });
  }, [target]);
  return <span ref={ref}>0</span>;
}

export default function HallOfNerds() {
  const { users } = useMockData();
  const [activeTab, setActiveTab] = useState("Weekly");

  const sorted = [...users].sort((a, b) => b.karma - a.karma);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 20);
  const currentUser = users[0];
  const currentUserRank = sorted.findIndex(u => u.id === currentUser.id) + 1;

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-8">
      <section className="rounded-3xl border border-border-subtle bg-card p-4 md:p-6 text-center">
        <Trophy className="w-10 h-10 md:w-14 md:h-14 text-karma mx-auto mb-2 md:mb-3" />
        <h2 className="text-2xl md:text-4xl font-heading font-black text-text tracking-tight uppercase">Hall of Nerds</h2>
        <p className="text-muted mt-1 font-mono text-xs md:text-sm">Top contributors ranked by karma.</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 justify-center pb-2">
        {["Weekly", "Monthly", "All-Time"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-pill text-sm font-heading font-bold transition-all ${
              activeTab === tab
                ? "bg-karma text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                : "bg-card text-muted hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        {[top3[1], top3[0], top3[2]].map((user, podiumIdx) => {
          if (!user) return null;
          const rankDisplay = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
          const isFirst = rankDisplay === 1;
          return (
            <Link key={user.id} href={`/profile/${user.username}`}>
            <div
              className={`flex flex-col items-center p-3 md:p-4 rounded-2xl border text-center cursor-pointer hover:-translate-y-0.5 transition-all ${
                isFirst
                  ? "border-karma/50 bg-karma/10 shadow-[0_0_30px_rgba(234,179,8,0.2)] order-2"
                  : "border-border-subtle bg-card order-1"
              } ${rankDisplay === 2 ? "order-1" : rankDisplay === 3 ? "order-3" : ""}`}
            >
              <div className={`text-2xl mb-1 ${isFirst ? "text-karma" : "text-muted"} font-heading font-black`}>
                {isFirst ? "👑" : rankDisplay === 2 ? "🥈" : "🥉"}
              </div>
              <div className="w-12 h-12 rounded-full bg-background border border-border-subtle flex items-center justify-center text-2xl mb-2">
                {user.avatarChar}
              </div>
              <p className={`font-heading font-bold text-sm ${isFirst ? "shimmer-gold" : "text-text"} truncate w-full`}>
                {user.name.split(" ")[0]}
              </p>
              <p className="font-mono text-[10px] text-muted">@{user.username}</p>
              <div className={`mt-2 font-heading font-black text-lg ${isFirst ? "text-karma" : "text-muted"}`}>
                <KarmaCount target={user.karma} />
              </div>
            </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center p-4 rounded-xl border border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(255,77,0,0.1)] mb-2">
        <div className="w-8 font-heading font-black text-xl text-primary text-center">#{currentUserRank}</div>
        <div className="mx-4 w-10 h-10 rounded-full border border-border-subtle bg-background flex items-center justify-center text-xl">{currentUser.avatarChar}</div>
        <div className="flex-1">
          <div className="font-heading font-bold text-sm">{currentUser.name} <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase text-black ml-1">You</span></div>
          <div className="font-mono text-xs text-muted">@{currentUser.username} • {getRankTitle(currentUser.karma)}</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-heading font-black text-karma text-xl"><KarmaCount target={currentUser.karma} /></span>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Karma</span>
        </div>
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {rest.map((user, i) => {
          const rank = i + 4;
          return (
            <Link key={user.id} href={`/profile/${user.username}`}>
            <div className="flex items-center p-2.5 md:p-3 rounded-xl border border-border-subtle bg-card hover:bg-background/50 transition-all cursor-pointer">
              <div className="w-8 font-heading font-black text-base text-muted text-center">#{rank}</div>
              <div className="mx-3 w-9 h-9 rounded-full border border-border-subtle bg-background flex items-center justify-center text-lg">{user.avatarChar}</div>
              <div className="flex-1">
                <div className="font-heading font-bold text-sm text-text">{user.name}</div>
                <div className="font-mono text-[10px] text-muted">@{user.username} • {getRankTitle(user.karma)}</div>
              </div>
              <div className="font-heading font-black text-karma">
                <KarmaCount target={user.karma} />
              </div>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
