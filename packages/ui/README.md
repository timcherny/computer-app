# @computer/ui

Computer's reusable React components and CSS-variable themes. The package includes Button, Text, Avatar, navigation, and chat components, Operator color tokens, and Chip typography recipes. It is private until publication is explicitly requested.

## Use

```jsx
import { Button } from '@computer/ui';
import '@computer/ui/styles.css';

<Button variant="secondary" size="sm" onClick={handleClick}>
  Continue
</Button>
```

Import the stylesheet once in the consuming app. The Button defaults to `type="button"` and accepts native button props, including `disabled`, `aria-*`, and React 19 `ref`. It supports `primary`, `secondary`, and `ghost` variants and `sm`, `md`, and `lg` sizes. Keyboard focus is visible and transitions respect reduced-motion settings.

React 19 is a peer dependency. Consumers supply their own React installation.

## Themes

The default follows the operating system. Set `data-theme="light"` or `data-theme="dark"` on `<html>` or on a containing element to choose explicitly.

```jsx
<section data-theme="dark">
  <Button>Continue</Button>
</section>
```

Load overrides after the package stylesheet:

```css
:root[data-theme='light'] {
  --computer-color-accent: #234d80;
  --computer-color-accent-hover: #16395f;
  --computer-color-on-accent: #ffffff;
  --computer-color-focus: #234d80;
  --computer-radius-md: 0.5rem;
}
```

All colors and control styling in components come from `--computer-*` tokens. Definitions are in `src/tokens.css`; a visual color reference is available in Storybook under Foundations / Colors and Foundations / Typography. Brand overrides should preserve readable contrast and a visible keyboard focus indicator.

## Develop

From the repository root:

```sh
npm run storybook
npm run build:ui
npm run build:storybook
```

Add reusable components under `src/components`, export them only through `src/index.js`, and add stories under `stories/`. The catalog includes live props, native disabled behavior, size examples, generated docs, and light/dark previews.

The `development` export condition points at JSX source for workspace HMR. Production consumers load `dist/index.js`; `@computer/ui/styles.css` resolves to the appropriate stylesheet. Bundlers consuming the development export need to handle React JSX. The library configuration is named `vite.lib.config.js` so it does not override Storybook's application build.

## Install in another local project

From this repository root:

```sh
npm pack --workspace @computer/ui
```

The prepack script builds the library. The resulting `computer-ui-0.1.0.tgz` contains the public exports, compiled JavaScript/CSS, and the source needed for development imports. In another React 19 project:

```sh
npm install /absolute/path/to/computer-ui-0.1.0.tgz
```

This creates a locally installable package without publishing anything. Removing the private flag, adding registry configuration, and publishing require a separate request.

## Figma foundations

The 20 Operator colors come from the Figma collection’s Light and Dark modes. Names map directly: `✦/bg/primary` becomes `--computer-color-bg-primary`. The existing `background`, `surface`, `text`, `accent`, and other aliases remain available. The accent aliases represent the inverse primary action; `text-active` is the blue active-state token.

```jsx
import { Button, Text, colorTokens, typographyTokens } from '@computer/ui';

<Text as="h1" variant="heading" tone="heading">Workspace</Text>
<Text as="p" variant="prose">A comfortable paragraph.</Text>
<Text variant="caption">RECENT</Text>
<Button variant="primary">Continue</Button>
```

`Text` separates styling from semantics with `as`. Recipes: `label`, `body`, `body-strong`, `input`, `prose`, `heading`, and `caption`. CSS recipe tokens follow `--computer-type-{recipe}-{family|size|weight|line-height|tracking}`. Sizes and tracking use rem; line heights are unitless so text scales with the user’s font size.

The three font families are `--computer-font-sans` (Chip Text Variable), `--computer-font-display` (Chip Display Variable), and `--computer-font-mono` (Chip Mono). The stylesheet uses local font faces with their actual weight ranges. Font binaries are not bundled: this Mac uses the installed Chip fonts, while other devices use system fallbacks. For identical rendering on other devices, provide webfont files with the relevant distribution rights, or override the font-family tokens in the consuming app.

Light/dark can be nested, and `data-theme="system"` follows OS changes through CSS media queries. Token overrides belong after the package stylesheet on the relevant theme scope. Color source values and typography metadata are also exported for catalog/tooling use; CSS variables drive components and support consumer overrides.

