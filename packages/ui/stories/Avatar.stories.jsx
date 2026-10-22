import { useState } from 'react';
import { expect, fn, userEvent, within, waitFor } from 'storybook/test';
import { Avatar, Button, Text } from '@computer/ui';
import sampleImage from './assets/avatar/image.png';
import memberLeft from './assets/avatar/member-left.png';
import memberRight from './assets/avatar/member-right.jpg';
import memberBottom from './assets/avatar/member-bottom.png';

const sampleMembers = [
  { src: memberLeft, alt: 'First member' },
  { src: memberRight, alt: 'Second member' },
  { src: memberBottom, alt: 'Third member' },
];

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { variant: 'default', src: sampleImage, alt: 'Landscape avatar' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'mp', 'mp-gray', 'computer', 'team', 'hover'] },
    size: { control: { type: 'number', min: 16, step: 4 } },
    members: { control: 'object' },
    as: { control: 'select', options: ['span', 'button'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: 'Avatar from Operator’s Figma component set. Default size is 32px, or 33px for Team. Variants follow the current Figma set: Default, MP, MP Gray, Computer, Team, and Hover. MP Gray uses the primary background token for multiperson chat headers; MP uses the secondary background for navigation. Pass alt for an accessible name; leave it empty when adjacent text already names the person. src customizes default/team; members supplies up to three group images. Missing or failed images show initials. The default span is non-interactive. Use as="button" and an action-oriented alt for a native button that shows the chevron on hover and keyboard focus. The standalone hover variant previews that visual state.' } },
  },
};

export const Default = {};
export const Hover = { args: { variant: 'hover', src: undefined, alt: 'Avatar menu indicator' } };
export const Computer = { args: { variant: 'computer', src: undefined, alt: 'Computer' } };
export const MP = { args: { variant: 'mp', src: undefined, alt: 'Design team', members: sampleMembers } };
export const MPGray = { args: { variant: 'mp-gray', src: undefined, alt: 'Design team', members: sampleMembers } };
export const Team = { args: { variant: 'team', src: undefined, alt: 'Team' } };
export const Initials = { args: { src: undefined, alt: 'Tim Cherny' } };

const figmaVariants = [
  { label: 'Default', variant: 'default', src: sampleImage, alt: 'Landscape avatar' },
  { label: 'MP', variant: 'mp', members: sampleMembers, alt: 'Design team' },
  { label: 'MP Gray', variant: 'mp-gray', members: sampleMembers, alt: 'Design team' },
  { label: 'Computer', variant: 'computer', alt: 'Computer' },
  { label: 'Team', variant: 'team', alt: 'Team' },
  { label: 'Hover', variant: 'hover', alt: 'Avatar menu indicator' },
];

export const BothThemes = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="theme-comparison">
      {['light', 'dark'].map((theme) => (
        <section className="foundation-panel" data-theme={theme} key={theme} aria-label={`${theme} avatars`}>
          <div className="foundation-heading"><Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text><Text variant="caption">FIGMA VARIANTS</Text></div>
          <div className="avatar-specimens">
            {figmaVariants.map(({ label, ...avatar }) => (
              <div className="avatar-specimen" key={label}>
                <Avatar {...avatar} />
                <Text variant="label">{label}</Text>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

function RecoveryExample() {
  const [src, setSrc] = useState('data:image/png;base64,broken');
  return <div className="story-row"><Avatar src={src} alt="Tim Cherny" /><Button variant="secondary" onClick={() => setSrc(sampleImage)}>Load sample image</Button></div>;
}

export const ImageRecovery = {
  parameters: { controls: { disable: true } },
  render: () => <RecoveryExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('img', { name: 'Tim Cherny' });
    await waitFor(() => expect(avatar).toHaveTextContent('TC'));
    await userEvent.click(canvas.getByRole('button', { name: 'Load sample image' }));
    await waitFor(() => {
      const image = avatar.querySelector('img');
      expect(image).not.toBeNull();
      expect(image.complete && image.naturalWidth > 0).toBe(true);
    });
    expect(avatar).not.toHaveTextContent('TC');
  },
};

export const Interactive = {
  args: { as: 'button', alt: 'Open profile menu', onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Open profile menu' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Disabled = {
  args: { as: 'button', alt: 'Open profile menu', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Open profile menu' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
