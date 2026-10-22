# Computer

A fresh React app for web and Mac, with an independently packaged component library.

The intended project folder is `/Users/timcherny/Computer-app`. The older Computer and Arcade repositories are separate reference projects.

## Start

Use Node 24 (or Node 22.12+) and npm. After receiving repository access:

```sh
git clone https://github.com/timcherny/computer-app.git
cd computer-app
```

From the project root:

```sh
npm install
npm run dev:desktop
```

The primary development surface is the Electron window. Saving React or CSS files updates it through Vite HMR. Quit Computer with Cmd+Q, or stop the terminal command with Ctrl+C, to stop both Electron and Vite. Restart this command after changes to Electron main or preload.

The prototype includes light/dark themes, chats and sessions, navigation, menus, and canvas tabs. Conversations use local demo data; there is no shared backend or live AI service.

## Commands

| Command | Result |
| --- | --- |
| `npm run dev:desktop` | Vite plus the native Mac window |
| `npm run dev` | Web development at http://127.0.0.1:5175 |
| `npm run storybook` | Component catalog at http://127.0.0.1:6008 |
| `npm run build:ui` | Library JavaScript and CSS in `packages/ui/dist` |
| `npm run build` | Library and production web app |
| `npm run build:storybook` | Static catalog in `packages/ui/storybook-static` |
| `npm run build:desktop` | Library, web app, and a local Mac `.app` under `release/` |
| `npm run build:share` | Signed, notarized Apple Silicon DMG and ZIP in `release/signed-apple-silicon/` |
| `npm run deploy:web` | Build and deploy the static renderer to the Computer prototype Vercel project |
| `npm run preview` | Built web app at http://127.0.0.1:4175 |

`dev:desktop` owns port 5175; do not run it alongside a separate `dev` command. Ports are strict so a conflict fails clearly. Arcade's 5173/6006 and the earlier Computer app's 5174/6007 remain available to those projects.

On this Apple Silicon Mac, the packaged app is `release/mac-arm64/Computer.app`. Packaging targets the host architecture and creates a locally ad-hoc signed app; The separate `build:share` workflow supports Apple Developer ID signing and notarization; auto-update is not configured. Daily review uses `dev:desktop` rather than rebuilding the package after each edit.

For sharing, run `npm run build:share` and send the ARM64 DMG or ZIP together with [the recipient guide](docs/share-prototype.md). It bundles the renderer and needs no local server or Vercel deployment. See [the AI handoff](docs/electron-handoff.md) for setup and rebuilding. Signing a distributable release requires your own configured certificate and notarization credentials.

The browser prototype is live at [computer-prototype-hazel.vercel.app](https://computer-prototype-hazel.vercel.app). See [web deployment](docs/web-deployment.md) for updates and local-data behavior.

## Layout

```text
apps/
  web/                 React product UI, shared by web and Mac
  desktop/             Electron main, sandboxed preload, packaging
packages/
  ui/                  @computer/ui components, tokens, and Storybook
scripts/
  dev-desktop.mjs      Starts Vite, then Electron; stops them together
docs/
  computer-project-context.md
  electron-blank-reboot.md
```

The Electron shell loads the web app from Vite in development and from a bundled `renderer/` directory in the packaged app. Relative asset paths let the production UI load from disk without a web server.

Only `window.computerDesktop.platform` crosses the preload bridge. The renderer has no Node access. Context isolation and sandboxing are enabled; permissions, new windows, and navigation away from the renderer are denied. Development uses `~/Library/Application Support/Computer-app` for settings; packaged builds use a separate `Computer-prototype` profile.

## Shared components

```jsx
import { Button } from '@computer/ui';
import '@computer/ui/styles.css';

export function SaveButton() {
  return <Button variant="primary" onClick={() => console.log('Save')}>Save</Button>;
}
```

The JavaScript public API lives in `packages/ui/src/index.js`. Components use CSS custom properties, with light and dark themes selected by `data-theme` on the document or a containing element. See [the UI package guide](packages/ui/README.md) for token overrides and local installation.

Development exports resolve to source so edits to the shared package update both the app and Storybook immediately. Production exports resolve to the built library. React is a peer dependency and is not bundled into the library. Storybook has Button controls, generated component docs, and a token catalog with a theme switcher.

## Project boundaries

- Build reusable UI in `packages/ui`; build product screens in `apps/web`.
- Refer to `/Users/timcherny/Computer` only when Tim names a specific area of logic to reuse.
- Do not edit Computer, Arcade, or DevRev-computer as part of this reboot.
- Do not add Astryx as a dependency or copy its component library.
- The private source repository is https://github.com/timcherny/computer-app, with `main` as its default branch. Do not publish `@computer/ui` until asked.

The handoff documents in `docs/` preserve the original decisions. This README describes the scaffold's commands and structure. Open `/Users/timcherny/Computer-app` as the active project for future app work.
