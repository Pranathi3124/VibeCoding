# Wobb Frontend Take-Home Assignment - Submission Report

Welcome to my submission for the Vibe Coder Intern role take-home assignment! I have completely overhauled the starter application, resolving multiple critical bugs, refactoring the state management to Zustand with localStorage persistence, implementing multi-campaign shortlist management, creating interactive inline SVG analytics charts, and redesigning the interface from scratch into a polished, modern, fully responsive SaaS dashboard.

---

## 🚀 Key Improvements & Changes

### 1. State Management (Zustand & Persistence)
- **Centralized State**: Replaced fragmented component state with a persistent Zustand store (`src/store/useStore.ts`).
- **Persistence**: Used Zustand's `persist` middleware to automatically sync candidate lists, search queries, active platform, and select campaigns to `localStorage`. Navigation or page refreshing preserves your active search term, filters, and shortlists.
- **Multi-Campaign Lists**: Added support for creating, switching, and deleting multiple named influencer campaigns (e.g., "Summer Launch", "Tech Campaign"), going beyond a single list.

### 2. UI/UX Redesign (Aesthetics & Responsiveness)
- **Responsive Layout**: Removed the hardcoded `#root` width restriction (`width: 1126px`) and the profile cards' hardcoded size (`w-[700px]`) in favor of a modern, responsive two-column grid.
- **Two-Column Dashboard**:
  - **Left Area**: Features beautiful platform selection pills (custom social SVGs), a glassmorphic search input with live filters, and a responsive card grid (1-column on mobile, 2 on tablet, 3 on desktop).
  - **Right Sidebar/Drawer**: Contains the Campaign Manager panel, showing aggregated statistics (total reach, average engagement rate) of shortlisted creators, list controls, and client-side exports. On mobile, this slides in as an overlay drawer.
- **Micro-Interactions & Animations**: Added `framer-motion` for fluid card layouts, list additions, search filtering transitions, and sidebar slides.
- **Dark Mode**: Integrated a light/dark mode theme toggle in the header that synchronizes with local storage and respects system preferences.

### 3. Analytics Visualizations
- **SVG Follower Growth Chart**: Designed a custom, responsive inline SVG area chart (`src/components/FollowerHistoryChart.tsx`) on the Profile Details page. It parses the historical data (`stat_history`) from the JSON reports to graph follower growth over time, complete with grid lines, gradient fills, and hoverable data labels.

### 4. Find & Fix Bugs
- **Case-Insensitive Search**: Updated `filterProfiles` in `src/utils/dataHelpers.ts` to convert queries and usernames to lowercase, correcting the bug where searching for "mrbeast" failed to match user "MrBeast".
- **Case-Insensitive Profile Loader**: Patched `loadProfileByUsername` in `src/utils/profileLoader.ts` to locate modules within `import.meta.glob` case-insensitively, resolving crashes when users manually navigate to lowercase URLs (e.g., `/profile/mrbeast` loads `mrbeast.json` or `/profile/mrbeast6000` loads `MrBeast6000.json`).
- **Engagement Rate Formatting**: Fixed the metric calculation in `ProfileDetailPage.tsx`. The raw JSON lists rates as decimals (e.g., `0.01425` = `1.43%`). The starter code multiplied by `10000` (yielding `142.50%`). I corrected it to multiply by `100` via the shared `formatEngagementRate` utility.
- **Engagements Metric Display**: Fixed the metric row displaying the engagement rate under the "Engagements" (count) label. It now renders the formatted absolute engagement count (e.g., `1.3M`).
- **Batch State Log Stale Value**: Corrected the async state logging in `SearchPage.tsx` where printing `clickCount` output the batch-stale value. We now use a functional state update to capture and log the correct click count synchronously.

---

## 📦 Installed Libraries
- **`zustand`**: Lightweight, fast state manager chosen for clean boilerplate-free hook subscription and out-of-the-box local storage persistence.
- **`framer-motion`**: Industry-standard React animation library used to create smooth, high-fidelity micro-interactions and layout transitions.
- **`lucide-react`**: Used for clean, SVG-based dashboard iconography.

---

## 🧠 Engineering Assumptions & Decisions
- **Casing Match**: We assumed filenames in `assets/data/profiles/*.json` would map to the creator's username. Our case-insensitive module path lookup handles all route queries gracefully.
- **Self-contained SVGs**: For social media platform logos (Instagram, YouTube), we built custom SVG nodes directly within components rather than using third-party packages, avoiding compile-time peer dependency mismatches.

---

## ⚖️ Trade-offs
- **Client-Side Export**: The JSON and CSV file creation is performed completely client-side in the browser. While memory-efficient for lists under ~10k items, it could hit browser download limits with extremely large databases. For a real product, we would offload file assembly to a server microservice.
- **Animation Framework Size**: Adding `framer-motion` adds bundle size weight (~30kb). However, the immediate boost in user delight and visual quality far outweighs the tiny download footprint in a modern web dashboard.

---

## 🔮 Future Enhancements
- **Fuzzy Search Integration**: Connect a lightweight library like `fuse.js` to allow search query matching with minor typos.
- **Unit & Component Testing**: Add unit tests for `useStore.ts` actions and visual component snapshots for `FollowerHistoryChart.tsx` using Vitest and React Testing Library.
- **Audience Location Map**: Render a geographic map of audience distribution using SVG paths from region code indicators.
