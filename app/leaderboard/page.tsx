"use client";

import { Trophy, Medal, Star } from "lucide-react";
import Image from "next/image";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Arjun M.", alias: "codeking", karma: 1450, tag: "bg-violet-500", icon: "💻" },
  { rank: 2, name: "Sneha P.", alias: "pixelwitch", karma: 1240, tag: "bg-pink-500", icon: "🎨" },
  { rank: 3, name: "Rohan D.", alias: "logicgod", karma: 1024, tag: "bg-blue-500", icon: "📐" },
  { rank: 12, name: "You", alias: "bridgr_newbie", karma: 142, tag: "bg-orange-500", icon: "🧠" },
];

export default function HallOfNerds() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="flex flex-col items-center justify-center text-center py-6 mb-2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-karma/10 via-background to-background">
        <Trophy className="w-16 h-16 text-karma mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse" />
        <h2 className="text-4xl font-heading font-black text-white tracking-tight uppercase">Hall of Nerds</h2>
        <p className="text-muted mt-2 font-mono text-sm max-w-sm">"The legends who carry the campus on their backs."</p>
      </div>

      <div className="flex gap-2 justify-center pb-6">
        {["Weekly", "Monthly", "All-Time"].map((filter, i) => (
          <button 
            key={filter} 
            className={`px-6 py-2 rounded-pill text-sm font-heading font-bold transition-all ${
              i === 0 ? "bg-karma text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-card text-muted hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {LEADERBOARD_DATA.map((user) => {
          const isTop3 = user.rank <= 3;
          const isSelf = user.alias === "bridgr_newbie";

          return (
            <div 
              key={user.rank} 
              className={`flex items-center p-4 rounded-xl border transition-transform hover:scale-[1.02] ${
                isSelf ? "bg-white/10 border-white/20" : "bg-card border-white/5"
              } ${user.rank === 1 ? "border-karma/50 bg-karma/5 shadow-[0_0_20px_rgba(251,191,36,0.15)]" : ""}`}
            >
              <div className={`w-8 font-heading font-black text-xl text-center ${
                user.rank === 1 ? "text-karma drop-shadow-md" : 
                user.rank === 2 ? "text-gray-300" : 
                user.rank === 3 ? "text-amber-600" : "text-muted"
              }`}>
                {user.rank}
              </div>
              
              <div className="mx-4 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-background font-heading font-bold text-lg relative">
                {user.name.charAt(0)}
                {user.rank === 1 && <Trophy className="w-4 h-4 text-karma absolute -top-2 -right-1" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg">{user.name}</span>
                  {isSelf && <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">You</span>}
                </div>
                <div className="font-mono text-xs text-muted">@{user.alias}</div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-heading font-black text-karma text-xl drop-shadow-sm">{user.karma}</span>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Karma</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
