import { MessageItem } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';
import sampleImage from './assets/avatar/image.png';

const many='Hi, can you help me with itHi, can you help me with it Hi, can you help me with itHi, can you help me with';
export default {title:'Components/MessageItem',component:MessageItem,tags:['autodocs'],args:{type:'me',children:'Hi, can you help me with it',tail:true},
  argTypes:{type:{control:'select',options:['me','person','personWithAvatar','personWithAvatarAndName','notification','threadSummary','topAvatar']},size:{control:'select',options:['auto','oneLine','manyLines','writing']}},
  parameters:{docs:{description:{component:'Figma Message item: outgoing/incoming bubbles, optional tails, sender avatars/names, typing, notifications, thread summaries and top avatars. Long content wraps; auto promotes multiline text using the old Computer helper. Bubble and tail colors share one token so both themes stay seamless. Notification and sender labels use uppercase caption typography.'}}},
};
export const Me = {};
export const Person = {args:{type:'person'}};
export const NoTail = {args:{tail:false}};
export const WithAvatarAndName = {args:{type:'personWithAvatarAndName',name:'Maya',avatar:{initial:'M'}}};
export const Typing = {args:{type:'person',size:'writing',name:'Maya'}};
function All(){return <div className="chat-message-specimens">
  <MessageItem size="manyLines">{many}</MessageItem><MessageItem size="manyLines" tail={false}>{many}</MessageItem>
  <MessageItem type="person" size="manyLines">{many}</MessageItem>
  <MessageItem>Hi, can you help me with it</MessageItem><MessageItem tail={false}>Hi, can you help me with it</MessageItem>
  <MessageItem type="person">Hi, can you help me with it</MessageItem><MessageItem type="person" size="writing"/>
  <MessageItem type="personWithAvatar">Hi, can you help me with it</MessageItem>
  <MessageItem type="personWithAvatarAndName" name="Person name">Hi, can you help me with it</MessageItem>
  <MessageItem type="notification">New thread created</MessageItem>
  <MessageItem type="threadSummary" title="Metrics discussion" count="25">Weekly rundown for Project 17 is 88% complete</MessageItem>
  <MessageItem type="topAvatar" name="Peter L" avatar={{src:sampleImage}}/>
</div>;}
export const AllVariants={render:()=> <All/>};
export const BothThemes={render:()=> <ChatThemes><All/></ChatThemes>};
