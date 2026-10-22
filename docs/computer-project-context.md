# Computer — decisions & context (portable)

Use this file in another Cursor Project or chat. Last updated: 2026-10-19. Owner: Tim Cherny.

---

## What this Project is

- Cursor Project name: **Computer**
- Goal: rebuild a product UI as **web + Mac (Electron)**, with components structured so others can reuse them later (Astryx-inspired packaging).
- You are restarting from a **blank app**; too much changed in the prior Computer fork to keep iterating there as the main codebase.

---

## Directory map (Tim’s Mac)

| Path | Role |
|------|------|
| `/Users/timcherny/Arcade` | Stable baseline product on `main`. Ports: app **5173**, Storybook **6006**. Do not change unless Tim asks. |
| `/Users/timcherny/Computer` | Earlier fork of Arcade on branch `computer`. Ports: **5174** / **6007**. **Read-only reference** for logic (sessions, nav, canvas, storage). Do not treat as the active app. |
| `/Users/timcherny/Computer-app` | **Intended new home** (not scaffolded yet): blank Vite + React + Electron monorepo with shareable UI package. |
| `/Users/timcherny/DevRev-computer` | **Different repo** (DevRev experiment). Not the Arcade/Computer product. Ignore unless Tim says otherwise. |

Self-hosted Cursor worker that can see these folders: `~/Arcade @ Tim's MacBook Pro`.

---

## Decisions (current)

### Product direction
1. **Blank reboot** — new app; rebuild many components from scratch.
2. **Refer to Computer for logic** — copy/adapt only when Tim names an area; never edit Arcade or Computer unless asked.
3. **Web + Mac** — one React UI; Electron wraps it for Mac.
4. **Mac is the main surface** for day-to-day review (Electron window), web is a second target.
5. **Shareable components** — structure like Meta’s **Astryx** (separate UI package + theme tokens + catalog), but **do not** adopt `@astryxdesign/core` as the product UI in the first pass; Tim wants to own the components.
6. **Do not fork Astryx** or aim for full Astryx parity (150+ components, StyleX CLI) in the reboot.

### Planned repo shape (`Computer-app`)
```
Computer-app/
  apps/web          # Vite React product (web)
  apps/desktop      # Electron shell (Mac main surface)
  packages/ui       # @computer/ui — reusable components + tokens
  (Storybook)       # catalog for packages/ui
```

- Package name: `@computer/ui` (publish to npm later only if Tim asks).
- Theme: CSS custom properties (`:root` / `[data-theme]`); components use tokens only.
- Stack target: Vite 8, React 19, JSX (JS), Electron; Storybook for the UI catalog.
- Git: init on `main`; **no remote** until Tim asks. Cloud agents need a pushed remote to see files.

### Scripts (intended)
| Script | Purpose |
|--------|---------|
| `npm run dev:desktop` | **Primary** — Vite + Electron window (see changes in the real Mac app) |
| `npm run dev` | Web only in browser |
| `npm run storybook` | Component catalog |
| `npm run build` / `build:desktop` | Web dist + packaged Mac `.app` (not for every edit) |

### Seeing changes in the Mac app
1. Start `dev:desktop` once; leave the Electron window open.
2. Edit/save UI files → Vite HMR updates the Electron window.
3. Restart only if you changed Electron **main** or **preload**.
4. Packaged `.app` is for install/packaging checks, not the daily loop.

### Electron process model (for agents)
- **Main** (`electron/main`): window, menus, native OS APIs.
- **Preload**: thin `contextBridge` (e.g. `window.computerDesktop.*`).
- **Renderer**: React UI (almost all product work, including text/chat UI).
- Gate desktop-only APIs so web still runs without them.

---

## Product UX decisions already made on the old Computer fork

These applied to `/Users/timcherny/Computer` and may inform the rebuild; they are **not** automatically ported:

- Sessions/chat are the main surface; pages open in a **canvas**, not as standalone app pages.
- **Tomorrow**-style nav only; Simple/Next nav layouts removed.
- Standalone page shells and ticket UI removed from that fork; canvas views for issues/projects/docs kept there.
- Nav: kill Chat section; rename Sessions → **Recent**; show **10** sessions before More.
- Team/group rows: the old expand-only rule is superseded for Computer-app as of October 20, 2026. **Parent rows remain selectable even with second-level items**: text selects; avatar independently expands/collapses. Second-level left padding is 46px.
- **Reset** lives in the Me menu (nav), not the issue three-dots menu.

Treat these as product intent when rebuilding, not as a requirement to copy the old code wholesale.

---

## Cloud vs local

- **Local (Mac worker):** edits Arcade / Computer / Computer-app on disk; needed for Electron window and uncommitted work.
- **Cloud agent:** separate machine; cannot see Mac folders until code is on a **git remote** and pushed.
- Closing the laptop stops local agents; cloud agents keep running on their clone only.

---

## Explicitly out of scope (unless Tim reopens)

- Porting the full Computer UI in one go
- Installing Astryx as the design system
- Vercel / Electron auto-update setup in the reboot
- Changing Arcade or DevRev-computer
- Slack/mail integrations (discussed; not connected)

---

## How to use this file in another Project

1. Download or paste this markdown into the new Project’s Context / `docs/`.
2. Tell the agent: “Follow `computer-project-context.md`; active app is `Computer-app`; Computer is reference-only.”
3. If scaffolding hasn’t happened yet, execute the Electron blank reboot plan first (monorepo + Electron + `@computer/ui`).

---

## Related links (this Project only)

- Plan: `docs/electron-blank-reboot.md` (may need sync with monorepo + Astryx-packaging decisions above — this file is source of truth for decisions)
- Old app chat (local): Work on Computer app — historically pointed at `/Users/timcherny/Computer`; retarget to `Computer-app` after scaffold
