import { useEffect, useId, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { CanvasWindow, ChatWindow, IconButton, Menu, NavItem, NavPanel } from '@computer/ui';
import { computerItem, dateItems, recentItems, profileAvatar } from './navigation.js';
import { chatReducer, conversationFor, conversationPreview, initialChatState, saveChatState, seedMessages, presentMessages } from './chatData.js';

import { navigationLayoutKey, normalizeNavigationLayout, moveNavigationItem } from './navigationLayout.js';
import { propertiesForChat } from './properties.js';
import { canvasForChat, canvasReducer, loadCanvasState, saveCanvasState } from './canvasState.js';

const navigationIds = recentItems.map(item => item.id);
function initialNavigationLayout() {
  try { return normalizeNavigationLayout(JSON.parse(localStorage.getItem(navigationLayoutKey)), navigationIds); }
  catch { return normalizeNavigationLayout(null, navigationIds); }
}

function initialTheme() {
  try {
    const saved = localStorage.getItem('computer.theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage can be unavailable in an embedded or private browser session.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeIcon({ theme }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {theme === 'light' ? <path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5 8.5 8.5 0 1 0 20.5 13.1Z" /> : <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>}
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [chat, dispatch] = useReducer(chatReducer, undefined, initialChatState);
  const [canvasState, dispatchCanvas] = useReducer(canvasReducer,
    ['computer', ...dateItems.map(item => item.id), ...recentItems.flatMap(item => [item.id, ...(item.sessions || []).map(session => session.id)]), ...chat.custom.map(item => item.id)], loadCanvasState);
  const [propertiesOpenByChat, setPropertiesOpenByChat] = useState({});
  const canvasTitle = useRef(null);
  const chatTabPrefix = useId();
  const chatPane = useRef(null);
  const workspace = useRef(null);
  const splitDrag = useRef(null);
  const [splitRatio, setSplitRatio] = useState(null);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [resizingSplit, setResizingSplit] = useState(false);
  const splitMax = Math.max(340, workspaceWidth - 320);
  const splitWidth = Math.min(splitMax, Math.max(340, splitRatio === null ? Math.min(480, workspaceWidth * 0.38) : workspaceWidth * splitRatio));
  useLayoutEffect(() => {
    const element = workspace.current;
    const observer = new ResizeObserver(() => setWorkspaceWidth(element.clientWidth));
    observer.observe(element);
    setWorkspaceWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);
  function resizeSplit(width) {
    if (workspaceWidth) setSplitRatio(Math.max(340, Math.min(splitMax, width)) / workspaceWidth);
  }
  function finishSplitDrag() {
    splitDrag.current = null;
    setResizingSplit(false);
  }
  const pendingCanvasFocus = useRef(false);
  const pendingChatFocus = useRef(false);
  useEffect(() => { saveCanvasState(canvasState); }, [canvasState]);
  const [resetCount, setResetCount] = useState(0);
  const [navigation, setNavigation] = useState(initialNavigationLayout);
  const [dropTarget, setDropTarget] = useState(null);
  const draggedChat = useRef(null);
  const suppressNavClick = useRef(0);
  const pendingNavigationFocus = useRef(null);
  const sidebar = useRef(null);
  const navigationToggle = useRef(null);
  const pendingSidebarFocus = useRef(false);
  const [draggingId, setDraggingId] = useState(null);
  const [navigationAnnouncement, setNavigationAnnouncement] = useState('');
  useEffect(() => {
    try { localStorage.setItem(navigationLayoutKey, JSON.stringify(navigation)); } catch { /* Placement still works without storage. */ }
  }, [navigation]);
  useLayoutEffect(() => {
    if (!pendingNavigationFocus.current) return;
    const row = [...sidebar.current.querySelectorAll('[data-chat-id]')].find(el => el.dataset.chatId === pendingNavigationFocus.current);
    (row?.querySelector('.computer-nav-item__action') ?? row?.querySelector('.computer-nav-item'))?.focus();
    pendingNavigationFocus.current = null;
  }, [navigation]);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 701px)').matches);
  useLayoutEffect(() => {
    if (pendingSidebarFocus.current) { navigationToggle.current?.focus(); pendingSidebarFocus.current = false; }
  }, [sidebarOpen]);
  const current = conversationFor(chat.currentId, chat.custom);
  const canvas = canvasForChat(canvasState, chat.currentId);
  const pages = propertiesForChat(chat.currentId).flatMap(section => section.items);
  const canvasItems = [
    ...(canvas.expanded ? [{ id: '__chat__', label: 'Chat', closable: false, tabId: `${chatTabPrefix}-tab`, externalPanelId: `${chatTabPrefix}-panel` }] : []),
    ...canvas.tabIds.map(id => pages.find(item => item.id === id)).filter(Boolean),
  ];
  const chatTabActive = canvas.open && canvas.expanded && canvas.chatSelected;
  const propertySections = propertiesForChat(chat.currentId).map(section => ({ ...section, items: section.items.map(item => ({
    ...item, selected: canvas.open && !chatTabActive && item.id === canvas.selectedId, onClick: () => openCanvasPage(item.id),
  })) }));
  const propertiesOpen = propertiesOpenByChat[chat.currentId] ?? false;
  function setPropertiesOpen(open) { setPropertiesOpenByChat(state => ({ ...state, [chat.currentId]: open })); }
  function openCanvasPage(pageId) {
    pendingCanvasFocus.current = true;
    dispatchCanvas({ type: 'open-page', chatId: chat.currentId, pageId });
    setPropertiesOpen(false);
  }
  function closeCanvas() {
    pendingChatFocus.current = true;
    dispatchCanvas({ type: 'close', chatId: chat.currentId });
    setPropertiesOpen(true);
  }
  function reopenCanvas() {
    pendingCanvasFocus.current = true;
    dispatchCanvas({ type: 'reopen', chatId: chat.currentId });
    setPropertiesOpen(false);
  }
  useLayoutEffect(() => {
    if (pendingCanvasFocus.current && canvas.open) { canvasTitle.current?.focus(); pendingCanvasFocus.current = false; }
    if (pendingChatFocus.current && (!canvas.open || chatTabActive)) { chatPane.current?.querySelector('textarea')?.focus(); pendingChatFocus.current = false; }
  }, [canvas, chat.currentId]);
  const sendMessage = text => dispatch({ type: 'send', id: chat.currentId, messageId: crypto.randomUUID(), text });
  const isComputerChat = chat.currentId === 'computer' || chat.currentId.startsWith('date-') || chat.currentId.startsWith('local-');
  const messages = presentMessages(current, [...seedMessages(chat.currentId), ...(chat.sent[chat.currentId] || [])]);
  useEffect(() => { saveChatState(chat); }, [chat]);
  function setCurrent(item) {
    dispatch({ type: 'select', id: item.id });
    if (window.matchMedia('(max-width: 700px)').matches) setSidebarOpen(false);
  }
  function newChat() {
    dispatch({ type: 'new', id: `local-${crypto.randomUUID()}` });
    setGroupExpanded('computer', true);
    if (window.matchMedia('(max-width: 700px)').matches) setSidebarOpen(false);
  }
  const [expanded, setExpanded] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatActionsOpen, setChatActionsOpen] = useState(false);
  const [canvasMenuOpen, setCanvasMenuOpen] = useState(false);
  const profileId = useId();
  const chatActionsId = useId();
  const canvasMenuId = useId();
  const groupPrefix = useId();
  const desktop = window.computerDesktop?.platform === 'darwin';

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('computer.theme', theme); } catch {
      // Appearance still works when persistence is unavailable.
    }
  }, [theme]);

  function setGroupExpanded(id, nextExpanded) {
    setExpanded(ids => nextExpanded ? [...new Set([...ids, id])] : ids.filter(item => item !== id));
  }
  function resetData() {
    dispatch({ type: 'reset' });
    dispatchCanvas({ type: 'reset' });
    setPropertiesOpenByChat({});
    setExpanded([]);
    setNavigation(normalizeNavigationLayout(null, navigationIds));
    setResetCount(value => value + 1);
  }
  function moveChat(id, section, beforeId = null) {
    setNavigation(layout => moveNavigationItem(layout, id, section, beforeId));
    setNavigationAnnouncement(`${recentItems.find(item => item.id === id)?.label} moved to ${section === 'top' ? 'the top section' : 'Recent'}.`);
  }
  function finishDrag() {
    draggedChat.current = null;
    setDraggingId(null);
    setDropTarget(null);
  }
  function targetAt(x, y) {
    const target = document.elementFromPoint(x, y);
    const zone = target?.closest('[data-nav-section]');
    if (!zone && target?.closest('.computer-nav-panel__recent')) return { section: 'recent', beforeId: navigation.recent[0] ?? null };
    if (!zone) return null;
    const section = zone.dataset.navSection;
    const row = target.closest('.app-nav-chat');
    if (!row) return { section, beforeId: null };
    const bounds = row.querySelector('.computer-nav-item').getBoundingClientRect();
    const id = row.dataset.chatId;
    const index = navigation[section].indexOf(id);
    return { section, beforeId: y < bounds.top + bounds.height / 2 ? id : navigation[section][index + 1] ?? null };
  }
  function updateDrag(event) {
    const drag = draggedChat.current;
    if (!drag || event.pointerId !== drag.pointerId) return false;
    if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return false;
    if (!drag.moved) {
      drag.moved = true;
      setDraggingId(drag.id);
      setNavigationAnnouncement(`Dragging ${recentItems.find(item => item.id === drag.id).label}. Drop in the top section or Recent.`);
    }
    event.preventDefault();
    setDropTarget(targetAt(event.clientX, event.clientY));
    return true;
  }
  function endPointerDrag(event) {
    const drag = draggedChat.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (updateDrag(event)) {
      const target = targetAt(event.clientX, event.clientY);
      if (target) moveChat(drag.id, target.section, target.beforeId);
      suppressNavClick.current = performance.now() + 300;
    }
    finishDrag();
  }
  function chatRows(section) {
    return navigation[section].map(id => {
      const item = recentItems.find(value => value.id === id);
      return <div key={id} className="app-nav-chat" data-chat-id={id}
        data-dragging={draggingId === id || undefined}
        data-drop-before={dropTarget?.section === section && dropTarget.beforeId === id || undefined}
        onDragStartCapture={event => event.preventDefault()}
        onPointerDown={event => {
          if (event.button !== 0 || event.pointerType === 'touch' || event.target.closest('[data-variant="session"]')) return;
          suppressNavClick.current = 0;
          draggedChat.current = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId, moved: false };
          (event.target.closest('button, a') ?? event.currentTarget).setPointerCapture(event.pointerId);
        }}
        onPointerMove={updateDrag}
        onPointerUp={endPointerDrag}
        onPointerCancel={finishDrag}
        onKeyDown={event => {
          if (event.key === 'Escape') { finishDrag(); return; }
          if (event.altKey && event.shiftKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();
            pendingNavigationFocus.current = id;
            moveChat(id, event.key === 'ArrowUp' ? 'top' : 'recent');
          }
        }}>
        <NavItem variant={sidebarOpen ? 'default' : 'collapsed'} label={item.label} description={conversationPreview(item.id, chat)} avatar={item.avatar}
          className={id === 'gil' ? 'app-nav-gil' : undefined}
          selected={current?.id === item.id || !sidebarOpen && item.sessions?.some(session => session.id === current?.id)} expanded={expanded.includes(item.id)}
          controlsId={item.sessions ? `${groupPrefix}-${item.id}` : undefined}
          onExpandedChange={item.sessions ? value => setGroupExpanded(item.id, value) : undefined}
          onClick={() => setCurrent(item)} />
        {item.sessions && <div className="app-nav-sessions" id={`${groupPrefix}-${item.id}`} hidden={!sidebarOpen || !expanded.includes(item.id)}>
          {item.sessions.map(session => <NavItem key={session.id} variant="session" label={session.label} count={session.count} selected={current?.id === session.id} onClick={() => setCurrent(session)} />)}
        </div>}
      </div>;
    });
  }
  function dropZoneProps(section) {
    return {
      className: 'app-nav-drop-zone',
      role: 'group',
      'aria-label': section === 'top' ? 'Top chats' : 'Recent chats',
      'data-drop-end': dropTarget?.section === section && dropTarget.beforeId === null || undefined,
      'data-nav-section': section,
    };
  }
  const themeAction = theme === 'light' ? 'Dark mode' : 'Light mode';
  const toggleTheme = () => setTheme(value => value === 'light' ? 'dark' : 'light');
  const navigationToolbar = <div className="app-toolbar" role="group" aria-label="Navigation actions">
    <IconButton ref={navigationToggle} icon="menu" label={sidebarOpen ? 'Hide navigation' : 'Show navigation'} aria-expanded={sidebarOpen} aria-controls="app-navigation" onClick={() => { pendingSidebarFocus.current = true; setSidebarOpen(value => !value); }} />
    <IconButton icon="plus" label="New chat" onClick={newChat} />
  </div>;

  return (
    <div className="computer-app" data-desktop={desktop || undefined} data-sidebar-open={sidebarOpen}>
      {!sidebarOpen && <div className="app-floating-nav-chrome">{navigationToolbar}</div>}
      {sidebarOpen && <button className="app-sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <NavPanel
        ref={sidebar}
        className="app-sidebar"
        id="app-navigation"
        onClickCapture={event => {
          if (performance.now() < suppressNavClick.current) { event.preventDefault(); event.stopPropagation(); }
        }}
        collapsed={!sidebarOpen}
        data-desktop={desktop || undefined}
        header={sidebarOpen ? navigationToolbar : undefined}
        primary={<div {...dropZoneProps('top')}>
          <NavItem {...computerItem} variant={sidebarOpen ? 'default' : 'collapsed'} description={conversationPreview(computerItem.id, chat)} selected={current?.id === computerItem.id || !sidebarOpen && (dateItems.some(item => item.id === current?.id) || chat.custom.some(item => item.id === current?.id))} onClick={() => setCurrent(computerItem)}
            expanded={expanded.includes('computer')} onExpandedChange={value => setGroupExpanded('computer', value)} controlsId={`${groupPrefix}-computer`} />
          <div className="app-nav-sessions" id={`${groupPrefix}-computer`} hidden={!sidebarOpen || !expanded.includes('computer')}>
            {[...chat.custom.map(item => ({ ...item, count: 'Now' })), ...dateItems].map(item => <NavItem key={item.id} variant="session" label={item.label} count={item.count} selected={current?.id === item.id} onClick={() => setCurrent(item)} />)}
          </div>
          {chatRows('top')}
        </div>}
        footer={<NavItem variant={sidebarOpen ? 'me' : 'collapsed'} label="Open profile menu" avatar={profileAvatar} popoverTarget={profileId} aria-haspopup="menu" aria-expanded={profileOpen} />}
      >
        <div {...dropZoneProps('recent')}>{chatRows('recent')}</div>
      </NavPanel>
      <span className="app-nav-announcement" role="status">{navigationAnnouncement}</span>

      <Menu id={profileId} className="app-profile" popover="auto" sectionLabel="Tim Cherny"
        aria-label="Profile and appearance" onToggle={event => setProfileOpen(event.newState === 'open')}
        items={[
          { id: 'appearance', label: themeAction, leading: <ThemeIcon theme={theme} />, onClick: toggleTheme },
          { id: 'divider', type: 'divider' },
          { id: 'reset', label: 'Reset to default data', onClick: resetData },
        ]} />

      <Menu id={chatActionsId} className="app-chat-actions" popover="auto" aria-label="Chat actions"
        onToggle={event => setChatActionsOpen(event.newState === 'open')}
        items={[
          { id: 'new', label: 'New chat', onClick: newChat },
          ...(navigationIds.includes(current.id) ? [{ id: 'placement', label: navigation.top.includes(current.id) ? 'Move to Recent' : 'Move to top section', onClick: () => moveChat(current.id, navigation.top.includes(current.id) ? 'recent' : 'top') }] : []),
          { id: 'appearance', label: themeAction, onClick: toggleTheme },
        ]} />

      <Menu id={canvasMenuId} className="app-canvas-add-menu" popover="auto" sectionLabel="Pages" aria-label="Open a page"
        style={{ positionAnchor: canvas.open ? '--canvas-add' : '--canvas-opener' }}
        onToggle={event => setCanvasMenuOpen(event.newState === 'open')}
        items={pages.map(page => ({ id: page.id, label: page.label, selected: canvas.selectedId === page.id,
          onClick: () => openCanvasPage(page.id) }))} />

      <div className="app-workspace">
        <main className="app-main" ref={workspace} data-resizing-split={resizingSplit || undefined}
          style={splitRatio === null ? undefined : { '--app-chat-size': `${splitWidth}px` }}
          data-canvas-open={canvas.open || undefined} data-canvas-expanded={canvas.open && canvas.expanded || undefined} data-chat-tab-active={chatTabActive || undefined}>
          <div className="app-chat-pane" ref={chatPane} id={`${chatTabPrefix}-panel`}
            role={chatTabActive ? 'tabpanel' : undefined} aria-labelledby={chatTabActive ? `${chatTabPrefix}-tab` : undefined}>
          <ChatWindow key={`${resetCount}-${chat.currentId}`} title={current.label} subtitle={current.participantCount ? `${current.participantCount} people` : undefined} avatar={current.avatar} messages={messages}
            propertiesSections={propertySections} propertiesOpen={propertiesOpen} onPropertiesOpenChange={setPropertiesOpen}
            propertiesHeader={{ description: current.participantCount ? `${current.participantCount} people` : 'Last use today' }}
            topbarProps={{ moreButtonProps: { popoverTarget: chatActionsId, 'aria-haspopup': 'menu', 'aria-expanded': chatActionsOpen },
              showCanvasControl: !canvas.open, canvasTabCount: canvas.tabIds.length,
              onCanvasToggle: canvas.tabIds.length ? reopenCanvas : undefined,
              canvasButtonProps: canvas.tabIds.length ? {} : { popoverTarget: canvasMenuId, 'aria-haspopup': 'menu', 'aria-expanded': canvasMenuOpen },
            }}
            inputProps={{ autoFocus: true, group: !isComputerChat, computerOnly: isComputerChat }}
            inputValue={chat.drafts[chat.currentId] || ''}
            onInputChange={event => dispatch({ type: 'draft', id: chat.currentId, text: event.target.value })}
            onSend={sendMessage} />
          {canvas.open && !canvas.expanded && <div className="app-split-resizer" role="separator" tabIndex={0}
            aria-label="Resize chat and canvas" aria-orientation="vertical" aria-controls={`${chatTabPrefix}-panel`}
            aria-valuemin={340} aria-valuemax={Math.round(splitMax)} aria-valuenow={Math.round(splitWidth)}
            aria-valuetext={`Chat width ${Math.round(splitWidth)} pixels`}
            onPointerDown={event => {
              if (event.button !== 0 || !event.isPrimary) return;
              event.preventDefault();
              event.currentTarget.focus({ preventScroll: true });
              event.currentTarget.setPointerCapture(event.pointerId);
              splitDrag.current = { id: event.pointerId, x: event.clientX, width: chatPane.current.getBoundingClientRect().width };
              setResizingSplit(true);
            }}
            onPointerMove={event => {
              const drag = splitDrag.current;
              if (drag?.id === event.pointerId) resizeSplit(drag.width + event.clientX - drag.x);
            }}
            onPointerUp={event => {
              if (splitDrag.current?.id !== event.pointerId) return;
              event.currentTarget.releasePointerCapture(event.pointerId);
              finishSplitDrag();
            }}
            onPointerCancel={finishSplitDrag} onLostPointerCapture={finishSplitDrag}
            onKeyDown={event => {
              const width = { ArrowLeft: splitWidth - 10, ArrowRight: splitWidth + 10, Home: 340, End: splitMax }[event.key];
              if (width !== undefined) { event.preventDefault(); resizeSplit(width); }
            }} />}
          </div>
          {canvas.open && <CanvasWindow onCanvasSend={sendMessage} cursorLabel={isComputerChat ? undefined : 'TIM'} className="app-canvas" items={canvasItems} selectedId={chatTabActive ? '__chat__' : canvas.selectedId} titleRef={canvasTitle}
            onSelect={pageId => {
              dispatchCanvas({ type: pageId === '__chat__' ? 'select-chat' : 'select-tab', chatId: chat.currentId, pageId });
            }}
            onCloseTab={pageId => {
              if (canvas.tabIds.length === 1) { pendingChatFocus.current = true; setPropertiesOpen(true); }
              dispatchCanvas({ type: 'close-tab', chatId: chat.currentId, pageId });
            }} onClose={closeCanvas} expanded={canvas.expanded}
            onExpand={() => dispatchCanvas({ type: 'toggle-expanded', chatId: chat.currentId })}
            addButtonProps={{ popoverTarget: canvasMenuId, 'aria-haspopup': 'menu', 'aria-expanded': canvasMenuOpen }} />}
        </main>
      </div>
    </div>
  );
}
