import { colorTokens, Text } from '@computer/ui';

export default {
  title: 'Foundations/Colors',
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

function ColorPalette({ theme }) {
  return (
    <section className="foundation-panel" data-theme={theme} aria-label={`${theme} colors`}>
      <div className="foundation-heading">
        <Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text>
        <Text variant="caption">20 TOKENS</Text>
      </div>
      <div className="token-grid">
        {colorTokens.map((token) => (
          <div className="token-card" key={token.name}>
            <div className="token-swatch" style={{ background: `var(${token.cssVariable})` }} />
            <Text as="h3" variant="label">{token.name}</Text>
            <code className="token-value">{token[theme]}</code>
            <p className="token-label">{token.cssVariable}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export const BothThemes = {
  render: () => (
    <div className="foundation-page">
      <header className="foundation-intro">
        <Text as="h1" variant="heading" tone="heading">Color</Text>
        <Text as="p" variant="prose">One vocabulary. Two appearances. The Operator collection, directly from Figma.</Text>
      </header>
      <div className="theme-comparison">
        <ColorPalette theme="light" />
        <ColorPalette theme="dark" />
      </div>
    </div>
  ),
};

export const CurrentTheme = {
  render: (_, context) => <ColorPalette theme={context.globals.theme} />,
};
