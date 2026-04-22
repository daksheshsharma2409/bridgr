"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Trophy } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";
import Link from "next/link";

const RANK_TITLES: [number, string][] = [
    [0, "Noob"],
    [10, "2 Brain Cells Left"],
    [50, "Still Loading..."],
    [150, "NPC Escaped"],
    [300, "Main Character"],
    [500, "Keyboard Warrior"],
    [750, "Gigabrain"],
    [1000, "Try Hard 🔥"],
];

function getRankTitle(karma: number) {
    let title = RANK_TITLES[0][1];
    for (const [threshold, name] of RANK_TITLES) {
        if (karma >= threshold) title = name;
    }
    return title;
}

function KarmaCount({ target }: { target: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
                if (ref.current)
                    ref.current.innerText = Math.round(
                        obj.val,
                    ).toLocaleString();
            },
        });
    }, [target]);
    return <span ref={ref}>0</span>;
}

export default function HallOfNerds() {
    const { users } = useMockData();
    const [activeTab, setActiveTab] = useState("Weekly");

    const sorted = [...users].sort((a, b) => b.karma - a.karma);
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3, 20);
    const currentUser = users[0];
    const currentUserRank =
        sorted.findIndex((u) => u.id === currentUser.id) + 1;

    return (
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-8">
            <section
                className="bg-card border-[3px] border-border p-5 md:p-6 text-center"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "4px 4px 0px 0px #2d2d2d",
                }}
            >
                <Trophy className="w-10 h-10 md:w-14 md:h-14 text-primary mx-auto mb-3 md:mb-4 animate-gentle-bounce" />
                <h2 className="text-3xl md:text-5xl font-heading font-black text-text tracking-tight uppercase">
                    Hall of Nerds
                </h2>
                <p className="text-text/70 mt-2 font-sans text-xs md:text-sm">
                    Top contributors ranked by karma.
                </p>
            </section>

            {/* Tabs */}
            <div className="flex gap-3 justify-center pb-2">
                {["Weekly", "Monthly", "All-Time"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-sm font-heading font-bold transition-all duration-75 border-[2px] ${
                            activeTab === tab
                                ? "bg-karma text-text border-border active:translate-x-1 active:translate-y-1"
                                : "bg-card text-text border-border hover:translate-x-0.5 hover:translate-y-0.5"
                        }`}
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                            boxShadow:
                                activeTab === tab
                                    ? "2px 2px 0px 0px #2d2d2d"
                                    : "1px 1px 0px 0px #2d2d2d",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                {[top3[1], top3[0], top3[2]].map((user, podiumIdx) => {
                    if (!user) return null;
                    const rankDisplay =
                        podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
                    const isFirst = rankDisplay === 1;
                    return (
                        <Link key={user.id} href={`/profile/${user.username}`}>
                            <div
                                className={`flex flex-col items-center p-4 md:p-5 text-center cursor-pointer transition-all duration-100 border-[3px] ${
                                    isFirst
                                        ? "bg-karma border-border order-2 hover:translate-x-1 hover:translate-y-1"
                                        : "bg-card border-border order-1 hover:translate-x-0.5 hover:translate-y-0.5"
                                } ${rankDisplay === 2 ? "order-1" : rankDisplay === 3 ? "order-3" : ""}`}
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    boxShadow: isFirst
                                        ? "4px 4px 0px 0px #2d2d2d"
                                        : "3px 3px 0px 0px #2d2d2d",
                                }}
                            >
                                <div
                                    className={`text-3xl mb-2 font-heading font-black`}
                                >
                                    {isFirst
                                        ? "👑"
                                        : rankDisplay === 2
                                          ? "🥈"
                                          : "🥉"}
                                </div>
                                <div
                                    className={`w-14 h-14 border-[2px] border-border flex items-center justify-center text-3xl mb-3 font-heading font-bold ${isFirst ? "bg-white" : "bg-muted/30"}`}
                                    style={{ borderRadius: "50%" }}
                                >
                                    {user.avatarChar}
                                </div>
                                <p
                                    className={`font-heading font-bold text-sm ${isFirst ? "shimmer-gold" : "text-text"} truncate w-full`}
                                >
                                    {user.name.split(" ")[0]}
                                </p>
                                <p className="font-mono text-[10px] text-muted">
                                    @{user.username}
                                </p>
                                <div
                                    className={`mt-2 font-heading font-black text-lg ${isFirst ? "text-karma" : "text-muted"}`}
                                >
                                    <KarmaCount target={user.karma} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div
                className="flex items-center p-4 md:p-5 border-[3px] border-border bg-white"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "4px 4px 0px 0px #2d2d2d",
                }}
            >
                <div className="w-8 font-heading font-black text-xl text-primary text-center">
                    #{currentUserRank}
                </div>
                <div
                    className="mx-4 w-10 h-10 border-[2px] border-border bg-muted/30 flex items-center justify-center text-xl font-heading font-bold"
                    style={{ borderRadius: "50%" }}
                >
                    {currentUser.avatarChar}
                </div>
                <div className="flex-1">
                    <div className="font-heading font-bold text-sm text-text">
                        {currentUser.name}{" "}
                        <span className="bg-primary px-3 py-1 rounded text-[10px] font-bold uppercase text-text ml-2 border-[1.5px] border-border">
                            You
                        </span>
                    </div>
                    <div className="font-sans text-xs text-text/70">
                        @{currentUser.username} •{" "}
                        {getRankTitle(currentUser.karma)}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-heading font-black text-primary text-xl">
                        <KarmaCount target={currentUser.karma} />
                    </span>
                    <span className="text-[10px] font-heading font-bold text-text/70 uppercase tracking-wider">
                        Karma
                    </span>
                </div>
            </div>

            {/* Rest of leaderboard */}
            <div className="space-y-2">
                {rest.map((user, i) => {
                    const rank = i + 4;
                    return (
                        <Link key={user.id} href={`/profile/${user.username}`}>
                            <div
                                className="flex items-center p-3 md:p-4 border-[2px] border-border bg-card hover:translate-x-1 hover:translate-y-1 transition-all duration-100 cursor-pointer"
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                }}
                            >
                                <div className="w-8 font-heading font-black text-base text-text text-center">
                                    #{rank}
                                </div>
                                <div
                                    className="mx-3 w-9 h-9 border-[1.5px] border-border bg-muted/30 flex items-center justify-center text-lg font-heading font-bold"
                                    style={{ borderRadius: "50%" }}
                                >
                                    {user.avatarChar}
                                </div>
                                <div className="flex-1">
                                    <div className="font-heading font-bold text-sm text-text">
                                        {user.name}
                                    </div>
                                    <div className="font-sans text-[10px] text-text/70">
                                        @{user.username} •{" "}
                                        {getRankTitle(user.karma)}
                                    </div>
                                </div>
                                <div className="font-heading font-black text-primary">
                                    <KarmaCount target={user.karma} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
