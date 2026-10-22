/** Typography recipe independent of HTML semantics. Native props and React 19 refs pass through. */
export function Text({
  as: Element = 'span',
  variant = 'body',
  tone = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Element
      {...props}
      className={['computer-text', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-tone={tone}
    >
      {children}
    </Element>
  );
}
