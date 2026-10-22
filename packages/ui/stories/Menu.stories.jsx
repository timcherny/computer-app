import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Menu } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

const profileItems = [
  { id: 'theme', label: 'Dark mode' },
  { id: 'divider', type: 'divider' },
  { id: 'reset', label: 'Reset to default data' },
];
export default {
  title: 'Components/Menu', component: Menu, tags: ['autodocs'],
  args: { sectionLabel: 'Tim Cherny', items: profileItems },
  parameters: { docs: { description: { component: 'Adapted from Computer’s Menu and MenuItem: 202px shell, 6px padding, 4px gaps/corners, 28px rows, section labels, dividers, checkmarks, trailing text/icons and shortcut hints. Uses Computer-app tokens in both themes. Pass popover="auto" and a trigger’s popoverTarget for native dismissal and focus return. Arrow keys, Home/End and typeahead move between enabled items; selection closes a popover before invoking the action. Product routes and account actions remain the host’s responsibility.' } } },
};
export const Default = {};
export const Dark = { globals: { theme: 'dark' } };
export const BothThemes = { render: () => <ChatThemes><Menu sectionLabel="Tim Cherny" items={profileItems} /></ChatThemes> };
export const Selection = { render: () => {
  const [selected, setSelected] = useState('recent');
  return <Menu sectionLabel="Sort" selectedId={selected} onSelect={setSelected}
    items={[{ id: 'manual', label: 'Manual' }, { id: 'alphabetical', label: 'Alphabetical' }, { id: 'recent', label: 'Recent' }]} />;
} };
export const Keyboard = {
  args: { sectionLabel: 'Chat actions', onSelect: fn(), items: [
    { id: 'new', label: 'New chat' }, { id: 'canvas', label: 'Open canvas', disabled: true },
    { id: 'theme', label: 'Dark mode' }, { id: 'divider', type: 'divider' }, { id: 'reset', label: 'Reset to default data' },
  ] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'New chat' }));
    await userEvent.keyboard('{ArrowDown}');
    expect(canvas.getByRole('menuitem', { name: 'Dark mode' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(canvas.getByRole('menuitem', { name: 'Reset to default data' })).toHaveFocus();
    await userEvent.keyboard('{Home}{ArrowUp}');
    expect(canvas.getByRole('menuitem', { name: 'Reset to default data' })).toHaveFocus();
    await userEvent.keyboard('d');
    expect(canvas.getByRole('menuitem', { name: 'Dark mode' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(args.onSelect).toHaveBeenLastCalledWith('theme', expect.objectContaining({ id: 'theme' }), expect.anything());
  },
};
