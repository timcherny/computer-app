# Chat properties panel

Adapted from the read-only original Computer components: `PropertiesNav.jsx`, `MenuSection.jsx`, and the properties rail in `ChatWindow.jsx`. The implementation uses Computer-app's shared tokens and local icons, with no Tailwind or canvas dependencies.

- Public component: `PropertiesNav`, exported by `@computer/ui`.
- Sections accept `id`, `title`, `items`, and `defaultOpen`. Empty sections are omitted.
- Rows accept `id`, `label`, `trailingLabel`, `onClick` or `href`, `disabled`, and `selected`. Rows without actions are disabled.
- Original dimensions retained: 259px rail, 28px rows, 4px section row gap, 10px section gap, 40px separation from the thread.
- ChatWindow accepts `propertiesSections`, `propertiesHeader`, `defaultPropertiesOpen`, or controlled `propertiesOpen` with `onPropertiesOpenChange`.
- At chat widths below 1000px, the rail becomes a compact nonmodal overlay. Outside click or Escape dismisses it. Escape returns focus from the panel to its toggle.
- Every chat and session has a Pages section. Computer keeps Inbox, Agents, Goals, Reports; other chats have 1–3 contextual page names supplied by `propertiesForChat`. Clicking a page opens or selects its title-only canvas tab for the current chat. The existing rightmost top-bar button toggles properties; there is no extra header button. Page names follow the saved prototype copy; the side rail uses each chat’s own name and avatar, with participant counts for groups.

Storybook includes both themes, section collapse, and integrated wide/narrow ChatWindow examples.

## Figma update — October 21

Reference: Operator node `9054:16590` (identity row `9054:16733`, section `9054:16594`). Both the rail and compact menu omit item icons and section chevrons. Section labels remain clickable buttons with accessible expanded state. Items retain their names and a 76px right-aligned trailing caption. Prototype counts: Inbox 3, Agents 2, Goals 3, Reports 4.

The panel identity row uses the existing dynamic chat avatar, title, optional last-use text; its 52px height and 14px divider match Figma. When the rail is open at chat widths of at least 1000px, the centered top-bar identity (avatar, name and subtitle) is hidden. It returns when the rail closes or becomes a compact menu.

The compact menu contains only the Pages section, without the Computer identity row or its divider. The identity row remains in the wide side rail.

The properties header no longer includes a three-dot More button. Chat More actions remain in the chat top bar.
