# Computer prototype — open on another Mac

This is the self-contained Apple Silicon Mac build of Computer. Send this guide together with `Computer-0.1.3-mac-arm64.dmg` (or the ZIP alternative). No project source, Node.js, Terminal, Vercel account, or local web server is needed to run it.

## Install and open

1. Download the DMG and double-click it.
2. Drag **Computer** into **Applications**.
3. Open **Computer** from Applications.

For the ZIP alternative, double-click the ZIP, then move the extracted **Computer.app** into Applications before opening it.

Version 0.1.3 from `release/signed-apple-silicon` is built with a Developer ID Application signature and Apple notarization. Its notarization tickets are attached to the app and DMG. macOS may ask you to confirm opening an app downloaded from the Internet. If it reports damage or cannot verify the developer, stop and send Tim the exact message; do not disable Gatekeeper or remove quarantine attributes.

Use the signed 0.1.3 release. Version 0.1.0 had an invalid signature; 0.1.1 was locally signed but not notarized. Neither is the current distribution.

## What to expect

- Requires macOS 13 Ventura or later on an Apple Silicon Mac (M1 and later). This download does not target Intel Macs.
- The interface and its assets are bundled inside the app and work offline.
- Conversations are fictional prototype examples. Chat input, navigation, properties, and canvas interactions run locally; this is not a connected AI service or shared workspace.
- Each Mac starts with its own default examples. Tim's local drafts, chat history, and preferences are not included in the app download. Edits are saved locally and do not sync to other people.
- Use **Me → Reset to default data** to restore the example content.
- Chip fonts are used if already installed. Otherwise, the app uses its system-font fallbacks; no commercial font files are included.
- Updates are manual: quit Computer and replace the installed app with a newer copy from Tim. There is no automatic updater.

## Prompt for another AI

> Help me open the attached Computer prototype on my Apple Silicon Mac. It is a self-contained Electron application, not a source project. Use the provided DMG or ZIP; install Computer.app in Applications. No Node, npm, Terminal server, or Vercel deployment is required. The current signed release is Developer ID signed and notarized. If macOS blocks it, check the version and exact error with Tim. Do not disable system security or remove quarantine. The prototype data is fictional and local to this Mac. If I need to rebuild from source, follow the separate `electron-handoff.md` document and obtain the complete Computer-app source folder from Tim.
