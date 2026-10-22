import { fn } from 'storybook/test';
import { Button } from '@computer/ui';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A native React button using Operator color and typography tokens. The default 28px size follows Figma: primary is the inverse pill action; secondary is the filled square control; ghost is transparent. Small (24px), large (36px), focus and disabled states extend the Figma reference. Import Button from @computer/ui and import @computer/ui/styles.css once in your app. Standard button props and React 19 refs pass through to the native element.',
      },
    },
  },
  args: { children: 'Continue', variant: 'primary', size: 'md', disabled: false, onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export const Primary = {};
export const Secondary = { args: { variant: 'secondary' } };
export const Ghost = { args: { variant: 'ghost' } };
export const Disabled = { args: { disabled: true } };
export const Sizes = {
  render: (args) => (
    <div className="story-row">
      {['sm', 'md', 'lg'].map((size) => <Button {...args} key={size} size={size}>{size}</Button>)}
    </div>
  ),
};

export const BothThemes = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="theme-comparison">
      {['light', 'dark'].map((theme) => (
        <section className="foundation-panel" data-theme={theme} key={theme} aria-label={`${theme} buttons`}>
          <h2 className="button-theme-label">{theme === 'light' ? 'Light' : 'Dark'}</h2>
          {['primary', 'secondary', 'ghost'].map((variant) => (
            <div className="button-specimen" key={variant}>
              <span className="token-label">{variant}</span>
              <div className="story-row">
                <Button {...args} variant={variant} disabled={false}>Action</Button>
                <Button {...args} variant={variant} disabled>Disabled</Button>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};
