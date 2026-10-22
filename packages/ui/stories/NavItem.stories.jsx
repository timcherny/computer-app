import { useId, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NavItem, Text } from '@computer/ui';
import sampleImage from './assets/avatar/image.png';

const avatar = { src: sampleImage };
const chat = { label: 'Operator chat', description: 'Lets create a one simple way of', avatar };

export default {
  title: 'Components/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  args: { ...chat, variant: 'default', selected: false, disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['default', 'session', 'section', 'me', 'collapsed'] },
    label: { control: 'text' },
    description: { control: 'text' },
    count: { control: 'text' },
    avatar: { control: 'object' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    expanded: { control: 'boolean' },
    onExpandedChange: { control: false },
    controlsId: { control: 'text' },
    expansionLabel: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: 'Operator navigation item. Figma’s Default, 2 level, Section, Me and Collapsed map to default, session, section, me and collapsed. Collapsed is a 52px avatar-only button with a centered 32px avatar, 4px padding and 8px corners and a tooltip/accessibility label. Supply label for every variant, including the accessible name of Me. The row uses a native button, or a link when href is supplied; section is a non-interactive heading. Only selection fills the row background; hover and pointer-down leave it unchanged. selected marks the current view with aria-current="page". avatar accepts Avatar visual options (variant, src, initials, members). For expandable default rows, pass expanded and onExpandedChange: the avatar becomes a separate toggle and displays the Hover chevron on pointer hover or keyboard focus. controlsId associates the toggle with its child group. The text only selects/navigates when onClick or href is supplied. Defaults to 267px wide and shrinks to its container. Override --computer-nav-item-width: 100% for a fluid sidebar. Colors and typography follow the theme tokens.' } },
  },
};

export const Default = {};
export const Selected = { args: { selected: true } };
export const Collapsed = { args: { variant: 'collapsed' } };
export const CollapsedSelected = { args: { variant: 'collapsed', selected: true } };
export const Session = { args: { variant: 'session', label: 'Session name', count: '2 days' } };
export const SessionSelected = { args: { ...Session.args, selected: true } };
export const Section = { args: { variant: 'section', label: 'RECENT' } };
export const Me = { args: { variant: 'me', label: 'Open profile menu', 'aria-haspopup': 'menu' } };
export const Link = { args: { href: '#operator-chat', selected: true } };
export const Disabled = { args: { disabled: true } };

function Variants() {
  return (
    <div className="nav-item-specimens">
      <NavItem {...chat} />
      <NavItem {...chat} selected />
      <NavItem variant="section" label="RECENT" />
      <NavItem variant="session" label="Session name" count="2 days" />
      <NavItem variant="session" label="Session name" count="5 days" selected />
      <NavItem variant="me" label="Open profile menu" avatar={avatar} />
      <NavItem {...chat} variant="collapsed" />
      <NavItem {...chat} variant="collapsed" selected />
    </div>
  );
}

export const BothThemes = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="theme-comparison">
      {['light', 'dark'].map((theme) => (
        <section className="foundation-panel" data-theme={theme} key={theme} aria-label={`${theme} navigation items`}>
          <div className="foundation-heading">
            <Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text>
            <Text variant="caption">FIGMA VARIANTS</Text>
          </div>
          <Variants />
        </section>
      ))}
    </div>
  ),
};

export const NarrowAndLongLabels = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="nav-item-specimens nav-item-narrow">
      <NavItem {...chat} label="A very long conversation title that must stay on one line" description="A longer preview that must truncate without moving the avatar" />
      <NavItem variant="session" label="A very long session title" count="10 days" selected />
      <NavItem variant="section" label="A LONG SECTION NAME THAT MUST TRUNCATE" />
    </div>
  ),
};

function NavigationExample({ onActivate, onDisabled }) {
  const [current, setCurrent] = useState('first');
  return (
    <nav aria-label="Example sessions" className="nav-item-specimens">
      <NavItem variant="section" label="RECENT" />
      <NavItem variant="session" label="First session" count="2 days" selected={current === 'first'} onClick={() => setCurrent('first')} />
      <NavItem variant="session" label="Second session" count="5 days" selected={current === 'second'} onClick={() => { setCurrent('second'); onActivate(); }} />
      <NavItem variant="session" label="Unavailable session" count="10 days" disabled onClick={onDisabled} />
      <NavItem variant="session" label="Unavailable link" count="10 days" href="#unavailable" disabled onClick={onDisabled} />
      <NavItem variant="me" label="Open profile menu" avatar={avatar} onClick={onActivate} />
    </nav>
  );
}

