# Avatar provenance

Source: https://www.figma.com/design/rLRBVEqB1TSV2dHM34lKEZ/Operator?node-id=7083-98366

Read through Figma MCP on 2026-10-20. The React Code Connect map was empty. This implementation does not publish or claim a Code Connect mapping, and no Figma nodes were edited.

| Figma variant | Node | React variant | Native size |
| --- | --- | --- | --- |
| Default | 7083:98360 | default | 32 × 32 |
| Hover | 9022:418 | hover | 32 × 32 |
| Computer | 9003:64204 | computer | 32 × 32 |
| MP | 7091:21933 | mp | 32 × 32 |
| Team | 7083:98369 | team | 33 × 33 |

The refreshed design replaces the duplicate image variant with Hover. Default retains the original photo. Hover has a 32px disc and a 16px chevron at (8,8). Its disc is now bound to bg/secondary, and its chevron is bound to text/primary. Both bindings are used directly in code. The initial image/group API names remain aliases. The Computer mark is an 18px SVG centered at (7,7); its CSS mask uses `--computer-avatar-mark-color` (#f4f4f4), kept white in both themes per the October 21 correction. The MP disc is now also bound to bg/secondary. MP and Hover therefore use #ffffff in Light and #141414 in Dark. Group circles are (x,y,size): (4,5,14), (20,11,10), (13,21,7). Team artwork starts at (1.8333,2), is 29.3333px square, and is clipped to a 4px radius.

## Downloaded source assets

| MCP file | Local asset | Use |
| --- | --- | --- |
| a8ab6.png | stories/assets/avatar/image.png | Default reference photo |
| 0756e.png | src/assets/avatar/computer-background.png | Computer circular background |
| cde66.svg | src/assets/avatar/computer-mark.svg | Computer mark mask |
| 5ccbc.svg | src/assets/avatar/group-background.svg | Original MP circle geometry, now a token-colored mask |
| b634a.svg | src/assets/avatar/team.svg | Team artwork |
| d89ba.png | stories/assets/avatar/member-left.png | Group 14px photo |
| fa007.png | stories/assets/avatar/member-right.jpg | Group 10px photo |
| 5874a.png | stories/assets/avatar/member-bottom.png | Group 7px photo |
| 84add.svg | src/assets/avatar/hover-background.svg | Hover disc mask |
| c97c1.svg | src/assets/avatar/chevron-down.svg | 16px chevron mask |

All assets are local imports. No expiring Figma URLs are used at runtime. Demo photos remain in Storybook; consumers supply their own image sources and group members. Missing-image initials, failed-image recovery, accessible naming and optional size overrides are implementation additions to the visual reference.

`as="button"` adds native button semantics, pointer hover, keyboard focus, and disabled handling. Static avatars do not suggest an action on hover. The component does not supply a menu. Storybook includes recovery, click/Enter activation and disabled interaction checks.

Color-binding refresh on 2026-10-20: MP ellipse `7091:21934` and Hover ellipse `9022:419` both reference `VariableID:6364:3491` (`✦/bg/secondary`). The 20 global color values are unchanged. Latest exports `075da.svg` (MP) and `be389.svg` (Hover) reflect these bindings; the existing circle geometry is retained locally as masks rather than baking a single mode’s color into images.

The 2026-10-21 variable refresh changes the Dark bg/secondary value to #141414; MP and Hover inherit it through their existing bindings.
