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

        tl.current.to(container.current, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
        });

        tl.current.from(
            ".menu-orb",
            {
                y: 28,
                scale: 0.75,
                opacity: 0,
                stagger: 0.08,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.45",
        );

        tl.current.from(
            ".menu-item-wrap",
            {
                y: 24,
                scale: 0.98,
                opacity: 0,
                stagger: 0.06,
                duration: 0.4,
                ease: "power3.out",
            },
            "-=0.45",
        );

        tl.current.from(
            ".menu-meta",
            {
                y: 18,
                opacity: 0,
                stagger: 0.05,
                duration: 0.35,
                ease: "power2.out",
            },
            "-=0.3",
        );

        gsap.set(container.current, { y: "-100%", autoAlpha: 0 });
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
            className="fixed inset-0 z-[100] bg-bg/90 backdrop-blur-md flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 overflow-hidden"
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
            <div className="menu-orb absolute top-0 right-0 w-[44vw] h-[44vw] max-w-[560px] max-h-[560px] bg-primary/12 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/5" />
            <div className="menu-orb absolute -bottom-24 left-0 w-[34vw] h-[34vw] max-w-[460px] max-h-[460px] bg-secondary/15 rounded-full blur-[110px]" />
            <div className="menu-orb absolute top-1/3 right-1/3 w-[24vw] h-[24vw] max-w-[330px] max-h-[330px] bg-online/12 rounded-full blur-[90px]" />

            <button
                onClick={onClose}
                className="absolute top-6 md:top-8 right-6 md:right-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-[2px] border-border bg-card transition-all duration-150 z-[101] hover:-translate-y-0.5"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "2px 2px 0px 0px #2d2d2d",
                }}
            >
                <X className="w-6 h-6 text-text" />
            </button>

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6 items-start w-full">
                    <p className="menu-meta text-[11px] md:text-xs uppercase tracking-[0.35em] text-text/55">
                        Navigation
                    </p>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                href={item.href}
                                key={item.href}
                                onClick={onClose}
                                className="menu-item-wrap group w-full flex items-center gap-3 md:gap-5 border-[2px] border-border bg-card/80 px-4 md:px-6 py-3 md:py-4 transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    boxShadow: isActive
                                        ? "3px 3px 0px 0px #2d2d2d"
                                        : "1px 1px 0px 0px #2d2d2d",
                                }}
                            >
                                <div
                                    className={`p-2.5 md:p-3 border-[2px] border-border transition-all duration-300 shrink-0 ${isActive ? "bg-primary" : "bg-muted/25"} group-hover:bg-primary`}
                                    style={{
                                        borderRadius:
                                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    }}
                                >
                                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-text" />
                                </div>
                                <span
                                    className={`font-heading text-xl md:text-3xl leading-none font-black uppercase tracking-tight transition-all duration-300 group-hover:translate-x-0.5 ${isActive ? "text-primary" : "text-text"}`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                <div
                    className="menu-meta lg:col-span-4 bento-panel p-5 md:p-6 bg-card/80"
                    style={{
                        borderRadius:
                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                    }}
                >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-text/55">
                        Space
                    </p>
                    <h3 className="mt-3 text-2xl md:text-3xl font-heading font-black uppercase">
                        Quick jump
                    </h3>
                    <p className="mt-2 text-sm text-text/75 font-sans leading-relaxed">
                        Move through Lobby, Hub, Quests, and profiles with a clean
                        command-center style overlay.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="menu-meta px-3 py-1 text-[11px] border-[1.5px] border-border bg-muted/25">
                            GSAP
                        </span>
                        <span className="menu-meta px-3 py-1 text-[11px] border-[1.5px] border-border bg-muted/25">
                            Three.js
                        </span>
                        <span className="menu-meta px-3 py-1 text-[11px] border-[1.5px] border-border bg-muted/25">
                            Minimal UI
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-6 md:left-16 lg:left-24 flex gap-6 font-heading text-[11px] md:text-xs text-text/70 uppercase tracking-[0.2em] z-10 font-bold">
                <span className="menu-meta">Campus signal network</span>
                <span className="menu-meta">Ctrl + M menu flow</span>
            </div>
        </div>
    );
}
