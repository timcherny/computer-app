import { useState } from 'react';
import { Tag, Button } from '@computer/ui';

export default {
  title: 'Components/Tag', component: Tag, tags: ['autodocs'],
  args: { children: 'TIM', animate: true, animationKey: 0 },
  argTypes: { animationKey: { control: 'number' }, gradient: { control: 'object' } },
  parameters: { docs: { description: { component: '20 px tag from Figma 9054:17090. Small-pill gradient crop with a one-second reveal: fade in 0–0.2s, fade out 0.8–1s. Increment animationKey to replay. Reduced motion keeps the neutral tag.' } } },
};
export const Default = {};
export const Static = { args: { animate: false } };
function PlaygroundTag(args) {
  const [key, setKey] = useState(0);
  return <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <Tag {...args} animationKey={key} />
    <Button onClick={() => setKey(value => value + 1)}>Replay animation</Button>
  </div>;
}
export const Playground = { render: args => <PlaygroundTag {...args} /> };
export const BothThemes = { render: args => <div style={{ display: 'flex', gap: 16 }}>{['light','dark'].map(theme =>
  <div key={theme} data-theme={theme} style={{ padding: 24, background: 'var(--computer-color-bg-secondary)' }}><Tag {...args} /></div>
)}</div> };
