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
- **Current UI Direction**: Mobile-first dark glass cards, neon-accent CTAs, compact stacked modules, and floating capsule dock inspired by tactile, high-contrast interfaces.

---

## Technical Stack
- **Framework**: Next.js 16 (App Router).
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

## Current Product Behaviors (Updated)
- **Leaderboard Profiles**: Every rank card (top-3 + full list) links to `app/profile/[username]/page.tsx`.
- **Help Integrity Rule**: Users cannot offer help on their own blocker posts.
- **Single-help Rule**: Once help is offered on a request, the same request's CTA is disabled (`Help Offered`).
- **Ghost Mode**: Removed completely from Lobby filters and actions.
- **Data Persistence**: Feed, quests, rooms, and users persist via localStorage in `MockDataContext`.
- **Mobile Density Pass**: Mobile dock, profile header, cards, and page paddings are intentionally compact to avoid bulky UI.
- **Mobile Dock Routing**: Mobile dock uses document-level navigation (`window.location.assign`) to avoid client history patch/runtime issues.
- **Visual System Reset**: Lobby, Leaderboard, Quests, and Map now use a unified card-first layout system (hero card + content cards) rather than mixed legacy bento fragments.
- **Profile Expansion**: User profiles now support editable `projects` and `socialLinks`.
- **Structured Profile Links**:
  - `socialLinks` are objects with `{ title, url }` and titles are clickable.
  - `projects` are objects with `{ name, description, repoUrl, liveUrl? }` where live link is optional.
- **Theme Safety**: Avoid runtime-generated Tailwind classes (e.g. `bg-${...}`); use explicit mappings.

---

## Key Development Rules
1. **Theme Parity**: NEVER use hardcoded colors like `text-white` or `bg-[#1A1A1A]` for foregrounds/borders. Use semantic tokens: `text-text`, `border-border-subtle`, `bg-card`.
2. **Corner Radius**: Standard radius for cards and containers is `rounded-3xl` or `rounded-card` (defined in `globals.css`).
3. **Mock Data**: All state is managed through `useMockData()`. To update a user, use `updateUserProfile`.
4. **GSAP & Framer**: Use GSAP for text and complex timeline animations; use Framer Motion for simple layout transitions and spring physics.
5. **Interaction Consistency**: If a UI action button exists (e.g., Offer Help, Join Party), it must be wired to meaningful state logic and disabled for invalid self-actions.
