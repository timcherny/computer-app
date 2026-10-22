// Asset paths and optical insets adapted from Computer; SVG files are copied unchanged.
/**
 * Figma: icon — App — Arcade v0.3 SOR (`6363:15954`)
 * Only icons downloaded from that component set.
 *
 * Glyph SVGs are the Union/Vector paths (not the full 16×16 frame).
 * `ICON_INSETS` matches Figma absolute insets inside the 16×16 icon frame.
 */
export const ICON_NAMES = [
  'canvasDocument', 'canvasClose', 'canvasAdd', 'canvasExpand', 'canvasPanel',
  'bell',
  'claude',
  'codex',
  'discover',
  'explore',
  'agent',
  'plus',
  'canvas',
  'leftSidePanel',
  'rightSidePanel',
  'twoSquaresOverlappingWithPlus',
  'house',
  'window',
  'rectangleAndThreeHorizontalLines',
  'search',
  'cross',
  'check',
  'checked',
  'checkedEmpty',
  'chevronRight',
  'chevronUp',
  'chevronDown',
  'max',
  'min',
  'filter',
  'more',
  'plusInChatBubble',
  'plusLarge',
  'arrowUpLarge',
  'computerMark',
  'menu',
  'chevronLeft',
  'chevronRightSmall',
  'buttonPlus',
  'buttonMore',
  'buttonCanvas',
]

export const ICON_MAP = {
  // Full 16px Figma frames from canvas_tab-item / canvas_tabs (October 21).
  canvasDocument: new URL('../assets/icons/canvas-document.svg', import.meta.url).href,
  canvasClose: new URL('../assets/icons/canvas-cross.svg', import.meta.url).href,
  canvasAdd: new URL('../assets/icons/canvas-plus.svg', import.meta.url).href,
  canvasExpand: new URL('../assets/icons/canvas-max.svg', import.meta.url).href,
  canvasPanel: new URL('../assets/icons/canvas-panel.svg', import.meta.url).href,
  buttonMore: new URL('../assets/icons/button-more.svg', import.meta.url).href,
  buttonCanvas: new URL('../assets/icons/button-canvas.svg', import.meta.url).href,
  menu: new URL('../assets/icons/menu.svg', import.meta.url).href,
  buttonPlus: new URL('../assets/icons/button-plus.svg', import.meta.url).href,
  chevronLeft: new URL('../assets/icons/chevron-down.svg', import.meta.url).href,
  chevronRightSmall: new URL('../assets/icons/chevron-right.svg', import.meta.url).href,
  bell: new URL('../assets/icons/bell.svg', import.meta.url).href,
  claude: new URL('../assets/icons/claude.svg', import.meta.url).href,
  codex: new URL('../assets/icons/codex.svg', import.meta.url).href,
  discover: new URL('../assets/icons/discover.svg', import.meta.url).href,
  explore: new URL('../assets/icons/explore.svg', import.meta.url).href,
  agent: new URL('../assets/icons/agent.svg', import.meta.url).href,
  plus: new URL('../assets/icons/plus.svg', import.meta.url).href,
  canvas: new URL('../assets/icons/canvas.svg', import.meta.url).href,
  leftSidePanel: new URL('../assets/icons/left-side-panel.svg', import.meta.url).href,
  rightSidePanel: new URL('../assets/icons/right-side-panel.svg', import.meta.url).href,
  twoSquaresOverlappingWithPlus: new URL('../assets/icons/two-squares-overlapping-with-plus.svg', import.meta.url).href,
  house: new URL('../assets/icons/house-with-horizontal-line.svg', import.meta.url).href,
  window: new URL('../assets/icons/window.svg', import.meta.url).href,
  rectangleAndThreeHorizontalLines: new URL('../assets/icons/rectangle-and-three-horizontal-lines.svg', import.meta.url).href,
  search: new URL('../assets/icons/search.svg', import.meta.url).href,
  cross: new URL('../assets/icons/cross.svg', import.meta.url).href,
  check: new URL('../assets/icons/check.svg', import.meta.url).href,
  /** Checkmark.in.filled.square (`6681:13689` / `6476:3215`). */
  checked: new URL('../assets/icons/checked.svg', import.meta.url).href,
  /** Horizontal.line.in.square — Checked empty (`6681:15975` / `6681:16004`). */
  checkedEmpty: new URL('../assets/icons/checked-empty.svg', import.meta.url).href,
  chevronRight: new URL('../assets/icons/chevron-down.svg', import.meta.url).href,
  /** Chevron.Down glyph (`6498:45532`); up uses same file + 180° rotate. */
  chevronDown: new URL('../assets/icons/chevron-down.svg', import.meta.url).href,
  chevronUp: new URL('../assets/icons/chevron-down.svg', import.meta.url).href,
  /** Chevron.diagonally.outside.large (`6595:60363` / `6595:60374`). */
  max: new URL('../assets/icons/max.svg', import.meta.url).href,
  /** Chevron.diagonally.inside.large (`6595:60807` / Union). */
  min: new URL('../assets/icons/min.svg', import.meta.url).href,
  filter: new URL('../assets/icons/filter.svg', import.meta.url).href,
  more: new URL('../assets/icons/more.svg', import.meta.url).href,
  plusInChatBubble: new URL('../assets/icons/plus-in-chat-bubble.svg', import.meta.url).href,
  /** Plus.large glyph in a 20×20 frame (group composer, `6987:22554`). */
  plusLarge: new URL('../assets/icons/plus-large.svg', import.meta.url).href,
  /** Arrow.up.large glyph in a 20×20 frame (group composer send, `6987:22558`). */
  arrowUpLarge: new URL('../assets/icons/arrow-up-large.svg', import.meta.url).href,
  /** Computer mark glyph in an 18×18 frame (group composer, `6987:22528`). */
  computerMark: new URL('../assets/icons/computer-mark.svg', import.meta.url).href,
}

