import { Text, typographyTokens } from '@computer/ui';

export default {
  title: 'Foundations/Typography',
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

const examples = {
  label: 'Continue to your workspace',
  body: 'A clear thought, with room to grow.',
  'body-strong': 'A little emphasis goes a long way.',
  input: 'Write a message',
  prose: 'Bring your ideas together in one place. Good typography gives every word a clear role and a comfortable rhythm.',
  heading: 'A place to think.',
  caption: 'RECENT · 0123456789',
};

function TypeSpecimens({ theme }) {
  return (
    <section className="foundation-panel" data-theme={theme} aria-label={`${theme} typography`}>
      <div className="foundation-heading">
        <Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text>
        <Text variant="caption">7 RECIPES</Text>
      </div>
      {typographyTokens.map((recipe) => (
        <div className="type-specimen" key={recipe.name}>
          <div className="type-metadata">
            <Text as="h3" variant="label">{recipe.label}</Text>
            <code>{recipe.size}/{recipe.lineHeight} · {recipe.weight} · {recipe.letterSpacing}px</code>
          </div>
          <Text as="p" variant={recipe.name}>{examples[recipe.name]}</Text>
        </div>
      ))}
    </section>
  );
}

export const Recipes = {
  render: () => (
    <div className="foundation-page">
      <header className="foundation-intro">
        <Text as="h1" variant="heading" tone="heading">Typography</Text>
        <Text as="p" variant="prose">Chip Text for the interface, Chip Display for headings, Chip Mono for compact labels.</Text>
        <Text as="p" variant="body">Measurements come from Operator’s text layers. Installed Chip fonts load locally; other devices use system fallbacks.</Text>
      </header>
      <div className="theme-comparison">
        <TypeSpecimens theme="light" />
        <TypeSpecimens theme="dark" />
      </div>
    </div>
  ),
};

export const Families = {
  render: () => (
    <div className="font-families">
      {[
        ['sans', 'Chip Text Variable', 'Aa Bb Cc · 0123456789'],
        ['display', 'Chip Display Variable', 'Aa Bb Cc · 0123456789'],
        ['mono', 'Chip Mono', 'Aa Bb Cc · 0123456789'],
      ].map(([token, family, sample]) => (
        <section className="font-family" key={token}>
          <Text as="h2" variant="prose">{family}</Text>
          <p className="font-alphabet" style={{ fontFamily: `var(--computer-font-${token})` }}>{sample}</p>
          <code>--computer-font-{token}</code>
        </section>
      ))}
    </div>
  ),
};
