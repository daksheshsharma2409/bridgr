"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, Map as MapIcon, Swords, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Lobby", icon: Home, highlightClass: "text-primary", bgClass: "bg-primary" },
  { href: "/map", label: "Spatial Hub", icon: MapIcon, highlightClass: "text-online", bgClass: "bg-online" },
  { href: "/quests", label: "Quests", icon: Swords, highlightClass: "text-quest", bgClass: "bg-quest" },
  { href: "/leaderboard", label: "Hall of Nerds", icon: Trophy, highlightClass: "text-karma", bgClass: "bg-karma" },
  { href: "/profile", label: "Chamber", icon: User, highlightClass: "text-alert", bgClass: "bg-alert" },
];

export function FullScreenMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });

    // Fresh animation: Sleek slide down from the top 
    tl.current.to(container.current, {
      y: "0%",
      duration: 0.5,
      ease: "power3.out"
    });

    // Orbs fade and float in
    tl.current.from(".menu-orb", {
      scale: 0.5,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.2)"
    }, "-=0.3");

    // Menu items slide up with slight scaling
    tl.current.from(".menu-item-wrap", {
      y: 40,
      scale: 0.95,
      opacity: 0,
      stagger: 0.06,
      duration: 0.45,
      ease: "back.out(1.5)"
    }, "-=0.4");

    gsap.set(container.current, { y: "-100%" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      tl.current?.play();
    } else {
      document.body.style.overflow = "auto";
      tl.current?.reverse();
    }
  }, [isOpen]);

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-2xl flex flex-col justify-center items-start pl-8 md:pl-24 pointer-events-none overflow-hidden -translate-y-full"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* Colorful Atmospheric Background Elements */}
      <div className="menu-orb absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
      <div className="menu-orb absolute bottom-0 left-10 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-quest/20 rounded-full blur-[100px] translate-y-1/4" />
      <div className="menu-orb absolute top-1/2 right-1/4 w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] bg-alert/15 rounded-full blur-[80px]" />

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-[101]"
      >
        <X className="w-8 h-8 text-white" />
      </button>

      <div className="flex flex-col gap-6 md:gap-8 items-start w-full relative z-10 w-max">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              href={item.href} 
              key={item.href}
              onClick={onClose}
              className="menu-item-wrap group flex items-center gap-6 md:gap-8 cursor-pointer"
            >
              <div className={`p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:${item.bgClass} group-hover:text-black shadow-lg`}>
                 <item.icon className={`w-8 h-8 md:w-12 md:h-12 ${isActive ? item.highlightClass : "text-white"} transition-colors group-hover:text-black`} />
              </div>
              <span className={`font-serif text-5xl md:text-[5.5rem] leading-none font-black uppercase tracking-tighter transition-all duration-300 group-hover:translate-x-4 ${isActive ? item.highlightClass : 'text-white'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="absolute bottom-10 left-8 md:left-24 flex gap-8 font-mono text-xs md:text-sm text-muted uppercase tracking-widest z-10">
        <span className="hover:text-primary transition-colors cursor-pointer">Supabase Auth</span>
        <span className="hover:text-primary transition-colors cursor-pointer">Terminal</span>
      </div>
    </div>
  );
}
