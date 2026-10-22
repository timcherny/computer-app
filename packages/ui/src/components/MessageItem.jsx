import { Avatar } from './Avatar.jsx';
import { Icon } from './Icon.jsx';
import { MessageAvatar } from './MessageAvatar.jsx';
import { Text } from './Text.jsx';

/** Adapted from Computer's messageSizeForText; wrapping remains responsive. */
export function messageSizeForText(text, size = 'auto') {
  if (size !== 'auto') return size;
  return typeof text === 'string' && (text.includes('\n') || text.length > 48) ? 'manyLines' : 'oneLine';
}

export function MessageItem({ type = 'me', size = 'auto', tail = true, children, name, avatar = {},
  title, count, onClick, className = '', ...props }) {
  const classes = ['computer-message-item', className].filter(Boolean).join(' ');
  if (type === 'notification') return <div {...props} className={classes} data-type={type}>
    <Text variant="caption" tone="secondary" className="computer-message-item__caption">{children}</Text>
  </div>;
  if (type === 'threadSummary') {
    const Element = onClick ? 'button' : 'div';
    return <Element {...props} type={onClick ? 'button' : undefined} onClick={onClick} className={classes} data-type={type}>
      <span className="computer-message-item__summary-heading"><Text variant="body">{title}</Text>
        {count != null && <Text variant="caption" tone="secondary" className="computer-message-item__caption">{count}</Text>}
      </span>
      <Text variant="body" className="computer-message-item__summary-body">{children}</Text>
    </Element>;
  }
  if (type === 'topAvatar') return <div {...props} className={classes} data-type={type}>
    <Avatar {...avatar} size={32} alt="" />
    <Text variant="caption" className="computer-message-item__name-badge">{name}</Text>
  </div>;
  const withAvatar = type === 'personWithAvatar' || type === 'personWithAvatarAndName';
  const resolvedSize = messageSizeForText(children, size);
  return <div {...props} className={classes} data-type={type} data-size={resolvedSize} data-tail={tail || undefined}>
    {type === 'personWithAvatarAndName' && <Text variant="caption" tone="secondary" className="computer-message-item__sender">{name}</Text>}
    <div className="computer-message-item__row">
      {withAvatar && <MessageAvatar {...avatar} alt="" />}
      <div className="computer-message-item__bubble">
        {tail && <span className="computer-message-item__tail" aria-hidden="true" />}
        {resolvedSize === 'writing' ? <span className="computer-message-item__writing" role="status" aria-label={`${name || 'Someone'} is typing`}><Icon name="more" /></span>
          : <Text as="div" variant="body" className="computer-message-item__text">{children}</Text>}
      </div>
    </div>
  </div>;
}
