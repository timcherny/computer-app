import { useState } from 'react';
import computer from '../assets/message-avatar/computer.svg';
import computerCircle from '../assets/message-avatar/computer-in-circle.svg';
import claude from '../assets/message-avatar/claude.svg';
import codex from '../assets/message-avatar/codex.svg';

const glyphs = { computer, computerCircle, claude, codex };

function Portrait({ src, initial }) {
  const [failed, setFailed] = useState(false);
  return src && !failed
    ? <img src={src} alt="" draggable={false} onError={() => setFailed(true)} />
    : <span className="computer-message-avatar__initial">{initial}</span>;
}

export function MessageAvatar({ variant = 'initial', src, initial = 'M', count = 0, alt = '', className = '', ...props }) {
  const glyph = glyphs[variant];
  return (
    <span {...props} className={['computer-message-avatar', className].filter(Boolean).join(' ')}
      data-variant={variant} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined}>
      {variant === 'count' ? <span className="computer-message-avatar__initial">{count}</span>
        : glyph ? <span className="computer-message-avatar__glyph" style={{ maskImage: `url("${glyph}")` }} />
        : <Portrait key={src || 'initial'} src={src} initial={[...String(initial).trim()][0]?.toLocaleUpperCase() || 'M'} />}
    </span>
  );
}
