import { Icon } from './Icon.jsx';
import { Text } from './Text.jsx';

/** Adapted from Computer/src/components/MenuItem.jsx for Computer's shared tokens. */
export function MenuItem({ type = 'item', label, selected = false, disabled = false,
  leading, trailingLabel, trailingIcon, shortcuts = [], depth = 1, href,
  className = '', ...props }) {
  const classes = ['computer-menu-item', className].filter(Boolean).join(' ');
  if (type === 'divider') return <div {...props} className={classes} data-type="divider" role="separator" />;
  if (type === 'section') return <div {...props} className={classes} data-type="section" role="presentation">
    <Text variant="caption" tone="secondary">{label}</Text>
  </div>;
  const Element = href && !disabled ? 'a' : 'button';
  return <Element {...props} className={classes} data-type={type} data-depth={depth}
    data-selected={selected || undefined} role="menuitem" aria-current={selected || undefined} aria-disabled={disabled || undefined}
    type={Element === 'button' ? 'button' : undefined} href={Element === 'a' ? href : undefined}
    disabled={Element === 'button' ? disabled : undefined}>
    {leading && <span className="computer-menu-item__leading">{leading}</span>}
    <Text variant="label" className="computer-menu-item__label">{label}</Text>
    {selected && <Icon name="check" />}
    {shortcuts.length > 0 && <span className="computer-menu-item__shortcuts" aria-hidden="true">
      {shortcuts.map((key, index) => <Text as="kbd" variant="caption" tone="secondary" key={`${key}-${index}`}>{key}</Text>)}
    </span>}
    {trailingIcon ? <Icon name={trailingIcon} /> : trailingLabel != null &&
      <Text variant="caption" tone="secondary" className="computer-menu-item__trailing">{trailingLabel}</Text>}
  </Element>;
}
