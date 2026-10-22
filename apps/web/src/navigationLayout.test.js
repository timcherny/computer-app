import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNavigationLayout, moveNavigationItem } from './navigationLayout.js';

test('moves a chat to the top and back without losing other chats', () => {
  const original = { top: [], recent: ['gil', 'team', 'ben'] };
  const pinned = moveNavigationItem(original, 'team', 'top');
  assert.deepEqual(pinned, { top: ['team'], recent: ['gil', 'ben'] });
  assert.deepEqual(moveNavigationItem(pinned, 'team', 'recent', 'ben'), original);
  assert.deepEqual(original.top, []);
});

test('reorders within a section and ignores dropping onto itself', () => {
  const layout = { top: ['gil', 'team'], recent: ['ben'] };
  assert.deepEqual(moveNavigationItem(layout, 'team', 'top', 'gil').top, ['team', 'gil']);
  assert.equal(moveNavigationItem(layout, 'gil', 'top', 'gil'), layout);
});

test('restores saved placement while removing duplicates and adding new chats', () => {
  const saved = { top: ['team', 'removed', 'team'], recent: ['team', 'gil'] };
  const layout = normalizeNavigationLayout(JSON.parse(JSON.stringify(saved)), ['gil', 'team', 'ben']);
  assert.deepEqual(layout, { top: ['team'], recent: ['gil', 'ben'] });
  assert.deepEqual(normalizeNavigationLayout(null, ['gil', 'team']), { top: [], recent: ['gil', 'team'] });
});

test('rejects foreign IDs and invalid destinations', () => {
  const layout = { top: [], recent: ['gil'] };
  assert.equal(moveNavigationItem(layout, 'computer', 'top'), layout);
  assert.equal(moveNavigationItem(layout, 'gil', 'unknown'), layout);
});
