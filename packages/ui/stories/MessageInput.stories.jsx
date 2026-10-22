import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MessageInput, defaultMessageGradient, Button } from '@computer/ui';

const people = [{id:'gil',name:'Gil'},{id:'ben',name:'Ben'},{id:'tim',name:'Tim Cherny'}];
export default {
  title:'Components/MessageInput', component:MessageInput, tags:['autodocs'],
  args:{people, computerOnly:true, animate:true, loopDuration:5, gradient:defaultMessageGradient},
  parameters:{docs:{description:{component:'407 × 44 px Figma composer. One-second full-pill intro (0–0.2s fade in, 0.8–1s fade out), followed by a five-second loop inside the 36 × 28 px Computer pill. Controlled or uncontrolled text; four-line growth; Enter sends, Shift+Enter inserts a newline; @ opens keyboard-selectable mentions. Group mode supports Tab to toggle Computer (Shift+Tab exits). onSend(text,event,{toComputer}) does not clear the draft; the owner clears after accepting it. onAddAction receives add-files, generative-ui or side-chat; these do not perform external actions. gradient exposes independent scale/smallScale and palette, grain, crop, easing, detail and distortion controls. animationKey replays the intro. Reduced motion skips the intro and renders a still. paused stops the decorative loop. No legacy issue-storage or backend dependencies.'}}},
  argTypes:{gradient:{control:'object'},onSend:{action:'send'},onAddAction:{action:'add action'},animationKey:{control:'number'}},
};
export const Default = {};
export const Filled = {args:{animate:false,defaultValue:'Let’s review the onboarding flow.'}};
export const Multiline = {args:{animate:false,defaultValue:'First line\nSecond line\nThird line\nFourth line\nFifth line'}};
export const Group = {args:{animate:false,group:true,computerOnly:false}};
export const Disabled = {args:{disabled:true}};
export const BothThemes = {render:args=><div style={{display:'grid',gap:24}}>{['light','dark'].map(theme=><div key={theme} data-theme={theme} style={{padding:24,background:'var(--computer-color-bg-secondary)'}}><MessageInput {...args}/></div>)}</div>};
function Demo(args){const [value,setValue]=useState(''),[sent,setSent]=useState(''),[key,setKey]=useState(0);return <div style={{display:'grid',gap:16}}><MessageInput {...args} value={value} onChange={e=>setValue(e.target.value)} animationKey={key} onSend={text=>{setSent(text);setValue('');}}/><Button onClick={()=>setKey(k=>k+1)}>Replay intro</Button><output aria-live="polite">{sent&&`Sent locally: ${sent}`}</output></div>;}
export const Playground = {args:{group:true,computerOnly:false},render:args=><Demo {...args}/>};
export const Interaction = {
  args:{animate:false,onSend:fn(),onMentionSelect:fn(),onAddAction:fn()},
  play:async({canvasElement,args})=>{
    const canvas=within(canvasElement), input=canvas.getByRole('textbox',{name:'Message'});
    await userEvent.click(input);await userEvent.keyboard('{Enter}');expect(args.onSend).not.toHaveBeenCalled();
    await userEvent.type(input,'Hello');await userEvent.keyboard('{Shift>}{Enter}{/Shift}');await userEvent.type(input,'there');
    expect(input).toHaveValue('Hello\nthere');await userEvent.keyboard('{Enter}');
    expect(args.onSend).toHaveBeenCalledWith('Hello\nthere',expect.anything(),{toComputer:true});
    await userEvent.clear(input);await userEvent.type(input,'@gi');await userEvent.keyboard('{Enter}');
    expect(input).toHaveValue('Gil: ');expect(args.onMentionSelect).toHaveBeenCalledWith({name:'Gil'});
    const add=canvas.getByRole('button',{name:'Add',exact:true});
    await userEvent.click(add);
    const menu=canvas.getByRole('menu',{name:'Add to message'});
    expect(menu).toBeVisible();expect(add).toHaveAttribute('aria-expanded','true');
    expect(canvas.getByRole('menuitem',{name:'Add files or photos'})).toHaveFocus();
    await userEvent.keyboard('{End}');expect(canvas.getByRole('menuitem',{name:'New side chat'})).toHaveFocus();
    await userEvent.keyboard('{Escape}');expect(add).toHaveFocus();expect(add).toHaveAttribute('aria-expanded','false');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(canvas.getByRole('menuitem',{name:'Add files or photos'}));expect(args.onAddAction).toHaveBeenCalledWith('add-files');expect(input).toHaveFocus();
  },
};

export const TabBehavior = {
  args:{group:true,computerOnly:false,animate:true,onSend:fn()},
  play:async({canvasElement,args})=>{
    const canvas=within(canvasElement),input=canvas.getByRole('textbox',{name:'Message'});
    await userEvent.click(input);
    expect(canvas.getByText('Tab',{selector:'kbd'})).toBeVisible();
    await userEvent.type(input,'Keep this draft');
    input.setSelectionRange(4,4);
    await userEvent.keyboard('{Tab}');
    expect(input).toHaveFocus();expect(input).toHaveValue('Keep this draft');expect(input.selectionStart).toBe(4);
    expect(canvasElement.querySelector('.computer-message-input')).toHaveAttribute('data-computer','true');
    // Toggling off during the intro must retain focus and cancel the intro.
    await userEvent.keyboard('{Tab}');expect(input).toHaveFocus();
    expect(canvasElement.querySelector('.computer-message-input')).toHaveAttribute('data-computer','false');
    await userEvent.keyboard('{Enter}');expect(args.onSend).toHaveBeenLastCalledWith('Keep this draft',expect.anything(),{toComputer:false});
    await userEvent.keyboard('{Tab}');
    await new Promise(resolve=>setTimeout(resolve,1100));
    expect(input).toHaveFocus();expect(canvasElement.querySelector('.computer-message-input__agent')).toBeVisible();
    await userEvent.keyboard('{Enter}');expect(args.onSend).toHaveBeenLastCalledWith('Keep this draft',expect.anything(),{toComputer:true});
    await userEvent.clear(input);await userEvent.type(input,'@gi');await userEvent.keyboard('{Tab}');
    expect(input).toHaveValue('Gil: ');
    expect(canvasElement.querySelector('.computer-message-input')).toHaveAttribute('data-computer','true');
    await userEvent.tab({shift:true});expect(input).not.toHaveFocus();
  },
};
