import { Avatar } from './Avatar.jsx';
import { Text } from './Text.jsx';

export function ChatHeader({ title = 'Computer', subtitle, avatar = { variant: 'computer' }, className = '', ...props }) {
  const headerAvatar = avatar?.variant === 'mp' || avatar?.variant === 'group'
    ? { ...avatar, variant: 'mp-gray' } : avatar;
  return <header {...props} className={['computer-chat-header', className].filter(Boolean).join(' ')} data-lines={subtitle ? 'two' : 'one'}>
    <Avatar {...headerAvatar} className={['computer-chat-header__avatar', avatar?.className].filter(Boolean).join(' ')} alt="" />
    <div className="computer-chat-header__chip">
      <Text as="h1" variant="label" className="computer-chat-header__title">{title}</Text>
      {subtitle && <Text variant="caption" tone="secondary" className="computer-chat-header__subtitle">{subtitle}</Text>}
    </div>
  </header>;
}
