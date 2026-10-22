# Canvas window

Figma Operator Page `7086:20043`. `CanvasWindow` composes the existing `CanvasTabs` and heading Text variant. The 48px strip sits above a title-only body with 48px top padding, 20px outer and 32px inner horizontal padding, a centered 740px maximum content width, and 24px right corners. All colors and dimensions use shared theme tokens.

Public props: `items`, `selectedId`, `onSelect`, `onCloseTab`, `onClose`, `onExpand`, `expanded`, `onAdd`, `addButtonProps`, and `titleRef`. The host owns page identities, selection, visibility and persistence. Tab/panel IDs are unique per instance; keyboard selection and tab closing come from CanvasTabs.

Product behavior:

- Properties entries open/select pages, with one tab per page per chat. There is no body content yet.
- The + menu lists the current chat’s pages. The rightmost icon closes the canvas without removing its tabs. The adjacent icon expands/restores its size.
- When the canvas is closed, the chat top bar shows its opener after the properties button. With no saved tabs, the Figma plus icon opens the same Pages menu as the tab-strip +; choosing a page then opens the canvas. With saved tabs, a numbered MessageAvatar replaces the icon and reopens those tabs directly. The count includes page tabs only. The opener disappears while the canvas is open; closing it returns the control to the chat top bar. Selecting a properties entry also reopens the canvas.
- Individual tab close selects a neighboring tab if needed; the last tab closes the canvas and returns focus to the composer.
- Each chat remembers its own ordered tabs, selected page and visibility in local storage under `computer.canvas.v1`. Invalid/deleted page and chat IDs are discarded on reload. Reset to default data clears canvas state along with conversation data.
- Opening a page closes chat properties. Closing the canvas restores properties. The same ChatWindow remains mounted, preserving drafts and conversation scroll. Explicit page opening focuses its title; switching chats retains composer autofocus.
- Narrow windows show the canvas across the workspace; the main chat navigation remains available. Expanded canvas adds a fixed, nonclosable **Chat** tab before the page tabs. It displays the existing conversation and composer at full width without remounting them. Page selection and Chat selection are remembered independently per chat across reloads. Restoring the split view returns to the last selected page alongside the chat. With navigation hidden, tabs leave room for navigation and native window controls.

Items may specify `tabId` and `externalPanelId` to associate a tab with an existing panel outside CanvasWindow. In this case the host owns the external panel's visibility, `role="tabpanel"`, `id`, and `aria-labelledby`; CanvasWindow omits its title body for that tab. This keeps the product conversation mounted while switching tabs.

Catalog: Design, Interactive, Both themes, Long title under Components/CanvasWindow.

Validation: `node --test apps/web/src/canvasState.test.js`, `npm run build`, and `npm run build:storybook`; live web and Electron checks cover title rendering, adding/selecting tabs without duplicates, close/reopen and per-chat restoration.