The medium Button matches Figma’s 28px height, 13/16 label, 460 weight, and 0.1px tracking. Primary maps to the pill-shaped inverse action, secondary to the square filled control, and ghost to the transparent control. Small (24px) and large (36px) sizes, disabled opacity and keyboard focus are implementation extensions. Figma’s pressed colors also serve hover feedback. The Select variant’s icon and menu behavior are not implemented by this Button.

Provenance and remaining Code Connect work are recorded in `../../docs/figma-foundations.md`. The raw MCP snapshot is in `../../docs/figma-foundations.json`.

## Avatar

```jsx
import { Avatar } from '@computer/ui';

<Avatar src="/people/tim.jpg" alt="Tim Cherny" />
<Avatar variant="computer" alt="Computer" />
<Avatar variant="team" alt="Design team" />
<Avatar variant="mp" alt="Project team" members={[
  { src: '/people/tim.jpg', alt: 'Tim Cherny' },
  { src: '/people/maya.jpg', alt: 'Maya' },
  { src: '/people/alex.jpg', alt: 'Alex' },
]} />
```

Variants match the updated Figma set: `default`, `mp`, `computer`, `team`, and `hover`. The initial names `image` and `group` remain aliases for `default` and `mp`. An image avatar without `src`, or one whose image fails, shows initials derived from `alt`; set `initials` to override them. A new source retries image loading. The component ships without sample people baked into its defaults; demonstration photos live only in the catalog.

Group members occupy the original 14px, 10px and 7px circles, in that order, on the 32px disc. At most three are displayed. `src` can replace the default team artwork. The Computer background and team artwork are local Figma assets; the Computer mark uses the inverse text token. MP and Hover backgrounds follow Figma’s `✦/bg/secondary` binding: white in light mode and `#141414` in dark mode.

Default sizes match Figma: 32px, or 33px for Team with its inset 29.333px artwork. `size={48}` optionally scales the composition; this is an implementation extension. Override `--computer-avatar-size`, `--computer-avatar-default-size`, `--computer-avatar-team-size`, or `--computer-avatar-team-radius` through CSS. Fallback colors use the existing avatar-placeholder and primary-text tokens.

Use `alt=""` to hide a decorative avatar from assistive technology when adjacent text already identifies it. A named avatar exposes one image role; nested artwork is decorative. Native props and React 19 refs pass through. The default span has no tab stop. Use `<Avatar as="button" src={photo} alt="Open profile menu" onClick={openMenu} />` for a native button: pointer hover and keyboard focus replace the artwork with Figma’s circle and centered 16px chevron. Disabled buttons do not respond. `variant="hover"` exposes the same visual for previews. The button defaults to `type="button"`; pass `aria-expanded` and `aria-haspopup` when it opens a menu. The menu itself is supplied by the consumer.

The hover circle now directly follows Figma’s secondary background binding in both modes; its chevron follows the primary text binding. The existing SVG circle geometry is used as a mask so the fill responds to theme tokens.

See [Avatar provenance](../../docs/figma-avatar.md) for source nodes and asset mapping.

## NavItem

```jsx
import { NavItem } from '@computer/ui';

<NavItem label="Operator chat" description="Latest message preview" avatar={{ src: '/people/tim.jpg' }} onClick={openChat} selected />
<NavItem variant="section" label="RECENT" />
<NavItem variant="session" label="Session name" count="2 days" href="/sessions/today" />
<NavItem variant="me" label="Open profile menu" avatar={{ src: '/people/tim.jpg' }} onClick={openProfile} aria-haspopup="menu" />
```

Variants: `default` (52px), `session` (32px, indented 46px), `section` (11px caption heading), and `me` (40px, avatar only). Selected default/session rows use 8px corners. Only selection fills the row background; hover and pointer-down leave it unchanged. Second-level secondary info has a 16px-high box, at least 28px wide, that grows for relative timestamps supplied through `count`. Timestamp text always displays in uppercase (for example, `2 DAYS`). The default 267px width shrinks to the parent; use `--computer-nav-item-width: 100%` for a fluid sidebar. Text uses the existing label/caption recipes and truncates with ellipsis. `avatar` accepts `variant`, `src`, `members` and `initials`; portraits are 32px and decorative unless they control expansion.

