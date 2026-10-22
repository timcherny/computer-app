import { Icon } from './Icon.jsx';

/** Supply a descriptive label; pressed is optional for toggle buttons. */
export function IconButton({ icon = 'plus', label, variant = 'ghost', state = 'default', pressed,
  disabled = false, type = 'button', className = '', children, 'aria-label': ariaLabel, ...props }) {
  return (
    <button {...props} type={type} className={['computer-icon-button', className].filter(Boolean).join(' ')}
      data-variant={variant} data-state={state} disabled={disabled || state === 'disabled'}
      aria-label={ariaLabel ?? label} aria-pressed={pressed}>
      {children ?? <Icon name={icon === 'plus' ? 'buttonPlus' : icon} size={20} />}
    </button>
  );
}
