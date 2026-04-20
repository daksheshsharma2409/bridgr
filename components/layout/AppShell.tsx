"use client";

import { usePathname } from "next/navigation";
import { KarmaCounter } from "../ui/KarmaCounter";
import { FullScreenMenu } from "./FullScreenMenu";
import { useState } from "react";
import Link from "next/link";
import { Bell, Home, Map as MapIcon, Swords, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Lobby", icon: Home },
  { href: "/map", label: "Hub", icon: MapIcon },
  { href: "/quests", label: "Quests", icon: Swords },
  { href: "/leaderboard", label: "Rank", icon: Trophy },
  { href: "/profile", label: "Chamber", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="fixed top-0 left-0 w-full h-24 px-6 md:px-12 bg-transparent z-[50] flex items-center justify-between mix-blend-difference pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <h1 className="font-serif text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">BRIDGR</h1>
        </Link>
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          <KarmaCounter karma={142} />
          <button 
             onClick={() => setMenuOpen(true)}
             className="hidden md:flex group flex-col gap-2 p-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
             <div className="w-10 h-[2px] bg-white transition-all group-hover:w-8" />
             <div className="w-8 h-[2px] bg-white transition-all group-hover:w-10" />
          </button>
        </div>
      </header>

      <main className="flex-1 pt-24 md:pt-32 pb-24 md:pb-12 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto w-full z-10">
        {children}
      </main>

      {/* Mobile Bottom Dock */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-md border-t border-white/5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] px-2 z-[999]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
             const isActive = pathname === item.href;
             return (
               <a
                 key={item.href}
                 href={item.href}
                 className={cn(
                   "flex flex-col items-center p-2 gap-1 rounded-xl min-w-[60px] cursor-pointer transition-all active:scale-95 touch-manipulation",
                   isActive ? "text-primary scale-110" : "text-muted hover:text-white"
                 )}
               >
                 <item.icon className={cn("w-6 h-6 transition-all", isActive && "drop-shadow-[0_0_8px_var(--primary)]")} />
                 <span className="text-[10px] font-heading font-black uppercase tracking-widest mt-1">{item.label}</span>
               </a>
             );
          })}
        </div>
      </nav>
    </div>
  );
}
