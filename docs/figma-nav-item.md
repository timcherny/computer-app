# NavItem provenance

Source: [Operator / nav_tem](https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=7083-16676), inspected through Figma MCP on 2026-10-21.

| Figma variant | Node | Public API | Dimensions at 16px root |
| --- | --- | --- | --- |
| Default / Default | 9022:411 | `variant="default"` | 267 × 44 |
| Default / Selected | 9022:451 | `selected` | 267 × 44 |
| 2 level / Default | 7086:16384 | `variant="session"` | 267 × 32 |
| 2 level / Selected | 9022:474 | `variant="session" selected` | 267 × 32 |
| Section / Default | 7083:90861 | `variant="section"` | 267 × 11 |
| Me / Default | 9017:383 | `variant="me"` | 267 × 40 |

Rows use 4px corners; selected default and second-level rows use 8px corners through `--computer-nav-item-selected-radius`. Horizontal padding is 8px and the gap is 6px. The default avatar is 32px at (8, 6); the title/preview begin at x=46 and use UI/System (13px / 16px, weight 460, 0.1px tracking), with 4px between lines. Session rows now indent 46px (updated from the Figma source’s 48px at Tim’s request on October 20, 2026), use 8px vertical padding, and place UI/Numerical secondary info at the trailing edge. Its box is 16px tall with a 28px minimum width, matching Figma’s 28 × 16px numeric sample while allowing the requested relative timestamps (such as “10 days”) to remain readable. The value is vertically centered, right-aligned, and always displayed in uppercase (for example, “10 DAYS”). Override `--computer-nav-item-info-height` and `--computer-nav-item-info-min-width` for other hosts. Section uses the same 10px / 10px Chip Mono recipe with 2px padding around its trimmed cap box. Me contains only a 32px avatar at (8, 4).

## Theme mapping

- Selected fill: `✦/bg/pressed` (`VariableID:6363:15552`) → `--computer-color-bg-pressed`.
- Chat title: `✦/text/primary` (`VariableID:6364:3492`) → `--computer-color-text-primary`.
- Preview: `✦/text/secondary` (`VariableID:6364:3493`) → `--computer-color-text-secondary`.
- Session title uses the external `FG/Neutral/Prominent` variable, resolving to the same primary color in the light design. Use the product’s primary text token in both themes.
- Section/count are unbound #939393 in Figma. Use the matching secondary text token, including its dark-mode value, to follow the project's theme contract.

The existing `Text` component supplies label/caption recipes. The existing `Avatar` supplies the portrait. Figma's `a8ab6.png` is already present as `stories/assets/avatar/image.png`; all sample photos stay in Storybook. No temporary Figma URL is used at runtime, and no asset is redrawn.

## Behavior and implementation extensions

`default`, `session` and `me` render native buttons by default. Providing `href` makes a native link. `selected` is controlled by the consumer and adds `aria-current="page"`; consumers can override `aria-current` for other navigation semantics. Expandable default rows use controlled `expanded` and `onExpandedChange`, with `controlsId` identifying their children. Only the avatar toggles expansion; it displays the existing Avatar Hover chevron on hover/focus and exposes `aria-expanded`. Optional `expansionLabel` overrides its accessible name. Text selection/navigation is a separate native control when `onClick`/`href` is supplied, otherwise static. Disabled rows disable both controls. These are interaction extensions requested by Tim on October 20, 2026. The component does not manage routing or open a menu itself.

Section renders an h3 and never becomes a navigation control. Me's required `label` supplies its accessible name. Avatars are decorative in nonexpandable rows. Expandable rows render a noninteractive wrapper with sibling avatar/text controls, preventing nested buttons. Layout props and refs target the wrapper; other native props target the text control/content.

Only selected rows use the pressed background token; hover and active leave the row background unchanged. The avatar's expansion chevron remains available on hover/focus. Keyboard focus and disabled states use existing library tokens. Disabled links remove href and their tab stop and suppress click callbacks. Long text truncates with ellipsis; widths shrink to the container and can be overridden with `--computer-nav-item-width`. Minimum heights scale with text instead of clipping it. Unsupported text-box trimming falls back to normal caption line metrics.

The Code Connect map for this component returned `{}`. No remote mapping or template has been published.

## Verification

Run `npm run build` and `npm run build:storybook`. In Storybook, inspect Both Themes and Narrow And Long Labels, then run Interaction and Expandable for controlled selection, Enter/Space activation, disabled links/buttons, and tab order.


October 21 collapsed variant (`9054:16990`, `9054:16997` in component set `7083:16676`): `variant="collapsed"` renders an avatar-only 52px button/link with a centered 32px avatar, 4px padding and 8px corners. `label` supplies the accessible name and tooltip; `selected` uses the pressed background. It selects the chat without the independent expansion toggle. Existing full/default and session selected corners remain 8px. Storybook includes default/selected collapsed examples and both themes.
