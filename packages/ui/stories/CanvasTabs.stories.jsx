import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CanvasTabs, Text } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

const initialItems = [{ id: 'agents', label: 'Agents deep dive' }, { id: 'core', label: 'Core functionality' }];
function Example({ initial = initialItems, onSelect, onClose, ...args }) {
  const [items, setItems] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  return <div style={{width:expanded?'100%':691,maxWidth:'100%',background:'var(--computer-color-bg-secondary)'}}>
    <CanvasTabs {...args} items={items} selectedId={selectedId} expanded={expanded} panelOpen={panelOpen}
      onSelect={id=>{setSelectedId(id);onSelect?.(id);}}
      onClose={id=>{setItems(rows=>rows.filter(row=>row.id!==id));onClose?.(id);}}
      onAdd={()=>{const id=crypto.randomUUID();setItems(rows=>[...rows,{id,label:'Untitled'}]);setSelectedId(id);}}
      onExpand={()=>setExpanded(value=>!value)} onPanelToggle={()=>setPanelOpen(value=>!value)} />
    <div style={{padding:20}}><Text variant="caption" tone="secondary">{items.find(item=>item.id===selectedId)?.label ?? 'No open tabs'}</Text>
      {panelOpen && <Text as="p" variant="label">Canvas panel preview</Text>}
    </div>
  </div>;
}
export default { title: 'Components/CanvasTabs', component: CanvasTabs, tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Figma canvas_tabs, Tabs full (7086:21168): a 48px tab bar with 200px tabs, an add control, and fixed expand/panel actions. Overflow scrolls horizontally. Arrow keys, Home and End select tabs; Delete closes a closable tab. The host owns documents, add/close actions, canvas expansion and the panel. These catalog examples are local previews; CanvasWindow composes the strip for the product canvas.' } } } };
export const Design = { render: () => <div style={{width:691,maxWidth:'100%'}}><CanvasTabs items={initialItems} defaultSelectedId="agents" onAdd={()=>{}} onExpand={()=>{}} onPanelToggle={()=>{}} /></div> };
export const Interactive = { render: args=><Example {...args}/>, args:{onSelect:fn(),onClose:fn()}, play: async ({ canvasElement, args }) => {
  const canvas=within(canvasElement);
  const first=canvas.getByRole('tab',{name:'Agents deep dive'});
  await userEvent.click(first);
  await userEvent.keyboard('{ArrowRight}');
  const second=canvas.getByRole('tab',{name:'Core functionality'});
  expect(second).toHaveFocus();expect(second).toHaveAttribute('aria-selected','true');
  expect(args.onSelect).toHaveBeenLastCalledWith('core');
  await userEvent.keyboard('{Delete}');
  expect(args.onClose).toHaveBeenLastCalledWith('core');expect(first).toHaveFocus();expect(first).toHaveAttribute('aria-selected','true');
  await userEvent.click(canvas.getByRole('button',{name:'Add canvas tab'}));
  expect(canvas.getByRole('tab',{name:'Untitled'})).toHaveAttribute('aria-selected','true');
  await userEvent.click(canvas.getByRole('button',{name:'Expand canvas'}));
  expect(canvas.getByRole('button',{name:'Restore canvas size'})).toHaveAttribute('aria-pressed','true');
  await userEvent.click(canvas.getByRole('button',{name:'Show canvas panel'}));
  expect(canvas.getByText('Canvas panel preview')).toBeVisible();
} };
export const BothThemes = { render: () => <ChatThemes><CanvasTabs items={initialItems} onAdd={()=>{}} onExpand={()=>{}} onPanelToggle={()=>{}} /></ChatThemes> };
export const Overflow = { render: args=><div style={{width:460,maxWidth:'100%'}}><Example {...args} initial={Array.from({length:8},(_,index)=>({id:`tab-${index}`,label:`Document ${index+1}`}))}/></div> };
export const DisabledTab = { render: () => <Example initial={[initialItems[0],{id:'unavailable',label:'Unavailable',disabled:true},initialItems[1]]}/> };
export const Empty = { render: () => <Example initial={[]}/> };
