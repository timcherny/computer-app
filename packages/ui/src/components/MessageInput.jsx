import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MessageGradient, defaultMessageGradient } from './MessageGradient.jsx';
import { Menu } from './Menu.jsx';
import computer from '../assets/message-input/computer.svg';
import plus from '../assets/message-input/plus.svg';
import arrow from '../assets/message-input/arrow-up.svg';

const emptyPeople = [];
const defaultAgent = { id: 'computer', name: 'Computer' };
/** New animated composer, adapted from the reference app's MessageInput.
 * onChange(event), onSend(text,event,{toComputer}) preserve the earlier contract.
 * Sending does not clear the draft: the owner decides after accepting the send.
 */
export function MessageInput({
  value, defaultValue = '', onChange, onSend, onKeyDown, onMentionSelect,
  people = emptyPeople, agent = defaultAgent, mentionsEnabled = true,
  group = false, computerOnly = !group, defaultToComputer = false,
  maxLines = 4, placeholder = 'Write a message', disabled = false,
  animate = true, introEnabled = true, animationKey = 0, gradient, loopDuration = 5, paused = false,
  onAddAction, className = '', style, id, ...textareaProps
}) {
  const input = useRef(null), root = useRef(null), overlay = useRef(null);
  const generatedId = useId(), inputId = id || generatedId, listId = `${inputId}-mentions`;
  const actionsAnchor = `--computer-message-actions-${generatedId.replace(/[^a-zA-Z0-9-]/g, '')}`;
  const [draft,setDraft] = useState(defaultValue), [toComputer,setToComputer] = useState(defaultToComputer);
  const [mention,setMention] = useState(null), [active,setActive] = useState(0), [menu,setMenu] = useState(false);
  const [multiline,setMultiline] = useState(false);
  const [intro,setIntro] = useState(false), [focused,setFocused] = useState(false);
  const text = String(value !== undefined ? value ?? '' : draft);
  const isComputer = computerOnly || (group && toComputer);
  const [sequenceSeed,setSequenceSeed] = useState(gradient?.seed ?? defaultMessageGradient.seed);
  const sequenceRef = useRef({ active:false, key:animationKey, seed:gradient?.seed, started:false });
  const sequenceGradient = useMemo(() => ({ ...gradient, seed:sequenceSeed }), [gradient,sequenceSeed]);
  useEffect(() => {
    const previous = sequenceRef.current;
    const seedChanged = previous.seed !== gradient?.seed;
    const starting = isComputer && (!previous.active || previous.key !== animationKey);
    if (seedChanged) {
      setSequenceSeed(gradient?.seed ?? defaultMessageGradient.seed);
      previous.started = isComputer;
    } else if (starting) {
      if (previous.started) {
        // Always pick a different seed; retain it throughout the intro and loop.
        setSequenceSeed(current => (current + 1 + Math.floor(Math.random()*999998)) % 999999);
      }
      previous.started = true;
    }
    previous.active = isComputer;
    previous.key = animationKey;
    previous.seed = gradient?.seed;
  }, [isComputer,animationKey,gradient?.seed]);
  const showSend = isComputer || focused || !!text || menu;
  const showTabHint = group && !computerOnly && focused && !isComputer && !text;
  const options = useMemo(() => [...people,agent].filter(Boolean).filter(p => p.name.toLowerCase().includes(mention?.query.toLowerCase() || '')), [people,agent,mention]);
  const names = useMemo(() => [...people,agent].filter(Boolean).map(p => p.name), [people,agent]);
  const tokens = useMemo(() => {
    const escape = name => name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if (!names.length) return [text];
    return text.split(new RegExp(`((?:${names.map(escape).join('|')}):)`, 'g'));
  }, [text,names]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (!animate || !introEnabled || !isComputer || multiline || media.matches || disabled) { setIntro(false); return; }
    setIntro(true);
    const timer = setTimeout(() => setIntro(false),1000);
    const reduce = () => { if (media.matches) setIntro(false); };
    media.addEventListener('change',reduce);
    return () => { clearTimeout(timer); media.removeEventListener('change',reduce); };
    // Layout changes cancel an intro below, but must not start a new one.
  }, [animate,introEnabled,isComputer,animationKey,disabled]);
  useEffect(() => { if (multiline) setIntro(false); }, [multiline]);
  useLayoutEffect(() => {
    const el = input.current;
    const controls = el.closest('.computer-message-input__controls');
    // Measure against the compact layout even after expanding, so moving the
    // controls below the text cannot make the layout oscillate between modes.
    const measure = document.createElement('textarea');
    measure.tabIndex = -1;
    measure.setAttribute('aria-hidden', 'true');
    measure.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:0;min-height:0;padding:0;border:0;resize:none;overflow:hidden;';
    root.current.appendChild(measure);
    const resize = () => {
      const style = getComputedStyle(el);
      for (const property of ['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','whiteSpace','overflowWrap','wordBreak']) measure.style[property] = style[property];
      const gap = parseFloat(getComputedStyle(controls).columnGap) || 8;
      const compactPadding = isComputer ? 16 : 24;
      const compactControls = (isComputer ? 36 + gap : 0) + 28 + gap + (showSend ? 28 + gap : 0);
      measure.style.width = `${Math.max(1, root.current.clientWidth - compactPadding - compactControls)}px`;
      measure.style.lineHeight = '16px';
      measure.value = text || ' ';
      setMultiline(measure.scrollHeight > 17);
      const lineHeight = parseFloat(style.lineHeight) || 16;
      const cap = Math.max(1, maxLines) * lineHeight;
      el.style.height = '0px';
      const height = el.scrollHeight;
      el.style.height = `${Math.min(cap, Math.max(lineHeight, height))}px`;
      el.style.overflowY = height > cap ? 'auto' : 'hidden';
      overlay.current.scrollTop = el.scrollTop;
    };
    resize();
    let width = root.current.clientWidth;
    const observer = new ResizeObserver(() => {
      const next = root.current.clientWidth;
      if (next !== width) { width = next; resize(); }
    });
    observer.observe(root.current);
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) resize(); });
    return () => { disposed = true; observer.disconnect(); measure.remove(); };
  }, [text,maxLines,multiline,isComputer,showSend]);
  useEffect(() => {
    const outside=e=>{if(!root.current?.contains(e.target))setMention(null);};
    document.addEventListener('pointerdown',outside);return ()=>document.removeEventListener('pointerdown',outside);
  }, []);
  function updateMention(el) {
    const end=el.selectionStart, match=el.value.slice(0,end).match(/@([^\s@]*)$/);
    setMention(mentionsEnabled && match ? {start:match.index,end,query:match[1]} : null);setActive(0);
  }
  function change(next,event) { if(value===undefined)setDraft(next);onChange?.(event || {target:{value:next},currentTarget:{value:next}}); }
  function pick(person) {
    const token=`${person.name}: `, next=text.slice(0,mention.start)+token+text.slice(mention.end), cursor=mention.start+token.length;
    change(next);setMention(null);onMentionSelect?.({name:person.name});
    requestAnimationFrame(()=>{input.current?.focus();input.current?.setSelectionRange(cursor,cursor);});
  }
  function send(event) { if(disabled || !text.trim())return;setMention(null);onSend?.(text,event,{toComputer:isComputer}); }
  function keyDown(event) {
    onKeyDown?.(event);if(event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode===229)return;
    if(event.key==='Escape' && (mention || menu)){event.preventDefault();setMention(null);setMenu(false);return;}
    if(mention && options.length){
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setActive(i=>(i+(event.key==='ArrowDown'?1:-1)+options.length)%options.length);return;}
      if((event.key==='Enter'&&!event.metaKey&&!event.ctrlKey)||(event.key==='Tab'&&!event.shiftKey&&!event.altKey&&!event.metaKey&&!event.ctrlKey)){event.preventDefault();pick(options[active] || options[0]);return;}
    }
    if(group&&!computerOnly&&event.key==='Tab'&&!event.shiftKey&&!event.metaKey&&!event.ctrlKey&&!event.altKey){event.preventDefault();setToComputer(v=>!v);return;}
    if(event.key==='Enter'&&!event.shiftKey&&!event.metaKey&&!event.ctrlKey&&!event.altKey){event.preventDefault();send(event);}
  }
  return <div ref={root} className={`computer-message-input ${className}`} style={style} data-multiline={multiline} data-gradient-seed={sequenceSeed} data-send-visible={showSend} data-group={group && !computerOnly} data-focused={focused} data-filled={!!text} data-intro={intro} data-computer={isComputer} data-disabled={disabled} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
    {group && !computerOnly && <span className="computer-message-input__sr-only" id={`${inputId}-target-help`}>Tab toggles between the group and Computer. Shift+Tab moves to the previous control.</span>}
    <div className="computer-message-input__surface">
      {intro && <div className="computer-message-input__intro" key={animationKey}><MessageGradient settings={sequenceGradient} /></div>}
      <div className="computer-message-input__controls">
        {isComputer && <span className="computer-message-input__agent" aria-label="To Computer">
          {!intro && focused && <MessageGradient loop settings={sequenceGradient} duration={loopDuration} paused={paused || disabled || !animate} />}
          <img src={computer} alt="" />
        </span>}
        <div className="computer-message-input__field">
          {showTabHint && <span className="computer-message-input__tab-hint" aria-hidden="true">Write a message, <kbd>Tab</kbd> for Computer</span>}
          <div className="computer-message-input__highlight" ref={overlay} aria-hidden="true">{tokens.map((token,i)=>i%2?<mark key={i}>{token}</mark>:token)}{'\n'}</div>
          <textarea {...textareaProps} ref={input} id={inputId} rows={1} value={text} disabled={disabled}
            aria-label={textareaProps['aria-label'] || 'Message'} placeholder={showTabHint?'':placeholder} aria-describedby={group&&!computerOnly?`${inputId}-target-help`:undefined}
            aria-controls={mention&&options.length?listId:undefined} aria-expanded={!!(mention&&options.length)} aria-autocomplete="list"
            aria-activedescendant={mention&&options.length?`${listId}-${active}`:undefined}
            onChange={e=>{change(e.currentTarget.value,e);updateMention(e.currentTarget);}}
            onSelect={e=>updateMention(e.currentTarget)} onKeyDown={keyDown}
            onScroll={e=>{overlay.current.scrollTop=e.currentTarget.scrollTop;}}
            onFocus={e=>{setFocused(true);textareaProps.onFocus?.(e);}} onBlur={e=>{textareaProps.onBlur?.(e);}} />
        </div>
        {multiline && group && !computerOnly && !isComputer && <span className="computer-message-input__multiline-hint"><kbd>Tab</kbd> for Computer</span>}
        <button type="button" className="computer-message-input__add" aria-label="Add" aria-haspopup="menu" aria-expanded={menu} aria-controls={`${inputId}-actions`} popoverTarget={`${inputId}-actions`} style={{ anchorName: actionsAnchor }} disabled={disabled} onClick={()=>setMention(null)}
          onPointerDown={event=>event.preventDefault()}
          onKeyDown={event=>{if(event.key==='ArrowDown'&&!menu){event.preventDefault();event.currentTarget.click();}}}><img src={plus} alt="" /></button>
        <span className="computer-message-input__send-slot" inert={!showSend || undefined}><button type="button" className="computer-message-input__send" aria-label="Send message" disabled={disabled||!text.trim()||!showSend} tabIndex={showSend?0:-1} aria-hidden={!showSend || undefined} onClick={send}><img src={arrow} alt="" /></button></span>
      </div>
    </div>
    {mention&&options.length>0&&<div className="computer-message-input__menu" role="listbox" id={listId} aria-label="Mention suggestions">
      {options.map((person,index)=><button type="button" role="option" aria-selected={active===index} id={`${listId}-${index}`} key={person.id || person.name} onPointerDown={e=>e.preventDefault()} onClick={()=>pick(person)}>{person.name}</button>)}
    </div>}
    <Menu className="computer-message-input__actions" id={`${inputId}-actions`} popover="auto" aria-label="Add to message" style={{ positionAnchor: actionsAnchor }}
      onToggle={event=>setMenu(event.newState==='open')}
      items={[
        { id: 'add-files', label: 'Add files or photos' },
        { id: 'generative-ui', label: 'Generative UI' },
        { id: 'side-chat', label: 'New side chat' },
      ]}
      onSelect={action=>{onAddAction?.(action);input.current?.focus();}} />
  </div>;
}
