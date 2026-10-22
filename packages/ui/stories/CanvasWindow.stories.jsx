import { expect, fn, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { CanvasWindow, Button } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

const pages = [{ id: 'goals', label: 'Goals' }, { id: 'core', label: 'Core functionality' }];
function Example() {
  const [items, setItems] = useState(pages);
  const [selectedId, setSelectedId] = useState('goals');
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  return <div style={{ width: expanded ? '100%' : 691, maxWidth: '100%', height: 700 }}>
    {open ? <CanvasWindow cursorLabel="TIM" items={items} selectedId={selectedId} onSelect={setSelectedId}
      onCloseTab={id => { setItems(rows => rows.filter(row => row.id !== id)); if (items.length === 1) setOpen(false); }}
      onAdd={() => { setItems(pages); setSelectedId('core'); }} onClose={() => setOpen(false)}
      expanded={expanded} onExpand={() => setExpanded(value => !value)} />
      : <Button onClick={() => { if (!items.length) setItems(pages); setOpen(true); }}>Open canvas</Button>}
  </div>;
}
export default { title: 'Components/CanvasWindow', component: CanvasWindow, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Title-only canvas from Figma Page (7086:20043). A 48px tab strip above a centered page title. The host owns tabs and per-chat persistence. The top-right icon closes the canvas while the adjacent control expands or restores it.' } } } };
export const Design = { render: () => <div style={{ width: 691, maxWidth: '100%', height: 900 }}><CanvasWindow items={pages} selectedId="goals" /></div> };
export const Interactive = { render: () => <Example /> };
export const BothThemes = { render: () => <ChatThemes><div style={{ height: 440 }}><CanvasWindow items={pages} selectedId="goals" /></div></ChatThemes> };
export const LongTitle = { render: () => <div style={{ width: 420, maxWidth: '100%', height: 500 }}><CanvasWindow items={[{ id: 'long', label: 'Onboarding exploration and success criteria' }]} /></div> };

export const CursorTag = { args: { items: pages, selectedId: "goals", cursorLabel: "TIM" }, render: args => <div style={{ width: 691, maxWidth: "100%", height: 500 }}><CanvasWindow {...args} /></div> };

export const CursorTabWithFocusedControl = {
  render: () => <div><Button>Outside canvas</Button><div style={{ width: 691, maxWidth: '100%', height: 500 }}><CanvasWindow items={pages} selectedId="goals" cursorLabel="TIM" /></div></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Outside canvas' });
    await userEvent.click(button);
    await userEvent.hover(canvas.getByRole('tabpanel', { name: 'Goals' }));
    await userEvent.keyboard('{Tab}');
    expect(canvasElement.querySelector('.computer-canvas-window__cursor-computer')).toBeInTheDocument();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Tab}');
    expect(canvasElement.querySelector('.computer-tag')).toHaveTextContent('TIM');
    expect(button).toHaveFocus();
    await userEvent.unhover(canvas.getByRole('tabpanel', { name: 'Goals' }));
    await userEvent.tab();
    expect(button).not.toHaveFocus();
  },
};

export const PlaceComputerInput = {
  ...CursorTag,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('tabpanel', { name: 'Goals' });
    await userEvent.hover(panel);
    await userEvent.keyboard('{Tab}');
    await userEvent.click(panel);
    const input = canvas.getByRole('textbox', { name: 'Message Computer on canvas' });
    expect(input).toHaveFocus();
    expect(canvasElement.querySelector('.computer-canvas-window__cursor-tag')).not.toBeInTheDocument();
    await userEvent.type(input, 'Review this section');
    await userEvent.hover(panel);
    expect(canvasElement.querySelector('.computer-canvas-window__cursor-tag')).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(input).not.toBeInTheDocument();
  },
};

export const CanvasInputBlur = {
  ...CursorTag,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('tabpanel', { name: 'Goals' });
    await userEvent.hover(panel);
    await userEvent.keyboard('{Tab}');
    await userEvent.click(panel);
    const input = canvas.getByRole('textbox', { name: 'Message Computer on canvas' });
    await userEvent.type(input, 'Keep my draft');
    await userEvent.click(canvas.getByRole('button', { name: 'Add', exact: true }));
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(input).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Goals', exact: true }));
    expect(input).not.toBeInTheDocument();
  },
};

export const SendCanvasMessage = {
  ...CursorTag,
  args: { ...CursorTag.args, onCanvasSend: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('tabpanel', { name: 'Goals' });
    await userEvent.hover(panel);
    await userEvent.keyboard('{Tab}');
    await userEvent.click(panel);
    const input = canvas.getByRole('textbox', { name: 'Message Computer on canvas' });
    await userEvent.keyboard('{Enter}');
    expect(args.onCanvasSend).not.toHaveBeenCalled();
    await userEvent.type(input, 'Review this page');
    await userEvent.keyboard('{Enter}');
    expect(args.onCanvasSend).toHaveBeenCalledWith('Review this page', expect.anything(), expect.objectContaining({ toComputer: true, pageId: 'goals' }));
    expect(input).not.toBeInTheDocument();
  },
};