Supply `label` for all variants; it is the accessible name for Me. Interactive rows are native buttons (type button), or native links when `href` is supplied. `selected` is controlled and sets `aria-current="page"`; `disabled` suppresses activation and removes a link's URL/tab stop. Native props and React 19 refs pass through. Section is a non-interactive h3. For avatar-only expansion on a default row, supply controlled `expanded`, `onExpandedChange(nextExpanded, event)`, and `controlsId` for the child container. The avatar is a native toggle with `aria-expanded`, an “Expand/Collapse {label}” accessible name (override via `expansionLabel`), and the existing Hover chevron on pointer hover/keyboard focus. Its action never selects the row. The text is a separate button/link when `onClick`/`href` is provided, or static for expand-only groups; there are no nested controls. In this compound form, `className`, `id`, `style`, and `ref` apply to the outer row, while remaining native props apply to the text control/content. `disabled` disables both actions. Keep the controlled child container mounted with `hidden={!expanded}` so `controlsId` always points to an element. Routing, selection state, and menus belong to the consumer.

Storybook includes all six Figma states, both themes, long-label/narrow examples, and selection/expansion keyboard and disabled interaction checks. Source details and theme adaptations: [NavItem provenance](../../docs/figma-nav-item.md).

## NavPanel

```jsx
import { NavItem, NavPanel } from '@computer/ui';

<NavPanel
  primary={<NavItem label="Computer" avatar={avatar} onClick={openComputer} />}
  footer={<NavItem variant="me" label="Open profile menu" avatar={avatar} onClick={openProfile} />}
>
  <NavItem label="Gil" description={lastMessage} avatar={avatar} selected={current === 'gil'} onClick={openGil} />
</NavPanel>
```

`primary` contains the main entry and date/session rows. Children are recent entries beneath `recentLabel` (default RECENT). `footer` remains visible below the scrollable navigation. `header` is an optional 48px chrome slot; native window controls belong to the host, and the web does not display fake window buttons. `label` names the navigation landmark. Standard props and React 19 refs apply to the outer aside.

The reference is 240 × 900px. Override `--computer-nav-panel-height` to fill a host and `--computer-nav-panel-width` for another sidebar width. The panel uses 32px session rows with 8px vertical padding, a 28px section heading, and 44px profile rows. It uses the existing sidebar background/border tokens in both themes. Pass `data-desktop` only in an Electron host to make the header draggable. Selection, group expansion, routing and profile menus are consumer-owned.

Storybook includes both themes, a short panel with overflow, and an interaction test. Computer starts expanded; its avatar toggles Today / Yesterday / 25 April, whose sample trailing values are 2 days / 5 days / 10 days. All parent rows, including Computer team and Ben & Gil, are selectable through their text even when they contain second-level items. Their avatars independently expand/collapse those items. See [NavPanel provenance](../../docs/figma-nav-panel.md).


## Chat

```jsx
import { ChatWindow, Icon, IconButton, MessageAvatar, MessageItem, ChatHeader, MessageInput } from '@computer/ui';

<ChatWindow
  key={conversationId}
  title="Computer"
  messages={messages}
  inputValue={draft}
  onInputChange={event => setDraft(event.target.value)}
  onSend={text => { appendMessage({ id: crypto.randomUUID(), type: 'me', text }); setDraft(''); }}
/>
```

The host owns persistence and delivery. `messages` contains `{ id, text, ...MessageItemProps }`. Key the window by conversation ID to reset scroll on a conversation switch. New outgoing messages scroll into view; incoming changes preserve a scrolled-up reading position. The fixed header/composer adapt the old Computer chat layout. Give ChatWindow a parent with a defined height. The scroll viewport ends 22px below the input’s top edge (`--computer-chat-scroll-input-overlap`). The composer sits above history, and bottom message padding keeps the last message fully visible at the end of scrolling.

