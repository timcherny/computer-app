import test from 'node:test';
import assert from 'node:assert/strict';
import { canvasReducer as reduce, canvasForChat, normalizeCanvasState } from './canvasState.js';
import { propertiesForChat } from './properties.js';

const open = (state, pageId, chatId = 'computer') => reduce(state, { type: 'open-page', chatId, pageId });
test('opening an existing page selects its tab without duplicating or reordering it', () => {
  const state = open(open(open({}, 'inbox'), 'goals'), 'inbox');
  assert.deepEqual(state.computer.tabIds, ['inbox', 'goals']);
  assert.equal(state.computer.selectedId, 'inbox');
  assert.equal(state.computer.open, true);
  assert.equal(open(state, 'unknown'), state);
});
test('canvas visibility and selected tabs are independent per chat', () => {
  const gilPage = propertiesForChat('gil')[0].items[0].id;
  const state = open(open({}, 'goals'), gilPage, 'gil');
  const closed = reduce(state, { type: 'close', chatId: 'computer' });
  assert.equal(closed.gil, state.gil);
  assert.equal(closed.gil.open, true);
  assert.equal(closed.computer.open, false);
  assert.deepEqual(closed.computer.tabIds, ['goals']);
  const reopened = reduce(closed, { type: 'reopen', chatId: 'computer' });
  assert.equal(reopened.computer.selectedId, 'goals');
  assert.equal(reopened.computer.open, true);
});
test('closing active, inactive and final tabs keeps a valid selection', () => {
  let state = open(open(open({}, 'inbox'), 'agents'), 'goals');
  state = reduce(state, { type: 'close-tab', chatId: 'computer', pageId: 'agents' });
  assert.equal(state.computer.selectedId, 'goals');
  state = reduce(state, { type: 'close-tab', chatId: 'computer', pageId: 'goals' });
  assert.equal(state.computer.selectedId, 'inbox');
  state = reduce(state, { type: 'close-tab', chatId: 'computer', pageId: 'inbox' });
  assert.deepEqual(state.computer, { open: false, expanded: false, chatSelected: false, tabIds: [], selectedId: null });
  assert.equal(reduce(state, { type: 'reopen', chatId: 'computer' }), state);
});
test('reload preserves remembered tabs and rejects stale pages, chats and malformed data', () => {
  const state = reduce(open(open({}, 'inbox'), 'reports'), { type: 'close', chatId: 'computer' });
  assert.deepEqual(normalizeCanvasState(JSON.parse(JSON.stringify({ version: 1, chats: state })), ['computer']), state);
  assert.deepEqual(normalizeCanvasState({ version: 1, chats: {
    computer: { tabIds: ['inbox', 'inbox', 'gone'], selectedId: 'gone', open: true },
    removed: { tabIds: ['goals'], open: true },
  } }, ['computer']), { computer: { tabIds: ['inbox'], selectedId: 'inbox', open: true, expanded: false, chatSelected: false } });
  assert.deepEqual(normalizeCanvasState(null, ['computer']), {});
  assert.deepEqual(normalizeCanvasState({ version: 2, chats: state }, ['computer']), {});
});
test('closing canvas restores size while retaining tabs; reset clears every canvas', () => {
  let state = reduce(open({}, 'goals'), { type: 'toggle-expanded', chatId: 'computer' });
  assert.equal(state.computer.expanded, true);
  state = reduce(state, { type: 'close', chatId: 'computer' });
  assert.equal(state.computer.expanded, false);
  assert.deepEqual(state.computer.tabIds, ['goals']);
  assert.deepEqual(reduce(state, { type: 'reset' }), {});
  assert.equal(canvasForChat({}, 'computer').open, false);
});

 test('expanded Chat tab preserves the last page and survives reload per chat', () => {
  let state = open({}, 'goals');
  assert.equal(reduce(state, { type: 'select-chat', chatId: 'computer' }), state);
  state = reduce(state, { type: 'toggle-expanded', chatId: 'computer' });
  state = reduce(state, { type: 'select-chat', chatId: 'computer' });
  assert.equal(state.computer.chatSelected, true);
  assert.equal(state.computer.selectedId, 'goals');
  assert.deepEqual(state.computer.tabIds, ['goals']);
  assert.deepEqual(normalizeCanvasState({ version: 1, chats: state }, ['computer']), state);
  assert.equal(canvasForChat(state, 'gil').chatSelected, false);
  const page = reduce(state, { type: 'select-tab', chatId: 'computer', pageId: 'goals' });
  assert.equal(page.computer.chatSelected, false);
  const restored = reduce(state, { type: 'toggle-expanded', chatId: 'computer' });
  assert.equal(restored.computer.chatSelected, false);
  assert.equal(restored.computer.selectedId, 'goals');
  const closed = reduce(state, { type: 'close', chatId: 'computer' });
  assert.equal(closed.computer.chatSelected, false);
});
