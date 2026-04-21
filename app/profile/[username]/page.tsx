"use client";

import { useState, useLayoutEffect, useRef, use } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Coffee, MapPin, Zap, Sparkles, HeartHandshake, BookOpen, Gift, Edit2, Save, Palette, Link as LinkIcon, FolderGit2 } from "lucide-react";
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
          className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 rounded-xl bg-primary text-black text-xs font-heading font-bold"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <button
            key={`${item}-${idx}`}
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="px-3 py-1.5 rounded-xl bg-background border border-border-subtle text-xs font-bold text-text"
            title="Remove item"
          >
            {item} ×
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Chamber({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { users, currentUser, updateUserSignal, updateUserProfile } = useMockData();
  const container = useRef<HTMLDivElement>(null);

  const profileUser = users.find(u => u.username === username);

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
  }>({ superpowers: [], quirks: [], vibeTags: [], wins: [], interests: [], projects: [], socialLinks: [] });
  const [projectDraft, setProjectDraft] = useState({ name: "", description: "", repoUrl: "", liveUrl: "" });
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
        ease: "power2.out"
      });
    }, container);
    return () => ctx.revert();
  }, [profileUser]);

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-4xl font-heading text-text">404 - Nerd Not Found</h2>
        <p className="text-muted font-mono">This user does not exist in our grid.</p>
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

    const nextSuperpowers = draftLists.superpowers.map((name, i) => {
      return { 
        name: name.trim(), 
        color: PALETTE[i % PALETTE.length], 
        emoji: "" 
      };
    }).filter(s=>s.name);

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
      superpowers: profileUser.superpowers.map(s => s.name),
      quirks: profileUser.quirks,
      vibeTags: profileUser.vibeTags,
      wins: profileUser.wins,
      interests: profileUser.interests,
      projects: profileUser.projects ?? [],
      socialLinks: profileUser.socialLinks ?? [],
    });
    setProjectDraft({ name: "", description: "", repoUrl: "", liveUrl: "" });
    setSocialDraft({ title: "", url: "" });
    setIsEditing(true);
  };

  const renderEditableText = (field: keyof UserProfile, label?: string) => {
    if (isEditing) {
      if (field === 'bio' || field === 'exchange') {
         return (
           <textarea 
             className="w-full bg-background/50 border border-border-subtle rounded p-2 text-text font-mono text-sm resize-none"
             value={draft[field] as string}
             onChange={e => setDraft({ ...draft, [field]: e.target.value })}
           />
         );
      }
      return (
        <input 
          type="text"
          className="bg-background/50 border border-border-subtle rounded px-2 py-1 text-text font-heading text-sm w-full"
          value={draft[field] as string}
          onChange={e => setDraft({ ...draft, [field]: e.target.value })}
        />
      );
    }
    return <p className="text-base md:text-lg font-serif italic text-text/90">{profileUser[field] as string}</p>;
  };

  return (
    <div ref={container} className="max-w-4xl mx-auto pb-8 md:pb-16 space-y-4 md:space-y-6">
      
      {/* 1. The "Social Identity" Header */}
      <div className="anim-item relative mb-4 md:mb-8">
        <div className="h-28 md:h-40 bg-gradient-to-tr from-primary/30 via-bg to-bg rounded-t-3xl border border-border-subtle relative">
          {isSelf && (
            <button 
              onClick={isEditing ? handleSave : handleEdit}
              className={cn("absolute top-3 right-3 px-3 py-1.5 rounded-xl font-bold font-heading text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg", isEditing ? "bg-online text-black" : "bg-card border border-border-subtle text-text hover:bg-background/50")}
            >
              {isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
            </button>
          )}
        </div>
        <div className="px-4 md:px-10 pb-4 md:pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 md:gap-6 -mt-12 md:-mt-16 relative z-10 w-full mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-card border-4 border-bg rounded-3xl flex items-center justify-center shadow-[0_0_30px_var(--color-primary)] backdrop-blur-md relative overflow-hidden group">
              <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform cursor-crosshair">{profileUser.avatarChar}</span>
            </div>
            
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
              <div>
                {isEditing ? (
                  <input type="text" className="text-2xl md:text-4xl font-heading font-black uppercase text-text tracking-tighter bg-transparent border-b border-border-subtle outline-none w-full mb-1" value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} />
                ) : (
                  <h2 className="text-2xl md:text-4xl font-heading font-black uppercase text-text tracking-tighter">{profileUser.name}</h2>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono text-primary font-bold">@{profileUser.username}</p>
                  <span className="flex items-center gap-1 bg-karma/10 border border-karma/30 px-2 py-0.5 rounded text-xs font-bold text-karma uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> {profileUser.karma}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isSelf ? (
                  <div className="bg-card border border-border-subtle rounded-full p-1 flex gap-1 shadow-lg">
                    <button onClick={() => updateUserSignal("open")} className={cn("px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5", profileUser.signal === "open" ? "bg-online/20 text-online" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "open" ? "bg-online shadow-[0_0_8px_var(--color-online)]" : "bg-gray-600")} /> Open</button>
                    <button onClick={() => updateUserSignal("flow")} className={cn("px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5", profileUser.signal === "flow" ? "bg-alert/20 text-alert" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "flow" ? "bg-alert shadow-[0_0_8px_var(--color-alert)]" : "bg-gray-600")} /> Flow</button>
                    <button onClick={() => updateUserSignal("offline")} className={cn("px-2.5 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-1.5", profileUser.signal === "offline" ? "bg-background/50 text-text" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "offline" ? "bg-text" : "bg-gray-600")} /> DND</button>
                  </div>
                ) : (
                  <div className="bg-card border border-border-subtle rounded-full p-2 flex items-center gap-3 px-4 shadow-lg cursor-default">
                    <div className={cn("w-3 h-3 rounded-full", profileUser.signal === "open" ? "bg-online animate-pulse shadow-[0_0_8px_var(--online)]" : profileUser.signal === "flow" ? "bg-alert animate-pulse shadow-[0_0_8px_var(--alert)]" : "bg-gray-500")} />
                    <span className={cn("text-sm font-heading font-bold uppercase", profileUser.signal === "open" ? "text-online" : profileUser.signal === "flow" ? "text-alert" : "text-muted")}>
                      {profileUser.signal}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card/50 border border-border-subtle p-3 md:p-4 rounded-xl border-l-4 border-l-primary flex justify-between items-center group">
            <div className="w-full">
              {renderEditableText('bio')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
        
        {/* Skill Inventory - Main Card */}
        <div className="lg:col-span-8">
           <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl relative group bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4 md:mb-5">
              <Zap className="w-5 h-5 text-primary" /> Skill Inventory
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">My Superpowers</span>
                {isEditing ? (
                  <ListEditor
                    items={draftLists.superpowers}
                    onChange={(superpowers) => setDraftLists({ ...draftLists, superpowers })}
                    placeholder="Add a superpower..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {profileUser.superpowers.map((sp, idx) => (
                      <span key={idx} className={cn("bg-background border-2 px-3 py-2 rounded-xl text-sm font-heading font-bold flex items-center transition-transform hover:scale-105 active:scale-95", sp.emoji ? "gap-1.5" : "", sp.color)}>
                        {sp.emoji && <span className="text-lg">{sp.emoji}</span>} {sp.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">The Lab Quirks (Niche Flex)</span>
                {isEditing ? (
                  <ListEditor
                    items={draftLists.quirks}
                    onChange={(quirks) => setDraftLists({ ...draftLists, quirks })}
                    placeholder="Add a quirk..."
                  />
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {profileUser.quirks.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm font-mono text-text/80 bg-background/50 p-2.5 rounded-xl border border-border-subtle group/item"><span className="text-primary group-hover/item:translate-x-1 transition-transform">▸</span> {q}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-quest/10 border border-quest/30 px-5 py-3 rounded-2xl w-full group/learn overflow-hidden relative">
                  <div className="absolute inset-0 bg-quest/5 -translate-x-full group-hover/learn:translate-x-0 transition-transform duration-500" />
                  <BookOpen className="w-5 h-5 text-quest shrink-0 relative z-10" />
                  <div className="w-full relative z-10">
                    <span className="text-[10px] font-bold text-quest uppercase tracking-wider block leading-none mb-1 opacity-80">Learning Currently</span>
                    {isEditing ? (
                      <input type="text" className="bg-background/20 border-b border-quest/40 outline-none px-1 text-text text-sm font-heading font-bold w-full" value={draft.learning || ""} onChange={e => setDraft({...draft, learning: e.target.value})} />
                    ) : (
                       <span className="font-heading font-bold text-sm text-text">{profileUser.learning}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof - Side Card */}
        <div className="lg:col-span-4">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl border-t-4 border-t-karma bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4 md:mb-5"><HeartHandshake className="w-5 h-5 text-karma" /> Social Proof</h3>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">My Vibe Tags</span>
              {isEditing ? (
                <ListEditor
                  items={draftLists.vibeTags}
                  onChange={(vibeTags) => setDraftLists({ ...draftLists, vibeTags })}
                  placeholder="Add a vibe tag..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileUser.vibeTags.map((v, i) => <span key={i} className="px-3 py-1.5 rounded-xl bg-background/50 border border-border-subtle text-[11px] font-bold text-text uppercase tracking-wider">{v}</span>)}
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">Recent Wins</span>
              {isEditing ? (
                <ListEditor
                  items={draftLists.wins}
                  onChange={(wins) => setDraftLists({ ...draftLists, wins })}
                  placeholder="Add a recent win..."
                />
              ) : (
                <div className="space-y-4 relative border-l-2 border-border-subtle ml-2 pl-5 py-1">
                  {profileUser.wins.map((w, i) => (
                    <div key={i} className="relative group/win">
                      <div className={cn("absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 border-card transition-all group-hover/win:scale-125", i === 0 ? "bg-karma shadow-[0_0_8px_var(--karma)]" : "bg-muted")} />
                      <p className={cn("text-sm font-mono leading-relaxed", i === 0 ? "text-text" : "text-muted")}>{w}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campus Coordinates - Lower Left */}
        <div className="lg:col-span-5">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden bento-glow h-full min-h-[180px] md:min-h-[220px]">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-online opacity-10 blur-[50px] rounded-full pointer-events-none" />
             <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4 md:mb-5 relative z-10">
               <MapPin className="w-5 h-5 text-online" /> Campus Coordinates
             </h3>
             <div className="space-y-4 relative z-10 w-full">
                <div className="flex gap-4 items-center bg-background/40 backdrop-blur-sm border border-border-subtle p-4 rounded-2xl w-full hover:bg-background/60 transition-colors group/coord">
                  <div className="w-12 h-12 rounded-2xl bg-online/15 flex items-center justify-center border border-online/30 transition-all group-hover/coord:rotate-6">
                    <div className="w-3.5 h-3.5 bg-online rounded-full animate-pulse shadow-[0_0_12px_var(--online)]" />
                  </div>
                  <div className="w-full flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1 opacity-60">Find Me At (Right Now)</span>
                    {isEditing ? (
                      <input type="text" className="bg-transparent border-b border-muted outline-none text-text text-sm font-heading font-bold w-full truncate" value={draft.location?.current || ""} onChange={e => setDraft({...draft, location: {...draft.location!, current: e.target.value}})} />
                    ) : (
                      <span className="font-heading font-bold text-text truncate block">{profileUser.location.current}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 items-center px-4 py-3 w-full bg-background/20 rounded-2xl border border-border-subtle/50">
                  <Coffee className="w-5 h-5 text-muted shrink-0" />
                  <div className="w-full min-w-0">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1 opacity-60">Local Haunt</span>
                    {isEditing ? (
                      <input type="text" className="bg-transparent border-b border-border-subtle outline-none text-text font-mono text-sm w-full" value={draft.location?.spot || ""} onChange={e => setDraft({...draft, location: {...draft.location!, spot: e.target.value}})} />
                    ) : (
                      <span className="font-mono text-sm text-text/70 truncate block">{profileUser.location.spot}</span>
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Let's Trade - Lower Right */}
        <div className="lg:col-span-7">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl border-b-4 border-b-primary relative group bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4 text-primary"><Gift className="w-5 h-5 shrink-0" /> Let's Trade</h3>
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 md:p-5 mb-4 md:mb-5 relative group/trade overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/trade:opacity-20 transition-opacity">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 opacity-80">Will Exchange Help For</span>
              {isEditing ? (
                <textarea className="w-full bg-background/50 border border-primary/30 rounded-xl p-3 text-text font-heading font-bold text-sm resize-none" value={draft.exchange || ""} onChange={e => setDraft({...draft, exchange: e.target.value})} />
              ) : (
                <p className="font-heading font-bold text-text text-sm relative z-10 leading-relaxed italic">"{profileUser.exchange}"</p>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3 opacity-60">Ice-Breaker Interests</span>
              {isEditing ? (
                <ListEditor
                  items={draftLists.interests}
                  onChange={(interests) => setDraftLists({ ...draftLists, interests })}
                  placeholder="Add an interest..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((int, i) => <span key={i} className="px-3 py-1.5 rounded-xl bg-background border border-border-subtle text-xs font-bold text-muted hover:text-text transition-colors cursor-default">{int}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4">
              <FolderGit2 className="w-5 h-5 text-primary" /> Projects
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <input
                    value={projectDraft.name}
                    onChange={(e) => setProjectDraft({ ...projectDraft, name: e.target.value })}
                    placeholder="Project name"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
                  />
                  <textarea
                    value={projectDraft.description}
                    onChange={(e) => setProjectDraft({ ...projectDraft, description: e.target.value })}
                    placeholder="Project description"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs min-h-[72px]"
                  />
                  <input
                    value={projectDraft.repoUrl}
                    onChange={(e) => setProjectDraft({ ...projectDraft, repoUrl: e.target.value })}
                    placeholder="Repository link"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
                  />
                  <input
                    value={projectDraft.liveUrl}
                    onChange={(e) => setProjectDraft({ ...projectDraft, liveUrl: e.target.value })}
                    placeholder="Working link (optional)"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = projectDraft.name.trim();
                      const description = projectDraft.description.trim();
                      const repoUrl = projectDraft.repoUrl.trim();
                      const liveUrl = projectDraft.liveUrl.trim();
                      if (!name || !description || !repoUrl) return;
                      setDraftLists({
                        ...draftLists,
                        projects: [...draftLists.projects, { name, description, repoUrl, liveUrl }],
                      });
                      setProjectDraft({ name: "", description: "", repoUrl: "", liveUrl: "" });
                    }}
                    className="px-3 py-2 rounded-xl bg-primary text-black text-xs font-heading font-bold"
                  >
                    Add Project
                  </button>
                </div>
                <div className="space-y-2">
                  {draftLists.projects.map((project, i) => (
                    <div key={`${project.name}-${i}`} className="p-3 rounded-xl bg-background border border-border-subtle">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-heading font-bold text-text">{project.name}</p>
                          <p className="text-xs text-muted mt-1">{project.description}</p>
                          <p className="text-[11px] text-primary mt-2 break-all">{project.repoUrl}</p>
                          {project.liveUrl ? <p className="text-[11px] text-online mt-1 break-all">{project.liveUrl}</p> : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDraftLists({ ...draftLists, projects: draftLists.projects.filter((_, idx) => idx !== i) })}
                          className="text-xs px-2 py-1 rounded-lg border border-border-subtle text-muted hover:text-text"
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
                {(profileUser.projects ?? []).map((project, i) => (
                  <div key={i} className="p-3 rounded-xl bg-background border border-border-subtle">
                    <p className="text-sm font-heading font-bold text-text">{project.name}</p>
                    <p className="text-xs text-muted mt-1">{project.description}</p>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="block text-xs text-primary hover:underline break-all mt-2">
                      Repository
                    </a>
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block text-xs text-online hover:underline break-all mt-1">
                        Live Project
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-4 md:p-6 shadow-xl h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-lg md:text-xl text-text mb-4">
              <LinkIcon className="w-5 h-5 text-online" /> Social Links
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <input
                    value={socialDraft.title}
                    onChange={(e) => setSocialDraft({ ...socialDraft, title: e.target.value })}
                    placeholder="Social title (e.g. GitHub)"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
                  />
                  <input
                    value={socialDraft.url}
                    onChange={(e) => setSocialDraft({ ...socialDraft, url: e.target.value })}
                    placeholder="Social link URL"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const title = socialDraft.title.trim();
                      const url = socialDraft.url.trim();
                      if (!title || !url) return;
                      setDraftLists({
                        ...draftLists,
                        socialLinks: [...draftLists.socialLinks, { title, url }],
                      });
                      setSocialDraft({ title: "", url: "" });
                    }}
                    className="px-3 py-2 rounded-xl bg-primary text-black text-xs font-heading font-bold"
                  >
                    Add Social Link
                  </button>
                </div>
                <div className="space-y-2">
                  {draftLists.socialLinks.map((link, i) => (
                    <div key={`${link.title}-${i}`} className="p-3 rounded-xl bg-background border border-border-subtle flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-heading font-bold text-text">{link.title}</p>
                        <p className="text-xs text-primary break-all mt-1">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraftLists({ ...draftLists, socialLinks: draftLists.socialLinks.filter((_, idx) => idx !== i) })}
                        className="text-xs px-2 py-1 rounded-lg border border-border-subtle text-muted hover:text-text"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {(profileUser.socialLinks ?? []).map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className="block text-xs md:text-sm text-primary hover:underline break-all">
                    {link.title}
                  </a>
                ))}
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
          <p className="text-muted font-mono text-xs mb-4">Pick your aesthetic. Remembered forever.</p>
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
                      : "border-border-subtle bg-card hover:border-border-subtle/40"
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
                    <span className="text-xl">{preset.emoji}</span>
                    <span className={cn("font-heading font-bold text-sm", isActive ? "text-text" : "text-muted")}>
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
