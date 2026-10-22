/** A native button. Accepts standard button props, including ref (React 19). */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={['computer-button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  );
}