/**
 * Figma glyph insets within the 16×16 icon frame (`_Experiment/Components/Icon/Default`).
 * CSS `inset` shorthand: top | top/right/bottom/left | top/horizontal/bottom | etc.
 */
export const ICON_INSETS = {
  canvasDocument: {size: '20px', inset: '10%'},
  canvasClose: {size: '16px', inset: 0},
  canvasAdd: {size: '16px', inset: 0},
  canvasExpand: {size: '20px', inset: '10%'},
  canvasPanel: {size: '20px', inset: '10%'},
  buttonMore: {size: '20px', inset: '8.3333%'},
  buttonCanvas: {size: '20px', inset: '8.3333%'},
  menu: 0,
  buttonPlus: {size: '20px', inset: '8.3333%'},
  chevronLeft: {inset: '30.78% 14.86%', rotate: 90},
  chevronRightSmall: '25.35% 36.11%',
  bell: '5.86% 12.1% 5.86% 12.11%',
  /** Claude_AI_symbol 13×13 at 1.5,1.5 in 16×16 (`6488:34493` / `6580:59369`). */
  claude: { frame: 13, inset: 0 },
  /** codex-openai 13×13 at 1.5,1.5 in 16×16 (`6580:59420` / `6580:59424`). */
  codex: { frame: 13, inset: 0 },
  /** Compass / Variant19 (`6580:59363` / `6580:59364`). */
  discover: '5.88% 5.92% 5.88% 5.91%',
  /** Explore / Magnifying.glass.in.square (`6585:59703` / `6492:37297`). */
  explore: '5.82% 5.85% 5.83% 5.85%',
  /** Agent.studio (`6488:34501` / `6488:34502`). */
  agent: '6.53% 5.33%',
  /** Plus.large inset from Figma (`6396:4767`). */
  plus: '12.11%',
  /** Canvas glyph inset: top/right/bottom/left from Figma (`6391:4308`). */
  canvas: '5.86% 5.86% 5.86% 5.83%',
  leftSidePanel: '5.8% 5.84%',
  /** Dot.in.right.window / Right side panel (`6488:35213` / `6488:35214`). */
  rightSidePanel: '5.8% 5.84%',
  twoSquaresOverlappingWithPlus: '5.84% 5.86%',
  /** House.with.horizontal.line (`6599:12389`). */
  house: '5.76% 5.75%',
  window: '5.8% 5.84%',
  rectangleAndThreeHorizontalLines: '5.86%',
  /** Search uses a 14×14 optical frame centered in 16×16, then glyph inset. */
  search: {
    frame: 14,
    inset: '12.13% 12.5%',
  },
  cross: '20.45%',
  /** Checkmark.large in 16×16 frame (`6377:15382` / `6377:15448`). */
  check: '15.89% 15.9% 15.89% 15.91%',
  /** Checkmark.in.filled.square Vector 14×14 at 6.25% inset (`6681:13689`). */
  checked: '6.25%',
  /** Horizontal.line.in.square fills the 16×16 frame (`6681:15975`). */
  checkedEmpty: 0,
  /** Chevron.right.small in 16×16 frame (`6377:15453` / `6377:15464`). */
  chevronRight: {inset: '30.78% 14.86%', rotate: -90},
  /** Chevron.Down in 16×16 frame (`6498:45532` / `6498:45541`). */
  chevronDown: '30.78% 14.86%',
  /** Chevron up = Chevron.Down rotated 180° (`6498:45513`). */
  chevronUp: { inset: '30.78% 14.86%', rotate: 180 },
  /** Chevron.diagonally.outside.large Union in 16×16 (`6595:60363` / `6595:60374`). */
  max: '17.11%',
  /**
   * Chevron.diagonally.inside.large Union in 16×16 (`6595:60807`).
   * Strokes sit on the frame edge — clip hides the glyph.
   */
  min: { inset: '1.88%', overflow: 'visible' },
  /** Three.bars.horizontal / Filter (`6415:5203`). */
  filter: '24.61% 12.11%',
  more: '43.36% 18.36%',
  /**
   * Plus.in.chat.bubble Medium 20×20 (`6464:6762`).
   * Union inset 10.53% 5.59% in `_Experiment/Components/Icon/Medium`.
   */
  plusInChatBubble: {
    size: '20px',
    inset: '10.53% 5.59%',
  },
  /** Plus.large 15.16px glyph centered in 20×20 (`6987:22554`). */
  plusLarge: {
    size: '20px',
    inset: '12.11%',
  },
  /** Arrow.up.large 11.71×15.16 centered in 20×20 (`6987:22558`). */
  arrowUpLarge: {
    size: '20px',
    inset: '12.11% 20.73%',
  },
  /** Computer mark 10.87×8.32 centered in 18×18 (`6987:22528`). */
  computerMark: {
    size: '18px',
    inset: '26.9% 19.79%',
  },
}

