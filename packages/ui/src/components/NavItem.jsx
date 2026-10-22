import { Avatar } from './Avatar.jsx';
import { Text } from './Text.jsx';

/** Navigation row with optional, independently controlled avatar expansion. */
export function NavItem({
  variant = 'default',
  label,
  description,
  count,
  avatar = {},
  selected = false,
  disabled = false,
  href,
  type = 'button',
  className = '',
  onClick,
  tabIndex,
  expanded = false,
  onExpandedChange,
  controlsId,
  expansionLabel,
  id,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
  ...props
}) {
  const classes = ['computer-nav-item', className].filter(Boolean).join(' ');

  if (variant === 'section') {
    return (
      <h3 {...props} id={id} style={style} ref={ref} className={classes} data-variant="section">
        <Text as="span" variant="caption" tone="secondary" className="computer-nav-item__section-label">
          {label}
        </Text>
      </h3>
    );
  }

  const isLink = href != null;
  const Element = isLink ? 'a' : 'button';
  const isSession = variant === 'session';
  const isMe = variant === 'me';
  const isCollapsed = variant === 'collapsed';
  const expandable = variant === 'default' && typeof onExpandedChange === 'function';

  function handleClick(event) {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  }

  const actionProps = {
    ...props,
    href: isLink && !disabled ? href : undefined,
    role: isLink ? 'link' : undefined,
    type: isLink ? undefined : type,
    disabled: !isLink ? disabled : undefined,
    'aria-disabled': isLink && disabled ? true : undefined,
    'aria-label': ariaLabel ?? (isMe || isCollapsed ? label : undefined),
    title: props.title ?? (isCollapsed ? label : undefined),
    'aria-current': ariaCurrent ?? (selected ? 'page' : undefined),
    tabIndex: isLink && disabled ? -1 : tabIndex,
    onClick: handleClick,
  };
  const content = (
    <span className="computer-nav-item__content">
      <Text as="span" variant="label" className="computer-nav-item__label">{label}</Text>
      {!isSession && description != null && (
        <Text as="span" variant="label" tone="secondary" className="computer-nav-item__description">
          {description}
        </Text>
      )}
    </span>
  );
  const rowProps = {
    id, style, ref, className: classes,
    'data-variant': variant,
    'data-selected': selected || undefined,
    'data-disabled': disabled || undefined,
  };

  if (expandable) {
    return (
      <div {...rowProps} data-expandable>
        <Avatar
          className="computer-nav-item__avatar"
          as="button"
          variant={avatar.variant}
          src={avatar.src}
          members={avatar.members}
          initials={avatar.initials}
          alt={label}
          size={32}
          disabled={disabled}
          aria-label={expansionLabel ?? `${expanded ? 'Collapse' : 'Expand'} ${label}`}
          aria-expanded={expanded}
          aria-controls={controlsId}
          onClick={event => onExpandedChange(!expanded, event)}
        />
        {isLink || onClick ? (
          <Element {...actionProps} className="computer-nav-item__action">{content}</Element>
        ) : (
          <span {...props} className="computer-nav-item__body">{content}</span>
        )}
      </div>
    );
  }

  return (
    <Element {...actionProps} {...rowProps}>
      {!isSession && (
        <span className="computer-nav-item__avatar" aria-hidden="true">
          <Avatar
            variant={avatar.variant}
            src={avatar.src}
            members={avatar.members}
            initials={avatar.initials}
            alt={label}
            size={32}
          />
        </span>
      )}
      {!isMe && !isCollapsed && content}
      {isSession && count != null && (
        <span className="computer-nav-item__count">
          <Text as="span" variant="caption" tone="secondary" className="computer-nav-item__count-value">{count}</Text>
        </span>
      )}
    </Element>
  );
}
