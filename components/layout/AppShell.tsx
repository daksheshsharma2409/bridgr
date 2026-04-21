"use client";

import { usePathname } from "next/navigation";
import { KarmaCounter } from "../ui/KarmaCounter";
import { FullScreenMenu } from "./FullScreenMenu";
import { useState } from "react";
import Link from "next/link";
import { Home, Map as MapIcon, Swords, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useMockData } from "@/lib/MockDataContext";

const NAV_ITEMS = [
  { href: "/", label: "Lobby", icon: Home },
  { href: "/map", label: "Hub", icon: MapIcon },
  { href: "/quests", label: "Quests", icon: Swords },
  { href: "/leaderboard", label: "Rank", icon: Trophy },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useMockData();

  // Dynamically attach the profile link to the current user
  const _navItems = [...NAV_ITEMS, { href: `/profile/${currentUser.username}`, label: "Chamber", icon: User }];

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="hidden md:flex fixed top-0 left-0 w-full h-24 px-6 md:px-12 bg-transparent z-[50] items-center justify-between mix-blend-difference pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <h1 className="font-serif text-3xl md:text-5xl font-black text-text uppercase tracking-tighter">BRIDGR</h1>
        </Link>
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          <KarmaCounter karma={currentUser.karma} />
          <button 
             onClick={() => setMenuOpen(true)}
             className="hidden md:flex group flex-col gap-2 p-3 hover:bg-card/60 rounded-full transition-colors cursor-pointer"
          >
             <div className="w-10 h-[2px] bg-text transition-all group-hover:w-8" />
             <div className="w-8 h-[2px] bg-text transition-all group-hover:w-10" />
          </button>
        </div>
      </header>

      <main className="flex-1 pt-4 md:pt-32 pb-20 md:pb-12 px-3 md:px-6 lg:px-12 max-w-7xl mx-auto w-full z-10">
        {children}
      </main>

      {/* Mobile Bottom Dock */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-xl border-t border-border-subtle py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] px-2 z-[999]"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {_navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
              <a
                 key={item.href}
                href={item.href}
                onClick={(e) => {
                  // Use document-level navigation on mobile to bypass client-history patch issues.
                  e.preventDefault();
                  window.location.assign(item.href);
                }}
                 className={cn(
                  "flex flex-col items-center p-1.5 gap-0.5 rounded-xl cursor-pointer transition-all active:scale-95 touch-manipulation",
                  isActive ? "bg-background text-primary" : "text-muted hover:text-text"
                 )}
               >
                <item.icon className={cn("w-5 h-5 transition-all", isActive && "drop-shadow-[0_0_8px_var(--color-primary)]")} />
                <span className="text-[9px] font-heading font-black uppercase tracking-wider mt-0.5">{item.label}</span>
              </a>
             );
          })}
        </div>
      </nav>
    </div>
  );
}
