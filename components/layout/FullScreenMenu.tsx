"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, Map as MapIcon, Swords, Trophy, User } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";

const BASE_NAV_ITEMS = [
    {
        href: "/",
        label: "Lobby",
        icon: Home,
        highlightClass: "text-primary",
        bgClass: "bg-primary",
    },
    {
        href: "/map",
        label: "Spatial Hub",
        icon: MapIcon,
        highlightClass: "text-online",
        bgClass: "bg-online",
    },
    {
        href: "/quests",
        label: "Quests",
        icon: Swords,
        highlightClass: "text-quest",
        bgClass: "bg-quest",
    },
    {
        href: "/leaderboard",
        label: "Hall of Nerds",
        icon: Trophy,
        highlightClass: "text-karma",
        bgClass: "bg-karma",
    },
];

export function FullScreenMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const container = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);
    const pathname = usePathname();
    const { currentUser } = useMockData();

    const NAV_ITEMS = [
        ...BASE_NAV_ITEMS,
        {
            href: `/profile/${currentUser.username}`,
            label: "Chamber",
            icon: User,
            highlightClass: "text-alert",
            bgClass: "bg-alert",
        },
    ];

    useEffect(() => {
        tl.current = gsap.timeline({ paused: true });

        // Fresh animation: Sleek slide down from the top
        tl.current.to(container.current, {
            y: "0%",
            duration: 0.5,
            ease: "power3.out",
        });

        // Orbs fade and float in
        tl.current.from(
            ".menu-orb",
            {
                scale: 0.5,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "back.out(1.2)",
            },
            "-=0.3",
        );

        // Menu items slide up with slight scaling
        tl.current.from(
            ".menu-item-wrap",
            {
                y: 40,
                scale: 0.95,
                opacity: 0,
                stagger: 0.06,
                duration: 0.45,
                ease: "back.out(1.5)",
            },
            "-=0.4",
        );

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
            className="fixed inset-0 z-[100] bg-bg/98 flex flex-col justify-center items-start pl-8 md:pl-24 overflow-hidden -translate-y-full"
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
            {/* Colorful Atmospheric Background Elements */}
            <div className="menu-orb absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
            <div className="menu-orb absolute bottom-0 left-10 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/4" />
            <div className="menu-orb absolute top-1/2 right-1/4 w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] bg-primary/8 rounded-full blur-[80px]" />

            <button
                onClick={onClose}
                className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center border-[3px] border-border bg-card transition-all duration-100 z-[101] hover:translate-x-1 hover:translate-y-1"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "2px 2px 0px 0px #2d2d2d",
                }}
            >
                <X className="w-6 h-6 text-text" />
            </button>

            <div className="flex flex-col gap-6 md:gap-10 items-start w-full relative z-10 pr-12">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            onClick={onClose}
                            className="menu-item-wrap group w-full flex items-center gap-4 md:gap-6 cursor-pointer transition-all duration-100 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                        >
                            <div
                                className={`p-3 md:p-4 border-[2px] border-border transition-all duration-300 shrink-0 ${isActive ? "bg-primary" : "bg-muted/20"} hover:bg-primary`}
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    boxShadow: isActive
                                        ? "2px 2px 0px 0px #2d2d2d"
                                        : "1px 1px 0px 0px #2d2d2d",
                                }}
                            >
                                <item.icon
                                    className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${isActive ? "text-text" : "text-text"}`}
                                />
                            </div>
                            <span
                                className={`font-heading text-2xl md:text-4xl leading-none font-black uppercase tracking-tight transition-all duration-300 group-hover:translate-x-1 break-words ${isActive ? "text-primary" : "text-text"}`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-10 left-8 md:left-24 flex gap-8 font-heading text-xs md:text-sm text-text/70 uppercase tracking-widest z-10 font-bold">
                <span className="hover:text-primary transition-colors cursor-pointer">
                    Supabase Auth
                </span>
                <span className="hover:text-primary transition-colors cursor-pointer">
                    Terminal
                </span>
            </div>
        </div>
    );
}
