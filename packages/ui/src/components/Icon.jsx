import { ICON_MAP, ICON_INSETS, ICON_NAMES, resolveIconName } from './iconMap.js';

export const iconNames = ICON_NAMES;

/** Local Figma artwork, with its original optical insets and token-based color. */
export function Icon({ name = 'plus', size, title, className = '', style, ...props }) {
  const resolved = resolveIconName(name);
  const src = ICON_MAP[resolved];
  const value = ICON_INSETS[resolved];
  if (!src || value == null) return null;
  const config = typeof value === 'object' ? value : { inset: value };
  const dimension = size ?? config.size;
  return (
    <span {...props} className={['computer-icon', className].filter(Boolean).join(' ')}
      data-icon={resolved} role={title ? 'img' : undefined} aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ '--computer-icon-size': typeof dimension === 'number' ? `${dimension}px` : dimension, ...style }}>
      <span className="computer-icon__frame" style={{
        width: config.frame ? `${config.frame / 16 * 100}%` : '100%',
        height: config.frame ? `${config.frame / 16 * 100}%` : '100%',
        transform: config.rotate ? `rotate(${config.rotate}deg)` : undefined,
      }}>
        <span className="computer-icon__glyph" style={{ inset: config.inset, maskImage: `url("${src}")` }} />
      </span>
    </span>
  );
}
