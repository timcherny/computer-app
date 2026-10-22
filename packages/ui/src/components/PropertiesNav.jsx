import { useId, useState } from 'react';
import { Text } from './Text.jsx';
import { Avatar } from './Avatar.jsx';

function PropertiesSection({ title, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return <section className="computer-properties-section" aria-label={title}>
    <button type="button" className="computer-properties-item computer-properties-section__heading"
      aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
      <Text variant="caption" tone="secondary">{title}</Text>
    </button>
    <div id={id} hidden={!open} className="computer-properties-section__items">
      {items.map(({ id: itemId, label, trailingLabel, onClick, href, disabled, selected }) => {
        const Element = href && !disabled ? 'a' : 'button';
        return <Element key={itemId} className="computer-properties-item" href={Element === 'a' ? href : undefined}
          type={Element === 'button' ? 'button' : undefined} onClick={onClick}
          disabled={Element === 'button' ? disabled || !onClick : undefined} aria-current={selected ? 'page' : undefined}>
          <Text variant="label" className="computer-properties-item__label">{label}</Text>
          {trailingLabel != null && <Text variant="caption" tone="secondary" className="computer-properties-item__trailing">{trailingLabel}</Text>}
        </Element>;
      })}
    </div>
  </section>;
}

/** Adapted from Computer's PropertiesNav/MenuSection. Empty sections are omitted. */
export function PropertiesNav({ sections = [], header, className = '', 'aria-label': label = 'Chat properties', ...props }) {
  return <nav {...props} aria-label={label} className={['computer-properties-nav', className].filter(Boolean).join(' ')}>
    {header && <div className="computer-properties-nav__identity">
      <div className="computer-properties-nav__header">
        <Avatar {...header.avatar} alt="" />
        <div className="computer-properties-nav__identity-text">
          <Text variant="label">{header.title}</Text>
          {header.description && <Text variant="label" tone="secondary">{header.description}</Text>}
        </div>
      </div>
      <div className="computer-properties-nav__divider" role="separator" />
    </div>}
    {sections.filter(section => section.items?.length).map(section => <PropertiesSection key={section.id} {...section} />)}
  </nav>;
}