- `Icon`: `name`, optional `size` and accessible `title`; otherwise decorative. `iconNames` lists the public names. SVG masks use currentColor and the source optical insets. Assets are bundled locally.
- `IconButton`: `icon`, accessible `label`, `variant="ghost" | "default"`, optional controlled `pressed`, native button props. Figma `state="pressed" | "disabled"` is also available for specimens. Always provide a meaningful label. Default size is 36px with a 20px icon. Hover leaves the appearance unchanged; pointer-down and controlled pressed states show the pressed background. Keyboard focus retains its visible outline.
- `MessageAvatar`: 20px `initial`, `computer`, `computerCircle`, `claude`, `codex`, or a portrait via `src`. `initial` supplies the fallback if an image fails. Use `alt=""` beside an existing sender label, or a descriptive `alt` for an independent image.
- `MessageItem`: `type="me" | "person" | "personWithAvatar" | "personWithAvatarAndName" | "notification" | "threadSummary" | "topAvatar"`. Text is children. Supply `name` and `avatar` as needed. `size="auto" | "oneLine" | "manyLines" | "writing"`; `tail={false}` hides the bubble tail. Auto chooses multiline padding for newlines or longer text; wrapping always remains responsive. Thread summaries accept `title`, `count`, and optional `onClick` (renders a native button).
- `ChatHeader`: `title`, optional `subtitle`, and Avatar props in `avatar`; defaults to the Computer artwork. Uses the Figma 40px avatar, 28px single-line title chip and shadow. A subtitle selects the two-line variant: title and uppercase numerical caption share one 40px chip, with 6px between lines and 3px/8px top/bottom padding.
- `MessageInput`: the separately implemented animated Figma composer is preserved. It supports controlled `value`/`onChange(event)` or uncontrolled `defaultValue`; the owner clears the draft after `onSend(text,event,{toComputer})`. Enter sends, Shift+Enter adds a line, and IME input is protected. Mentions, group mode, animation settings and `onAddAction` are supported. ChatWindow forwards `inputProps` for these settings and `onAddAction` for optional actions.

All components use the same light/dark tokens. Full provenance and local prototype behavior are documented in [figma-chat.md](../../docs/figma-chat.md).


## Chat top bar

`ChatTopbar` composes `ChatHeader` and two `IconButton` controls. It matches Figma [chat_topbar](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=9043-1228): a 157px overlay with a 120px gradient/blur background, centered header 9px from the top, and 36px More/Canvas buttons at top/right 9px with a 4px gap. Width is fluid; the reference is 447px. Long titles truncate before the action controls. The background fades from the current theme’s `bg-secondary` at 0% to transparent at 100%. Six masked backdrop-filter layers approximate Figma’s progressive blur from 6px at the top to 0px at the bottom, controlled by `--computer-chat-topbar-blur`. Chat history forms a separate stacking context so both bubble text and backgrounds stay beneath the overlay. The noninteractive overlay passes pointer events to chat history.

```jsx
<ChatTopbar title="Computer" onMore={openChatActions}
  canvasOpen={canvasOpen} onCanvasToggle={() => setCanvasOpen(value => !value)} />

<ChatWindow topbarProps={{ onMore: openChatActions, canvasOpen, onCanvasToggle: toggleCanvas }} />
```

The consumer owns menus and canvas state. `moreButtonProps` and `canvasButtonProps` pass native/ARIA props to their controls (including `popoverTarget`, `aria-expanded`, and `aria-controls`). Missing callbacks disable the corresponding action; a native popover target also enables More. `canvasOpen` controls `aria-pressed` and Open/Close canvas labels. No menu, canvas contents or navigation state is baked into the shared component.

ChatWindow uses this overlay above the scrollable history, with initial top padding to keep the opening message below the fade. The composer remains fixed. The product More popover offers New chat and appearance switching; Canvas is currently disabled pending its implementation.

The header uses the existing matching avatar artwork: a 40px disc, an 18px mark and 6px gap above the 28px title. Its mark keeps the source light color in both themes so it remains legible over the multicolor artwork; this is scoped to ChatHeader. Tokens `--computer-chat-avatar-*` and `--computer-chat-topbar-*` expose geometry and theme customization. New More/Canvas assets preserve the exact Figma 16.6667px SVG frames inside the 20px icon slot; existing catalog icons are unchanged.


## Menu and MenuItem

Adapted from the original Computer project, using Computer-app tokens and shared components. `Menu` renders a 202px shell with optional `sectionLabel`, `items`, `selectedId`, and `onSelect(id, item, event)`. Items support `id`, `label`, `type="item" | "section" | "divider"`, `disabled`, `selected`, `leading`, `trailingLabel`, `trailingIcon`, `shortcuts`, `href`, and `onClick`.

For an overlay, pass `id` and `popover="auto"`, and connect a trigger with `popoverTarget` and `aria-haspopup="menu"`. Position the menu with a host class. Native dismissal restores trigger focus. Enabled rows support arrow keys, Home/End, and typeahead; choosing an action closes the popover before invoking callbacks. Standalone `MenuItem` belongs inside a menu. Storybook includes both themes and keyboard coverage. See [menu provenance](../../docs/computer-menus.md).
