"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SignalBadge } from "@/components/ui/SignalBadge";
import { MessageSquare, Search, Sparkles, Terminal } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Lobby() {
    const { feed, users, addFeedItem, offerHelp, currentUser } = useMockData();
    const [newPost, setNewPost] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const heroRef = useRef<HTMLDivElement>(null);
    const feedRef = useRef<HTMLDivElement>(null);
    const asideRef = useRef<HTMLElement>(null);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        addFeedItem({
            type: "request",
            author: {
                name: currentUser.name,
                handle: `@${currentUser.username}`,
                avatarChar: currentUser.avatarChar,
            },
            timeAgo: "Just now",
            content: newPost,
            skills: [],
            tags: ["NEW REQUEST", "STRUCTURED HELP"],
        });
        setNewPost("");
    };

    const filteredFeed = useMemo(() => {
        return feed.filter((item) => {
            const byFilter =
                activeFilter === "All" ||
                (activeFilter === "Skills" && item.skills.length > 0) ||
                (activeFilter === "Quests" && item.type === "quest") ||
                (activeFilter === "Events" && item.type === "event");

            const searchableText = [
                item.author.name,
                item.author.handle,
                item.content,
                item.tags.join(" "),
                item.skills.map((s) => s.name).join(" "),
            ]
                .join(" ")
                .toLowerCase();
            const bySearch = searchableText.includes(searchTerm.toLowerCase());
            return byFilter && bySearch;
        });
    }, [activeFilter, feed, searchTerm]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.from(".lobby-panel", {
                y: 28,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.14,
            });

            gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 32, opacity: 0.15 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.65,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            end: "top 55%",
                            scrub: 0.7,
                        },
                    },
                );
            });

            if (heroRef.current) {
                gsap.to(heroRef.current, {
                    yPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        });

        return () => ctx.revert();
    }, [filteredFeed.length]);

    return (
        <div className="max-w-6xl mx-auto pb-10 space-y-6 md:space-y-8">
            <section
                ref={heroRef}
                className="lobby-panel bento-panel p-6 md:p-8 lg:p-10"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                }}
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-text uppercase">
                            The Lobby
                        </h2>
                        <p className="text-xs md:text-sm font-sans text-text/70 mt-2">
                            Find help fast. Offer help faster.
                        </p>
                    </div>
                    <div
                        className="inline-flex items-center gap-3 bg-muted/30 border-[2px] border-border px-4 py-2 text-xs font-heading"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        <SignalBadge status={currentUser.signal} />
                        <span className="text-text">You are currently</span>
                        <span className="font-bold text-text uppercase">
                            {currentUser.signal}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
                    <button
                        onClick={() => {
                            addFeedItem({
                                type: "request",
                                author: {
                                    name: currentUser.name,
                                    handle: `@${currentUser.username}`,
                                    avatarChar: currentUser.avatarChar,
                                },
                                timeAgo: "Just now",
                                content:
                                    "Quick collaboration pod forming now. Share blockers in this thread.",
                                skills: [],
                                tags: ["POD CALL", "STRUCTURED HELP"],
                            });
                        }}
                        className="h-12 bg-primary text-text font-heading font-bold text-sm flex items-center justify-center gap-2 border-[2px] border-border transition-all duration-75 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        <Terminal className="w-4 h-4" /> Assemble Pod
                    </button>
                    <button
                        onClick={() => setActiveFilter("Skills")}
                        className="h-12 bg-card border-[2px] border-border text-text font-heading font-bold text-sm transition-all duration-75 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        Skills Needed
                    </button>
                    <button
                        onClick={() => setActiveFilter("Events")}
                        className="h-12 bg-card border-[2px] border-border text-text font-heading font-bold text-sm transition-all duration-75 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow: "2px 2px 0px 0px #2d2d2d",
                        }}
                    >
                        Events
                    </button>
                </div>
            </section>

            <section className="bento-grid lg:grid-cols-12">
                <div
                    ref={feedRef}
                    className="lobby-panel lg:col-span-8 bento-panel p-5 md:p-7 lg:p-8"
                >
                    <div
                        className="flex items-center gap-2 bg-muted/20 border-[2px] border-border px-3 py-2"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        <Search className="w-4 h-4 text-text/60" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search requests by skill, tag, name..."
                            className="w-full bg-transparent outline-none text-sm text-text placeholder:text-text/50 font-sans"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto py-3">
                        {["All", "Skills", "Quests", "Events"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-xs font-heading font-bold whitespace-nowrap border-[2px] transition-all duration-75 ${activeFilter === filter ? "bg-primary text-text border-border shadow-[2px_2px_0px_0px_#2d2d2d]" : "bg-card border-border"}`}
                                style={{
                                    borderRadius:
                                        "255px 15px 225px 15px / 15px 225px 15px 255px",
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handlePost} className="relative mb-4">
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Describe your blocker with clear context..."
                            className="w-full min-h-[110px] bg-muted/20 border-[2px] border-border p-4 pr-32 text-sm text-text resize-none font-sans"
                            style={{
                                borderRadius:
                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newPost.trim()}
                            className="absolute right-3 bottom-3 h-10 px-5 rounded-lg bg-primary text-text font-heading font-bold text-sm border-[2px] border-border disabled:opacity-40 transition-all duration-75 active:translate-x-1 active:translate-y-1"
                            style={{
                                borderRadius:
                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                boxShadow: "2px 2px 0px 0px #2d2d2d",
                            }}
                        >
                            Post
                        </button>
                    </form>

                    <div className="space-y-4">
                        {filteredFeed
                            .filter((item) => item.type === "request")
                            .map((item) => (
                                <article
                                    key={item.id}
                                    className="scroll-reveal bg-muted/20 border-[2px] border-border p-4 md:p-5"
                                    style={{
                                        borderRadius:
                                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 border-[2px] border-border bg-primary flex items-center justify-center text-xs font-heading font-bold"
                                            style={{ borderRadius: "50%" }}
                                        >
                                            {item.author.avatarChar}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-heading font-bold text-text truncate">
                                                {item.author.name}
                                            </p>
                                            <p className="text-[11px] font-sans text-text/60 truncate">
                                                {item.author.handle} •{" "}
                                                {item.timeAgo}
                                            </p>
                                        </div>
                                        <div className="ml-auto flex gap-1 flex-wrap justify-end">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-white border-[1.5px] border-border text-[10px] font-heading font-bold text-text"
                                                    style={{
                                                        borderRadius:
                                                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm font-sans text-text/90">
                                        {item.content}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {item.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1.5 bg-card border-[2px] border-border text-[11px] font-heading font-bold text-text"
                                                style={{
                                                    borderRadius:
                                                        "255px 15px 225px 15px / 15px 225px 15px 255px",
                                                }}
                                            >
                                                {skill.emoji} {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => offerHelp(item.id)}
                                        disabled={
                                            item.author.handle ===
                                                `@${currentUser.username}` ||
                                            item.tags.includes("HELP OFFERED")
                                        }
                                        className="mt-4 w-full h-11 border-[2px] border-border bg-white disabled:opacity-50 text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all duration-75 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                            boxShadow:
                                                "2px 2px 0px 0px #2d2d2d",
                                        }}
                                    >
                                        <MessageSquare className="w-4 h-4" />{" "}
                                        {item.author.handle ===
                                        `@${currentUser.username}`
                                            ? "Your Request"
                                            : item.tags.includes("HELP OFFERED")
                                              ? "Help Offered"
                                              : "Offer Help"}
                                    </button>
                                </article>
                            ))}
                    </div>
                </div>

                <aside
                    ref={asideRef}
                    className="lobby-panel lg:col-span-4 bento-panel p-5 md:p-6"
                >
                    <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-text">
                        Discover Helpers
                    </h3>
                    <div className="mt-4 space-y-2">
                        {users.slice(1, 9).map((user) => (
                            <Link
                                key={user.id}
                                href={`/profile/${user.username}`}
                                className="scroll-reveal flex items-center gap-3 bg-muted/20 border-[2px] border-border p-3.5 transition-all duration-150 hover:-translate-y-0.5"
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                }}
                            >
                                <div
                                    className="w-10 h-10 border-[2px] border-border bg-primary flex items-center justify-center font-heading font-bold"
                                    style={{ borderRadius: "50%" }}
                                >
                                    {user.avatarChar}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-heading font-bold text-text truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] font-sans text-text/60 truncate">
                                        @{user.username}
                                    </p>
                                </div>
                                <Sparkles className="w-4 h-4 text-primary" />
                            </Link>
                        ))}
                    </div>
                </aside>
            </section>
        </div>
    );
}
