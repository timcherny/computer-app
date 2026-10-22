import { useEffect, useMemo, useState } from 'react';
import { MessageGradient, defaultMessageGradient } from './MessageGradient.jsx';

/** Compact label with a one-second, small-crop gradient reveal. */
export function Tag({ children, animate = true, animationKey = 0, gradient, className = '', ...props }) {
  const [playing, setPlaying] = useState(false);
  const settings = useMemo(() => ({
    ...defaultMessageGradient,
    ...gradient,
    // Use the small pill crop with the intro renderer's one-second timing.
    scale: gradient?.smallScale ?? defaultMessageGradient.smallScale,
  }), [gradient]);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (!animate || media.matches) { setPlaying(false); return; }
    setPlaying(true);
    const timer = setTimeout(() => setPlaying(false), 1000);
    const reduce = () => { if (media.matches) setPlaying(false); };
    media.addEventListener('change', reduce);
    return () => { clearTimeout(timer); media.removeEventListener('change', reduce); };
  }, [animate, animationKey]);

  return <span {...props} className={['computer-tag', className].filter(Boolean).join(' ')} data-animating={playing}>
    {playing && <span className="computer-tag__gradient" key={animationKey} aria-hidden="true"><MessageGradient settings={settings} /></span>}
    <span className="computer-tag__label">{children}</span>
  </span>;
}
