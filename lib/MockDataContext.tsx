"use client";

import React, { createContext, useContext, useState } from "react";
import { initializeMockData } from "./mockDataGenerator";

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

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  avatarChar: string;
  bio: string;
  karma: number;
  signal: "open" | "flow" | "offline";
  superpowers: Skill[];
  quirks: string[];
  learning: string;
  location: {
    current: string;
    spot: string;
  };
  vibeTags: string[];
  wins: string[];
  exchange: string;
  interests: string[];
};

type MockDataState = {
  feed: FeedItem[];
  quests: Quest[];
  rooms: Room[];
  users: UserProfile[];
  currentUser: UserProfile;
  addFeedItem: (item: Omit<FeedItem, "id">) => void;
  joinQuest: (id: string) => void;
  enterRoom: (id: string) => void;
  updateUserSignal: (signal: UserProfile["signal"]) => void;
  updateUserProfile: (username: string, updates: Partial<UserProfile>) => void;
};

// Initial Data generated procedurally to seed the state
const { initialFeed, initialQuests, initialRooms, initialUsers } = initializeMockData();

// Context
const MockDataContext = createContext<MockDataState | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("bridgr_mock_users");
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Default currentUser is the 0th index from the generator ("bridgr_newbie")
  const currentUser = users[0];

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

  const updateUserProfile = (username: string, updates: Partial<UserProfile>) => {
    setUsers(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(u => u.username === username);
      if (idx !== -1) {
        copy[idx] = { ...copy[idx], ...updates };
        try {
          localStorage.setItem("bridgr_mock_users", JSON.stringify(copy));
        } catch {}
      }
      return copy;
    });
  };

  const updateUserSignal = (signal: UserProfile["signal"]) => {
    updateUserProfile(currentUser.username, { signal });
  };

  return (
    <MockDataContext.Provider value={{ feed, quests, rooms, users, currentUser, addFeedItem, joinQuest, enterRoom, updateUserSignal, updateUserProfile }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) throw new Error("useMockData must be used within MockDataProvider");
  return context;
}
