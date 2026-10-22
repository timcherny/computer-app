import { useState } from 'react';
import computerBackground from '../assets/avatar/computer-background.png';
import teamArtwork from '../assets/avatar/team.svg';

function getInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => [...word][0]).join('').toLocaleUpperCase();
}

function AvatarImage({ src, alt, initials }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="computer-avatar__initials">{initials || getInitials(alt)}</span>;
  }
  return <img className="computer-avatar__image" src={src} alt="" draggable={false} onError={() => setFailed(true)} />;
}

/** Figma avatar. Use as="button" for an action, or the default span for a static image. */
export function Avatar({
  as: Element = 'span',
  variant = 'default',
  src,
  alt = '',
  initials,
  members = [],
  size,
  type = 'button',
  disabled = false,
  className = '',
  style,
  'aria-label': ariaLabel,
  ...props
}) {
  const isButton = Element === 'button';
  // Preserve the initial implementation's names while reflecting Figma's current variants.
  const visualVariant = ({ image: 'default', group: 'mp' })[variant] || variant;
  const avatarStyle = {
    ...(Number.isFinite(size) && size > 0 ? { '--computer-avatar-size': `${size}px` } : {}),
    ...style,
  };

  return (
    <Element
      {...props}
      className={['computer-avatar', className].filter(Boolean).join(' ')}
      data-variant={visualVariant}
      type={isButton ? type : undefined}
      disabled={isButton ? disabled : undefined}
      role={isButton ? undefined : alt ? 'img' : undefined}
      aria-label={ariaLabel ?? (alt || undefined)}
      aria-hidden={!isButton && !alt ? true : undefined}
      style={avatarStyle}
    >
      <span className="computer-avatar__visual" aria-hidden="true">
        {visualVariant === 'default' && (
          <span className="computer-avatar__portrait">
            <AvatarImage key={src || 'empty'} src={src} alt={alt} initials={initials} />
          </span>
        )}
        {visualVariant === 'computer' && (
          <>
            <img className="computer-avatar__image computer-avatar__round" src={computerBackground} alt="" draggable={false} />
            <span className="computer-avatar__computer-mark" />
          </>
        )}
        {(visualVariant === 'mp' || visualVariant === 'mp-gray') && (
          <>
            <span className="computer-avatar__group-background" />
            {(members.length === 2 ? [0, 1] : [0, 1, 2]).map((index) => {
              const member = members[index] || {};
              return (
                <span className="computer-avatar__member" data-position={index} key={index}>
                  <AvatarImage key={member.src || 'empty'} src={member.src} alt={member.alt || ''} initials={member.initials} />
                </span>
              );
            })}
          </>
        )}
        {visualVariant === 'team' && (
          <span className="computer-avatar__team-art">
            <AvatarImage key={src || teamArtwork} src={src || teamArtwork} alt={alt} initials={initials} />
          </span>
        )}
      </span>
      {(isButton || visualVariant === 'hover') && (
        <span className="computer-avatar__hover" aria-hidden="true">
          <span className="computer-avatar__hover-background" />
          <span className="computer-avatar__chevron" />
        </span>
      )}
    </Element>
  );
}