/** Figma property labels → code names */
export const FIGMA_PROPERTY_ALIASES = {
  Bell: 'bell',
  Menu: 'menu',
  Home: 'house',
  Variant28: 'explore',
  'Chevron left': 'chevronLeft',
  'Chevron right small': 'chevronRightSmall',
  Claude: 'claude',
  Codex: 'codex',
  Discover: 'discover',
  Compass: 'discover',
  Explore: 'explore',
  'Magnifying.glass.in.square': 'explore',
  Variant19: 'discover',
  Agent: 'agent',
  'Agent.studio': 'agent',
  Plus: 'plus',
  Canvas: 'canvas',
  'Left side panel': 'leftSidePanel',
  'Dot.in.left.window': 'leftSidePanel',
  'Right side panel': 'rightSidePanel',
  'Dot.in.right.window': 'rightSidePanel',
  'Two.squares.overlapping.with.plus': 'twoSquaresOverlappingWithPlus',
  House: 'house',
  'House.with.horizontal.line': 'house',
  Window: 'window',
  Variant8: 'rectangleAndThreeHorizontalLines',
  Variant4: 'search',
  Cross: 'cross',
  Check: 'check',
  Checked: 'checked',
  'Checkmark.in.filled.square': 'checked',
  'Checked empty': 'checkedEmpty',
  'Horizontal.line.in.square': 'checkedEmpty',
  'Chevron right': 'chevronRight',
  'Chevron down': 'chevronDown',
  'Chevron up': 'chevronUp',
  Max: 'max',
  'Chevron.diagonally.outside.large': 'max',
  Min: 'min',
  'Chevron.diagonally.inside.large': 'min',
  Filter: 'filter',
  'Three.bars.horizontal': 'filter',
  More: 'more',
  'Three.dots.horizontal': 'more',
  'Rectangle.and.three.horizontal.lines': 'rectangleAndThreeHorizontalLines',
  'Plus.in.chat.bubble': 'plusInChatBubble',
  'Plus in chat bubble': 'plusInChatBubble',
  'Plus.large': 'plusLarge',
  'Arrow.up.large': 'arrowUpLarge',
  'Computer mark': 'computerMark',
}

export function resolveIconName(name) {
  if (ICON_MAP[name]) return name
  return FIGMA_PROPERTY_ALIASES[name] || name
}
