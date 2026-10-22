# Operator foundations

Color variables refreshed from Figma MCP on 2026-10-21; typography was sampled on 2026-10-20. No Figma document changes were made.

- File: https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator
- Collection: Operator (`VariableCollectionId:6363:15483`), 20 colors.
- Modes: Light (`6363:0`) and Dark (`9002:2`).
- Raw source: [figma-foundations.json](figma-foundations.json).
- Color names retain Figma’s path with `/` replaced by `-` and the decorative `✦/` removed. Colors round to 8-bit sRGB hex.

## Typography

There are no local text styles in this file, so recipes come from actual text layers. Variable font axis values take precedence over the style name: for example, the chat body layer is called Semibold but its weight axis is 460.

| Recipe | Family | Size / line height | Weight | Tracking | Example node |
| --- | --- | --- | --- | --- | --- |
| label | Chip Text Variable | 13 / 16 | 460 | 0.1px | 6363:15491 |
| body | Chip Text Variable | 13 / 20 | 460 | 0 | 7086:16958 |
| body-strong | Chip Text Variable | 13 / 20 | 650 | 0 | 7086:16996 |
| input | Chip Text Variable | 14 / 16 | 460 | 0.1px | 9003:64049 |
| prose | Chip Text Variable | 15 / 24 | 460 | 0.1px | I7086:20061;5668:362638 |
| heading | Chip Display Variable | 40 / 46 | 650 | 0 | I7086:20050;5676:572865 |
| caption | Chip Mono | 10 / 10 | 400 | 0 | 7083:83884 |

The project uses installed Chip fonts via `local()` and retains system fallbacks. No font binaries are copied into the shareable package. Chip Text supports 400–700; Chip Display supports 400–800; the captured Mono face is 400. Webfont files remain a follow-up for identical rendering on machines without Chip installed.

## Components and Code Connect

The user-linked node `7083:98366` is an avatar component set. Its React Code Connect map was empty. The matching Avatar implementation now lives in `packages/ui/src/components/Avatar.jsx`; see `figma-avatar.md` for its variants and assets. No Code Connect mapping has been published.

Button source reference: `6363:15516`. Its default, action, ghost and pressed variants inform the existing `Button` implementation. The medium size is from Figma; small/large, focus and disabled are implementation extensions. The Select/dropdown variant is not implemented in this pass. `Text` exposes reusable recipes sampled from text layers rather than claiming a Figma component mapping.

Code Connect discovery succeeded, but no templates or mappings have been published. The Button is a candidate for a future confirmed mapping; a mapping must account for Figma’s Type/Action/State properties and nested icon components without pretending unsupported variants are supported.

## Use of color

Primary, inverse and navigation text tokens cover ordinary readable labels. Secondary text and the active color retain the exact design values (blue in Light, neutral gray in Dark); their light-mode contrast is lower, so they are not used for Button labels. This token extraction is not an accessibility certification of every possible foreground/background pairing.

## Color refresh — 2026-10-21

The Operator collection still contains 20 colors. All Light values are unchanged. Eighteen Dark values now use neutral grays; text-primary and bg-inverse-primary stay #f4f4f4. The active color is now #afafaf, and the existing focus alias follows it. CSS explicit/system theme scopes, exported colorTokens, and the raw color snapshot are synchronized.
