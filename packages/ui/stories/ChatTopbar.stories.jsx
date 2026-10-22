import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChatTopbar, ChatWindow, Text } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

function Example({ onMore, onCanvasToggle, ...args }) {
  const [canvasOpen, setCanvasOpen] = useState(false);
  return <ChatTopbar {...args} canvasOpen={canvasOpen} onMore={onMore}
    onCanvasToggle={() => { setCanvasOpen(value => !value); onCanvasToggle?.(); }} />;
}

export default {
  title: 'Components/ChatTopbar', component: ChatTopbar, tags: ['autodocs'],
  args: { title: 'Computer', onMore: fn(), onCanvasToggle: fn() },
  parameters: { docs: { description: { component: 'Figma chat_topbar (9043:1228): 157px overlay with a 120px gradient/blur background, a centered ChatHeader at 9px from the top, and 36px actions at top/right 9px with a 4px gap. When properties are available, showCanvasControl adds the canvas opener after that control. canvasTabCount replaces its plus icon with a numbered MessageAvatar. More opens a consumer-owned menu; Canvas is controlled through canvasOpen/onCanvasToggle. Missing actions are disabled. The gradient uses the current theme’s secondary background and fades from the very top. Six masked backdrop layers approximate Figma’s progressive background blur from 6px at the top to 0px at the bottom. The fade passes pointer events through to the history beneath it.' } } },
};
export const Default = { render: args => <div className="chat-topbar-specimen"><Example {...args} /></div> };
export const BothThemes = { render: args => <ChatThemes><div className="chat-topbar-specimen"><Example {...args} /></div></ChatThemes> };
export const LongTitle = { ...Default, args: { title: 'Onboarding review with the Computer team' } };
export const EmptyCanvas = { render: args => <div className="chat-topbar-specimen"><ChatTopbar {...args} onPropertiesToggle={() => {}} showCanvasControl /></div> };
export const RememberedCanvas = { ...EmptyCanvas, args: { canvasTabCount: 3 } };
export const CanvasControlThemes = { render: args => <ChatThemes><div className="chat-topbar-specimen"><ChatTopbar {...args} onPropertiesToggle={() => {}} showCanvasControl canvasTabCount={3} /></div></ChatThemes> };
export const Narrow = { render: args => <div className="chat-topbar-specimen chat-topbar-narrow"><Example {...args} /></div> };
export const OverContent = { render: args => <div className="chat-topbar-overlay-demo">
  <div className="chat-topbar-overlay-copy"><Text as="p">Messages scroll beneath the top bar.</Text><Text as="p">The background fades into the conversation.</Text></div>
  <Example {...args} />
</div> };
export const ProgressiveBlur = { render: () => <ChatThemes><div style={{ width: 447, maxWidth: '100%', height: 520 }}>
  <ChatWindow title="Scroll preview" inputProps={{ animate: false }} messages={Array.from({ length: 20 }, (_, index) => ({
    id: `scroll-${index}`, type: index % 2 ? 'me' : 'person',
    text: `Sample message ${index + 1}. Scroll to see the text and bubbles soften beneath the header, then return to full clarity below it.`,
  }))} />
</div></ChatThemes> };
export const UnavailableActions = { ...Default, render: args => <div className="chat-topbar-specimen"><ChatTopbar {...args} /></div>, args: { onMore: undefined, onCanvasToggle: undefined } };
export const Interaction = { ...Default, play: async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'More chat actions' }));
  expect(args.onMore).toHaveBeenCalledTimes(1);
  await userEvent.tab();
  expect(canvas.getByRole('button', { name: 'Open canvas' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(args.onCanvasToggle).toHaveBeenCalledTimes(1);
  expect(canvas.getByRole('button', { name: 'Close canvas' })).toHaveAttribute('aria-pressed', 'true');
  await userEvent.keyboard(' ');
  expect(args.onCanvasToggle).toHaveBeenCalledTimes(2);
  expect(canvas.getByRole('button', { name: 'Open canvas' })).toHaveAttribute('aria-pressed', 'false');
} };
