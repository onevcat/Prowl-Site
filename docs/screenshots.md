# Product screenshots

Assets live in `public/images/shots/`. They are referenced from `src/pages/details.astro`.

## How the current set was captured

- App: `Prowl Debug.app` (Debug build of the same commit as the synced docs), launched with
  `PROWL_DEBUG_DATA_DIRECTORY=<scratch>/pd-data` and `PROWL_CLI_SOCKET=/tmp/pd/cli.sock`, so
  nothing from `~/.prowl` or the release app is involved.
- Scene: shallow clones of Kingfisher (blue, logo icon), Prowl (mint, app icon), MeetCat (yellow,
  app icon) and a small Notes repo (red, tag icon), with extra worktrees
  (`feature/retry-downloader`, `fix/cache-expiry`, `feature/agent-island-roster`,
  `fix/shelf-spine-tint`, `feature/auth`). Repository colours and icons come from
  `repository-appearances.json`, keyed by the `/tmp/…` path Prowl reports (not `/private/tmp`).
  Window tint follows the repository colour; Shelf spines follow it too.
- Agents: Claude Code, Codex and Pi launched from the seeded Agent Profiles through
  `prowl create tab --profile … --prompt -`, so Working / Blocked / Done / Idle all appear.
- Capture: `screencapture -l <windowID>` (window id from `CGWindowListCopyWindowInfo`), cropped to
  the opaque window bounds and encoded with `magick … -quality 84 out.webp`. Menus were driven with
  AppleScript (`click menu item "Canvas" of menu "View"`), toolbar buttons with the AX API
  (`AXPress` on the button's identifier, e.g. `agents-toolbar-menu`, `Tile`).

## Inventory

| File | Shows | Used on |
| --- | --- | --- |
| `hero.webp` | Shelf view with the Prowl book open (mint chrome), Kingfisher / MeetCat / Notes as closed spines, Active Agents with Blocked / Done / Idle | Details intro |
| `canvas.webp` | Canvas, five tiled cards with repository-coloured headers: Claude explaining code, a permission prompt, Codex done, Pi done, a git log | Layout → Canvas |
| `shelf.webp` | Shelf with the Prowl feature book open and a Working / Blocked roster | Layout → Shelf |
| `new-worktree.webp` | New Worktree sheet with an Apple Intelligence branch suggestion over a Claude session; `+26 -0` badge in the sidebar | Layout → Sidebar & worktrees |
| `normal.webp` | Normal view, Prowl feature worktree, full Claude answer | (spare) |
| `active-agents.webp` | Active Agents panel crop: Blocked, Done, Idle, Idle with repository colours | Agents → Active Agents |
| `agent-island.webp` | Floating Agent Island bar with state counts and Blocked / Done cells | Agents → Agent Island |
| `agent-island-roster.webp` | Expanded Island roster with 1–4 shortcuts and the keyboard legend | Agents → Agent Island |
| `agents-popover.webp` | Toolbar Agents menu: Run a workflow (Hello World, Handoff) and one launch row per profile | Agents → Agent Profiles |
| `custom-commands.webp` | Toolbar crop: Xcode open button, Run, Build, Check, Test | Automation → Custom Commands |
| `workflow-history.webp` | Workflow History panel over a Handoff run that needs attention | Automation → Agent Workflows |
| `workflow-status.webp` | Toolbar crop with the workflow status item "Prepare handoff briefing" | (spare) |
| `command-palette.webp` | Command Palette filtered by "launch": Launch Agent rows | Fundamentals |
| `diff.webp` | Show Diff window, split view, RetryStrategy.swift | Fundamentals |
| `settings.webp` | Settings window, General page (older neutral scene) | Fundamentals |

## Still worth capturing by hand

The Debug scene is left running with this configuration; use it for these. Drop the file into
`public/images/shots/` and reference it from the matching panel in `src/pages/details.astro`.

| Suggested file | What to capture | Where it would go |
| --- | --- | --- |
| `hero.webp` (retake) | Same Shelf composition as now, but with the window active (coloured traffic lights); the scripted run could not activate the window while another app was in use | Details intro (replace) |
| `workflow-start-sheet.webp` | Agents menu → Handoff → the start sheet with Roles / Options / Steps (a Handoff run was already live, so the sheet did not open) | Automation → Agent Workflows (add beside history) |
| `settings-profiles.webp` | Settings → Agents → Profiles list, and one profile editor with the Launch Preview | Agents → Agent Profiles (add) |
| `settings-cli-skills.webp` | Settings → Agents → CLI & Skills with the connection status and skill targets | CLI & skills → Bundled skills |
| `settings-workflows.webp` | Settings → Agents → Workflows detail page (Roles, Run Setup, Validation) | Automation → Agent Workflows |
| `canvas-broadcast.webp` | Canvas with three cards ⌘-selected and "Broadcasting to 3 cards" in the toolbar | Layout → Canvas (second image) |
| `workspace.webp` | A workspace expanded in the sidebar with child rows and their badges (add `demo/checkout-flow` back to the scene) | Layout → Workspaces (beside the JSON) |
| `agent-island-notch.webp` | Agent Island on the built-in notched display, wings on both sides of the camera | Agents → Agent Island |
| `settings.webp` (retake) | Settings → General with the colourful scene, or drop it | Fundamentals |
