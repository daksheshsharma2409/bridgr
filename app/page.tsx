"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { QuestCard } from "@/components/ui/QuestCard";
import { SignalBadge } from "@/components/ui/SignalBadge";
import { Flame, MessageSquare, Terminal } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";

export default function Lobby() {
  const container = useRef<HTMLDivElement>(null);
  const { feed, addFeedItem } = useMockData();
  const [newPost, setNewPost] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    addFeedItem({
      type: "request",
      author: { name: "Dakshesh S.", handle: "@bridgr_newbie", avatarChar: "😎" },
      timeAgo: "Just now",
      content: newPost,
      skills: [],
      tags: ["NEW REQUEST"]
    });
    setNewPost("");
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation for header elements
      gsap.from(".header-anim", {
        opacity: 0,
        y: -15,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
      // Staggered entrance for feed items
      gsap.from(".feed-item", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.2)",
        clearProps: "all"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="header-anim flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-white tracking-tight uppercase">The Lobby</h2>
          <p className="text-sm font-mono text-primary mt-1">Campus heartbeat • 42 Nerds Online</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-full border border-white/5 text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors shadow-sm">
          Signal: <SignalBadge status="open" showText={true} />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="header-anim flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Skills", "Quests", "Events"].map((filter, i) => (
          <button 
            key={filter} 
            className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-sm font-heading font-bold transition-all ${
              i === 0 ? "bg-primary text-black shadow-[0_0_15px_var(--primary)]" : "bg-card border border-white/5 text-muted hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Fast Action Row */}
      <div className="header-anim grid grid-cols-1 gap-4">
        <button className="bg-card hover:bg-card/80 transition-all p-4 rounded-xl border border-white/5 flex flex-row items-center justify-center gap-3 text-white font-heading font-bold hover:shadow-[0_0_20px_var(--primary)] group">
          <Terminal className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          Assemble the Nerds
        </button>
      </div>

      {/* Create Post Form */}
      <form onSubmit={handlePost} className="header-anim flex flex-col relative mb-8">
        <textarea 
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Broadcast a blocker to the campus..."
          className="w-full bg-card border border-white/5 rounded-card px-4 pt-4 pb-12 text-sm text-white placeholder:text-muted outline-none focus:border-primary transition-all shadow-inner resize-none min-h-[100px]"
        />
        <button 
          type="submit"
          disabled={!newPost.trim()}
          className="absolute right-3 bottom-3 bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:hover:bg-primary text-black px-5 py-2 rounded-lg text-sm font-heading font-bold"
        >
          Post Request
        </button>
      </form>

      {/* Feed List */}
      <div className="space-y-4 pt-2">
        {feed.map((item) => {
          if (item.type === "request") {
            return (
              <div key={item.id} className="feed-item bg-card border border-white/5 rounded-card p-5 shadow-lg relative max-w-full overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-alert shadow-[0_0_15px_var(--alert)]" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-heading font-bold text-xs border border-white/10">{item.author.avatarChar}</div>
                  <div>
                    <span className="font-heading font-bold tracking-tight text-sm">{item.author.name}</span>
                    <span className="text-muted font-mono text-xs ml-2">{item.author.handle} • {item.timeAgo}</span>
                  </div>
                  {item.tags?.map(t => (
                    <div key={t} className="ml-auto bg-alert/10 text-alert text-[10px] uppercase font-black px-2 py-1 rounded">{t}</div>
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed text-white/90">{item.content}</p>
                {item.skills && item.skills.length > 0 && (
                  <div className="flex gap-2">
                    {item.skills.map((s, i) => (
                      <span key={i} className={`text-xs border border-primary/40 bg-primary/10 text-primary px-2 py-1 rounded font-heading font-bold uppercase`}>
                        {s.emoji} {s.name}
                      </span>
                    ))}
                  </div>
                )}
                <button className="mt-4 w-full bg-card hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-heading font-bold flex justify-center items-center gap-2 transition-all">
                  <MessageSquare className="w-4 h-4" /> Offer Help
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
