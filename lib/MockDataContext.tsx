"use client";

import React, { createContext, useContext, useState } from "react";
import { generateFeed, generateQuests, generateRooms } from "./mockDataGenerator";

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

// Initial Data generated procedurally to seed the state
const initialFeed: FeedItem[] = generateFeed(30);
const initialQuests: Quest[] = generateQuests(30);
const initialRooms: Room[] = generateRooms(30);

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
