import { FeedItem, Quest, Room, Skill, UserProfile } from "./MockDataContext";

const FIRST_NAMES = ["Arjun", "Priya", "Rohan", "Sneha", "Karan", "Ananya", "Vikram", "Neha", "Rahul", "Aisha", "Dev", "Zara", "Omar", "Tara", "Sam", "Meera"];
const LAST_INITIALS = ["M.", "P.", "D.", "K.", "S.", "V.", "R.", "A.", "G.", "N."];
const AVATARS = ["😎", "🤓", "🚀", "🔥", "⚡", "👾", "🦊", "👻", "🤖", "🧠", "✨", "🌟"];

const SKILL_POOL: Skill[] = [
  { name: "React.js", color: "border-primary text-primary bg-primary/10", emoji: "💻" },
  { name: "Python", color: "border-quest text-quest bg-quest/10", emoji: "🐍" },
  { name: "Figma", color: "border-alert text-alert bg-alert/10", emoji: "🎨" },
  { name: "Calculus", color: "border-blue-400 text-blue-400 bg-blue-400/10", emoji: "📐" },
  { name: "PyTorch", color: "border-green-400 text-green-400 bg-green-400/10", emoji: "🤖" },
  { name: "UI/UX", color: "border-pink-400 text-pink-400 bg-pink-400/10", emoji: "✨" },
  { name: "Node.js", color: "border-online text-online bg-online/10", emoji: "🟢" },
  { name: "C++", color: "border-indigo-400 text-indigo-400 bg-indigo-400/10", emoji: "⚙️" },
  { name: "Docker", color: "border-cyan-400 text-cyan-400 bg-cyan-400/10", emoji: "🐳" },
  { name: "AWS", color: "border-orange-400 text-orange-400 bg-orange-400/10", emoji: "☁️" }
];

const THEMES: Room["theme"][] = ["primary", "quest", "online", "alert"];
const BLOCK_NAMES = ["Block A", "Block B", "Basement", "Library", "West Wing", "Innovation Lab", "Student Center", "East Wing"];
const ROOM_PURPOSES = ["Coding & Dev", "UI/UX & Art", "AI & ML", "Engineering", "Photography", "Game Dev", "Cybersecurity", "Robotics", "Blockchain", "Hardware"];

// Stable pseudo-random generator
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandom<T>(array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

function getRandomSubset<T>(array: T[], size: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - random());
  return shuffled.slice(0, size);
}

export function generateFeed(count: number): FeedItem[] {
  const requests = [
    "Does anyone know how to configure Tailwind v4 with Framer Motion? Getting hydration errors on my animations.",
    "I keep getting a Segmentation Fault in my C++ assignment. I'll buy coffee for anyone who can trace this pointer issue.",
    "Looking for someone to explain Redux state persistence before the exam tomorrow. I'm based in the library.",
    "Can anyone review my portfolio site? I feel like the typography is completely off but I can't pinpoint why.",
    "My PyTorch model is suffering from vanishing gradients. Anyone want to take a look at my layers?",
    "Need a quick hand setting up a Docker container for a full-stack Postgres app. The volumes aren't sinking.",
    "Who is good at integral calculus? I am totally lost on partial fractions.",
    "Vercel deployment is failing with 'Module Not Found' even though it runs locally perfectly. Pls help!"
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `feed_${i}`,
    type: "request",
    author: {
      name: getRandom(FIRST_NAMES),
      handle: `@${getRandom(FIRST_NAMES).toLowerCase()}${Math.floor(random() * 99)}`,
      avatarChar: getRandom(AVATARS)
    },
    timeAgo: `${Math.floor(random() * 59) + 1}m ago`,
    content: getRandom(requests),
    skills: getRandomSubset(SKILL_POOL, Math.floor(random() * 3) + 1),
    tags: ["HELP NEEDED"]
  }));
}

export function generateQuests(count: number): Quest[] {
  const questTitles = [
    "UI Overhaul for Hackathon",
    "Debug ML Model Error",
    "Math Dept Calculus Survival",
    "Build a Crypto Wallet Clone",
    "Design System Architecture",
    "Indie Game Level Design",
    "Develop IoT Smart Mirror",
    "Reverse Engineer iOS App"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const partySize = Math.floor(random() * 4) + 2;
    const currentMembers = Math.floor(random() * partySize);
    return {
      id: `quest_${i}`,
      title: getRandom(questTitles) + ` #${i+1}`,
      description: "We are putting together a core party to tackle this project over the weekend. Bring your own snacks and extreme caffeine.",
      partySize,
      currentMembers,
      skillsNeeded: getRandomSubset(SKILL_POOL, Math.floor(random() * 3) + 1)
    };
  });
}

