import { Icon, iconNames, Text } from '@computer/ui';
import { ChatThemes } from './chatFixtures.jsx';

export default { title: 'Components/Icon', component: Icon, tags: ['autodocs'], args: {name:'plus'},
  argTypes: {name:{control:'select', options:iconNames}},
  parameters:{docs:{description:{component:'Local SVGs copied unchanged from Computer, with the missing Menu and icon-button Plus downloaded from Operator. Optical insets are preserved. Icons inherit currentColor, so themes and disabled controls work without SVG filters. Provide title only when the icon itself needs an accessible name.'}}},
};
export const Default = {};
export const Catalog = { render: () => <div className="chat-icon-grid">{iconNames.map(name => <div className="chat-icon-sample" key={name}><Icon name={name}/><Text variant="caption">{name}</Text></div>)}</div> };
export const BothThemes = {render:()=> <ChatThemes><Catalog.render/></ChatThemes>};
