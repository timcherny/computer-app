# Chat components — October 21, 2026

The shared package now exports `Icon`, `IconButton`, `MessageAvatar`, `MessageItem`, `ChatHeader`, `MessageInput`, and `ChatWindow`. The web/Electron renderer composes them with the existing NavPanel. This chat integration adds no runtime dependencies.

## Figma sources

Read through the official Figma MCP with Code Connect lookup enabled:

| Component | Source |
| --- | --- |
| Icons | [6363:15954](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=6363-15954) |
| Message avatar | [6363:15735](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=6363-15735) |
| Icon button | [9003:63802](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=9003-63802) |
| Message item | [7086:16954](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=7086-16954) |
| Chat header | [9035:976](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=9035-976) |

The ChatWindow layout adapts the old Computer implementation. The newer animated MessageInput created concurrently in a separate session is preserved and integrated; its own catalog describes its design and behavior. No remote Code Connect mappings have been published; this repository remains local without a remote.

## Artwork and sizing

At Tim’s request, existing matching artwork was copied unchanged from `/Users/timcherny/Computer/public/icons`, `/public/avatars`, and `/public/chat`. Icon masks, message-avatar glyphs and bubble tails live in `packages/ui/src/assets`. Photo examples live only in Storybook fixtures. The missing Menu and exact IconButton Plus artwork were downloaded from the Figma MCP asset URLs, also stored locally. `chat-assets.json` records the file hashes and source locations.

Icons preserve their source optical insets inside a 16px frame; IconButton uses a 20px frame inside a 36px button. MessageAvatar is 20px. Message bubbles use 20px corners, 14px horizontal padding, 10px single-line or 8px multiline vertical padding, a 481px maximum width, and the supplied 36×20px tails. Names and notification captions are uppercase. ChatHeader composes a 40px Computer avatar with the 28px title chip and Figma elevation shadow.

Colors consume the existing Operator CSS variables in both themes. Incoming bubbles use `bg-control`/`text-primary`; outgoing bubbles use `bg-inverse-primary`/`bg-secondary`. Icon masks use currentColor. Photographs and multicolor avatar artwork retain their original pixels. No palette values were changed in this task.

## Reference logic and local behavior

Read-only references: old Computer `Icon.jsx`, `iconMap.js`, `IconButton.jsx`, `Avatar.jsx`, `MessageItem.jsx`, `MessageInput.jsx`, `ChatWindow.jsx`, `chatStorage.js`, and `chatSessions.js`. The original project was not edited. Tailwind styles were rebuilt with package CSS and tokens.

- The composer grows with text, Enter sends, Shift+Enter adds a line, and IME composition never sends. Empty messages are disabled. The existing composer’s optional Add menu exposes consumer callbacks; this prototype does not implement file, generative UI or side-chat actions.
- The header and composer stay fixed; only history scrolls. Outgoing messages scroll into view. Incoming changes preserve the reading position when the user has scrolled up. Resize follows the bottom only if already pinned. Key ChatWindow by conversation ID to reset its scroll when switching.
- Product state belongs to `apps/web/src/chatData.js`. Nav selection opens an independent local conversation; drafts and sent messages persist under `computer.chat-prototype.v1`. Storage is parsed defensively and unavailable/full storage does not stop the current session.
- New chat creates a local session under Computer, with an uppercase NOW timestamp. Its first sent message supplies the session title. Existing second-level timestamp fixtures remain unchanged.
- The opening Computer/Today conversation uses saved CHAT-001 from the Operator workspace’s `computer-copy.md`. Person/team chats use their existing nav previews; historical and extra sessions start empty. No new scripted dialogue was invented.
- Sending only adds a local outgoing message. No assistant backend, teammate delivery, remote sync, document actions, or fabricated assistant reply is connected.
- Sidebar visibility, parent selection/avatar expansion, theme/profile controls, and native Electron window controls remain available. On narrow windows the navigation overlays the chat and closes after selection.

## Catalog and verification

Storybook includes all shared pieces, light/dark examples, a full chat specimen, and a composer interaction story covering blank messages, Shift+Enter, send, focus, and clearing. Build with `npm run build` and `npm run build:storybook`; review with `npm run dev:desktop` and `npm run storybook`.


## ChatHeader / ChatTopbar follow-up — October 21, 2026

Re-read nodes `9035:976` and `9043:1228` through Figma MCP with Code Connect enabled. ChatHeader keeps the existing exact avatar/background files (SHA256 matches fresh Figma downloads); its source mark is now 18px within the 40px avatar and retains the source light color in both themes. The new ChatTopbar uses the reference’s 157px transparent fade, 9px offsets, centered header, two 36px controls, and 4px action gap. Geometry is tokenized and titles truncate before the controls on narrower hosts.

The More and Canvas SVGs supplied here contain 16.6667px frames, unlike the earlier cropped icon glyphs. They are downloaded unchanged as `button-more.svg` and `button-canvas.svg`; dedicated icon names preserve their geometry without altering the earlier icon catalog. Source URLs and hashes are in `chat-assets.json`.

ChatWindow uses ChatTopbar as a stationary overlay while history scrolls beneath its fade. Padding keeps the first message below the initial overlay; the composer stays fixed. The host’s More popover provides New chat and appearance switching. Canvas is a controlled component callback and is disabled in the product pending its implementation. Storybook demonstrates callback/keyboard behavior, toggle state, both themes, a 320px host, long titles, and the fade over content.


The extra product toolbar above ChatTopbar has been removed. Navigation visibility, New chat and appearance icons are now hosted in NavPanel’s header beside the native Mac window controls. When navigation is hidden, the same controls remain in a compact floating group so it can be reopened. The chat starts at the top of the workspace, and its More popover follows that position.

## Two-line ChatHeader — October 21, 2026

Figma component set `9045:1423` adds variant `9045:1424`: a 40px avatar, 6px gap, and a shared title/subtitle chip with 4px corners and 9px horizontal padding. The October 21 padding update makes the chip 40px tall: 3px top padding, a 6px gap between title and subtitle, and 8px bottom padding. The uppercase 10px numerical subtitle uses cap trimming. Supplying `subtitle` selects this variant. Computer team and its session show 20 PEOPLE; Ben & Gil and its session show 2 PEOPLE. Single-line Computer/Gil headers retain their 28px chip. Both themes use existing color and typography tokens.

## Progressive topbar blur — October 21, 2026

Read `9043:1219` using Figma MCP: the gradient now fades from opaque at 0% to transparent at 100%, and the BACKGROUND_BLUR effect is PROGRESSIVE, with startRadius 6 at (0.5, 0) and radius 0 at (0.5, 1). Generated context flattened it to blur(0px), omitting the progressive start radius. The renderer uses six masked incremental Gaussian backdrop filters as a CSS approximation, under the theme-aware gradient and above the scroll content. The 157px overlay, header and controls retain their geometry. Chat history has z-index 0 so its message-text z-index cannot escape above the topbar. Storybook ProgressiveBlur demonstrates the effect over scrollable messages in both themes.

### Top bar background size update (October 21)

Figma `9043:1228` retains its 447 × 157px reference frame. The background `9043:1219` is now 120px tall; both the gradient and progressive 6px-to-0px blur finish at that boundary. `--computer-chat-topbar-background-height` controls this independently of the outer height and message top spacing. The header and actions retain their 9px offsets, and the entire overlay remains above the message stacking context.
