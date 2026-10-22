# Animated MessageInput

`MessageInput` is exported from `@computer/ui`. Review it in Storybook under **Components / MessageInput**. Source: `packages/ui/src/components/MessageInput.jsx`.

The 407 × 44 px input and 36 × 28 px Computer pill follow Figma node `9009:360` in Operator, with state styling updated from `9003:63811`. Regular messages have 4 px corners; Computer mode has 22 px corners. Radius, padding, shadow and send-button space transition over 280 ms with an ease-out curve. The send button fades/scales into its 28 px slot on focus or when filled, and remains available while focus moves within the composer. The input shadow appears only while the composer has focus, fading out on blur. Reduced motion disables these transitions. The newer Figma frame uses the mark without a Computer text label. Computer, plus and arrow artwork were downloaded through the official Figma MCP on October 21, 2026. The grainy procedural gradient replaces the design's static reference image intentionally.

## Behavior

- The full background intro is limited to single-line mode. Tab in multiline mode activates only the small pill loop; expanding during an intro cancels it, and collapsing does not replay it.
- One-second intro: opacity rises during 0–0.2s, holds through 0.8s, and falls through 1s. All controls remain visible and usable over the intro. The Computer pill and send button have white backgrounds and black icons during the intro; the Computer pill switches to its looping gradient with a light mark afterward.
- The small pill runs a seamless five-second loop only while the composer has focus. Outside focus it shows a white background with a black Computer mark in light mode, or black with a white mark in dark mode; the gradient canvas is unmounted. Full and small gradient scales are independent.
- Controlled `value`/`onChange(event)` or uncontrolled `defaultValue`.
- Enter sends nonblank input; Shift+Enter adds a newline. IME composition does not send.
- Text is measured against the available single-line width, including on window/container resize. Wrapped text or explicit newlines switches to the multiline layout from Figma `9003:64106`: full-width text with 20 px line height above a bottom control row. Simple-message mode shows “Tab for Computer”; Computer mode shows the pill. Shortening the draft or widening the container restores the compact layout. Measuring against the compact width avoids layout oscillation. Four-line growth by default, then internal scrolling; override `maxLines`.
- `@` suggestions from `people` and `agent`, keyboard navigation, Enter/Tab insertion, Escape dismissal, and highlighted `Name:` tokens.
- `group` mode: focusing an empty input shows a Tab keycap hint. Tab toggles Computer targeting, reveals the Computer mark, and plays the intro when entering Computer mode. A second Tab returns to the group, even during the intro. Draft, selection and keyboard focus are retained. Shift+Tab retains normal backwards navigation. An open mention list takes priority over the target toggle. `computerOnly` defaults to `!group`; the Playground uses group mode so both targets can be tried.
- `onSend(text, event, { toComputer })` retains the previous callback shape and does not clear the draft automatically.
- The Add menu calls `onAddAction('add-files' | 'generative-ui' | 'side-chat')`. Integrations are owned by the consumer. Nothing is uploaded, sent to a service, or opened externally by the component.
- Reduced motion skips the intro and renders a still. Animation pauses while the document is hidden; WebGL resources are released on unmount. CSS provides a fallback when WebGL is unavailable.

The reference-only `/Users/timcherny/Computer/src/components/MessageInput.jsx` supplied the editing, mention, sending, and group-target logic. Legacy issue-specific coding-agent suggestions/storage were not imported into the reusable package. The old experimental Nested toggle is replaced by the new design's permanently inset send button.

## Example

```jsx
import { useState } from 'react';
import { MessageInput, defaultMessageGradient } from '@computer/ui';

function Composer({ send }) {
  const [value, setValue] = useState('');
  return <MessageInput
    value={value}
    onChange={event => setValue(event.target.value)}
    onSend={async (text, event, metadata) => {
      await send(text, metadata);
      setValue('');
    }}
    gradient={defaultMessageGradient}
  />;
}
```

`gradient` accepts `seed`, `blueAmount`, `blackAmount`, `orangeAmount`, `grain`, `softness`, `motion`, `detail`, `distortion`, `cropX`, `cropY`, `scale`, `smallScale`, and `easing` (`linear`, `in`, `out`, `in-out`). Keep the object stable between text edits. `introEnabled={false}` skips the full-width intro while keeping the small pill loop. `animationKey` replays the intro when enabled, `loopDuration` changes the loop duration in seconds, `paused` renders a still, and `animate={false}` disables the intro and motion.

The shared ChatWindow uses this component in both the web and Electron renderer. In chat windows it fills the messages container width, matching its maximum width and side padding; standalone catalog examples retain the 407 px reference width. Empty Computer sessions play the full intro; Computer sessions with existing messages skip the intro and show the small pill, which animates on focus. In people chats, Tab still plays the full intro when entering Computer mode. Drafts and sends use the product’s local prototype state; no message backend is connected.

## Default gradient preset

The approved settings are exported as `defaultMessageGradient`, starting with seed **473393**. A component's first Computer sequence uses that seed (or a supplied `gradient.seed`). Subsequent `animationKey` replays and switches back to Computer choose a fresh seed. The same seed is retained through the intro and every five-second loop, so there is no jump at loop boundaries. Typing, focus and other rerenders do not reseed. Changing `gradient.seed` explicitly starts a new baseline; remounting restores the first preset. Palette, grain, softness, distortion, crop, scales and easing stay fixed.
