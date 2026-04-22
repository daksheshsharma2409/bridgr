"use client";

import { useState, useLayoutEffect, useRef, use } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import {
    Coffee,
    MapPin,
    Zap,
    Sparkles,
    HeartHandshake,
    BookOpen,
    Gift,
    Edit2,
    Save,
    Palette,
    Link as LinkIcon,
    FolderGit2,
} from "lucide-react";
import { useMockData, UserProfile } from "@/lib/MockDataContext";
import { useVibeTheme, VIBE_PRESETS } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

function ListEditor({
    items,
    onChange,
    placeholder,
    maxItems,
}: {
    items: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    maxItems?: number;
}) {
    const [input, setInput] = useState("");

    const addItem = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (maxItems && items.length >= maxItems) return;
        if (items.includes(trimmed)) return;
        onChange([...items, trimmed]);
        setInput("");
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addItem();
                        }
                    }}
                    placeholder={placeholder}
                    className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                    style={{
                        borderRadius:
                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                    }}
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-primary border-[2px] border-border text-text text-sm font-heading font-bold transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
                    style={{
                        borderRadius:
                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                        boxShadow: "2px 2px 0px 0px #2d2d2d",
                    }}
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <button
                        key={`${item}-${idx}`}
                        type="button"
                        onClick={() =>
                            onChange(items.filter((_, i) => i !== idx))
                        }
                        className="px-3 py-1.5 bg-muted/20 border-[1.5px] border-border text-sm font-heading font-bold text-text/80 hover:text-text transition-all"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                        title="Remove item"
                    >
                        {item} ×
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function Chamber({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = use(params);
    const { users, currentUser, updateUserSignal, updateUserProfile } =
        useMockData();
    const container = useRef<HTMLDivElement>(null);

    const profileUser = users.find((u) => u.username === username);

    const isSelf = currentUser.username === (profileUser?.username || "");
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<Partial<UserProfile>>({});
    const [draftLists, setDraftLists] = useState<{
        superpowers: string[];
        quirks: string[];
        vibeTags: string[];
        wins: string[];
        interests: string[];
        projects: UserProfile["projects"];
        socialLinks: UserProfile["socialLinks"];
    }>({
        superpowers: [],
        quirks: [],
        vibeTags: [],
        wins: [],
        interests: [],
        projects: [],
        socialLinks: [],
    });
    const [projectDraft, setProjectDraft] = useState({
        name: "",
        description: "",
        repoUrl: "",
        liveUrl: "",
    });
    const [socialDraft, setSocialDraft] = useState({ title: "", url: "" });
    const { theme, setTheme } = useVibeTheme();

    useLayoutEffect(() => {
        if (!profileUser) return;
        let ctx = gsap.context(() => {
            gsap.from(".anim-item", {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.7,
                ease: "power2.out",
            });
        }, container);
        return () => ctx.revert();
    }, [profileUser]);

    if (!profileUser) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
                <h2 className="text-4xl font-heading text-text">
                    404 - Nerd Not Found
                </h2>
                <p className="text-muted font-mono">
                    This user does not exist in our grid.
                </p>
            </div>
        );
    }

    const handleSave = () => {
        const PALETTE = [
            "border-primary text-primary bg-primary/10",
            "border-online text-online bg-online/10",
            "border-quest text-quest bg-quest/10",
            "border-alert text-alert bg-alert/10",
            "border-karma text-karma bg-karma/10",
            "border-cyan-400 text-cyan-400 bg-cyan-400/10",
            "border-indigo-400 text-indigo-400 bg-indigo-400/10",
            "border-pink-500 text-pink-500 bg-pink-500/10",
        ];

        const nextSuperpowers = draftLists.superpowers
            .map((name, i) => {
                return {
                    name: name.trim(),
                    color: PALETTE[i % PALETTE.length],
                    emoji: "",
                };
            })
            .filter((s) => s.name);

        updateUserProfile(profileUser.username, {
            ...draft,
            superpowers: nextSuperpowers,
            quirks: draftLists.quirks,
            vibeTags: draftLists.vibeTags,
            wins: draftLists.wins,
            interests: draftLists.interests,
            projects: draftLists.projects,
            socialLinks: draftLists.socialLinks,
        });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setDraft({
            name: profileUser.name,
            bio: profileUser.bio,
            learning: profileUser.learning,
            location: { ...profileUser.location },
            exchange: profileUser.exchange,
        });
        setDraftLists({
            superpowers: profileUser.superpowers.map((s) => s.name),
            quirks: profileUser.quirks,
            vibeTags: profileUser.vibeTags,
            wins: profileUser.wins,
            interests: profileUser.interests,
            projects: profileUser.projects ?? [],
            socialLinks: profileUser.socialLinks ?? [],
        });
        setProjectDraft({
            name: "",
            description: "",
            repoUrl: "",
            liveUrl: "",
        });
        setSocialDraft({ title: "", url: "" });
        setIsEditing(true);
    };

    const renderEditableText = (field: keyof UserProfile, label?: string) => {
        if (isEditing) {
            if (field === "bio" || field === "exchange") {
                return (
                    <textarea
                        className="w-full bg-background/50 border border-border-subtle rounded p-2 text-text font-mono text-sm resize-none"
                        value={draft[field] as string}
                        onChange={(e) =>
                            setDraft({ ...draft, [field]: e.target.value })
                        }
                    />
                );
            }
            return (
                <input
                    type="text"
                    className="bg-background/50 border border-border-subtle rounded px-2 py-1 text-text font-heading text-sm w-full"
                    value={draft[field] as string}
                    onChange={(e) =>
                        setDraft({ ...draft, [field]: e.target.value })
                    }
                />
            );
        }
        return (
            <p className="text-base md:text-lg font-serif italic text-text/90">
                {profileUser[field] as string}
            </p>
        );
    };

    return (
        <div
            ref={container}
            className="max-w-4xl mx-auto pb-8 md:pb-16 space-y-4 md:space-y-6"
        >
            {/* 1. The "Social Identity" Header */}
            <div className="anim-item relative mb-6 md:mb-8">
                <div
                    className="h-28 md:h-40 bg-muted/20 border-t-[3px] border-l-[3px] border-r-[3px] border-border relative"
                    style={{
                        borderRadius: "200px 200px 0 0 / 200px 200px 0 0",
                    }}
                >
                    {isSelf && (
                        <button
                            onClick={isEditing ? handleSave : handleEdit}
                            className={cn(
                                "absolute top-4 right-4 px-4 py-2 font-bold font-heading text-xs md:text-sm flex items-center gap-2 transition-all border-[2px] border-border duration-75",
                                isEditing
                                    ? "bg-primary text-text active:translate-x-1 active:translate-y-1"
                                    : "bg-card text-text hover:translate-x-0.5 hover:translate-y-0.5",
                            )}
                            style={{
                                borderRadius:
                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                boxShadow: "2px 2px 0px 0px #2d2d2d",
                            }}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="w-4 h-4" /> Save Profile
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div
                    className="px-4 md:px-10 pb-4 md:pb-6 bg-card border-b-[3px] border-l-[3px] border-r-[3px] border-border relative"
                    style={{
                        borderRadius: "0 0 200px 200px / 0 0 200px 200px",
                        boxShadow: "4px 4px 0px 0px #2d2d2d",
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 md:gap-6 -mt-12 md:-mt-16 relative z-10 w-full mb-4 md:mb-6">
                        <div
                            className="w-20 h-20 md:w-32 md:h-32 bg-muted border-[3px] border-border rounded-full flex items-center justify-center backdrop-blur-md relative overflow-hidden group"
                            style={{ boxShadow: "3px 3px 0px 0px #2d2d2d" }}
                        >
                            <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform cursor-crosshair">
                                {profileUser.avatarChar}
                            </span>
                        </div>

                        <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
                            <div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="text-2xl md:text-4xl font-heading font-black uppercase text-text tracking-tighter bg-transparent border-b-2 border-border outline-none w-full mb-1"
                                        value={draft.name}
                                        onChange={(e) =>
                                            setDraft({
                                                ...draft,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <h2 className="text-2xl md:text-4xl font-heading font-black uppercase text-text tracking-tighter">
                                        {profileUser.name}
                                    </h2>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="font-heading font-bold text-primary">
                                        @{profileUser.username}
                                    </p>
                                    <span
                                        className="flex items-center gap-1 bg-karma px-3 py-1 border-[1.5px] border-border text-xs font-heading font-bold text-text uppercase tracking-widest"
                                        style={{
                                            borderRadius:
                                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                                        }}
                                    >
                                        <Sparkles className="w-3 h-3" />{" "}
                                        {profileUser.karma}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isSelf ? (
                                    <div
                                        className="bg-card border-[2px] border-border p-2 flex gap-2"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                updateUserSignal("open")
                                            }
                                            className={cn(
                                                "px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5 border-[1.5px] border-border",
                                                profileUser.signal === "open"
                                                    ? "bg-primary text-text"
                                                    : "bg-card text-text hover:translate-x-0.5 hover:translate-y-0.5",
                                            )}
                                            style={{
                                                borderRadius:
                                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    profileUser.signal ===
                                                        "open"
                                                        ? "bg-text"
                                                        : "bg-gray-400",
                                                )}
                                            />{" "}
                                            Open
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateUserSignal("flow")
                                            }
                                            className={cn(
                                                "px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5 border-[1.5px] border-border",
                                                profileUser.signal === "flow"
                                                    ? "bg-primary text-text"
                                                    : "bg-card text-text hover:translate-x-0.5 hover:translate-y-0.5",
                                            )}
                                            style={{
                                                borderRadius:
                                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    profileUser.signal ===
                                                        "flow"
                                                        ? "bg-text"
                                                        : "bg-gray-400",
                                                )}
                                            />{" "}
                                            Flow
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateUserSignal("offline")
                                            }
                                            className={cn(
                                                "px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5 border-[1.5px] border-border",
                                                profileUser.signal === "offline"
                                                    ? "bg-primary text-text"
                                                    : "bg-card text-text hover:translate-x-0.5 hover:translate-y-0.5",
                                            )}
                                            style={{
                                                borderRadius:
                                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    profileUser.signal ===
                                                        "offline"
                                                        ? "bg-text"
                                                        : "bg-gray-400",
                                                )}
                                            />{" "}
                                            DND
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="bg-card border-[2px] border-border p-2 px-4 flex items-center gap-3"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "w-3 h-3 rounded-full",
                                                profileUser.signal === "open"
                                                    ? "bg-primary"
                                                    : profileUser.signal ===
                                                        "flow"
                                                      ? "bg-primary"
                                                      : "bg-gray-400",
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "text-sm font-heading font-bold uppercase text-text",
                                            )}
                                        >
                                            {profileUser.signal}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-muted/30 border-[2px] border-border p-4 md:p-5 flex justify-between items-center group"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                        }}
                    >
                        <div className="w-full">
                            {renderEditableText("bio")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
                {/* Skill Inventory - Main Card */}
                <div className="lg:col-span-8">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 relative group h-full"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-5 md:mb-6">
                            <Zap className="w-5 h-5 text-primary" /> Skill
                            Inventory
                        </h3>

                        <div className="space-y-5 md:space-y-6">
                            <div>
                                <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest mb-3 block">
                                    My Superpowers
                                </span>
                                {isEditing ? (
                                    <ListEditor
                                        items={draftLists.superpowers}
                                        onChange={(superpowers) =>
                                            setDraftLists({
                                                ...draftLists,
                                                superpowers,
                                            })
                                        }
                                        placeholder="Add a superpower..."
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2.5">
                                        {profileUser.superpowers.map(
                                            (sp, idx) => (
                                                <span
                                                    key={idx}
                                                    className={cn(
                                                        "bg-muted/20 border-[2px] border-border px-3 py-2 text-sm font-heading font-bold flex items-center transition-transform hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1",
                                                        sp.emoji
                                                            ? "gap-1.5"
                                                            : "",
                                                    )}
                                                    style={{
                                                        borderRadius:
                                                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                                                    }}
                                                >
                                                    {sp.emoji && (
                                                        <span className="text-lg">
                                                            {sp.emoji}
                                                        </span>
                                                    )}{" "}
                                                    {sp.name}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest mb-3 block">
                                    The Lab Quirks (Niche Flex)
                                </span>
                                {isEditing ? (
                                    <ListEditor
                                        items={draftLists.quirks}
                                        onChange={(quirks) =>
                                            setDraftLists({
                                                ...draftLists,
                                                quirks,
                                            })
                                        }
                                        placeholder="Add a quirk..."
                                    />
                                ) : (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {profileUser.quirks.map((q, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-2 text-sm font-sans text-text/80 bg-muted/20 p-2.5 border-[1.5px] border-border group/item"
                                                style={{
                                                    borderRadius:
                                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                                }}
                                            >
                                                <span className="text-primary group-hover/item:translate-x-1 transition-transform">
                                                    ▸
                                                </span>{" "}
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="pt-3">
                                <div
                                    className="inline-flex items-center gap-3 bg-muted/20 border-[2px] border-border px-4 py-3 w-full group/learn overflow-hidden relative"
                                    style={{
                                        borderRadius:
                                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    }}
                                >
                                    <BookOpen className="w-5 h-5 text-text shrink-0 relative z-10" />
                                    <div className="w-full relative z-10">
                                        <span className="text-[10px] font-heading font-bold text-text/70 uppercase tracking-wider block leading-none mb-1">
                                            Learning Currently
                                        </span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="bg-transparent border-b-2 border-border outline-none px-1 text-text text-sm font-heading font-bold w-full"
                                                value={draft.learning || ""}
                                                onChange={(e) =>
                                                    setDraft({
                                                        ...draft,
                                                        learning:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <span className="font-heading font-bold text-sm text-text">
                                                {profileUser.learning}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Proof - Side Card */}
                <div className="lg:col-span-4">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 h-full"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-5 md:mb-6">
                            <HeartHandshake className="w-5 h-5 text-primary" />{" "}
                            Social Proof
                        </h3>
                        <div className="mb-6">
                            <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest mb-3 block">
                                My Vibe Tags
                            </span>
                            {isEditing ? (
                                <ListEditor
                                    items={draftLists.vibeTags}
                                    onChange={(vibeTags) =>
                                        setDraftLists({
                                            ...draftLists,
                                            vibeTags,
                                        })
                                    }
                                    placeholder="Add a vibe tag..."
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profileUser.vibeTags.map((v, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-muted/20 border-[1.5px] border-border text-[11px] font-heading font-bold text-text uppercase tracking-wider"
                                            style={{
                                                borderRadius:
                                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            }}
                                        >
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest mb-3 block">
                                Recent Wins
                            </span>
                            {isEditing ? (
                                <ListEditor
                                    items={draftLists.wins}
                                    onChange={(wins) =>
                                        setDraftLists({ ...draftLists, wins })
                                    }
                                    placeholder="Add a recent win..."
                                />
                            ) : (
                                <div className="space-y-3 relative border-l-[2px] border-border ml-2 pl-4 py-1">
                                    {profileUser.wins.map((w, i) => (
                                        <div
                                            key={i}
                                            className="relative group/win"
                                        >
                                            <div
                                                className={cn(
                                                    "absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-card transition-all group-hover/win:scale-125",
                                                    i === 0
                                                        ? "bg-primary"
                                                        : "bg-muted",
                                                )}
                                            />
                                            <p
                                                className={cn(
                                                    "text-sm font-heading font-bold leading-relaxed",
                                                    i === 0
                                                        ? "text-text"
                                                        : "text-text/70",
                                                )}
                                            >
                                                {w}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Campus Coordinates - Lower Left */}
                <div className="lg:col-span-5">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 relative overflow-hidden h-full min-h-[180px] md:min-h-[220px]"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-5 md:mb-6 relative z-10">
                            <MapPin className="w-5 h-5 text-primary" /> Campus
                            Coordinates
                        </h3>
                        <div className="space-y-3 relative z-10 w-full">
                            <div
                                className="flex gap-4 items-center bg-muted/20 border-[2px] border-border p-3 w-full hover:bg-muted/30 transition-colors group/coord"
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                }}
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-[1.5px] border-border transition-all group-hover/coord:rotate-6">
                                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                                </div>
                                <div className="w-full flex-1 min-w-0">
                                    <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest block mb-1">
                                        Find Me At (Right Now)
                                    </span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="bg-transparent border-b-2 border-border outline-none text-text text-sm font-heading font-bold w-full truncate"
                                            value={
                                                draft.location?.current || ""
                                            }
                                            onChange={(e) =>
                                                setDraft({
                                                    ...draft,
                                                    location: {
                                                        ...draft.location!,
                                                        current: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    ) : (
                                        <span className="font-heading font-bold text-text truncate block">
                                            {profileUser.location.current}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex gap-3 items-center px-3 py-3 w-full bg-muted/20 border-[1.5px] border-dashed border-border"
                                style={{
                                    borderRadius:
                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                }}
                            >
                                <Coffee className="w-5 h-5 text-text/60 shrink-0" />
                                <div className="w-full min-w-0">
                                    <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest block mb-1">
                                        Local Haunt
                                    </span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="bg-transparent border-b-2 border-border outline-none text-text font-heading text-sm w-full"
                                            value={draft.location?.spot || ""}
                                            onChange={(e) =>
                                                setDraft({
                                                    ...draft,
                                                    location: {
                                                        ...draft.location!,
                                                        spot: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    ) : (
                                        <span className="font-heading font-bold text-sm text-text truncate block">
                                            {profileUser.location.spot}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Let's Trade - Lower Right */}
                <div className="lg:col-span-7">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 relative group h-full"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4 md:mb-5">
                            <Gift className="w-5 h-5 shrink-0" /> Let's Trade
                        </h3>
                        <div
                            className="bg-muted/20 border-[2px] border-border px-4 md:px-5 py-4 md:py-5 mb-5 md:mb-6 relative group/trade overflow-hidden"
                            style={{
                                borderRadius:
                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                            }}
                        >
                            <span className="text-[10px] font-heading font-bold text-text/70 uppercase tracking-widest block mb-2">
                                Will Exchange Help For
                            </span>
                            {isEditing ? (
                                <textarea
                                    className="w-full bg-card/50 border-[2px] border-border p-3 text-text font-heading font-bold text-sm resize-none"
                                    style={{
                                        borderRadius:
                                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                                    }}
                                    value={draft.exchange || ""}
                                    onChange={(e) =>
                                        setDraft({
                                            ...draft,
                                            exchange: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="font-heading font-bold text-text text-sm relative z-10 leading-relaxed italic">
                                    "{profileUser.exchange}"
                                </p>
                            )}
                        </div>
                        <div>
                            <span className="text-[10px] font-heading font-bold text-text/60 uppercase tracking-widest block mb-3">
                                Ice-Breaker Interests
                            </span>
                            {isEditing ? (
                                <ListEditor
                                    items={draftLists.interests}
                                    onChange={(interests) =>
                                        setDraftLists({
                                            ...draftLists,
                                            interests,
                                        })
                                    }
                                    placeholder="Add an interest..."
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profileUser.interests.map((int, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-muted/20 border-[1.5px] border-border text-xs font-heading font-bold text-text/80 hover:text-text transition-colors cursor-default"
                                            style={{
                                                borderRadius:
                                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            }}
                                        >
                                            {int}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 h-full"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-5">
                            <FolderGit2 className="w-5 h-5 text-primary" />{" "}
                            Projects
                        </h3>
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <input
                                        value={projectDraft.name}
                                        onChange={(e) =>
                                            setProjectDraft({
                                                ...projectDraft,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Project name"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <textarea
                                        value={projectDraft.description}
                                        onChange={(e) =>
                                            setProjectDraft({
                                                ...projectDraft,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Project description"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm min-h-[72px]"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <input
                                        value={projectDraft.repoUrl}
                                        onChange={(e) =>
                                            setProjectDraft({
                                                ...projectDraft,
                                                repoUrl: e.target.value,
                                            })
                                        }
                                        placeholder="Repository link"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <input
                                        value={projectDraft.liveUrl}
                                        onChange={(e) =>
                                            setProjectDraft({
                                                ...projectDraft,
                                                liveUrl: e.target.value,
                                            })
                                        }
                                        placeholder="Working link (optional)"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const name =
                                                projectDraft.name.trim();
                                            const description =
                                                projectDraft.description.trim();
                                            const repoUrl =
                                                projectDraft.repoUrl.trim();
                                            const liveUrl =
                                                projectDraft.liveUrl.trim();
                                            if (
                                                !name ||
                                                !description ||
                                                !repoUrl
                                            )
                                                return;
                                            setDraftLists({
                                                ...draftLists,
                                                projects: [
                                                    ...draftLists.projects,
                                                    {
                                                        name,
                                                        description,
                                                        repoUrl,
                                                        liveUrl,
                                                    },
                                                ],
                                            });
                                            setProjectDraft({
                                                name: "",
                                                description: "",
                                                repoUrl: "",
                                                liveUrl: "",
                                            });
                                        }}
                                        className="px-4 py-2 bg-primary border-[2px] border-border text-text text-sm font-heading font-bold transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
                                        style={{
                                            borderRadius:
                                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            boxShadow:
                                                "2px 2px 0px 0px #2d2d2d",
                                        }}
                                    >
                                        Add Project
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {draftLists.projects.map((project, i) => (
                                        <div
                                            key={`${project.name}-${i}`}
                                            className="p-3 bg-muted/20 border-[2px] border-border"
                                            style={{
                                                borderRadius:
                                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-heading font-bold text-text">
                                                        {project.name}
                                                    </p>
                                                    <p className="text-xs text-text/70 mt-1">
                                                        {project.description}
                                                    </p>
                                                    <p className="text-[11px] text-primary mt-2 break-all">
                                                        {project.repoUrl}
                                                    </p>
                                                    {project.liveUrl ? (
                                                        <p className="text-[11px] text-primary mt-1 break-all">
                                                            {project.liveUrl}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDraftLists({
                                                            ...draftLists,
                                                            projects:
                                                                draftLists.projects.filter(
                                                                    (_, idx) =>
                                                                        idx !==
                                                                        i,
                                                                ),
                                                        })
                                                    }
                                                    className="text-xs px-2 py-1 border-[1.5px] border-border text-text/60 hover:text-text transition-all"
                                                    style={{
                                                        borderRadius:
                                                            "200px 30px 210px 20px / 20px 210px 30px 200px",
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {(profileUser.projects ?? []).map(
                                    (project, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-muted/20 border-[2px] border-border"
                                            style={{
                                                borderRadius:
                                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                                            }}
                                        >
                                            <p className="text-sm font-heading font-bold text-text">
                                                {project.name}
                                            </p>
                                            <p className="text-xs text-text/70 mt-1">
                                                {project.description}
                                            </p>
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block text-xs text-primary hover:underline break-all mt-2 font-heading font-bold"
                                            >
                                                Repository
                                            </a>
                                            {project.liveUrl ? (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block text-xs text-primary hover:underline break-all mt-1 font-heading font-bold"
                                                >
                                                    Live Project
                                                </a>
                                            ) : null}
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div
                        className="anim-item bg-card border-[3px] border-border p-5 md:p-6 h-full"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-5">
                            <LinkIcon className="w-5 h-5 text-primary" /> Social
                            Links
                        </h3>
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <input
                                        value={socialDraft.title}
                                        onChange={(e) =>
                                            setSocialDraft({
                                                ...socialDraft,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Social title (e.g. GitHub)"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <input
                                        value={socialDraft.url}
                                        onChange={(e) =>
                                            setSocialDraft({
                                                ...socialDraft,
                                                url: e.target.value,
                                            })
                                        }
                                        placeholder="Social link URL"
                                        className="w-full bg-muted/20 border-[2px] border-border px-3 py-2 text-text font-heading text-sm"
                                        style={{
                                            borderRadius:
                                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const title =
                                                socialDraft.title.trim();
                                            const url = socialDraft.url.trim();
                                            if (!title || !url) return;
                                            setDraftLists({
                                                ...draftLists,
                                                socialLinks: [
                                                    ...draftLists.socialLinks,
                                                    { title, url },
                                                ],
                                            });
                                            setSocialDraft({
                                                title: "",
                                                url: "",
                                            });
                                        }}
                                        className="px-4 py-2 bg-primary border-[2px] border-border text-text text-sm font-heading font-bold transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
                                        style={{
                                            borderRadius:
                                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                                            boxShadow:
                                                "2px 2px 0px 0px #2d2d2d",
                                        }}
                                    >
                                        Add Social Link
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {draftLists.socialLinks.map((link, i) => (
                                        <div
                                            key={`${link.title}-${i}`}
                                            className="p-3 bg-muted/20 border-[2px] border-border flex items-start justify-between gap-2"
                                            style={{
                                                borderRadius:
                                                    "200px 30px 210px 20px / 20px 210px 30px 200px",
                                            }}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-heading font-bold text-text">
                                                    {link.title}
                                                </p>
                                                <p className="text-xs text-primary break-all mt-1">
                                                    {link.url}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDraftLists({
                                                        ...draftLists,
                                                        socialLinks:
                                                            draftLists.socialLinks.filter(
                                                                (_, idx) =>
                                                                    idx !== i,
                                                            ),
                                                    })
                                                }
                                                className="text-xs px-2 py-1 border-[1.5px] border-border text-text/60 hover:text-text transition-all"
                                                style={{
                                                    borderRadius:
                                                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {(profileUser.socialLinks ?? []).map(
                                    (link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block text-sm text-primary hover:underline break-all font-heading font-bold"
                                        >
                                            {link.title}
                                        </a>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Vibe Preset Theme Selector (self only) ─── */}
            {isSelf && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
                    className="anim-item bg-card border border-border-subtle rounded-2xl p-4 md:p-6 shadow-xl"
                >
                    <h3 className="flex items-center gap-2 font-heading font-black text-xl text-text mb-5">
                        <Palette className="w-5 h-5 text-primary" /> Vibe Preset
                    </h3>
                    <p className="text-muted font-mono text-xs mb-4">
                        Pick your aesthetic. Remembered forever.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {VIBE_PRESETS.map((preset) => {
                            const isActive = theme === preset.id;
                            return (
                                <motion.button
                                    key={preset.id}
                                    onClick={() => setTheme(preset.id)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        "relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden",
                                        isActive
                                            ? "border-primary shadow-[0_0_20px_var(--color-primary)] bg-primary/10"
                                            : "border-border-subtle bg-card hover:border-border-subtle/40",
                                    )}
                                >
                                    {/* Color swatch row */}
                                    <div className="flex gap-1.5 mb-3">
                                        {preset.preview.map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-5 h-5 rounded-full border border-white/20"
                                                style={{ background: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">
                                            {preset.emoji}
                                        </span>
                                        <span
                                            className={cn(
                                                "font-heading font-bold text-sm",
                                                isActive
                                                    ? "text-text"
                                                    : "text-muted",
                                            )}
                                        >
                                            {preset.label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-black font-black">
                                            ✓
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
