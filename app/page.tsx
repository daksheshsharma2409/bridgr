"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SignalBadge } from "@/components/ui/SignalBadge";
import { MessageSquare, Search, Sparkles, Terminal } from "lucide-react";
import { useMockData } from "@/lib/MockDataContext";

export default function Lobby() {
  const { feed, users, addFeedItem, offerHelp, currentUser } = useMockData();
  const [newPost, setNewPost] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    addFeedItem({
      type: "request",
      author: { name: currentUser.name, handle: `@${currentUser.username}`, avatarChar: currentUser.avatarChar },
      timeAgo: "Just now",
      content: newPost,
      skills: [],
      tags: ["NEW REQUEST", "STRUCTURED HELP"]
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

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-4 md:space-y-6">
      <section className="rounded-3xl border border-border-subtle bg-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-text uppercase">The Lobby</h2>
            <p className="text-xs md:text-sm font-mono text-muted mt-1">Find help fast. Offer help faster.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-background rounded-full border border-border-subtle px-3 py-1.5 text-xs">
            <SignalBadge status={currentUser.signal} />
            <span className="text-muted">You are currently</span>
            <span className="font-bold text-text uppercase">{currentUser.signal}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => {
              addFeedItem({
                type: "request",
                author: { name: currentUser.name, handle: `@${currentUser.username}`, avatarChar: currentUser.avatarChar },
                timeAgo: "Just now",
                content: "Quick collaboration pod forming now. Share blockers in this thread.",
                skills: [],
                tags: ["POD CALL", "STRUCTURED HELP"],
              });
            }}
            className="h-11 rounded-xl bg-primary text-black font-heading font-bold text-sm flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Assemble Pod
          </button>
          <button
            onClick={() => setActiveFilter("Skills")}
            className="h-11 rounded-xl bg-background border border-border-subtle text-text font-heading font-bold text-sm"
          >
            Skills Needed
          </button>
          <button
            onClick={() => setActiveFilter("Events")}
            className="h-11 rounded-xl bg-background border border-border-subtle text-text font-heading font-bold text-sm"
          >
            Events
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-3xl border border-border-subtle bg-card p-4 md:p-5">
          <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-background px-3 py-2">
            <Search className="w-4 h-4 text-muted" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requests by skill, tag, name..."
              className="w-full bg-transparent outline-none text-sm text-text placeholder:text-muted"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-3">
            {["All", "Skills", "Quests", "Events"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${activeFilter === filter ? "bg-primary text-black" : "bg-background border border-border-subtle text-muted"}`}
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
              className="w-full min-h-[110px] rounded-2xl border border-border-subtle bg-background p-3 pr-28 text-sm text-text resize-none"
            />
            <button type="submit" disabled={!newPost.trim()} className="absolute right-2 bottom-2 h-9 px-4 rounded-xl bg-primary text-black font-bold text-sm disabled:opacity-40">
              Post
            </button>
          </form>

          <div className="space-y-3">
            {filteredFeed.filter((item) => item.type === "request").map((item) => (
              <article key={item.id} className="rounded-2xl border border-border-subtle bg-background p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-border-subtle bg-card flex items-center justify-center text-xs">{item.author.avatarChar}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{item.author.name}</p>
                    <p className="text-[11px] font-mono text-muted truncate">{item.author.handle} • {item.timeAgo}</p>
                  </div>
                  <div className="ml-auto flex gap-1 flex-wrap justify-end">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-card border border-border-subtle text-[10px] font-bold text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-text/90">{item.content}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg text-[11px] font-bold bg-card border border-border-subtle text-text">
                      {skill.emoji} {skill.name}
                    </span>
                  ))}
                </div>
                  <button
                    onClick={() => offerHelp(item.id)}
                    disabled={item.author.handle === `@${currentUser.username}` || item.tags.includes("HELP OFFERED")}
                    className="mt-3 w-full h-10 rounded-xl border border-border-subtle bg-card disabled:opacity-50 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> {item.author.handle === `@${currentUser.username}` ? "Your Request" : item.tags.includes("HELP OFFERED") ? "Help Offered" : "Offer Help"}
                  </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 rounded-3xl border border-border-subtle bg-card p-4 md:p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Discover Helpers</h3>
          <div className="mt-3 space-y-2">
            {users.slice(1, 9).map((user) => (
              <Link key={user.id} href={`/profile/${user.username}`} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-background p-2.5">
                <div className="w-10 h-10 rounded-full border border-border-subtle bg-card flex items-center justify-center">{user.avatarChar}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text truncate">{user.name}</p>
                  <p className="text-[11px] font-mono text-muted truncate">@{user.username}</p>
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
