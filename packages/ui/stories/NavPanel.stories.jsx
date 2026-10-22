import { Fragment, useId, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton, NavItem, NavPanel, Text } from '@computer/ui';
import sampleImage from './assets/avatar/image.png';
import memberRight from './assets/avatar/member-right.jpg';
import memberBottom from './assets/avatar/member-bottom.png';

const avatar = { src: sampleImage };
const dates = ['Today', 'Yesterday', '25 April'].map((label, index) => ({ label, count: ['2 days', '5 days', '10 days'][index] }));
const recent = [
  { id: 'gil', avatar, label: 'Gil', description: 'Makes sense. Open the brief so we can work through her notes.' },
  { id: 'team', avatar: { variant: 'team' }, session: { id: 'onboarding', label: 'Onboarding review', count: '2 days' }, label: 'Computer team', description: 'She thinks we’re asking for too much information upfront. She’s suggested moving the profile questions until after signup.' },
  { id: 'ben-gil', avatar: { variant: 'mp', members: [{ src: sampleImage }, { src: memberRight }, { src: memberBottom }] }, session: { id: 'design-review', label: 'Design review', count: '5 days' }, label: 'Ben & Gil', description: 'Lets create a one simple way of' },
];

function PanelExample({ onSelect = () => {}, onProfile = () => {}, overflow = false, collapsed = false, ...props }) {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const groupPrefix = useId();
  function setGroupExpanded(id, nextExpanded) {
    setExpanded(ids => nextExpanded ? [...new Set([...ids, id])] : ids.filter(item => item !== id));
  }
  function select(id) { setSelected(id); onSelect(id); }
  return (
    <NavPanel
      {...props}
      collapsed={collapsed}
      primary={<>
        <NavItem variant={collapsed ? 'collapsed' : 'default'} label="Computer" description="Lets create a one simple way of" avatar={{ variant: 'computer' }} selected={selected === 'computer'} onClick={() => select('computer')}
          expanded={expanded.includes('computer')} onExpandedChange={value => setGroupExpanded('computer', value)} controlsId={`${groupPrefix}-computer`} />
        <div className="nav-panel-sessions" id={`${groupPrefix}-computer`} hidden={collapsed || !expanded.includes('computer')}>
          {dates.map(({ label, count }) => <NavItem key={label} variant="session" label={label} count={count} selected={selected === label} onClick={() => select(label)} />)}
        </div>
      </>}
      footer={<NavItem variant={collapsed ? 'collapsed' : 'me'} label="Open profile menu" avatar={avatar} onClick={onProfile} />}
    >
      {recent.map(item => <Fragment key={item.id}>
        <NavItem variant={collapsed ? 'collapsed' : 'default'} label={item.label} description={item.description} avatar={item.avatar}
          className={item.id === 'gil' ? 'nav-panel-gil' : undefined}
          selected={selected === item.id}
          onClick={() => select(item.id)}
          expanded={expanded.includes(item.id)}
          onExpandedChange={item.session ? value => setGroupExpanded(item.id, value) : undefined}
          controlsId={item.session ? `${groupPrefix}-${item.id}` : undefined}
        />
        {item.session && <div className="nav-panel-sessions" id={`${groupPrefix}-${item.id}`} hidden={collapsed || !expanded.includes(item.id)}>
          <NavItem variant="session" label={item.session.label} count={item.session.count} selected={selected === item.session.id} onClick={() => select(item.session.id)} />
        </div>}
      </Fragment>)}
      {overflow && Array.from({ length: 24 }, (_, index) => (
        <NavItem key={index} variant={collapsed ? 'collapsed' : 'default'} label={`Conversation ${index + 1}`} description="A longer recent conversation preview" avatar={avatar} selected={selected === `extra-${index}`} onClick={() => select(`extra-${index}`)} />
      ))}
    </NavPanel>
  );
}

export default {
  title: 'Components/NavPanel',
  component: NavPanel,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A 240px navigation panel composed from NavItem. collapsed switches to a 67px avatar rail with 52px items, 10px vertical padding and 6px row gaps; supply collapsed NavItems in its slots. The rail omits header chrome, separators and the Recent heading, retains its pinned profile, and scrolls overflow. primary holds Computer/date rows; children hold recent conversations; footer stays pinned below the scrollable list. header reserves 48px for host chrome. The web catalog leaves the native-chrome slot empty; Electron supplies real operating-system window controls. Set --computer-nav-panel-height to fill a host container. Selection, expansion, routing and profile menus are supplied by the consumer.' } },
  },
};