export function generateRooms(count: number): Room[] {
  return Array.from({ length: count }).map((_, i) => {
    const capacity = Math.floor(random() * 30) + 10;
    return {
      id: `room_${i}`,
      name: `${getRandom(ROOM_PURPOSES).split(" ")[0]} Chamber ${i+1}`,
      purpose: getRandom(ROOM_PURPOSES),
      occupancy: Math.floor(random() * capacity),
      capacity,
      theme: getRandom(THEMES)
    };
  });
}

export function generateUsers(count: number): UserProfile[] {
  const bios = [
    "I speak Python and drink too much iced coffee. Don't be shy!",
    "Will trade clean CSS modules for any help with Calculus III.",
    "Machine learning enthusiast trying to make sense of loss functions.",
    "Professional Googler. Semi-professional React developer."
  ];

  const quirks = [
    "Knows how to fix the 3D printer jam in the basement.",
    "Expert at resolving weird Next.js caching bugs.",
    "Can configure a Webpack setup from memory.",
    "Found the best coffee vending machine on campus."
  ];

  const learning = ["Rust & WebAssembly", "Unreal Engine 5", "Game Theory", "Distributed Systems"];
  
  const vibes = ["😇 Patient Teacher", "⚡ Quick Fixer", "🦉 Late Night Savior", "🤓 Deep Diver"];
  const wins = ["Helped 3 people with Next.js caching today.", "Guided a freshman through Git push.", "Fixed the robotics lab server overload."];
  const exchanges = [
    "Will help with tricky CSS in exchange for a large Monster Energy.",
    "Help me with PyTorch and I'll debug your React components.",
    "Will proofread your system design doc for a coffee."
  ];
  const interests = ["🎵 Punjabi Pop", "♟️ Chess", "🎮 FIFA 24", "📸 Film Photography", "🎸 Indie Rock"];
  
  const genUsers = Array.from({ length: count }).map((_, i) => {
    const name = getRandom(FIRST_NAMES);
    return {
      id: `usr_${i}`,
      username: `${name.toLowerCase()}${Math.floor(random() * 999)}`,
      name: `${name} ${getRandom(LAST_INITIALS)}`,
      avatarChar: getRandom(AVATARS),
      bio: getRandom(bios),
      karma: Math.floor(random() * 2000),
      signal: getRandom(["open", "flow", "offline"]) as UserProfile["signal"],
      superpowers: getRandomSubset(SKILL_POOL, 3),
      quirks: getRandomSubset(quirks, 2),
      learning: getRandom(learning),
      location: {
        current: getRandom(BLOCK_NAMES),
        spot: getRandom(ROOM_PURPOSES)
      },
      vibeTags: getRandomSubset(vibes, 2),
      wins: getRandomSubset(wins, 2),
      exchange: getRandom(exchanges),
      interests: getRandomSubset(interests, 3)
    };
  });

  // Always inject the default user at index 0
  const defaultUser: UserProfile = {
    id: "self_1",
    username: "bridgr_newbie",
    name: "Dakshesh S.",
    avatarChar: "😎",
    bio: "I speak Python and drink way too much iced coffee. Don't be shy!",
    karma: 142,
    signal: "open",
    superpowers: getRandomSubset(SKILL_POOL, 3),
    quirks: ["Knows how to fix the 3D printer jam in the basement.", "Expert at resolving weird Next.js caching bugs."],
    learning: "Rust & WebAssembly",
    location: { current: "Pixel Pilots Design Hub", spot: "The Vending Machine Corner, Block B" },
    vibeTags: ["😇 Patient Teacher", "⚡ Quick Fixer", "🦉 Late Night Savior"],
    wins: ["Helped 3 people with Next.js App Router caching today.", "Guided a freshman through their first Git push."],
    exchange: "Will help with tricky CSS layouts in exchange for a large Monster Energy.",
    interests: ["🎵 Punjabi Pop", "♟️ Chess", "🎮 FIFA 24"]
  };

  return [defaultUser, ...genUsers];
}

export function initializeMockData() {
  seed = 12345; // Reset seed to prevent HMR drift generating different IDs
  return {
    initialFeed: generateFeed(30),
    initialQuests: generateQuests(30),
    initialRooms: generateRooms(30),
    initialUsers: generateUsers(30)
  };
}
