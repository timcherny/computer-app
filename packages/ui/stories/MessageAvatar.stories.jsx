import { MessageAvatar, Text } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';
const photos=import.meta.glob('./assets/message-avatar/*.jpg',{eager:true,query:'?url',import:'default'});

export default {title:'Components/MessageAvatar',component:MessageAvatar,tags:['autodocs'],args:{variant:'initial',initial:'M'},
  argTypes:{variant:{control:'select',options:['photo','initial','count','computer','computerCircle','claude','codex']}},
  parameters:{docs:{description:{component:'20px message avatar, separate from the 32px navigation Avatar. Portraits are supplied through src; initials provide a missing/broken-image fallback. computer, computerCircle, claude and codex preserve Figma artwork and inherit theme colors. All 12 Figma portrait examples are local Storybook fixtures copied from Computer.'}}},
};
export const Initial = {};
export const Count = {args:{variant:'count',count:12,alt:'12 open tabs'}};
export const Computer = {args:{variant:'computer',alt:'Computer'}};
export const BrokenPortrait = {args:{variant:'photo',src:'./missing-portrait.png',initial:'T',alt:'Tim'}};
function All(){return <div className="chat-avatar-grid">{Object.entries(photos).map(([name,src])=><MessageAvatar key={name} variant="photo" src={src}/>)}{['initial','computer','computerCircle','claude','codex'].map(variant=><div className="chat-avatar-sample" key={variant}><MessageAvatar variant={variant}/><Text variant="caption">{variant}</Text></div>)}</div>;}
export const AllVariants = {render:()=> <All/>};
export const BothThemes = {render:()=> <ChatThemes><All/></ChatThemes>};
