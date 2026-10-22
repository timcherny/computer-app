// Local prototype page identities shared by properties navigation and canvas tabs.
const computerPages = [
  { id: 'inbox', label: 'Inbox', trailingLabel: '3' },
  { id: 'agents', label: 'Agents', trailingLabel: '2' },
  { id: 'goals', label: 'Goals', trailingLabel: '3' },
  { id: 'reports', label: 'Reports', trailingLabel: '4' },
];

const pageNamesByChat = {
  'date-0': ['Today’s plan', 'Maya’s feedback'],
  'date-1': ['Review preparation'],
  'date-2': ['Onboarding exploration', 'Success criteria'],
  gil: ['Signup comparison', 'Welcome states'],
  'computer-team': ['Onboarding brief', 'Team decisions', 'Handoff notes'],
  onboarding: ['Profile setup'],
  'ben-gil': ['Review agenda', 'Open questions'],
  'design-review': ['Review feedback', 'Decisions log', 'Next steps'],
};

export function propertiesForChat(chatId) {
  const names = pageNamesByChat[chatId] ?? ['Working notes'];
  const items = chatId === 'computer' ? computerPages : names.map((label, index) => ({
    id: `${chatId}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`,
    label,
    trailingLabel: String([3, 2, 1][index]),
  }));
  return [{ id: 'pages', title: 'Pages', items }];
}
