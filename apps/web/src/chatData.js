import { computerItem, dateItems, recentItems, gilAvatar, benAvatar } from './navigation.js';

export const CHAT_STORAGE_KEY = 'computer.chat-prototype.v1';
const knownIds = new Set([computerItem.id, ...dateItems.map(item => item.id), ...recentItems.flatMap(item => [item.id, ...(item.sessions || []).map(session => session.id)])]);
const morningMessages = [
  { id: 'intro', type: 'person', name: 'Computer', avatar: { variant: 'computer' }, text: 'Morning, Tim. Here’s what’s on your list today:\n\n• Review Maya’s comments in the Onboarding brief.\n• Update the prototype for your 3 pm design review.\n• Add the decisions from the review to the Handoff notes for Alex.' },
  { id: 'tim', type: 'me', text: 'Let’s start with Maya’s feedback. What’s on her mind?' },
  { id: 'feedback', type: 'person', name: 'Computer', avatar: { variant: 'computer' }, text: 'She thinks we’re asking for too much information upfront. She’s suggested moving the profile questions until after signup.' },
  { id: 'reply', type: 'me', text: 'Makes sense. Open the brief so we can work through her notes.' },
];

// Dialogue is saved fictional prototype copy, not instructions or live activity.
const conversationSeeds = {
  computer: morningMessages,
  'date-0': morningMessages,
  'date-1': [
    { id: 'yesterday-question', type: 'me', text: 'What should I have ready for the onboarding review?' },
    { id: 'yesterday-plan', type: 'person', name: 'Computer', text: 'The current flow, Maya’s comments in the Onboarding brief, and a shorter signup option to compare.' },
    { id: 'yesterday-scope', type: 'me', text: 'Let’s keep the comparison focused on when we ask the profile questions.' },
    { id: 'yesterday-next', type: 'person', name: 'Computer', text: 'A side-by-side view would work well: profile questions during signup, then the same questions after signup.' },
  ],
  'date-2': [
    { id: 'april-start', type: 'me', text: 'I’m starting to explore a simpler onboarding flow.' },
    { id: 'april-question', type: 'person', name: 'Computer', text: 'What should someone be able to do before they fill out their profile?' },
    { id: 'april-goal', type: 'me', text: 'Get into the product and see something useful. The profile can come later.' },
    { id: 'april-direction', type: 'person', name: 'Computer', text: 'That gives us a clear starting point: a short signup, a useful first screen, and profile details when they’re needed.' },
  ],
  gil: [
    { id: 'gil-question', type: 'person', name: 'Gil', text: 'How’s the onboarding prototype coming along?' },
    { id: 'gil-update', type: 'me', text: 'I’m trying a shorter signup. Maya suggested moving the profile questions until after it.' },
    { id: 'gil-suggestion', type: 'person', name: 'Gil', text: 'Makes sense. Can we compare both versions in the review?' },
    { id: 'gil-plan', type: 'me', text: 'Yes, I’ll bring both flows to the 3 pm review.' },
    { id: 'gil-first-screen', type: 'person', name: 'Gil', text: 'What do people see right after they finish the shorter signup?' },
    { id: 'gil-first-screen-reply', type: 'me', text: 'A simple welcome screen with one clear next step. I want them to try the product before we ask for anything else.' },
    { id: 'gil-empty-state', type: 'person', name: 'Gil', text: 'That sounds right. The empty state will matter a lot if they haven’t added any details yet.' },
    { id: 'gil-empty-state-reply', type: 'me', text: 'I’m working through three states:\n\n• Just signed up\n• Started profile setup\n• Skipped profile setup' },
    { id: 'gil-skip', type: 'person', name: 'Gil', text: 'Can they come back to profile setup later without losing where they were?' },
    { id: 'gil-skip-reply', type: 'me', text: 'That’s the idea. I’m showing a small reminder on the welcome screen, rather than blocking the next step.' },
    { id: 'gil-reminder', type: 'person', name: 'Gil', text: 'Keep the reminder quiet. It should feel like something useful they can do when they’re ready.' },
    { id: 'gil-reminder-reply', type: 'me', text: 'Agreed. I’ll try “Finish your profile” with a short explanation of why it helps.' },
    { id: 'gil-required', type: 'person', name: 'Gil', text: 'Which details are still required during signup?' },
    { id: 'gil-required-reply', type: 'me', text: 'For this version, just what’s needed to create the account. The rest stays in profile setup. I’ll check the exact requirements with Alex in the review.' },
    { id: 'gil-comparison', type: 'person', name: 'Gil', text: 'It would help to see the old and new flows next to each other, with the moved questions marked.' },
    { id: 'gil-comparison-reply', type: 'me', text: 'I’ll use the same example in both so we can compare the steps without getting distracted by different content.' },
    { id: 'gil-review-order', type: 'person', name: 'Gil', text: 'Nice. Start with the goal, then show the shorter path, and finish with the cases we still need to resolve.' },
    { id: 'gil-review-order-reply', type: 'me', text: 'My outline is:\n\n1. Why we’re shortening signup\n2. Current flow versus the new option\n3. The first screen and skipped profile state\n4. Open questions for Maya and Alex' },
    { id: 'gil-ready', type: 'person', name: 'Gil', text: 'That covers it. Leave a little time at the end to agree on what goes into the Handoff notes.' },
    { id: 'gil-ready-reply', type: 'me', text: 'Will do. I’ll bring this version to the review and capture the decisions afterward.' },
  ],
  'computer-team': [
    { id: 'team-feedback', type: 'personWithAvatarAndName', name: 'Maya', avatar: { initial: 'M' }, text: 'I’ve left a few comments in the Onboarding brief. The profile questions feel a little early.' },
    { id: 'team-option', type: 'me', text: 'I’m exploring a version that moves them until after signup.' },
    { id: 'team-engineering', type: 'personWithAvatarAndName', name: 'Alex', avatar: { initial: 'A' }, text: 'Could you show where those questions would appear later? That will help us talk through the implementation.' },
    { id: 'team-next', type: 'me', text: 'I’ll include that in the prototype and bring it to the review.' },
  ],
  onboarding: [
    { id: 'onboarding-focus', type: 'personWithAvatarAndName', name: 'Maya', avatar: { initial: 'M' }, text: 'For this review, let’s focus on how quickly someone can get through signup.' },
    { id: 'onboarding-proposal', type: 'me', text: 'The shorter version asks for the essentials first, then introduces profile setup inside the product.' },
    { id: 'onboarding-question', type: 'personWithAvatarAndName', name: 'Alex', avatar: { initial: 'A' }, text: 'What happens if someone skips profile setup completely?' },
    { id: 'onboarding-followup', type: 'me', text: 'Good question. I’ll show the skipped state alongside the completed one.' },
  ],
  'ben-gil': [
    { id: 'ben-gil-check', type: 'personWithAvatarAndName', name: 'Ben', avatar: { initial: 'B' }, text: 'Are we still looking at the onboarding flow this afternoon?' },
    { id: 'ben-gil-time', type: 'me', text: 'Yes, at 3 pm. I’ll bring the current flow and the shorter signup option.' },
    { id: 'ben-gil-focus', type: 'personWithAvatarAndName', name: 'Gil', avatar: recentItems.find(item => item.id === 'gil').avatar, text: 'Let’s start with the first screen after signup. It’ll help explain why we’re moving the profile questions.' },
    { id: 'ben-gil-next', type: 'me', text: 'Sounds good. I’ll put that screen first in the walkthrough.' },
  ],
  'design-review': [
    { id: 'review-agenda', type: 'me', text: 'For the design review: compare signup, walk through the first screen, then look at profile setup.' },
    { id: 'review-gil', type: 'personWithAvatarAndName', name: 'Gil', avatar: recentItems.find(item => item.id === 'gil').avatar, text: 'Can we include the empty state too? That’s where the shorter flow needs to make sense.' },
    { id: 'review-ben', type: 'personWithAvatarAndName', name: 'Ben', avatar: { initial: 'B' }, text: 'And let’s keep a short list of open questions for Alex.' },
    { id: 'review-next', type: 'me', text: 'Agreed. After the review, I’ll add the decisions and open questions to the Handoff notes.' },
  ],
};

