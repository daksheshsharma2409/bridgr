# Bridgr — Knowledge Context for LLMs

## Project Vision
Modern education is shifting from passive, lecture-based learning to Active, Collaborative learning. **Bridgr** transforms campuses into collaborative skill ecosystems via a peer-to-peer system.

### Core Problem: Socially-Blocked Expertise
Students struggle with niche technical hurdles while the solution exists in the same room, but remains inaccessible due to lack of social connection.

### Aesthetic: Peak Craft / Bento
- **Color Palette**: 8 Themes (4 Dark, 4 Light).
- **Typography**: Playfair Display (Heading), Inter (Sans), JetBrains Mono (Mono).
- **Layout**: Bento-style grid with `rounded-3xl` corners and `.bento-glow` effects.
- **Animations**: GSAP (Text Scramble, Count-up) + Framer Motion (Page transitions, Spring physics).

---

## Technical Stack
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4 (@theme inline) + Vanilla CSS.
- **State Management**: React Context (`MockDataContext.tsx`) with localStorage persistence.
- **Animations**: GSAP 3, Framer Motion.
- **Icons**: Lucide React.

---

## File Architecture
- `app/globals.css`: Theme system and CSS variables.
- `lib/ThemeContext.tsx`: Theme switching and persistence logic.
- `lib/MockDataContext.tsx`: Centralized mock data state (users, feed, quests, rooms).
- `app/profile/[username]/page.tsx`: The "Chamber" (Bento-style user profile).
- `app/page.tsx`: The Lobby (Campus heartbeat).
- `app/leaderboard/page.tsx`: Hall of Nerds (Karma-based leaderboard).
- `app/map/page.tsx`: Spatial Hub (Real-time physical room occupancy).
- `app/quests/page.tsx`: Quest Board (Peer collaboration projects).

---

## Key Development Rules
1. **Theme Parity**: NEVER use hardcoded colors like `text-white` or `bg-[#1A1A1A]` for foregrounds/borders. Use semantic tokens: `text-text`, `border-border-subtle`, `bg-card`.
2. **Corner Radius**: Standard radius for cards and containers is `rounded-3xl` or `rounded-card` (defined in `globals.css`).
3. **Mock Data**: All state is managed through `useMockData()`. To update a user, use `updateUserProfile`.
4. **GSAP & Framer**: Use GSAP for text and complex timeline animations; use Framer Motion for simple layout transitions and spring physics.
