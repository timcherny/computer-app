import { useRef } from 'react';
import { MenuItem } from './MenuItem.jsx';

const enabledItems = element => Array.from(element.querySelectorAll('[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'));

/** Computer's menu shell, adapted from the reference project with native popovers and keyboard navigation. */
export function Menu({ sectionLabel, items = [], selectedId, onSelect, onToggle, onKeyDown,
  className = '', 'aria-label': ariaLabel, ...props }) {
  const search = useRef({ text: '', time: 0 });
  function handleKeyDown(event) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const rows = enabledItems(event.currentTarget);
    if (!rows.length) return;
    const index = rows.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowDown') next = rows[(index + 1) % rows.length];
    if (event.key === 'ArrowUp') next = rows[(index < 0 ? rows.length - 1 : index - 1 + rows.length) % rows.length];
    if (event.key === 'Home') next = rows[0];
    if (event.key === 'End') next = rows.at(-1);
    if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const now = Date.now();
      const text = (now - search.current.time < 500 ? search.current.text : '') + event.key.toLocaleLowerCase();
      search.current = { text, time: now };
      next = [...rows.slice(index + 1), ...rows.slice(0, index + 1)]
        .find(row => row.textContent.trim().toLocaleLowerCase().startsWith(text));
    }
    if (next) { event.preventDefault(); next.focus(); }
    if (event.key === 'Tab' && event.currentTarget.matches(':popover-open')) event.currentTarget.hidePopover();
  }
  return <div {...props} role="menu" aria-label={ariaLabel || sectionLabel || 'Menu'}
    className={['computer-menu', className].filter(Boolean).join(' ')} onKeyDown={handleKeyDown}
    onToggle={event => {
      if (event.newState === 'open') enabledItems(event.currentTarget)[0]?.focus();
      onToggle?.(event);
    }}>
    {sectionLabel && <MenuItem type="section" label={sectionLabel} />}
    {items.map((item, index) => {
      const { id = String(index), onClick, ...row } = item;
      return <MenuItem {...row} key={id} selected={item.selected || (selectedId != null && selectedId === id)}
        onClick={event => {
          if (item.disabled) return;
          const menu = event.currentTarget.closest('[role="menu"]');
          if (menu?.matches(':popover-open')) menu.hidePopover();
          onClick?.(event);
          onSelect?.(id, item, event);
        }} />;
    })}
  </div>;
}
