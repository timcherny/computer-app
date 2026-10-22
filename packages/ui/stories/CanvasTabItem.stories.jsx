import { expect, fn, userEvent, within } from 'storybook/test';
import { CanvasTabItem } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

export default { title: 'Components/CanvasTabItem', component: CanvasTabItem, tags: ['autodocs'],
  args: { label: 'Core functionality', selected: true, onSelect: fn(), onClose: fn(), hover: false },
  parameters: { docs: { description: { component: 'Figma canvas_tab-item (6366:2560). Full tabs are 200 × 48px. Selected tabs use the primary background and a document icon; unselected tabs have a right divider. Hover reveals the close button without changing the tab width. Keyboard focus also reveals it. The selection and close buttons are siblings, so closing never selects the tab.' } } } };
export const Selected = {};
export const Unselected = { args: { selected: false } };
export const SelectedHover = { args: { hover: true } };
export const UnselectedHover = { args: { selected: false, hover: true } };
export const LongLabel = { args: { label: 'Core functionality and additional requirements', hover: true } };
export const Disabled = { args: { disabled: true, hover: true } };
export const BothThemes = { render: () => <ChatThemes><div role="tablist" aria-label="Canvas tab variants" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, 200px)',gap:10}}>
  {[true,false].flatMap(selected=>[false,true].map(hover=><CanvasTabItem key={`${selected}-${hover}`} label="Core functionality" selected={selected} hover={hover} onClose={()=>{}} />))}
</div></ChatThemes> };
export const Interaction = { args: { hover: undefined }, play: async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  const tab = canvas.getByRole('tab', { name: 'Core functionality' });
  await userEvent.click(tab);
  expect(args.onSelect).toHaveBeenCalledTimes(1);
  await userEvent.tab();
  const close = canvas.getByRole('button', { name: 'Close Core functionality' });
  expect(close).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(args.onClose).toHaveBeenCalledTimes(1);
  expect(args.onSelect).toHaveBeenCalledTimes(1);
} };
