# Canvas tabs

Figma Operator references: canvas_tab-item `6366:2560`; canvas_tabs / Tabs full `7086:21168`.

The full bar's design-context request failed in Figma, so its screenshot and metadata were correlated with high-fidelity child contexts: Leading `7086:21169` and action group `9003:63765`. Implemented with shared Text, Icon and IconButton, React JSX and token CSS.

- `CanvasTabItem`: 200 × 48px; selected primary background, 20px document slot with a native 16px SVG; unselected secondary divider. Hover/focus reveals a 16px close button and truncates the label while retaining width. `hover` can force a visual specimen. `selected`, `disabled`, `onSelect`, `onClose`, `tabIndex`, `tabRef`, `id` and `controls` support composition.
- `CanvasTabs`: `items`, controlled `selectedId` or `defaultSelectedId`, `onSelect`, `onClose`, `onAdd`, `addButtonProps`, `onExpand`, `onPanelToggle`, `expanded` and `panelOpen`. Missing action callbacks disable their controls. Items may specify `disabled`, `closable`, `tabId`, and `panelId`.
- Automatic keyboard activation: Left/Right wrap and skip disabled tabs; Home/End select the first/last enabled tab; Delete closes a closable tab. Closing the active tab selects an adjacent tab and restores focus after the host removes it. Closing the final tab focuses Add when enabled.
- Narrow bars scroll their tabs, keeping Add and the canvas action group available.
- Product integration now uses `CanvasWindow`; see `docs/canvas-window.md`. Storybook examples continue to own local specimen state.

Downloaded Figma SVGs are stored unchanged in `packages/ui/src/assets/icons/canvas-{document,cross,plus,max,panel}.svg`. Their root frames remain 16 × 16; shared Icon masks place Document/Max/Panel in 20px slots with 2px insets, and Close/Plus in native 16px slots. Colors inherit theme tokens.

Catalog: CanvasTabItem selected/unselected/hover, long label, disabled, both themes and keyboard close; CanvasTabs design, interactive, both themes, overflow, disabled tab and empty state.

Verified in Storybook: light/dark token colors; 200 × 48px tabs and 691 × 48px design bar; 16px glyph geometry; hover close without label-width drift; select/close/add/expand/panel interaction stories; disabled-tab skipping; overflow scroll to the final tab via End; and focus returning to Add after closing the last tab. App and Storybook production builds pass.
