import { useEffect, useId, useRef, useState } from 'react';
import { MessageGradient } from './MessageGradient.jsx';
import computer from '../assets/message-input/computer.svg';
import { MessageInput } from './MessageInput.jsx';
import { Tag } from './Tag.jsx';
import { CanvasTabs } from './CanvasTabs.jsx';
import { Text } from './Text.jsx';

/** Title-only document canvas. The consumer owns tabs, visibility and persistence. */
export function CanvasWindow({ items = [], selectedId, onSelect, onCloseTab, onClose, onExpand, expanded = false,
  onAdd, addButtonProps, titleRef, cursorLabel, onCanvasSend, className = '', ...props }) {
  const prefix = useId();
  const [cursor, setCursor] = useState(null);
  const cursorTag = useRef(null);
  const [composer, setComposer] = useState(null);
  const [canvasDraft, setCanvasDraft] = useState('');
  const [cursorComputer, setCursorComputer] = useState(false);
  const cursorVisible = Boolean(cursor && cursorLabel && !composer);
  useEffect(() => {
    if (!cursorVisible) { setCursorComputer(false); return; }
    const toggle = event => {
      if (event.key !== 'Tab' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey || event.repeat || event.defaultPrevented) return;
      // Pointer presence owns this shortcut even if a chat/control still has focus.
      event.preventDefault();
      event.stopPropagation();
      setCursorComputer(value => !value);
    };
    document.addEventListener('keydown', toggle, true);
    return () => document.removeEventListener('keydown', toggle, true);
  }, [cursorVisible]);
  useEffect(() => {
    const hide = () => setCursor(null);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', hide); document.removeEventListener('visibilitychange', hide); };
  }, []);
  useEffect(() => { setCursor(null); setComposer(null); setCanvasDraft(''); }, [selectedId, expanded, cursorLabel]);
  const followCursor = event => {
    if (!cursorLabel || composer || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const width = cursorTag.current?.offsetWidth ?? 40;
    const height = cursorTag.current?.offsetHeight ?? 20;
    setCursor({
      x: Math.max(bounds.left, Math.min(event.clientX + 12, bounds.right - width)),
      y: Math.max(bounds.top, Math.min(event.clientY + 16, bounds.bottom - height)),
    });
  };
  const placeComposer = event => {
    if (!cursorComputer || !cursorLabel || composer || event.button !== 0) return;
    if (event.target.closest('button,a,input,textarea,[contenteditable="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    const body = event.currentTarget;
    const bounds = body.getBoundingClientRect();
    setComposer({ x: event.clientX - bounds.left + body.scrollLeft, y: Math.max(8, Math.min(event.clientY - bounds.top, body.clientHeight - 60)) + body.scrollTop });
    setCursor(null);
    setCursorComputer(false);
  };
  const tabs = items.map(item => ({ ...item, tabId: item.tabId ?? `${prefix}-tab-${encodeURIComponent(item.id)}`, panelId: item.externalPanelId ?? `${prefix}-page-${encodeURIComponent(item.id)}` }));
  const active = tabs.find(item => item.id === selectedId) ?? tabs[0];
  return <section {...props} aria-label="Canvas window" className={['computer-canvas-window', className].filter(Boolean).join(' ')}>
    <CanvasTabs items={tabs} selectedId={active?.id} onSelect={onSelect} onClose={onCloseTab} onAdd={onAdd}
      addButtonProps={addButtonProps} onExpand={onExpand} expanded={expanded} onPanelToggle={onClose} panelLabel="Close canvas" />
    {active && !active.externalPanelId && <div className="computer-canvas-window__body" onPointerDownCapture={placeComposer} onPointerEnter={followCursor} onPointerMove={followCursor} onPointerLeave={() => setCursor(null)} onPointerCancel={() => setCursor(null)} onScroll={() => setCursor(null)} role="tabpanel" id={active.panelId} aria-labelledby={active.tabId}>
      {cursorVisible && <span ref={cursorTag} className="computer-canvas-window__cursor-tag" aria-hidden="true" style={{ left: cursor.x, top: cursor.y }}>{cursorComputer ? <span className="computer-canvas-window__cursor-computer"><MessageGradient loop duration={5} /><img src={computer} alt="" /></span> : <Tag>{cursorLabel}</Tag>}</span>}
      {composer && <div className="computer-canvas-window__composer" style={{ '--canvas-input-x': `${composer.x}px`, top: composer.y }} onBlur={event => {
        const container = event.currentTarget;
        if (container.contains(event.relatedTarget)) return;
        // Popover actions can restore focus synchronously after closing.
        queueMicrotask(() => { if (container.isConnected && !container.contains(document.activeElement)) setComposer(null); });
      }} onKeyDown={event => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.target.closest('[role="menu"]')) { event.preventDefault(); setComposer(null); }
      }}>
        <MessageInput autoFocus computerOnly introEnabled={false} aria-label="Message Computer on canvas" value={canvasDraft} onChange={event => setCanvasDraft(event.target.value)}
          onSend={(text, event, metadata) => {
            if (!onCanvasSend) return;
            onCanvasSend(text, event, { ...metadata, pageId: active.id, position: composer });
            setCanvasDraft('');
            setComposer(null);
          }} />
      </div>}
      <div className="computer-canvas-window__content"><Text as="h1" variant="heading" tone="heading"
        ref={titleRef} tabIndex={-1} className="computer-canvas-window__title">{active.label}</Text></div>
    </div>}
  </section>;
}
