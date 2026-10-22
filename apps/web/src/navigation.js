import sampleAvatar from './assets/nav-avatar.png';
import gilPhoto from './assets/gil.png';
import teamAvatar from './assets/nav-team.svg';

// Local prototype fixtures based on Figma, with sample durations requested by Tim; no chat service is connected.
const avatar = { src: sampleAvatar };
export const gilAvatar = { src: gilPhoto };
export const benAvatar = { initials: 'B', initial: 'B' };
export const computerItem = { id: 'computer', label: 'Computer', description: 'Lets create a one simple way of', avatar: { variant: 'computer' } };
export const dateItems = ['Today', 'Yesterday', '25 April'].map((label, index) => ({ id: `date-${index}`, label, count: ['2 days', '5 days', '10 days'][index] }));
export const recentItems = [
  { id: 'gil', label: 'Gil', mode: 'person', description: 'Makes sense. Open the brief so we can work through her notes.', avatar: gilAvatar },
  { id: 'computer-team', label: 'Computer team', mode: 'multiplayer', participantCount: 20, description: 'She thinks we’re asking for too much information upfront. She’s suggested moving the profile questions until after signup.', avatar: { variant: 'team', src: teamAvatar }, sessions: [{ id: 'onboarding', label: 'Onboarding review', count: '2 days' }] },
  { id: 'ben-gil', label: 'Ben & Gil', mode: 'multiplayer', participantCount: 2, description: 'Lets create a one simple way of', avatar: { variant: 'mp', members: [{ ...benAvatar, alt: 'Ben' }, { ...gilAvatar, alt: 'Gil' }] }, sessions: [{ id: 'design-review', label: 'Design review', count: '5 days' }] },
];
export const profileAvatar = avatar;
