# Computer app working agreement

This is the blank reboot at `/Users/timcherny/Computer-app`.

- Read `docs/computer-project-context.md` and `docs/electron-blank-reboot.md` for the accepted direction. The README describes the scaffold's current commands.
- `/Users/timcherny/Computer` is reference-only. Copy or adapt logic only after Tim names the area. Never edit that repository as part of this project.
- Do not change Arcade or DevRev-computer.
- Use React 19 and JavaScript/JSX, Vite 8, and Electron. Do not introduce TypeScript or a different framework without a concrete reason agreed with Tim.
- Reusable components belong in `packages/ui`, use tokens for styling, and are exported only by `src/index.js`. Storybook documents them.
- Product UI belongs in `apps/web`. The desktop shell loads the same renderer; do not build a second product UI in Electron.
- Keep native APIs in Electron main, expose only narrow methods through the sandboxed preload, and guard desktop APIs in the renderer so web still works.
- Use web port 5175 and Storybook port 6008. Preserve strict ports to avoid interfering with the other projects.
- `npm run dev:desktop` is the primary review workflow. UI edits use HMR; main/preload edits require restarting it.
- Verify UI changes with `npm run build` and appropriate visual checks. Verify catalog changes with `npm run build:storybook`. Verify packaging changes with `npm run build:desktop` on the Mac.
- Tim authorized private GitHub source sharing on October 21, 2026: `https://github.com/timcherny/computer-app`, default branch `main`. Vercel deployment is already configured. No npm publication or auto-update setup unless Tim asks.
- Do not fork or adopt Astryx as the product UI. Its package/theme/catalog model is the inspiration, not a dependency.
