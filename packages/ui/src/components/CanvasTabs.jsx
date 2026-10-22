import { useId, useLayoutEffect, useRef, useState } from 'react';
import { CanvasTabItem } from './CanvasTabItem.jsx';
import { IconButton } from './IconButton.jsx';
import { Icon } from './Icon.jsx';

/** Controlled or local selection; the consumer owns documents and canvas actions. */
export function CanvasTabs({ items = [], selectedId: selectedIdProp, defaultSelectedId, onSelect, onClose,
  onAdd, addButtonProps = {}, onExpand, onPanelToggle, expanded = false, panelOpen = false,
  addLabel = 'Add canvas tab', expandLabel = 'Expand canvas', collapseLabel = 'Restore canvas size',
  panelLabel = panelOpen ? 'Hide canvas panel' : 'Show canvas panel',
  'aria-label': label = 'Canvas tabs', className = '', ...props }) {
  const prefix = useId();
  const refs = useRef(new Map());
  const addButton = useRef(null);
  const pendingFocus = useRef(null);
  const [localSelectedId, setLocalSelectedId] = useState(defaultSelectedId ?? items.find(item => !item.disabled)?.id);
  const requested = selectedIdProp === undefined ? localSelectedId : selectedIdProp;
  const selectedId = items.some(item => item.id === requested && !item.disabled) ? requested : items.find(item => !item.disabled)?.id;
  useLayoutEffect(() => {
    if (pendingFocus.current) {
      (refs.current.get(pendingFocus.current.id) ?? addButton.current)?.focus();
      pendingFocus.current = null;
    }
  }, [items]);
  function select(id, focus = false) {
    if (selectedIdProp === undefined) setLocalSelectedId(id);
    onSelect?.(id);
    if (focus) refs.current.get(id)?.focus();
  }
  function close(item, event) {
    const index = items.indexOf(item);
    const next = items.slice(index + 1).find(row => !row.disabled) ?? items.slice(0, index).reverse().find(row => !row.disabled);
    pendingFocus.current = { id: item.id === selectedId ? next?.id : selectedId };
    if (item.id === selectedId && next) select(next.id);
    onClose?.(item.id, event);
  }
  function navigate(event, item) {
    const enabled = items.filter(row => !row.disabled);
    const index = enabled.findIndex(row => row.id === item.id);
    const next = event.key === 'ArrowRight' ? enabled[(index + 1) % enabled.length]
      : event.key === 'ArrowLeft' ? enabled[(index - 1 + enabled.length) % enabled.length]
      : event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : null;
    if (next) { event.preventDefault(); select(next.id, true); }
    if (event.key === 'Delete' && onClose && item.closable !== false) { event.preventDefault(); close(item, event); }
  }
  return <div {...props} className={['computer-canvas-tabs', className].filter(Boolean).join(' ')}>
    <div className="computer-canvas-tabs__leading">
      <div role="tablist" aria-label={label} className="computer-canvas-tabs__list">
        {items.map(item => <CanvasTabItem key={item.id} id={item.tabId ?? `${prefix}-${encodeURIComponent(item.id)}`} controls={item.panelId}
          tabRef={node => { if (node) refs.current.set(item.id, node); else refs.current.delete(item.id); }}
          label={item.label} selected={item.id === selectedId} disabled={item.disabled} tabIndex={item.id === selectedId ? 0 : -1}
          onSelect={() => select(item.id)} onClose={onClose && item.closable !== false ? event => close(item, event) : undefined}
          onKeyDown={event => navigate(event, item)} />)}
      </div>
      <div className="computer-canvas-tabs__add"><IconButton ref={addButton} label={addLabel} disabled={!onAdd && !addButtonProps.popoverTarget && !addButtonProps.onClick}
        {...addButtonProps} onClick={onAdd ?? addButtonProps.onClick}><Icon name="canvasAdd" /></IconButton></div>
    </div>
    <div className="computer-canvas-tabs__actions" role="group" aria-label="Canvas actions">
      <IconButton label={expanded ? collapseLabel : expandLabel} pressed={expanded} disabled={!onExpand} onClick={onExpand}>
        <Icon name={expanded ? 'min' : 'canvasExpand'} size={expanded ? 16 : 20} />
      </IconButton>
      <IconButton label={panelLabel} pressed={panelOpen} disabled={!onPanelToggle} onClick={onPanelToggle}><Icon name="canvasPanel" /></IconButton>
    </div>
  </div>;
}
