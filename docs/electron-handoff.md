# Computer — Electron handoff for another AI

## Objective

Run or rebuild Tim's Computer prototype on an **Apple Silicon Mac**. For simply opening the prototype, use the already packaged DMG/ZIP and follow `share-prototype.md`; do not scaffold a new Electron application.

The current distribution is a bundled, offline app. It does not load a Vercel URL. No Vercel deployment is required for this path.

## If source development is needed

Obtain the complete `Computer-app` source folder, including the npm lockfile, `apps`, `packages`, `scripts`, and `docs`. The project has no Git remote configured. Tim's absolute paths are not required on the receiving Mac. Do not modify or require any other Computer, Arcade, or DevRev-computer repository.

Use Node.js 24 LTS with npm on macOS. Run these commands in the copied `Computer-app` folder:

```sh
npm ci
npm run dev:desktop
```

This starts Vite on `http://127.0.0.1:5175` and launches Electron. UI changes update live. Quit Computer or stop the command to stop the development session. Restart after changes to main/preload. Do not run a second web server on the same port. Optional component catalog: `npm run storybook`, port 6008.

To build the shareable Apple Silicon application:

```sh
npm run build:share
```

Outputs, relative to the copied project:

- `release/signed-apple-silicon/Computer-0.1.3-mac-arm64.dmg`
- `release/signed-apple-silicon/Computer-0.1.3-mac-arm64.zip`
- `release/signed-apple-silicon/mac-arm64/Computer.app`
- `release/signed-apple-silicon/READ-ME-FIRST.md` and `AI-HANDOFF.md`
- `release/signed-apple-silicon/SHA256SUMS.txt`

Names change with `apps/desktop/package.json`'s version. The first build needs internet access for npm dependencies, Electron, and packaging tools. Once packaged, running the prototype needs no server or network. Send the DMG or ZIP, not the development node_modules directory. Keep the `.app` inside an archive or disk image when transferring it so bundle permissions and symlinks survive.

## Architecture and behavior to preserve

- React 19, JSX/JavaScript, Vite 8, npm workspaces.
- `packages/ui`: shared components, CSS-variable theme tokens, Storybook; public exports in `src/index.js`.
- `apps/web`: product renderer; `apps/desktop/src/main.cjs`: native shell; `preload.cjs`: narrow `computerDesktop.platform` bridge.
- Electron development loads only `http://127.0.0.1:5175`. Packaged Electron loads bundled `renderer/index.html` from app resources using relative asset paths.
- Keep sandboxing, context isolation, web security, disabled Node integration, navigation restrictions, denied permissions, and blocked new windows intact.
- Preserve the hidden title bar, native window controls, and separate draggable/non-draggable regions.
- Chat and canvas use local storage; data does not sync or invoke a real AI backend. Packaged app data lives under `~/Library/Application Support/Computer-prototype`; development uses `~/Library/Application Support/Computer-app`. This keeps distributed builds separate from the developer's running app and local data. Do not bundle either profile directory.
- Chip font binaries are not bundled; use the existing system-font fallbacks unless Tim provides distributable webfont assets.
- App identity is `dev.computer.app`; product name is `Computer`. Share packaging explicitly targets ARM64 only. The bundled Electron runtime requires macOS 13 or later.

## Signing and verification

`npm run build:desktop` makes a local ad-hoc signed `.app` for development verification. It is not a distribution command.

`npm run build:share` creates a trusted ARM64 release. It requires one valid Developer ID Application identity in the local keychain and the `Computer-notary` notarization credential profile. Override the profile with `APPLE_KEYCHAIN_PROFILE`; when multiple valid identities exist, set `COMPUTER_SIGNING_IDENTITY` to the intended certificate hash. Credentials and private keys stay out of the source and guides. Other developers must use their own identities and profiles.

The share command verifies the identity and credentials before building, requires signing, notarizes/staples the app before ZIP creation, signs/notarizes/staples the DMG, and verifies Gatekeeper acceptance of both the installer and the app extracted from the final ZIP. It fails on missing credentials, signing, notarization, stapling, or verification errors. `scripts/verify-mac-signature.cjs` also verifies deep/strict signature integrity before archive creation. Automatic updates remain unconfigured.

The icon source is `apps/desktop/build/icon-source.png`, imported from Figma node `9087:17646` at 600 × 600 pixels. Run `node scripts/build-mac-icon.mjs` after replacing it; `icon.icns` is packaged, while `icon.png` is used by the development Dock. Generated 1024px representations are upscaled from this source.

Do not distribute old 0.1.0 or 0.1.1 artifacts. Version 0.1.0 had an invalid resource signature; 0.1.1 was ad-hoc signed without notarization.

Before handing out a rebuilt package:

1. Run `npm run build:share` successfully on Apple Silicon macOS.
2. Inspect the packaged app's ARM64 architecture and bundled renderer assets. Extract the final ZIP to a temporary directory and verify that extracted app with `codesign --verify --deep --strict`; checking only a local launch is insufficient.
3. Open the packaged application, verify navigation, chat input, canvas tabs, resizing, and light/dark appearance. Avoid running two copies using the same profile simultaneously.
4. Check that the disk image opens and contains Computer.app plus the Applications shortcut; check the ZIP archive's integrity.
5. Send the recipient guide with the DMG/ZIP. Publish no Git remote, npm package, or web deployment unless Tim requests it.
