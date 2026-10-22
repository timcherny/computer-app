import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChatTopbar } from './ChatTopbar.jsx';
import { MessageInput } from './MessageInput.jsx';
import { MessageItem } from './MessageItem.jsx';
import { PropertiesNav } from './PropertiesNav.jsx';

/** A scrollable thread with a fixed header and composer. The host owns messages. */
export function ChatWindow({ title = 'Computer', subtitle, avatar, messages = [], inputValue, onInputChange, onSend,
  onAddAction, inputProps, topbarProps, placeholder, disabled = false,
  propertiesSections = [], propertiesHeader, propertiesOpen: controlledPropertiesOpen, defaultPropertiesOpen = false, onPropertiesOpenChange,
  className = '', ...props }) {
  const root = useRef(null);
  const panel = useRef(null);
  const panelButton = useRef(null);
  const panelId = useId();
  const [localPropertiesOpen, setLocalPropertiesOpen] = useState(defaultPropertiesOpen);
  const propertiesOpen = controlledPropertiesOpen ?? localPropertiesOpen;
  const hasProperties = propertiesSections.some(section => section.items?.length);
  function setPropertiesOpen(value) {
    if (controlledPropertiesOpen === undefined) setLocalPropertiesOpen(value);
    onPropertiesOpenChange?.(value);
  }
  function dismissProperties() {
    if (panel.current?.contains(document.activeElement)) panelButton.current?.focus();
    setPropertiesOpen(false);
  }
  useEffect(() => {
    if (!propertiesOpen || !hasProperties) return;
    function outside(event) {
      if (root.current?.clientWidth < 1000 && !panel.current?.contains(event.target) && !panelButton.current?.contains(event.target)) setPropertiesOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [propertiesOpen, hasProperties, controlledPropertiesOpen, onPropertiesOpenChange]);
  const scroll = useRef(null);
  const content = useRef(null);
  const pinned = useRef(true);
  const previous = useRef(null);
  useLayoutEffect(() => {
    const last = messages.at(-1);
    if (previous.current === null || pinned.current || (last?.id !== previous.current && last?.type === 'me')) {
      if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
    }
    previous.current = last?.id ?? null;
  }, [messages]);
  useLayoutEffect(() => {
    if (!scroll.current || !content.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => { if (pinned.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; });
    observer.observe(scroll.current);
    observer.observe(content.current);
    return () => observer.disconnect();
  }, []);
  return <section {...props} ref={root} data-properties-open={hasProperties && propertiesOpen || undefined} className={['computer-chat-window', className].filter(Boolean).join(' ')} aria-label={`${title} chat`}
    onKeyDown={event => { props.onKeyDown?.(event); if (!event.defaultPrevented && event.key === 'Escape' && propertiesOpen && hasProperties) { event.preventDefault(); dismissProperties(); } }}>
    <ChatTopbar {...topbarProps} title={title} subtitle={subtitle} avatar={avatar}
      onPropertiesToggle={hasProperties ? () => setPropertiesOpen(!propertiesOpen) : undefined} propertiesOpen={propertiesOpen}
      panelButtonProps={{ ref: panelButton, 'aria-controls': panelId }}
      className={['computer-chat-window__topbar', topbarProps?.className].filter(Boolean).join(' ')} />
    <div className="computer-chat-window__body">
    <div className="computer-chat-window__thread">
    <div className="computer-chat-window__scroll" ref={scroll} tabIndex={0} aria-label="Conversation history"
      onScroll={() => { const el = scroll.current; pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
      <div className="computer-chat-window__history-content">
      <div className="computer-chat-window__messages" ref={content} role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions text">
        {messages.map(({ id, text, ...message }) => <MessageItem key={id} {...message}>{text}</MessageItem>)}
      </div>
      </div>
    </div>
    <div className="computer-chat-window__composer"><MessageInput introEnabled={messages.length === 0 || (inputProps?.group && !inputProps?.computerOnly)} {...inputProps} value={inputValue} onChange={onInputChange} onSend={onSend} onAddAction={onAddAction} placeholder={placeholder} disabled={disabled} /></div>
    </div>
    {hasProperties && <aside id={panelId} ref={panel} hidden={!propertiesOpen} className="computer-chat-window__properties" aria-label="Properties panel">
      <PropertiesNav sections={propertiesSections} header={{title, avatar, ...propertiesHeader}} />
    </aside>}
    </div>
  </section>;
}
