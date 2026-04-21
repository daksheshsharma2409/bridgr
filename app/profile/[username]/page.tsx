"use client";

import { useState, useLayoutEffect, useRef, use } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Coffee, MapPin, Zap, Sparkles, HeartHandshake, BookOpen, Gift, Edit2, Save, Palette } from "lucide-react";
import { useMockData, UserProfile } from "@/lib/MockDataContext";
import { useVibeTheme, VIBE_PRESETS } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

export default function Chamber({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { users, currentUser, updateUserSignal, updateUserProfile } = useMockData();
  const container = useRef<HTMLDivElement>(null);

  const profileUser = users.find(u => u.username === username);

  const isSelf = currentUser.username === (profileUser?.username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<UserProfile>>({});
  const [draftStrings, setDraftStrings] = useState<{ superpowers: string; quirks: string; vibeTags: string; wins: string; interests: string }>({ superpowers: '', quirks: '', vibeTags: '', wins: '', interests: '' });
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
    const cleanStrings = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
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

    const nextSuperpowers = draftStrings.superpowers.split(",").map((name, i) => {
      return { 
        name: name.trim(), 
        color: PALETTE[i % PALETTE.length], 
        emoji: "" 
      };
    }).filter(s=>s.name);

    updateUserProfile(profileUser.username, {
      ...draft,
      superpowers: nextSuperpowers,
      quirks: cleanStrings(draftStrings.quirks),
      vibeTags: cleanStrings(draftStrings.vibeTags),
      wins: cleanStrings(draftStrings.wins),
      interests: cleanStrings(draftStrings.interests),
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
    setDraftStrings({
      superpowers: profileUser.superpowers.map(s => s.name).join(", "),
      quirks: profileUser.quirks.join(", "),
      vibeTags: profileUser.vibeTags.join(", "),
      wins: profileUser.wins.join(", "),
      interests: profileUser.interests.join(", ")
    });
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
    return <p className="text-lg font-serif italic text-text/90">{profileUser[field] as string}</p>;
  };

  return (
    <div ref={container} className="max-w-3xl mx-auto pb-16 space-y-6">
      
      {/* 1. The "Social Identity" Header */}
      <div className="anim-item relative mb-8">
        <div className="h-40 bg-gradient-to-tr from-primary/30 via-bg to-bg rounded-t-3xl border border-border-subtle relative">
          {isSelf && (
            <button 
              onClick={isEditing ? handleSave : handleEdit}
              className={cn("absolute top-4 right-4 px-4 py-2 rounded-xl font-bold font-heading text-sm flex items-center gap-2 transition-all shadow-lg", isEditing ? "bg-online text-black" : "bg-card border border-border-subtle text-text hover:bg-background/50")}
            >
              {isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
            </button>
          )}
        </div>
        <div className="px-6 md:px-10 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10 w-full mb-6">
            <div className="w-32 h-32 bg-[#1A1A1A] border-4 border-bg rounded-3xl flex items-center justify-center shadow-[0_0_30px_var(--primary)] backdrop-blur-md relative overflow-hidden group">
              <span className="text-6xl group-hover:scale-110 transition-transform cursor-crosshair">{profileUser.avatarChar}</span>
            </div>
            
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
              <div>
                {isEditing ? (
                  <input type="text" className="text-4xl font-heading font-black uppercase text-text tracking-tighter bg-transparent border-b border-border-subtle outline-none w-full mb-1" value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} />
                ) : (
                  <h2 className="text-4xl font-heading font-black uppercase text-text tracking-tighter">{profileUser.name}</h2>
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
                  <div className="bg-card border border-white/5 rounded-full p-1 flex gap-1 shadow-lg">
                    <button onClick={() => updateUserSignal("open")} className={cn("px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-2", profileUser.signal === "open" ? "bg-online/20 text-online" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "open" ? "bg-online shadow-[0_0_8px_var(--online)]" : "bg-gray-600")} /> Open</button>
                    <button onClick={() => updateUserSignal("flow")} className={cn("px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-2", profileUser.signal === "flow" ? "bg-alert/20 text-alert" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "flow" ? "bg-alert shadow-[0_0_8px_var(--alert)]" : "bg-gray-600")} /> Flow</button>
                    <button onClick={() => updateUserSignal("offline")} className={cn("px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all flex flex-row items-center gap-2", profileUser.signal === "offline" ? "bg-background/50 text-text" : "text-muted hover:text-text")}><div className={cn("w-2 h-2 rounded-full", profileUser.signal === "offline" ? "bg-text" : "bg-gray-600")} /> DND</button>
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
          
          <div className="bg-card/50 border border-border-subtle p-4 rounded-xl border-l-4 border-l-primary flex justify-between items-center group">
            <div className="w-full">
              {renderEditableText('bio')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Skill Inventory - Main Card */}
        <div className="md:col-span-8">
           <div className="anim-item bg-card border border-border-subtle rounded-3xl p-6 shadow-xl relative group bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-xl text-text mb-5">
              <Zap className="w-5 h-5 text-primary" /> Skill Inventory
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">My Superpowers</span>
                {isEditing ? (
                  <input type="text" className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs" placeholder="Comma separated superpowers..." value={draftStrings.superpowers} onChange={(e) => setDraftStrings({...draftStrings, superpowers: e.target.value})} />
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
                  <textarea className="w-full bg-background/50 border border-border-subtle rounded-xl p-3 text-text font-mono text-xs resize-none" rows={3} placeholder="Comma separated..." value={draftStrings.quirks} onChange={(e) => setDraftStrings({...draftStrings, quirks: e.target.value})} />
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
        <div className="md:col-span-4">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-6 shadow-xl border-t-4 border-t-karma bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-xl text-text mb-5"><HeartHandshake className="w-5 h-5 text-karma" /> Social Proof</h3>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">My Vibe Tags</span>
              {isEditing ? (
                <input type="text" className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs" placeholder="Comma separated..." value={draftStrings.vibeTags} onChange={(e) => setDraftStrings({...draftStrings, vibeTags: e.target.value})} />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileUser.vibeTags.map((v, i) => <span key={i} className="px-3 py-1.5 rounded-xl bg-background/50 border border-border-subtle text-[11px] font-bold text-text uppercase tracking-wider">{v}</span>)}
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block opacity-60">Recent Wins</span>
              {isEditing ? (
                <textarea className="w-full bg-background/50 border border-border-subtle rounded-xl p-3 text-text font-mono text-xs resize-none" rows={3} placeholder="Comma separated..." value={draftStrings.wins} onChange={(e) => setDraftStrings({...draftStrings, wins: e.target.value})} />
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
        <div className="md:col-span-5">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-6 shadow-xl relative overflow-hidden bento-glow h-full min-h-[220px]">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-online opacity-10 blur-[50px] rounded-full pointer-events-none" />
             <h3 className="flex items-center gap-2 font-heading font-black text-xl text-text mb-5 relative z-10">
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
        <div className="md:col-span-7">
          <div className="anim-item bg-card border border-border-subtle rounded-3xl p-6 shadow-xl border-b-4 border-b-pink-500 relative group bento-glow h-full">
            <h3 className="flex items-center gap-2 font-heading font-black text-xl text-text mb-4 text-pink-500"><Gift className="w-5 h-5 shrink-0" /> Let's Trade</h3>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-5 mb-5 relative group/trade overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/trade:opacity-20 transition-opacity">
                <Sparkles className="w-8 h-8 text-pink-500" />
              </div>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block mb-2 opacity-80">Will Exchange Help For</span>
              {isEditing ? (
                <textarea className="w-full bg-background/50 border border-pink-500/30 rounded-xl p-3 text-text font-heading font-bold text-sm resize-none" value={draft.exchange || ""} onChange={e => setDraft({...draft, exchange: e.target.value})} />
              ) : (
                <p className="font-heading font-bold text-text text-sm relative z-10 leading-relaxed italic">"{profileUser.exchange}"</p>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3 opacity-60">Ice-Breaker Interests</span>
              {isEditing ? (
                <input type="text" className="w-full bg-background/50 border border-border-subtle rounded-xl px-3 py-2 text-text font-mono text-xs" placeholder="Comma separated..." value={draftStrings.interests} onChange={(e) => setDraftStrings({...draftStrings, interests: e.target.value})} />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((int, i) => <span key={i} className="px-3 py-1.5 rounded-xl bg-background border border-border-subtle text-xs font-bold text-muted hover:text-text transition-colors cursor-default">{int}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Vibe Preset Theme Selector (self only) ─── */}
      {isSelf && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
          className="anim-item bg-card border border-white/5 rounded-2xl p-6 shadow-xl"
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