export const Interaction = {
  args: { onActivate: fn(), onDisabled: fn() },
  parameters: { controls: { disable: true } },
  render: ({ onActivate, onDisabled }) => <NavigationExample onActivate={onActivate} onDisabled={onDisabled} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'First session 2 days' });
    const second = canvas.getByRole('button', { name: 'Second session 5 days' });
    expect(first).toHaveAttribute('aria-current', 'page');
    await userEvent.click(second);
    expect(first).not.toHaveAttribute('aria-current');
    expect(second).toHaveAttribute('aria-current', 'page');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(args.onActivate).toHaveBeenCalledTimes(3);
    const disabledButton = canvas.getByRole('button', { name: 'Unavailable session 10 days' });
    const disabledLink = canvas.getByRole('link', { name: 'Unavailable link 10 days' });
    expect(disabledButton).toBeDisabled();
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    expect(disabledLink).not.toHaveAttribute('href');
    expect(disabledLink).toHaveAttribute('tabindex', '-1');
    await userEvent.click(disabledButton);
    await userEvent.click(disabledLink);
    expect(args.onDisabled).not.toHaveBeenCalled();
    await userEvent.click(first);
    await userEvent.tab();
    expect(second).toHaveFocus();
    await userEvent.tab();
    expect(canvas.getByRole('button', { name: 'Open profile menu' })).toHaveFocus();
    expect(canvas.getByRole('heading', { name: 'RECENT' })).not.toHaveAttribute('tabindex');
  },
};

function ExpandableExample({ onActivate, onExpand, onDisabled }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(false);
  const sessionsId = useId();
  return (
    <nav aria-label="Expandable example" className="nav-item-specimens">
      <NavItem label="Computer" description="Select text or expand the avatar" selected={selected}
        expanded={expanded} controlsId={sessionsId}
        onExpandedChange={value => { setExpanded(value); onExpand(value); }}
        onClick={() => { setSelected(true); onActivate(); }} />
      <div id={sessionsId} hidden={!expanded}>
        <NavItem variant="session" label="Today" count="2 days" />
      </div>
      <NavItem label="Unavailable group" disabled expanded={false} onExpandedChange={onDisabled} onClick={onDisabled} />
      <NavItem label="Unavailable group link" disabled href="#unavailable-group" expanded={false} onExpandedChange={onDisabled} onClick={onDisabled} />
      <NavItem label="Regular chat" avatar={avatar} onClick={onActivate} />
    </nav>
  );
}

export const Expandable = {
  args: { onActivate: fn(), onExpand: fn(), onDisabled: fn() },
  parameters: { controls: { disable: true } },
  render: args => <ExpandableExample {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Expand Computer', exact: true });
    const main = canvas.getByRole('button', { name: /^Computer Select text/ });
    await userEvent.click(main);
    expect(main).toHaveAttribute('aria-current', 'page');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(args.onExpand).not.toHaveBeenCalled();
    await userEvent.tab({ shift: true });
    expect(toggle).toHaveFocus();
    expect(toggle.querySelector('.computer-avatar__hover')).toHaveStyle({ opacity: '1' });
    expect(toggle.querySelector('.computer-avatar__initials')).toHaveTextContent('C');
    await userEvent.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(args.onExpand).toHaveBeenLastCalledWith(true);
    expect(canvas.getByRole('button', { name: 'Today 2 days' })).toBeVisible();
    expect(args.onActivate).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(args.onExpand).toHaveBeenLastCalledWith(false);
    await userEvent.tab();
    expect(main).toHaveFocus();
    await userEvent.tab();
    expect(canvas.getByRole('button', { name: 'Regular chat' })).toHaveFocus();
    const disabledToggle = canvas.getByRole('button', { name: 'Expand Unavailable group', exact: true });
    expect(disabledToggle).toBeDisabled();
    await userEvent.click(disabledToggle);
    const disabledLink = canvas.getByRole('link', { name: 'Unavailable group link' });
    expect(disabledLink).not.toHaveAttribute('href');
    await userEvent.click(disabledLink);
    expect(args.onDisabled).not.toHaveBeenCalled();
    expect(canvasElement.querySelector('button button, a button, button a')).toBeNull();
  },
};
