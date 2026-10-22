import { propertiesForChat } from './properties.js';

export const CANVAS_STORAGE_KEY = 'computer.canvas.v1';
const emptyChat = { open: false, expanded: false, chatSelected: false, tabIds: [], selectedId: null };
export function canvasForChat(state, chatId) {
  return Object.hasOwn(state, chatId) ? state[chatId] : emptyChat;
}
export function normalizeCanvasState(saved, chatIds) {
  if (saved?.version !== 1 || !saved.chats || typeof saved.chats !== 'object') return {};
  return Object.fromEntries(chatIds.flatMap(chatId => {
    const entry = Object.hasOwn(saved.chats, chatId) ? saved.chats[chatId] : null;
    if (!entry || typeof entry !== 'object') return [];
    const pages = new Set(propertiesForChat(chatId).flatMap(section => section.items.map(item => item.id)));
    const tabIds = [...new Set(Array.isArray(entry.tabIds) ? entry.tabIds.filter(id => pages.has(id)) : [])];
    return [[chatId, { tabIds, selectedId: tabIds.includes(entry.selectedId) ? entry.selectedId : tabIds[0] ?? null,
      open: entry.open === true && tabIds.length > 0, expanded: entry.expanded === true && entry.open === true && tabIds.length > 0,
      chatSelected: entry.chatSelected === true && entry.expanded === true && entry.open === true && tabIds.length > 0 }]];
  }));
}
export function loadCanvasState(chatIds) {
  try { return normalizeCanvasState(JSON.parse(localStorage.getItem(CANVAS_STORAGE_KEY)), chatIds); }
  catch { return {}; }
}
export function saveCanvasState(state) {
  try { localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify({ version: 1, chats: state })); }
  catch { /* Canvas tabs remain available in memory when storage is unavailable. */ }
}
export function canvasReducer(state, action) {
  if (action.type === 'reset') return {};
  const current = canvasForChat(state, action.chatId);
  let next;
  switch (action.type) {
    case 'open-page': {
      const exists = propertiesForChat(action.chatId).some(section => section.items.some(item => item.id === action.pageId));
      if (!exists) return state;
      next = { ...current, open: true, chatSelected: false, selectedId: action.pageId,
        tabIds: current.tabIds.includes(action.pageId) ? current.tabIds : [...current.tabIds, action.pageId] };
      break;
    }
    case 'select-tab':
      if (!current.tabIds.includes(action.pageId)) return state;
      next = { ...current, chatSelected: false, selectedId: action.pageId }; break;
    case 'select-chat':
      if (!current.open || !current.expanded) return state;
      next = { ...current, chatSelected: true }; break;
    case 'close-tab': {
      const index = current.tabIds.indexOf(action.pageId);
      if (index < 0) return state;
      const tabIds = current.tabIds.filter(id => id !== action.pageId);
      next = { ...current, tabIds,
        selectedId: current.selectedId === action.pageId ? tabIds[index] ?? tabIds.at(-1) ?? null : current.selectedId,
        open: current.open && tabIds.length > 0, expanded: current.expanded && tabIds.length > 0,
        chatSelected: current.chatSelected && tabIds.length > 0 };
      break;
    }
    case 'close': next = { ...current, open: false, expanded: false, chatSelected: false }; break;
    case 'reopen':
      if (!current.tabIds.length) return state;
      next = { ...current, open: true }; break;
    case 'toggle-expanded': next = { ...current, expanded: !current.expanded, chatSelected: false }; break;
    default: return state;
  }
  return { ...state, [action.chatId]: next };
}
