# Mac app icon

Artwork: Figma Operator, node `9087:17646` (Liquid Glass – Medium).
https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=9087-17646

`icon-source.png` is the original 600 × 600 raster downloaded from Figma. The generated 1024px image is upscaled and does not add source detail. Replace the source with a larger square PNG of the same design when available.

Run `node scripts/build-mac-icon.mjs` from the repository root after replacing the source. It preserves transparency and creates `icon.png` for the development Dock and `icon.icns` for the packaged app. The ICNS contains the standard 16–1024px representations.

The generator centers the artwork at 824 × 824 within a transparent 1024 × 1024 canvas (100px padding on each side), matching the visual scale of standard macOS Dock icons. Keep the Figma source unchanged; padding is added only to generated assets. Requires the installed Swift command-line toolchain.
