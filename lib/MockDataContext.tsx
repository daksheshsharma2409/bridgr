"use client";

import React, { createContext, useContext, useState } from "react";

// Types
export type Skill = { name: string; color: string; emoji: string };

export type FeedItem = {
  id: string;
  type: "request" | "event" | "quest" | "profile";
  author: { name: string; handle: string; avatarChar: string };
  timeAgo: string;
  content: string;
  skills: Skill[];
  tags: string[];
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  partySize: number;
  currentMembers: number;
  skillsNeeded: Skill[];
};

export type Room = {
  id: string;
  name: string;
  purpose: string;
  occupancy: number;
  capacity: number;
  theme: "primary" | "quest" | "online" | "alert";
};

type MockDataState = {
  feed: FeedItem[];
  quests: Quest[];
  rooms: Room[];
  addFeedItem: (item: Omit<FeedItem, "id">) => void;
  joinQuest: (id: string) => void;
  enterRoom: (id: string) => void;
  currentUserKarma: number;
  incrementKarma: (amount: number) => void;
};

// Initial Data
const initialFeed: FeedItem[] = [
  {
    id: "f1",
    type: "request",
    author: { name: "Priya", handle: "@pixelwitch", avatarChar: "P" },
    timeAgo: "2m ago",
    content: "Does anyone know how to configure Tailwind v4 with Framer Motion? Getting hydration errors on my animations. I'm in the Coding Hub right now.",
    skills: [
      { name: "React.js", color: "text-primary border-primary", emoji: "💻" },
      { name: "CSS", color: "text-white border-white", emoji: "🎨" }
    ],
    tags: ["HELP NEEDED"]
  }
];

const initialQuests: Quest[] = [
  {
    id: "q1",
    title: "UI Overhaul for Hackathon",
    description: "We need a design nerd to help us finish our Figma prototype before midnight. We have Red Bull.",
    partySize: 4,
    currentMembers: 3,
    skillsNeeded: [
      { name: "Figma", color: "bg-pink-500", emoji: "🎨" },
      { name: "UI/UX", color: "bg-pink-600", emoji: "📐" }
    ]
  },
  {
    id: "q2",
    title: "Debug ML Model Error",
    description: "Getting a weird tensor shape mismatch. Need someone who speaks PyTorch.",
    partySize: 2,
    currentMembers: 1,
    skillsNeeded: [
      { name: "PyTorch", color: "bg-green-600", emoji: "🤖" },
      { name: "Python", color: "bg-violet-500", emoji: "💻" }
    ]
  }
];

const initialRooms: Room[] = [
  { id: "r1", name: "Logic Lords Chamber", purpose: "Algorithms & Competitive Programming", occupancy: 14, capacity: 20, theme: "primary" },
  { id: "r2", name: "Pixel Pilots Hub", purpose: "UI/UX & Graphic Design", occupancy: 6, capacity: 15, theme: "quest" },
  { id: "r3", name: "Silicon Synapse", purpose: "AI & Machine Learning", occupancy: 22, capacity: 30, theme: "online" }
];

// Context
const MockDataContext = createContext<MockDataState | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentUserKarma, setCurrentUserKarma] = useState(142);

  const addFeedItem = (item: Omit<FeedItem, "id">) => {
    setFeed(prev => [{ ...item, id: `f${Date.now()}` }, ...prev]);
  };

  const joinQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && q.currentMembers < q.partySize) {
        return { ...q, currentMembers: q.currentMembers + 1 };
      }
      return q;
    }));
  };

  const enterRoom = (id: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id === id && r.occupancy < r.capacity) {
        return { ...r, occupancy: r.occupancy + 1 };
      }
      return r;
    }));
  };

  const incrementKarma = (amount: number) => {
    setCurrentUserKarma(prev => prev + amount);
  };

  return (
    <MockDataContext.Provider value={{ feed, quests, rooms, addFeedItem, joinQuest, enterRoom, currentUserKarma, incrementKarma }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) throw new Error("useMockData must be used within MockDataProvider");
  return context;
}
