import { Icon } from './Icon.jsx';
import { Text } from './Text.jsx';

/** A full-width canvas tab. Selection and closing are separate native buttons. */
export function CanvasTabItem({ label = 'Core functionality', selected = false, disabled = false,
  onSelect, onClose, closeLabel = `Close ${label}`, hover, tabIndex = selected ? 0 : -1,
  id, controls, tabRef, onKeyDown, className = '', ...props }) {
  return <div {...props} className={['computer-canvas-tab-item', className].filter(Boolean).join(' ')}
    data-selected={selected || undefined} data-disabled={disabled || undefined} data-hover={hover}>
    <button ref={tabRef} id={id} type="button" role="tab" aria-selected={selected} aria-controls={controls}
      disabled={disabled} tabIndex={disabled ? -1 : tabIndex} onClick={onSelect} onKeyDown={onKeyDown}
      className="computer-canvas-tab-item__select" title={label}>
      {selected && <Icon name="canvasDocument" />}
      <span className="computer-canvas-tab-item__contents"><Text variant="label" className="computer-canvas-tab-item__label">{label}</Text></span>
    </button>
    {onClose && <button type="button" className="computer-canvas-tab-item__close" aria-label={closeLabel}
      disabled={disabled} onClick={onClose}><Icon name="canvasClose" /></button>}
  </div>;
}