export const Default = { render: () => <PanelExample /> };
export const Dark = { globals: { theme: 'dark' }, render: () => <PanelExample /> };
export const Collapsed = { render: () => <PanelExample collapsed /> };
export const CollapsedDesign = { render: () => <NavPanel collapsed
  primary={<NavItem variant="collapsed" label="Computer" avatar={avatar} selected />}
  footer={<NavItem variant="collapsed" label="Open profile menu" avatar={avatar} />}>
  <NavItem variant="collapsed" label="Gil" avatar={avatar} />
  <NavItem variant="collapsed" label="Computer team" avatar={avatar} />
</NavPanel> };
export const CollapsedThemes = { render: () => <div className="nav-panel-comparison">{['light', 'dark'].map(theme => <div data-theme={theme} key={theme}><PanelExample collapsed /></div>)}</div> };
export const CollapsedOverflow = { render: () => <PanelExample collapsed overflow className="nav-panel-short" /> };
function ToggleExample() {
  const [collapsed, setCollapsed] = useState(false);
  return <div><IconButton icon="menu" label={collapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={() => setCollapsed(value => !value)} />
    <PanelExample collapsed={collapsed} className="nav-panel-short" /></div>;
}
export const CollapseAndExpand = { render: () => <ToggleExample /> };
export const CollapsedInteraction = {
  args: { onSelect: fn(), onProfile: fn() },
  render: args => <PanelExample {...args} collapsed className="nav-panel-short" />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const gil = canvas.getByRole('button', { name: 'Gil', exact: true });
    await userEvent.click(gil);
    expect(gil).toHaveAttribute('aria-current', 'page');
    expect(args.onSelect).toHaveBeenLastCalledWith('gil');
    await userEvent.tab();
    const team = canvas.getByRole('button', { name: 'Computer team', exact: true });
    expect(team).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(team).toHaveAttribute('aria-current', 'page');
    expect(gil).not.toHaveAttribute('aria-current');
    expect(args.onSelect).toHaveBeenLastCalledWith('team');
    await userEvent.click(canvas.getByRole('button', { name: 'Open profile menu' }));
    expect(args.onProfile).toHaveBeenCalledTimes(1);
    expect(canvas.queryByRole('button', { name: 'Expand Computer' })).not.toBeInTheDocument();
  },
};
export const BothThemes = {
  render: () => (
    <div className="nav-panel-comparison">
      {['light', 'dark'].map(theme => <div className="nav-panel-specimen" data-theme={theme} key={theme}>
        <Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text>
        <PanelExample label={`${theme} navigation`} />
      </div>)}
    </div>
  ),
};
export const Overflow = { render: () => <PanelExample className="nav-panel-short" overflow /> };
export const Interaction = {
  args: { onSelect: fn(), onProfile: fn() },
  render: args => <PanelExample {...args} className="nav-panel-short" />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const computer = canvas.getByRole('button', { name: 'Expand Computer', exact: true });
    expect(computer).toHaveAttribute('aria-expanded', 'false');
    expect(canvas.queryByRole('button', { name: 'Today 2 days' })).not.toBeInTheDocument();
    await userEvent.click(computer);
    const today = canvas.getByRole('button', { name: 'Today 2 days' });
    await userEvent.click(today);
    expect(today).toHaveAttribute('aria-current', 'page');
    expect(args.onSelect).toHaveBeenLastCalledWith('Today');
    expect(canvas.getByRole('button', { name: 'Yesterday 5 days' })).toBeVisible();
    expect(canvas.getByRole('button', { name: '25 April 10 days' })).toBeVisible();
    await userEvent.click(computer);
    expect(today).not.toBeVisible();
    expect(args.onSelect).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    expect(today).toBeVisible();
    const teamText = canvas.getByRole('button', { name: /^Computer team She thinks/ });
    await userEvent.click(teamText);
    expect(teamText).toHaveAttribute('aria-current', 'page');
    expect(today).not.toHaveAttribute('aria-current');
    expect(args.onSelect).toHaveBeenLastCalledWith('team');
    const team = canvas.getByRole('button', { name: 'Expand Computer team' });
    expect(team).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(team);
    expect(team).toHaveAttribute('aria-expanded', 'true');
    expect(team).not.toHaveAttribute('aria-current');
    expect(teamText).toHaveAttribute('aria-current', 'page');
    expect(args.onSelect).toHaveBeenCalledTimes(2);
    const session = canvas.getByRole('button', { name: 'Onboarding review 2 days' });
    await userEvent.tab();
    expect(teamText).toHaveFocus();
    await userEvent.tab();
    expect(session).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(session).toHaveAttribute('aria-current', 'page');
    expect(teamText).not.toHaveAttribute('aria-current');
    expect(today).not.toHaveAttribute('aria-current');
    expect(args.onSelect).toHaveBeenLastCalledWith('onboarding');
    await userEvent.click(team);
    expect(session).not.toBeVisible();
    await userEvent.keyboard(' ');
    expect(session).toBeVisible();
    expect(session).toHaveAttribute('aria-current', 'page');
    expect(args.onSelect).toHaveBeenCalledTimes(3);
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Ben & Gil' }));
    expect(canvas.getByRole('button', { name: 'Design review 5 days' })).toBeVisible();
    await userEvent.tab();
    const benGil = canvas.getByRole('button', { name: /^Ben & Gil Lets create/ });
    expect(benGil).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(benGil).toHaveAttribute('aria-current', 'page');
    expect(args.onSelect).toHaveBeenLastCalledWith('ben-gil');
    expect(canvas.getByRole('button', { name: 'Collapse Ben & Gil' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Open profile menu' }));
    expect(args.onProfile).toHaveBeenCalledTimes(1);
  },
};
