# NavPanel provenance

Source: [Operator / nav_panel](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=9022-572), read through Figma MCP on 2026-10-20.

## Geometry and composition

October 21 NavItem update ([7083:16676](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=7083-16676)): main rows are now 52px tall, including selected rows, through the shared `--computer-nav-item-height` token. Avatars remain 32px and session rows remain 32px with a 46px left inset. The original panel coordinates below describe the October 20 reference; main-row growth shifts subsequent content down.

- 240 × 900px reference, 24px top/bottom left corners and a 1px inset right divider.
- 48px native-chrome header; 6px between header, scroll area and footer.
- Primary group at y=54: 44px Computer row and three 32px session rows with 8px vertical padding, 6px apart, with 8px group padding.
- Recent group starts at y=218 with no extra top padding, a 28px section heading and 6px row spacing. The October 20 padding update removes the earlier 12px inset: Gil starts at y=252, Computer team at y=302, its expanded session at y=352, and Ben & Gil at y=390. Gil's instance overrides the avatar/text gap to 8px; the other rows use 6px.
- Profile row is 44px high at y=845, leaving 11px bottom padding in the reference.

NavPanel composes the existing NavItem, Avatar and Text components. Every second-level row in the web/Electron and catalog examples includes a relative timestamp, including Onboarding review (2 days) and Design review (5 days). Second-level rows use the standalone NavItem’s 32px height and 8px vertical padding, matching the updated Figma panel. The primary group is now 158px high. The panel scopes section/profile row-height variables; the standalone NavItem stays unchanged in size. Its scroll region contains primary and recent content; the header/footer remain fixed as the window shrinks or the list grows. CSS variables expose panel width, height, corner radius and chrome dimensions.

## Colors and assets

The design's unbound #faf9f9 fill and external Stroke/Neutral/Soft border match the existing bg-sidebar and border-sidebar tokens. Their existing dark values are used in dark mode. Text and selected states retain NavItem's theme tokens.

All five portraits in the source are the same default Avatar (`a8ab6.png`). Storybook reuses the existing sample. The app has its own local copy in `apps/web/src/assets/nav-avatar.png` so production does not import the story directory. Images are prototype data supplied to the component.

Figma emits a Code Connect snippet for the macOS 26 `WindowControlsStandard` component at `I9022:503;1168:2430` (source `5793:34477`). There is no matching dependency or implementation in this repository, and the panel's Code Connect map is empty. Electron uses the operating system's real window controls. The reusable panel reserves a header slot; Storybook and the web app leave that native-chrome space empty. No fake Mac controls are rendered in the web, no control is redrawn, and no temporary asset URL is used at runtime.

## App integration

The shared web renderer now places NavPanel to the left of the existing workspace. Electron loads that same renderer. Native traffic lights sit within the 48px header; the native security/preload configuration is unchanged. Only the header is draggable and interactive rows opt out of drag regions.

Clicking a date/chat selects it and updates the workspace title/preview. Only avatars expand/collapse groups: Computer starts expanded with its date rows; Computer team and Ben & Gil start collapsed with sample sessions. All parent rows, including teams/groups, are selectable through their text, independently of avatar expansion. This supersedes the earlier expand-only group rule at Tim’s request on October 20, 2026. Second-level left padding is 46px. Expandable avatars reuse the existing Hover chevron on pointer hover and keyboard focus. The footer opens a native HTML popover with appearance controls; Escape/outside click dismiss it. Theme persistence uses the existing `computer.theme` setting. This is local prototype behavior, not a connected chat or account service.

The labels and message previews come from the supplied Figma panel. At Tim’s request on October 20, 2026, the Today / Yesterday / 25 April trailing values are now sample durations of 2 days / 5 days / 10 days, replacing the Figma placeholder count 2546. The expanded session labels, Onboarding review and Design review, are local prototype extensions based on the existing copy reference.

## Verification

Build the web/UI and Storybook. Check the 240px panel in light/dark, scroll a long list while the footer remains visible, exercise group expansion/keyboard selection, and verify the profile popover/theme switch. Launch the Electron app to check the real traffic-light location and native drag region.

## Moving chats between sections (October 21)

Drag a main chat row between Recent and the top section beneath Computer, or reorder rows within either section. Expanded sessions travel with their parent; Computer and its own sessions stay in place. A line shows the insertion point and Escape cancels. Placement is saved locally in `computer.navigation-layout` and Reset to default data restores the original arrangement. Chat selection and drafts are independent of placement. The chat More menu also offers Move to top section / Move to Recent; Alt+Shift+Up / Down moves a focused chat between sections.


## Collapsed rail — October 21

Source: Figma `9054:16923`, with high-fidelity child contexts `9054:16925` and `9054:17024` because the outer context returned a Figma error. The screenshot and metadata establish the outer 67 × 900px frame, with its 68px inner layout centered at x=-0.5. The collapsed NavItem variants come from `7083:16676`. Existing local sample avatars match the reference; real app avatars remain dynamic.

`NavPanel collapsed` is a 67px rail, with 10px top/bottom padding, 6px row gaps, no separator or Recent heading, and a pinned profile avatar. Supply `NavItem variant="collapsed"` in the primary, recent and footer slots. Items are 52 × 52px, with a centered 32px avatar, 4px padding and 8px radius; selection uses the existing pressed token. The reference's row coordinates are x=7.5, y=10, 68, 126, and profile y=838. Labels remain accessible and appear as native tooltips.

The app now retains this rail when navigation is collapsed. It hides session rows while retaining group expansion state, selects parent avatars for active child sessions, and restores focus to the navigation toggle when changing layouts. Clicking an avatar selects its parent chat; expansion stays in the full navigation. Pinned/Recent chat placement and dragging continue to use the same layout state. The profile menu remains available. Electron adds its existing 48px native chrome clearance above the rail, and the floating expand/new-chat controls remain outside drag regions and clear of canvas tabs. Narrow windows keep the rail in flow; expanded navigation remains an overlay.

Catalog includes Collapsed, CollapsedDesign, CollapsedThemes, CollapsedOverflow, CollapseAndExpand and CollapsedInteraction. Verified Figma geometry, theme colors, loaded local avatars, avatar selection, profile access, retained child expansion and selection, keyboard focus, full-width canvas hit targets, and real pointer expansion in Electron.
