import { expect, userEvent, within } from 'storybook/test';
import { PropertiesNav } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

export const pageSections = [{ id: 'pages', title: 'Pages', items: [
  { id: 'inbox', label: 'Inbox', trailingLabel: '3' },
  { id: 'agents', label: 'Agents', trailingLabel: '2' },
  { id: 'goals', label: 'Goals', trailingLabel: '3' },
  { id: 'reports', label: 'Reports', trailingLabel: '4' },
] }];

export default { title: 'Components/PropertiesNav', component: PropertiesNav, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Adapted from the original Computer PropertiesNav and MenuSection: 259px wide, 28px rows, collapsible sections and theme tokens. Empty sections are omitted. Items without an action are disabled; the prototype pages do not open a canvas.' } } },
  args: { sections: pageSections }, excludeStories: ['pageSections'] };
export const Default = {};
export const WithIdentity = { args: { header: { title: 'Computer', description: 'Last use today', avatar: { variant: 'computer' } } } };
export const Dark = { globals: { theme: 'dark' } };
export const BothThemes = { render: args => <ChatThemes><PropertiesNav {...args} /></ChatThemes> };
export const Interaction = { play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  for (const label of ['Inbox', 'Agents', 'Goals', 'Reports']) expect(canvas.getByRole('button', { name: new RegExp(`^${label}`) })).toBeDisabled();
  const heading = canvas.getByRole('button', { name: 'Pages' });
  await userEvent.click(heading);
  expect(heading).toHaveAttribute('aria-expanded', 'false');
  expect(canvas.queryByRole('button', { name: /^Inbox/ })).not.toBeInTheDocument();
  await userEvent.click(heading);
  expect(canvas.getByRole('button', { name: /^Inbox/ })).toBeVisible();
} };
