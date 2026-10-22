import { Text } from '@computer/ui';

export const chatMessages = [
  { id: 'notice', type: 'notification', text: 'Today, 9:41 AM' },
  { id: 'intro', type: 'person', name: 'Computer', avatar: {variant: 'computer'}, text: 'Morning, Tim. Here’s what’s on your list today:\n\n• Review Maya’s comments in the Onboarding brief.\n• Update the prototype for your 3 pm design review.\n• Add the decisions from the review to the Handoff notes for Alex.' },
  { id: 'tim', type: 'me', text: 'Let’s start with Maya’s feedback. What’s on her mind?' },
  { id: 'feedback', type: 'person', name: 'Computer', avatar: {variant: 'computer'}, text: 'She thinks we’re asking for too much information upfront. She’s suggested moving the profile questions until after signup.' },
  { id: 'reply', type: 'me', text: 'Makes sense. Open the brief so we can work through her notes.' },
];

export function ChatThemes({ children }) {
  return <div className="theme-comparison">{['light','dark'].map(theme => <section key={theme} data-theme={theme} className="foundation-panel">
    <div className="foundation-heading"><Text as="h2" variant="prose">{theme === 'light' ? 'Light' : 'Dark'}</Text></div>
    {children}
  </section>)}</div>;
}