export function seedMessages(id) {
  if (!Object.hasOwn(conversationSeeds, id)) return [];
  return conversationSeeds[id].map(message => {
    if (message.name === 'Gil') return { ...message, senderId: 'gil', avatar: gilAvatar };
    if (message.name === 'Ben') return { ...message, senderId: 'ben', avatar: benAvatar };
    return message;
  });
}

// Mirrors Computer's presentThreadMessages: group names appear once per sender streak.
export function presentMessages(conversation, messages) {
  let previousSender = null;
  return messages.map(message => {
    if (!['person', 'personWithAvatar', 'personWithAvatarAndName'].includes(message.type)) {
      previousSender = null;
      return message;
    }
    if (conversation.mode !== 'multiplayer') return { ...message, type: 'person' };
    const sender = message.senderId || message.name;
    const type = sender && sender === previousSender ? 'personWithAvatar' : 'personWithAvatarAndName';
    previousSender = sender;
    return { ...message, type };
  });
}

export function conversationPreview(id, state) {
  const lastMessage = state.sent[id]?.at(-1) ?? seedMessages(id).at(-1);
  return lastMessage?.text.replace(/\s+/g, ' ').trim();
}

export function conversationFor(id, custom) {
  const local = custom.find(item => item.id === id);
  if (local) return { ...local, avatar: { variant: 'computer' } };
  if (id === 'computer') return { ...computerItem, avatar: { variant: 'computer' } };
  const date = dateItems.find(item => item.id === id);
  if (date) return { ...date, label: `Computer · ${date.label}`, avatar: { variant: 'computer' } };
  for (const item of recentItems) {
    if (item.id === id) return item;
    const session = item.sessions?.find(row => row.id === id);
    if (session) return { ...session, avatar: item.avatar, mode: item.mode, participantCount: item.participantCount };
  }
  return { ...computerItem, avatar: { variant: 'computer' } };
}

