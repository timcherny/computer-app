export const navigationLayoutKey = 'computer.navigation-layout';

export function normalizeNavigationLayout(saved, ids) {
  const seen = new Set();
  const take = values => (Array.isArray(values) ? values : []).filter(id => {
    if (!ids.includes(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const top = take(saved?.top);
  const recent = take(saved?.recent);
  return { top, recent: [...recent, ...ids.filter(id => !seen.has(id))] };
}

export function moveNavigationItem(layout, id, section, beforeId = null) {
  if (!['top', 'recent'].includes(section) || ![...layout.top, ...layout.recent].includes(id) || id === beforeId) return layout;
  const next = { top: layout.top.filter(value => value !== id), recent: layout.recent.filter(value => value !== id) };
  const index = next[section].indexOf(beforeId);
  next[section].splice(index < 0 ? next[section].length : index, 0, id);
  return next;
}
