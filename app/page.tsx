"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { SignalBadge } from "@/components/ui/SignalBadge";
import { MessageSquare, Terminal, Zap, Ghost } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import { cn } from "@/lib/utils";

export default function Lobby() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { feed, users, addFeedItem } = useMockData();
  const [newPost, setNewPost] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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
      // Text scramble effect on the title
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
      const original = "THE LOBBY";
      let iteration = 0;
      const interval = setInterval(() => {
        if (!titleRef.current) { clearInterval(interval); return; }
        titleRef.current.innerText = original
          .split("")
          .map((letter, i) => {
            if (i < iteration) return original[i];
            return letter === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        if (iteration >= original.length) clearInterval(interval);
        iteration += 0.5;
      }, 30);

      gsap.from(".header-anim", {
        opacity: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(".feed-item", {
        opacity: 0,
        y: 50,
        stagger: 0.07,
        duration: 0.7,
        ease: "back.out(1.4)",
        clearProps: "all"
      });

      // Glow orb follow mouse on discover rail
      const rail = document.getElementById("discover-rail");
      if (rail && glowRef.current) {
        rail.addEventListener("mousemove", (e) => {
          const rect = rail.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          gsap.to(glowRef.current, { x: x - 60, y: y - 60, duration: 0.3, ease: "power2.out" });
        });
      }
    }, container);
    return () => ctx.revert();
  }, []);

  const feedVariants = {
    initial: { opacity: 0, x: 60, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, damping: 20, stiffness: 200 } },
    exit: { opacity: 0, x: -40, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div ref={container} className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="header-anim flex justify-between items-end mb-6">
        <div>
          <h2
            ref={titleRef}
            className="text-3xl font-heading font-black text-text tracking-tight uppercase"
          >
            THE LOBBY
          </h2>
          <p className="text-sm font-mono text-primary mt-1">Campus heartbeat • 42 Nerds Online</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-full border border-border-subtle text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-background/50 transition-colors shadow-sm">
          Signal: <SignalBadge status="open" showText={true} />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="header-anim flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Skills", "Quests", "Events", "Ghost Mode"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-sm font-heading font-bold transition-all ${
              activeFilter === filter 
                ? "bg-primary text-black shadow-[0_0_15px_var(--color-primary)]" 
                : "bg-card border border-border-subtle text-muted hover:text-text"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Assemble Action */}
      <div className="header-anim grid grid-cols-2 gap-3 mb-8">
        <button className="bg-card hover:bg-card/80 transition-all p-4 rounded-xl border border-border-subtle flex flex-row items-center justify-center gap-3 text-text font-heading font-bold hover:shadow-[0_0_20px_var(--color-primary)] group">
          <Terminal className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          Assemble the Nerds
        </button>
        <button className="bg-card hover:bg-card/80 transition-all p-4 rounded-xl border border-border-subtle flex flex-row items-center justify-center gap-3 text-text font-heading font-bold hover:shadow-[0_0_20px_var(--color-karma)] group">
          <Ghost className="w-5 h-5 text-muted group-hover:text-karma group-hover:scale-110 transition-all" />
          Ghost Mode
        </button>
      </div>

      {/* Discover Nerds Rail — with tracking glow orb */}
      <div className="header-anim space-y-3 mb-8">
        <h3 className="text-sm font-heading font-bold text-muted uppercase tracking-wider px-1">⚡ Discover Nerds</h3>
        <div
          id="discover-rail"
          className="relative flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        >
          {/* Glow orb */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute w-[120px] h-[120px] rounded-full opacity-20 blur-[40px] z-0"
            style={{ background: "var(--color-primary)", top: 0, left: 0 }}
          />
          {users.slice(1, 14).map((user) => (
            <Link key={user.id} href={`/profile/${user.username}`} className="relative z-10">
              <div className="min-w-[130px] h-full bg-card hover:bg-background/50 transition-all border border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer snap-start group">
                <div className="w-14 h-14 bg-background border border-border-subtle rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform relative">
                  {user.avatarChar}
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card",
                    user.signal === "open" ? "bg-online" : user.signal === "flow" ? "bg-alert" : "bg-gray-500"
                  )} />
                </div>
                <div className="text-center w-full">
                  <p className="font-heading font-bold text-xs text-text truncate w-full">{user.name.split(" ")[0]}</p>
                  <p className="font-mono text-[10px] text-primary truncate w-full">@{user.username}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Post Form */}
      <motion.form
        onSubmit={handlePost}
        className="header-anim flex flex-col relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Broadcast a blocker to the campus..."
          className="w-full bg-card border border-border-subtle rounded-card px-4 pt-4 pb-12 text-sm text-text placeholder:text-muted outline-none focus:border-primary transition-all shadow-inner resize-none min-h-[100px]"
        />
        <button
          type="submit"
          disabled={!newPost.trim()}
          className="absolute right-3 bottom-3 bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:hover:bg-primary text-black px-5 py-2 rounded-lg text-sm font-heading font-bold transition-all"
        >
          Post Request
        </button>
      </motion.form>

      {/* Feed List with AnimatePresence */}
      <div className="space-y-4 pt-2">
        <AnimatePresence>
          {feed.map((item) => {
            if (item.type === "request") {
              return (
                <motion.div
                  key={item.id}
                  variants={feedVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="feed-item bg-card border border-border-subtle rounded-card p-5 shadow-lg relative max-w-full overflow-hidden group text-text"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-alert shadow-[0_0_15px_var(--color-alert)] group-hover:shadow-[0_0_25px_var(--color-alert)] transition-all" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-heading font-bold text-xs border border-border-subtle">
                      {item.author.avatarChar}
                    </div>
                    <div>
                      <span className="font-heading font-bold tracking-tight text-sm">{item.author.name}</span>
                      <span className="text-muted font-mono text-xs ml-2">{item.author.handle} • {item.timeAgo}</span>
                    </div>
                    {item.tags?.map((t) => (
                      <div key={t} className="ml-auto bg-alert/10 text-alert text-[10px] uppercase font-black px-2 py-1 rounded">{t}</div>
                    ))}
                  </div>
                  <p className="text-sm mb-4 leading-relaxed text-text/90">{item.content}</p>
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {item.skills.map((s, i) => (
                        <span key={i} className="text-xs border border-primary/40 bg-primary/10 text-primary px-2 py-1 rounded font-heading font-bold uppercase">
                          {s.emoji} {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="mt-2 w-full bg-card hover:bg-background/50 border border-border-subtle text-text py-2.5 rounded-xl font-heading font-bold flex justify-center items-center gap-2 transition-all">
                    <MessageSquare className="w-4 h-4" /> Offer Help
                  </button>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
