# Details Page Redesign — Scroll-Driven Storytelling

**Goal:** Transform the details page from a static feature list into a scroll-driven storytelling experience with GSAP ScrollTrigger parallax animations, replacing Diff View with the new CLI feature, and adding narrative context that shows *why* each feature matters.

**Scope:**
- In: `src/pages/details.astro` full rewrite, GSAP dependency, scroll-driven animations, CSS animated mockups, responsive design
- Out: no changes to index.astro / Nav / Layout; no video assets; no new npm build plugins

**Architecture:**
- GSAP + ScrollTrigger loaded via CDN `<script>` in the page (not bundled — keeps Astro build simple)
- Each "act" is a full-viewport pinned section with scroll-scrubbed animations
- Animated mockups built with HTML/CSS (same approach as index.astro's terminal sim)
- All styles scoped inside `<style>` in details.astro (consistent with existing pattern)
- Responsive breakpoint at 840px collapses to simplified single-column, reduced animations

**Acceptance / Verification:**
- `npm run build` succeeds with no errors
- All 5 acts render correctly at 1440px, 1024px, 768px, 375px widths
- Scroll animations play smoothly (pin, scrub, parallax)
- Lightbox still works for any real screenshots
- No layout shift or flash on load
- Footer and Nav remain unchanged

---

## Narrative Structure

```
Prologue  — "Your terminal wasn't built for agents."
Act 1     — Canvas: "All your agents, one view."
Act 2     — CLI: "Your agents can talk to the terminal."
Act 3     — Custom Actions: "Your workflow, one keystroke away."
Interlude — Native / Vertical Tabs / Agent Reminder (3-card grid)
Finale    — CTA: "Start prowling."
```

---

## Milestone 1: Infrastructure & Page Skeleton

### Task 1.1: Add GSAP ScrollTrigger via CDN

**Files:**
- Modify: `src/pages/details.astro` (add script tags in frontmatter or body)

**Steps:**
1. Add GSAP core + ScrollTrigger CDN scripts at the bottom of the page (before closing `</Layout>`)
2. Use `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` and ScrollTrigger plugin
3. Add a basic init script that registers ScrollTrigger
4. Verify: `npm run build` passes, page loads without console errors

### Task 1.2: Page skeleton with section placeholders

**Files:**
- Modify: `src/pages/details.astro` (replace current content)

**Steps:**
1. Replace current page content with 6 section placeholders:
   - `.act-prologue` (100vh)
   - `.act-canvas` (300vh for scroll room)
   - `.act-cli` (300vh)
   - `.act-actions` (200vh)
   - `.act-interlude` (100vh)
   - `.act-finale` (50vh)
2. Each section gets a temporary visible label for debugging
3. Add base styles: each act has `position: relative`, proper z-indexing
4. Verify: page scrolls through all sections, GSAP loads

---

## Milestone 2: Prologue — Hero Section

### Task 2.1: Prologue content and styling

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Build the prologue section (full viewport):
   - Headline: "Your terminal wasn't built for agents."
   - Subtext: Scene-setting copy about the agent era
   - Subtle downward scroll indicator (animated chevron)
2. Style: centered text, large mono font title, fade-in on load
3. Background: subtle radial gradient (matching home page pattern)

### Task 2.2: Prologue scroll-out animation

**Steps:**
1. GSAP ScrollTrigger: as user scrolls past prologue, text fades up and out
2. Pin the prologue for ~50vh of scroll, then release
3. Verify: smooth fade-out transition into Act 1

---

## Milestone 3: Act 1 — Canvas

### Task 3.1: Canvas mockup HTML/CSS

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Build a CSS mockup of the Canvas view:
   - 4 draggable-looking cards in a 2x2 grid (reuse home page's canvas-card pattern)
   - Each card shows a different agent/repo with terminal output snippets
   - Cards have subtle borders, mono font labels, status badges
2. Left side: narrative text block
   - Scene: "Three agents running. One of them just finished. Where?"
   - Resolution: "Canvas gives you the bird's-eye view."
   - 2-3 bullet details
3. Layout: text left, mockup right (like home page hero pattern)

### Task 3.2: Canvas scroll animation

**Steps:**
1. Pin the Canvas act for ~200vh of scroll
2. Animation sequence (scrubbed by scroll):
   - Phase 1: Cards start scattered/overlapping → animate to neat 2x2 grid
   - Phase 2: One card pulses with a green "done" indicator
   - Phase 3: A broadcast message bar appears at bottom of mockup
3. Text content fades in at phase 1, stays pinned through all phases

---

## Milestone 4: Act 2 — CLI

### Task 4.1: CLI terminal mockup HTML/CSS

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Build a terminal mockup (reuse frame-terminal pattern from index):
   - Title bar with dots
   - Terminal content area showing a CLI session
   - Lines will be revealed progressively by scroll
2. CLI session content:
   ```
   $ prowl list --json
   ▸ prowl       (3 tabs) ● running
   ▸ kingfisher  (1 tab)  ○ idle
   
   $ prowl send "npm test" --capture
   ⏳ waiting…
   ✓ exit 0 (3.2s)
   
   captured output:
     Tests  12 passed
     Time   3.18s
   ```
3. Left side: narrative text
   - Scene: "Your agent needs to run a test and read the result. In most terminals, it's blind."
   - Resolution: "Prowl's CLI turns your terminal into an API."
   - Key commands listed: `list`, `send --capture`, `read`, `key`

### Task 4.2: CLI scroll animation

**Steps:**
1. Pin the CLI act for ~200vh of scroll
2. Animation sequence (scrubbed by scroll):
   - Phase 1: Terminal appears, first command types in (`prowl list`)
   - Phase 2: Output appears line by line
   - Phase 3: Second command types in (`prowl send --capture`)
   - Phase 4: Waiting indicator → result appears with green checkmark
3. Each phase tied to scroll position via ScrollTrigger scrub

---

## Milestone 5: Act 3 — Custom Actions

### Task 5.1: Custom Actions mockup HTML/CSS

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Build a mockup showing:
   - A terminal toolbar with 3 custom action buttons (▶ Build, ⚙ Test, 📦 Deploy)
   - A keyboard shortcut hint below each button
   - Terminal area below showing command execution
2. Right side: narrative text
   - Scene: "Same three commands, every repo, every day. Muscle memory shouldn't need a terminal."
   - Resolution: "Pin your workflows to buttons. Trigger with a keystroke."
   - Details: up to 3 per repo, shell script or terminal input, custom shortcuts

### Task 5.2: Custom Actions scroll animation

**Steps:**
1. Pin for ~150vh of scroll
2. Animation sequence:
   - Phase 1: Toolbar buttons appear one by one
   - Phase 2: A keyboard shortcut hint glows (⌘+T)
   - Phase 3: Terminal shows command executing + output appearing
3. Verify smooth scrub behavior

---

## Milestone 6: Interlude — Quick Features

### Task 6.1: Three-column feature cards

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Build a 3-column card grid (not pinned — normal scroll):
   - **Native Performance**: libghostty icon, "No Electron. No compromise." + brief copy
   - **Vertical Tabs**: sidebar icon, "Repos and worktrees, organized." + brief copy
   - **Agent Reminder**: bell icon, "Know when your agent is done." + brief copy
2. Each card: icon/illustration at top, title, 2-line description
3. Style: bg-secondary background, border, rounded corners, consistent with feature-card pattern
4. Cards fade-in-up with stagger as they scroll into view (simple ScrollTrigger, not pinned)

---

## Milestone 7: Finale — CTA Section

### Task 7.1: CTA with download and install

**Files:**
- Modify: `src/pages/details.astro`

**Steps:**
1. Reuse CTA pattern but enhanced:
   - Headline: "Start prowling."
   - Primary: Download Prowl (DMG link)
   - Secondary: View on GitHub
   - Homebrew command with copy button (match index.astro pattern)
2. Add upstream attribution: "A personal fork of Supacode, built for daily use."
3. Footer: Built by @onevcat

---

## Milestone 8: Responsive & Polish

### Task 8.1: Responsive layout (840px, 480px)

**Steps:**
1. At 840px:
   - Acts collapse to single column (text above, mockup below)
   - Pin durations reduced (less scroll needed per act)
   - Canvas cards shrink proportionally
   - Terminal mockup max-width constrained
2. At 480px:
   - Interlude cards stack to single column
   - Font sizes scale down
   - CTA buttons stack vertically
3. Verify all breakpoints

### Task 8.2: Animation polish and performance

**Steps:**
1. Add `will-change` hints for animated elements
2. Ensure no layout thrashing during scroll
3. Add `prefers-reduced-motion` media query: disable scroll pins and scrubs, show all content statically
4. Test scroll performance in Safari and Chrome
5. Final `npm run build` verification

### Task 8.3: Cleanup

**Steps:**
1. Remove any debug labels/borders
2. Ensure no console warnings
3. Verify lightbox still works if screenshots are present
4. Check that Nav active state still works for "details"
