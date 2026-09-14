# Product screenshots

Assets live in `public/images/shots/`. They are referenced from `src/pages/details.astro`.

## How the current set was captured

- App: `Prowl Debug.app` (Debug build of the same commit as the synced docs).
- Isolation: `PROWL_DEBUG_DATA_DIRECTORY=<scratch>/pd-data` and `PROWL_CLI_SOCKET=/tmp/pd/cli.sock`,
  so nothing from `~/.prowl` or the release app is involved.
- Scene: shallow clones of Kingfisher, MeetCat, xin, FengNiao and magpie with a few extra
  worktrees (`feature/retry-downloader`, `fix/cache-expiry`, `feature/auth`, `codex/label-sync`)
  and a `checkout-flow` workspace. Agents were launched from the seeded Agent Profiles through
  `prowl create tab --profile … --prompt -` so Working / Blocked / Done / Idle all appear.
- Capture: `screencapture -l <windowID>` (window id from `CGWindowListCopyWindowInfo`), cropped to
  the 1760×1040 pt window and encoded with `magick … -quality 84 out.webp`. View modes were switched
  through the View menu with AppleScript accessibility (`click menu item "Canvas" of menu "View"`).

## Inventory

| File | Shows | Status |
| --- | --- | --- |
| `hero.webp` | Normal view: sidebar with worktrees and badges, a finished Codex session, Active Agents with Done / Blocked rows, custom command buttons | captured (details intro) |
| `canvas.webp` | Canvas, five tiled cards (Claude working, Codex working, Pi done, a permission prompt, a shell) | captured |
| `shelf.webp` | Shelf with spines on both sides and the Codex book open | captured |
| `new-worktree.webp` | The New Worktree sheet with an Apple Intelligence branch suggestion over a Claude session; `+26 -0` badge in the sidebar | captured (Layout → Sidebar & worktrees) |
| `active-agents.webp` | Active Agents panel crop with Working / Blocked / Done rows | captured |
| `agent-island.webp` | Floating Agent Island bar with state counts and a Blocked cell | captured |
| `custom-commands.webp` | Toolbar crop with Run, Build, Test, Review buttons | captured |
| `workflow-status.webp` | Toolbar crop with the workflow status item "Prepare handoff briefing" needing attention | captured |
| `command-palette.webp` | Command Palette open over Canvas | captured (Fundamentals) |
| `settings.webp` | Settings window, General page, with the Agents sections in the sidebar | captured (Fundamentals) |

## Still worth capturing by hand

These need clicks, hover, or a notched display, which the scripted session could not do while
the screen was locked. Each one has a placeholder-free fallback on the page today, so the site
ships without them; drop the file in and add an `<img>` to the matching panel when available.

| Suggested file | What to capture | Where it would go |
| --- | --- | --- |
| `agents-popover.webp` | Toolbar Agents capsule open: "Run a workflow" section and profile rows with the Recommended badge | Agents → Agent Profiles (replace the CSS profile card) |
| `agent-profile-editor.webp` | Settings → Agents → Profiles → a profile editor with the Launch Preview | Agents → Agent Profiles |
| `agent-island-roster.webp` | Agent Island expanded roster with the 1–9 hints, ideally on a notched display | Agents → Agent Island (second image) |
| `workflow-start-sheet.webp` | The start sheet of a multi-agent workflow (roles, options, steps) | Automation → Agent Workflows |
| `workflow-history.webp` | Workflow History panel with an expanded step | Automation → Agent Workflows |
| `command-palette-query.webp` | `⌘P` with a query typed, showing "Launch Agent" and "Run Workflow" rows | Fundamentals (replace `command-palette.webp`) |
| `diff-window.webp` | Show Diff window, split mode, a real agent change (the window opened but its web view did not render while the screen was locked) | Fundamentals |
| `canvas-broadcast.webp` | Canvas with three cards selected and "Broadcasting to 3 cards" in the toolbar | Layout → Canvas (second image) |
| `workspace.webp` | A workspace expanded in the sidebar with child rows and their badges | Layout → Workspaces (beside the JSON) |
