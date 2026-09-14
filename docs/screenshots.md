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
  the opaque window bounds. Large shots are encoded twice with `cwebp -q 80`, at 2000px and 1200px
  wide (`name.webp` / `name-1200.webp`), and served through `srcset`; small crops are single files. Menus were driven with
  AppleScript (`click menu item "Canvas" of menu "View"`), toolbar buttons with the AX API
  (`AXPress` on the button's identifier, e.g. `agents-toolbar-menu`, `Tile`).

## Inventory

| File | Shows | Used on |
| --- | --- | --- |
| `hero.webp` | Shelf view with the Prowl book open (mint chrome), Kingfisher / MeetCat / Notes as closed spines, Active Agents with Blocked / Done / Idle | Details intro |
| `canvas.webp` | Canvas, five tiled cards with repository-coloured headers: Claude explaining code, a permission prompt, Codex done, Pi done, a git log | Layout → Canvas |
| `shelf.webp` | Shelf with the Prowl feature book open and a Working / Blocked roster | Layout → Shelf |
| `new-worktree.webp` | New Worktree sheet with an Apple Intelligence branch suggestion over a Claude session; `+26 -0` badge in the sidebar | Layout → Sidebar & worktrees |
| `active-agents.webp` | Active Agents panel crop: Blocked, Done, Idle, Idle with repository colours | Agents → Active Agents |
| `agent-island.webp` | Floating Agent Island bar with state counts and Blocked / Done cells | Agents → Agent Island |
| `agent-island-roster.webp` | Expanded Island roster with 1–4 shortcuts and the keyboard legend | Agents → Agent Island |
| `agents-popover.webp` | Toolbar Agents menu: Run a workflow (Hello World, Handoff) and one launch row per profile | Agents → Agent Profiles |
| `custom-commands.webp` | Toolbar crop: Xcode open button, Run, Build, Check, Test | Automation → Custom Commands |
| `workflow-history.webp` | Workflow History panel over a Handoff run that needs attention | Automation → Agent Workflows |
| `command-palette.webp` | Command Palette filtered by "launch": Launch Agent rows | Fundamentals |
| `diff.webp` | Show Diff window, split view, RetryStrategy.swift | Fundamentals |
| `settings.webp` | Settings window, General page (older neutral scene), cropped to the gallery ratio | Fundamentals |

## Optional

The set above is complete for the page. One nicety remains: the intro hero was captured while the
Debug window was inactive (grey traffic lights) because another app had focus during the scripted
run. Re-shooting the same Shelf composition with the window active would replace `hero.webp`.