export function defaultChatState() {
  return { currentId: 'computer', custom: [], sent: {}, drafts: {} };
}

export function initialChatState() {
  const empty = defaultChatState();
  try {
    const data = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY));
    if (!data || data.version !== 1) return empty;
    const custom = Array.isArray(data.custom) ? data.custom.filter(item => item &&
      /^local-[a-zA-Z0-9-]+$/.test(item.id) && typeof item.label === 'string')
      .filter((item, index, all) => all.findIndex(other => other.id === item.id) === index)
      .map(({ id, label }) => ({ id, label: label.slice(0, 80) || 'New chat' })) : [];
    const ids = new Set([...knownIds, ...custom.map(item => item.id)]);
    const sent = {}, drafts = {};
    for (const id of ids) {
      if (Array.isArray(data.sent?.[id])) sent[id] = data.sent[id]
        .filter(row => row && typeof row.id === 'string' && typeof row.text === 'string' && row.text.trim())
        .filter((row, index, all) => all.findIndex(other => other.id === row.id) === index)
        .map(({ id: messageId, text }) => ({ id: messageId, type: 'me', text }));
      if (typeof data.drafts?.[id] === 'string') drafts[id] = data.drafts[id];
    }
    return { currentId: ids.has(data.currentId) ? data.currentId : 'computer', custom, sent, drafts };
  } catch { return empty; }
}

export function saveChatState(state) {
  try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ ...state, version: 1 })); } catch {
    // The current session remains usable when storage is unavailable or full.
  }
}

export function chatReducer(state, action) {
  switch (action.type) {
    case 'reset': return defaultChatState();
    case 'select': return { ...state, currentId: action.id };
    case 'draft': return { ...state, drafts: { ...state.drafts, [action.id]: action.text } };
    case 'new': return { ...state, currentId: action.id, custom: [{ id: action.id, label: 'New chat' }, ...state.custom] };
    case 'send': {
      const text = action.text.trim();
      if (!text) return state;
      const sent = state.sent[action.id] || [];
      return { ...state, sent: { ...state.sent, [action.id]: [...sent, { id: action.messageId, type: 'me', text }] },
        drafts: { ...state.drafts, [action.id]: '' },
        custom: state.custom.map(item => item.id === action.id && !sent.length ? { ...item, label: text.replace(/\s+/g, ' ').slice(0, 48) } : item) };
    }
    default: return state;
  }
}
