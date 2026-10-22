import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChatWindow } from '@computer/ui';
import { chatMessages, ChatThemes } from './chatFixtures.jsx';
import { pageSections } from './PropertiesNav.stories.jsx';

function Example({onSend=()=>{}, initialMessages=chatMessages, inputProps, ...props}){
  const [messages,setMessages]=useState(initialMessages);
  const [value,setValue]=useState('');
  return <ChatWindow {...props} inputProps={inputProps} messages={messages} inputValue={value} onInputChange={event=>setValue(event.target.value)}
    onSend={text=>{setMessages(rows=>[...rows,{id:crypto.randomUUID(),type:'me',text}]);setValue('');onSend(text);}}/>;
}
export default {title:'Components/ChatWindow',component:ChatWindow,tags:['autodocs'],parameters:{docs:{description:{component:'Composes ChatTopbar (including ChatHeader), MessageItem and MessageInput. The host owns chat state. The top bar overlays the scrolling history with a theme-aware fade, and the composer remains fixed. New outgoing messages scroll into view; incoming changes preserve the reading position when scrolled up. Resize follows the bottom only while already pinned. The example conversation comes from the saved Computer prototype copy.'}}}};
export const Default={render:args=><div className="chat-window-specimen chat-window-standalone"><Example {...args}/></div>};
export const Dark={...Default,globals:{theme:'dark'}};
export const Empty={...Default,args:{initialMessages:[]}};
export const WithProperties={render:args=><div style={{height:680,width:1100,maxWidth:'100%'}}><Example {...args}/></div>,args:{propertiesSections:pageSections,defaultPropertiesOpen:true,inputProps:{animate:false}},play:async({canvasElement})=>{
  const canvas=within(canvasElement);
  expect(canvas.getByRole('button',{name:/^Inbox/})).toBeDisabled();
  expect(canvas.queryByRole('button',{name:'Open canvas'})).not.toBeInTheDocument();
  expect(within(canvas.getByRole('group',{name:'Chat actions'})).getAllByRole('button')).toHaveLength(2);
  await userEvent.click(canvas.getByRole('button',{name:'Hide properties'}));
  expect(canvas.queryByRole('navigation',{name:'Chat properties'})).not.toBeInTheDocument();
  await userEvent.click(canvas.getByRole('button',{name:'Show properties'}));
  expect(canvas.getByRole('button',{name:/^Reports/})).toBeVisible();
}};
export const NarrowProperties={...WithProperties,render:args=><div style={{height:680,width:460,maxWidth:'100%'}}><Example {...args}/></div>};
export const ScrollWithProperties={...WithProperties,args:{...WithProperties.args,initialMessages:Array.from({length:5},(_,group)=>chatMessages.map(message=>({...message,id:`${group}-${message.id}`}))).flat()},play:undefined,parameters:{docs:{description:{story:'Long history keeps its scrollbar at the outer chat edge while the side properties panel and composer stay fixed.'}}}};
export const BothThemes={render:()=> <ChatThemes><div className="chat-window-specimen"><Example inputProps={{animate:false}}/></div></ChatThemes>,play:async({canvasElement})=>{
  for (const bubble of canvasElement.querySelectorAll('.computer-message-item__bubble')) {
    const text=bubble.querySelector('.computer-message-item__text');
    expect(getComputedStyle(text).color).not.toBe(getComputedStyle(bubble).backgroundColor);
  }
}};
export const Interaction={...Default,args:{onSend:fn(),inputProps:{animate:false}},play:async({canvasElement,args})=>{
  const canvas=within(canvasElement);const input=canvas.getByRole('textbox',{name:'Message'});const send=canvas.getByRole('button',{name:'Send message'});
  expect(send).toBeDisabled();await userEvent.type(input,'   ');await userEvent.keyboard('{Enter}');expect(args.onSend).not.toHaveBeenCalled();
  await userEvent.clear(input);await userEvent.type(input,'First line');await userEvent.keyboard('{Shift>}{Enter}{/Shift}');await userEvent.type(input,'Second line');
  expect(args.onSend).not.toHaveBeenCalled();await userEvent.keyboard('{Enter}');expect(args.onSend).toHaveBeenLastCalledWith('First line\nSecond line');expect(input).toHaveValue('');expect(input).toHaveFocus();expect(send).toBeDisabled();
  expect(canvas.getByText(/First line\s+Second line/)).toBeVisible();
}};
