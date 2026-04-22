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
    const _navItems = [
        ...NAV_ITEMS,
        {
            href: `/profile/${currentUser.username}`,
            label: "Chamber",
            icon: User,
        },
    ];

    return (
        <div className="min-h-screen bg-bg text-text flex flex-col">
            <FullScreenMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            <header className="hidden md:flex fixed top-0 left-0 w-full h-24 px-6 md:px-12 bg-transparent z-[50] items-center justify-between">
                <Link href="/" className="group">
                    <h1 className="font-heading text-4xl md:text-6xl font-black text-text uppercase tracking-tighter hover:rotate-1 transition-transform duration-100">
                        BRIDGR
                    </h1>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <KarmaCounter karma={currentUser.karma} />
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="hidden md:flex group flex-col gap-3 p-3 hover:bg-muted/30 rounded-full transition-colors cursor-pointer"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        <div className="w-6 h-[3px] bg-text transition-all group-hover:w-5 group-hover:rotate-1" />
                        <div className="w-6 h-[3px] bg-text transition-all group-hover:w-5 group-hover:-rotate-1" />
                        <div className="w-6 h-[3px] bg-text transition-all group-hover:w-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 pt-4 md:pt-32 pb-20 md:pb-12 px-3 md:px-6 lg:px-12 max-w-7xl mx-auto w-full z-10">
                {children}
            </main>

            {/* Mobile Bottom Dock - Hand-Drawn Style */}
            <nav
                className="md:hidden fixed bottom-4 left-4 right-4 bg-card border-[3px] border-border py-3 px-2 z-[999] flex justify-center"
                style={{
                    borderRadius:
                        "255px 15px 225px 15px / 15px 225px 15px 255px",
                    boxShadow: "4px 4px 0px 0px #2d2d2d",
                }}
            >
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
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
                                    "flex flex-col items-center p-2 gap-1 cursor-pointer transition-all active:scale-95 touch-manipulation font-heading font-black",
                                    isActive
                                        ? "text-primary"
                                        : "text-text hover:text-primary hover:rotate-1",
                                )}
                                style={
                                    isActive
                                        ? {
                                              borderRadius:
                                                  "200px 30px 210px 20px / 20px 210px 30px 200px",
                                              backgroundColor: "#fff9c4",
                                          }
                                        : {}
                                }
                            >
                                <item.icon
                                    className={cn("w-5 h-5 transition-all")}
                                />
                                <span className="text-[10px] uppercase tracking-wider">
                                    {item.label}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
