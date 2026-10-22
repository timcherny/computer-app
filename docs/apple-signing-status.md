# Apple signing status — October 21, 2026

- Apple Silicon share build version 0.1.1 has a valid ad-hoc signature. Both the final ZIP's extracted app and the app in the mounted DMG passed `codesign --verify --deep --strict`.
- Gatekeeper rejected that old 0.1.1 build for trusted distribution. Ad-hoc integrity validation is not Developer ID trust or notarization; the accepted 0.1.2 release is described below.
- Xcode and `notarytool` are installed. A valid Developer ID Application identity and matching private key are now available in the login keychain. Apple’s official Developer ID G2 intermediate certificate was imported to complete the chain; `security find-identity -v -p codesigning` confirms one valid identity.
- Apple Developer Program membership is now active. The account portal confirms membership and certificate creation is available.
- Tim created the CSR, issued the G2 Developer ID Application certificate, and installed it himself.
- Tim configured and validated the `Computer-notary` keychain profile. The share build reads that profile without exposing its password.
- Version 0.1.2 uses the larger 600 × 600 Figma icon from node `9087:17644`. The app and DMG are Developer ID signed, accepted by Apple notarization, and stapled. Gatekeeper accepts the final DMG and the app extracted from the final ZIP with `source=Notarized Developer ID`. The signed app launched successfully.
- Apple submission IDs: app `4ef87d7d-93d7-4a4f-b85e-ba5b108b73e0`; DMG `c43047a2-5025-4cac-8b51-a4e40fb624ff`.

The root `build:share` command requires a valid Developer ID Application identity and notarization credentials, and builds into `release/signed-apple-silicon`. It must successfully sign/notarize/staple the application and installer and verify Gatekeeper acceptance before distribution. Share the latest version listed below from that folder, not earlier ad-hoc builds in the old output directories. Never store private keys, passwords, or notarization credentials in the repository or shareable guides.

The browser prototype is already deployed independently at https://computer-prototype-hazel.vercel.app. See `web-deployment.md` for redeployment.

## Latest release: 0.1.3

- Updated icon from Figma node `9087:17646` (600 × 600 source).
- App and DMG accepted by Apple, tickets stapled, and final ZIP app and DMG passed Gatekeeper with `Notarized Developer ID`. The app launches successfully; the mounted DMG contains the correct version and icon.
- App submission: `4d214343-580b-49d1-9214-a2965cd82de6`; DMG submission: `869f3c60-14e2-4ee0-b38a-ed44a836daf2`.
- Share `release/signed-apple-silicon/Computer-0.1.3-mac-arm64.dmg` with `READ-ME-FIRST.md`.
