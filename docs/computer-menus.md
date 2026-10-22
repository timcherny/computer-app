# Shared menus

Adapted from the read-only reference at `/Users/timcherny/Computer/src/components/Menu.jsx`, `MenuItem.jsx`, and the menu tokens in `src/index.css`.

`packages/ui` exports `Menu` and `MenuItem`. The implementation keeps the reference's 202px shell, 6px padding, 4px gaps and corners, 28px rows, dividers, section captions, selected checkmarks, trailing labels/icons, shortcut hints, and elevation. Styling uses this project's CSS variables and components instead of the reference's Tailwind classes and issue/team dependencies.

The shared web/Electron renderer uses these menus for Me (appearance and reset) and chat More (new chat and appearance). Product actions remain in `apps/web`; no routes, account features, or storage from the reference project were copied. Native popovers handle outside-click/Escape dismissal and focus return. Opening focuses the first enabled item; arrows, Home/End, and typeahead move through enabled actions.

Storybook documents both components, both themes, selection, and a keyboard interaction scenario. The original Computer repository remains unchanged.

The message input’s plus button also uses `Menu`, with Add files or photos, Generative UI, and New side chat. Its native popover anchors above the individual composer’s plus button and flips when space is limited. Selection preserves the `onAddAction` callback IDs and returns focus to the draft; Escape returns focus to the plus button. Mention suggestions remain a separate listbox.
