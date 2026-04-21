"use client";

import React, { createContext, useContext, useState } from "react";
import { initializeMockData } from "./mockDataGenerator";

// Types
export type Skill = { name: string; color: string; emoji: string };
export type SocialLink = { title: string; url: string };
export type ProjectLink = {
  name: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
};

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
  projects: ProjectLink[];
  socialLinks: SocialLink[];
};

function normalizeUserProfile(user: UserProfile): UserProfile {
  const normalizedProjects = Array.isArray(user.projects)
    ? user.projects
        .map((project) => {
          if (!project || typeof project !== "object") return null;
          const candidate = project as Partial<ProjectLink>;
          if (!candidate.name || !candidate.description || !candidate.repoUrl) return null;
          return {
            name: candidate.name,
            description: candidate.description,
            repoUrl: candidate.repoUrl,
            liveUrl: candidate.liveUrl || "",
          };
        })
        .filter((project): project is ProjectLink => Boolean(project))
    : [];

  const normalizedSocialLinks = Array.isArray(user.socialLinks)
    ? user.socialLinks
        .map((link) => {
          if (!link || typeof link !== "object") return null;
          const candidate = link as Partial<SocialLink>;
          if (!candidate.title || !candidate.url) return null;
          return { title: candidate.title, url: candidate.url };
        })
        .filter((link): link is SocialLink => Boolean(link))
    : [];

  return {
    ...user,
    projects: normalizedProjects,
    socialLinks: normalizedSocialLinks,
  };
}

type MockDataState = {
  feed: FeedItem[];
  quests: Quest[];
  rooms: Room[];
  users: UserProfile[];
  currentUser: UserProfile;
  addFeedItem: (item: Omit<FeedItem, "id">) => void;
  offerHelp: (feedId: string) => void;
  joinQuest: (id: string) => void;
  createQuest: (quest: Omit<Quest, "id" | "currentMembers">) => void;
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
  const [users, setUsers] = useState<UserProfile[]>(initialUsers.map(normalizeUserProfile));

  React.useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("bridgr_mock_users");
      const storedFeed = localStorage.getItem("bridgr_mock_feed");
      const storedQuests = localStorage.getItem("bridgr_mock_quests");
      const storedRooms = localStorage.getItem("bridgr_mock_rooms");

      if (storedUsers) {
        const parsed = JSON.parse(storedUsers) as UserProfile[];
        setUsers(parsed.map(normalizeUserProfile));
      }
      if (storedFeed) setFeed(JSON.parse(storedFeed));
      if (storedQuests) setQuests(JSON.parse(storedQuests));
      if (storedRooms) setRooms(JSON.parse(storedRooms));
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("bridgr_mock_feed", JSON.stringify(feed));
    } catch {}
  }, [feed]);

  React.useEffect(() => {
    try {
      localStorage.setItem("bridgr_mock_quests", JSON.stringify(quests));
    } catch {}
  }, [quests]);

  React.useEffect(() => {
    try {
      localStorage.setItem("bridgr_mock_rooms", JSON.stringify(rooms));
    } catch {}
  }, [rooms]);

  React.useEffect(() => {
    try {
      localStorage.setItem("bridgr_mock_users", JSON.stringify(users));
    } catch {}
  }, [users]);

  // Default currentUser is the 0th index from the generator ("bridgr_newbie")
  const currentUser = users[0] ?? initialUsers[0];

  const addFeedItem = (item: Omit<FeedItem, "id">) => {
    setFeed(prev => [{ ...item, id: `f${Date.now()}` }, ...prev]);
  };

  const offerHelp = (feedId: string) => {
    let wasApplied = false;
    setFeed(prev => prev.map(item => {
      if (item.id !== feedId) return item;
      if (item.author.handle === `@${currentUser.username}`) return item;
      if (item.tags.includes("HELP OFFERED")) return item;
      wasApplied = true;
      return { ...item, tags: [...item.tags, "HELP OFFERED"] };
    }));
    if (!wasApplied) return;
    setUsers(prev => prev.map(user => {
      if (user.username !== currentUser.username) return user;
      return { ...user, karma: user.karma + 8 };
    }));
  };

  const joinQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && q.currentMembers < q.partySize) {
        return { ...q, currentMembers: q.currentMembers + 1 };
      }
      return q;
    }));
    setUsers(prev => prev.map(user => {
      if (user.username !== currentUser.username) return user;
      return { ...user, karma: user.karma + 5 };
    }));
  };

  const createQuest = (quest: Omit<Quest, "id" | "currentMembers">) => {
    setQuests(prev => [{
      ...quest,
      id: `quest_custom_${Date.now()}`,
      currentMembers: 1,
    }, ...prev]);
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
    <MockDataContext.Provider value={{ feed, quests, rooms, users, currentUser, addFeedItem, offerHelp, joinQuest, createQuest, enterRoom, updateUserSignal, updateUserProfile }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) throw new Error("useMockData must be used within MockDataProvider");
  return context;
}
