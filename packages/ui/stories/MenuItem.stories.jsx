import { MenuItem } from '@computer/ui';

export default { title: 'Components/MenuItem', component: MenuItem, tags: ['autodocs'],
  args: { label: 'New chat' }, decorators: [Story => <div role="menu" aria-label="Menu item preview" style={{ width: 'var(--computer-menu-width)' }}><Story /></div>] };
export const Default = {};
export const Selected = { args: { label: 'Recent', selected: true } };
export const Section = { args: { type: 'section', label: 'Navigation' } };
export const Divider = { args: { type: 'divider' } };
export const Disabled = { args: { disabled: true } };
export const Shortcut = { args: { shortcuts: ['⌘', 'N'] } };
export const Trailing = { args: { label: 'Settings', trailingIcon: 'chevronRight' } };
