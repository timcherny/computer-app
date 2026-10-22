import { useId } from 'react';
import { NavItem } from './NavItem.jsx';

/** Sidebar composition. Selection, routing, menus and native chrome belong to the app. */
export function NavPanel({
  primary,
  children,
  footer,
  header,
  collapsed = false,
  recentLabel = 'RECENT',
  label = 'Main navigation',
  className = '',
  ...props
}) {
  const headingId = useId();
  return (
    <aside {...props} data-collapsed={collapsed || undefined} className={['computer-nav-panel', className].filter(Boolean).join(' ')}>
      <div className="computer-nav-panel__header">{header}</div>
      <nav className="computer-nav-panel__scroll" aria-label={label}>
        {primary && <div className="computer-nav-panel__primary">{primary}</div>}
        <section className="computer-nav-panel__recent" aria-labelledby={collapsed ? undefined : headingId} aria-label={collapsed ? recentLabel : undefined}>
          {!collapsed && <NavItem id={headingId} variant="section" label={recentLabel} />}
          <div className="computer-nav-panel__items">{children}</div>
        </section>
      </nav>
      {footer && <div className="computer-nav-panel__footer">{footer}</div>}
    </aside>
  );
}
