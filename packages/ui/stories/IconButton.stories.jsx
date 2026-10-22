import { useState } from 'react';
import { IconButton } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

export default {title:'Components/IconButton',component:IconButton,tags:['autodocs'],args:{label:'Add',icon:'plus',variant:'ghost'},
  argTypes:{variant:{control:'select',options:['ghost','default']},state:{control:'select',options:['default','pressed','disabled']}},
  parameters:{docs:{description:{component:'36 × 36px native icon button. Ghost has a 4px radius; Default has a 2px radius. label is required for an accessible name. Pressed appearance lasts only while the button is held down. pressed exposes the toggle value through aria-pressed without latching the background. state="pressed" is a static catalog preview of Figma’s state. Hover leaves the appearance unchanged. Active/pressed, disabled and keyboard focus use theme tokens.'}}},
};
export const Ghost = {};
export const Default = {args:{variant:'default'}};
export const Pressed = {args:{state:'pressed'}};
export const Disabled = {args:{disabled:true}};
export const BothThemes = {render:()=> <ChatThemes><div className="story-row">{['ghost','default'].map(variant => ['default','pressed','disabled'].map(state=><IconButton key={variant+state} variant={variant} state={state} label={`${variant} ${state}`} />))}</div></ChatThemes>};
function ToggleExample(){const [pressed,setPressed]=useState(false);return <IconButton icon="leftSidePanel" label="Toggle sidebar" pressed={pressed} onClick={()=>setPressed(v=>!v)}/>;}
export const Toggle = {render:()=> <ToggleExample/>};
