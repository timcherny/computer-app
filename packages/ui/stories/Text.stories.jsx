import { Text, typographyTokens } from '@computer/ui';

export default {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'A clear thought, with room to grow.', variant: 'body', tone: 'primary', as: 'p' },
  argTypes: {
    variant: { control: 'select', options: typographyTokens.map(({ name }) => name) },
    tone: { control: 'select', options: ['primary', 'secondary', 'heading', 'active', 'navigation', 'inverse'] },
    as: { control: 'select', options: ['span', 'p', 'h1', 'h2', 'h3', 'label', 'div'] },
  },
  parameters: {
    docs: { description: { component: 'Figma typography recipes with independent HTML semantics. Choose as="h1" for a page heading, as="p" for a paragraph, or leave the default span. Native props and React 19 refs pass through. Inverse text needs an inverse background.' } },
  },
};

export const Body = {};
export const Heading = { args: { as: 'h1', variant: 'heading', tone: 'heading', children: 'A place to think.' } };
export const Caption = { args: { variant: 'caption', children: 'RECENT · 0123456789' } };
export const Inverse = {
  args: { tone: 'inverse' },
  decorators: [(Story) => <div className="inverse-sample"><Story /></div>],
};
