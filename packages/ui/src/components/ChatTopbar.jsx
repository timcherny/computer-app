import { ChatHeader } from './ChatHeader.jsx';
import { IconButton } from './IconButton.jsx';
import { MessageAvatar } from './MessageAvatar.jsx';

/** Fading overlay above chat history. The consumer owns menus and the canvas. */
export function ChatTopbar({
  title = 'Computer', subtitle, avatar, onMore, onCanvasToggle, canvasOpen = false,
  onPropertiesToggle, propertiesOpen = false, panelButtonProps = {},
  showCanvasControl = false, canvasTabCount = 0,
  moreButtonProps = {}, canvasButtonProps = {}, className = '', ...props
}) {
  const canvasControl = <IconButton icon={onPropertiesToggle ? 'plus' : 'buttonCanvas'}
    className="computer-chat-topbar__canvas-opener"
    label={canvasOpen ? 'Close canvas' : canvasTabCount ? `Open canvas (${canvasTabCount} ${canvasTabCount === 1 ? 'tab' : 'tabs'})` : 'Open canvas'}
    pressed={canvasOpen}
    disabled={!onCanvasToggle && !canvasButtonProps.onClick && !canvasButtonProps.popoverTarget}
    {...canvasButtonProps} onClick={onCanvasToggle ?? canvasButtonProps.onClick}>
    {canvasTabCount > 0 ? <MessageAvatar variant="count" count={canvasTabCount} /> : undefined}
  </IconButton>;
  return <div {...props} data-canvas-control={onPropertiesToggle && showCanvasControl || undefined} className={['computer-chat-topbar', className].filter(Boolean).join(' ')}>
    <div className="computer-chat-topbar__blur" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => <span key={index} style={{
        // Gaussian variances add: six overlapping steps reach the source 6px blur.
        '--topbar-blur-scale': Math.sqrt(2 * index + 1) / 6,
        '--topbar-blur-fade-start': `${(5 - index) / 6 * 100}%`,
        '--topbar-blur-fade-end': `${(6 - index) / 6 * 100}%`,
      }} />)}
    </div>
    <div className="computer-chat-topbar__identity"><ChatHeader title={title} subtitle={subtitle} avatar={avatar} /></div>
    <div className="computer-chat-topbar__actions" role="group" aria-label="Chat actions">
      <IconButton icon="buttonMore" label="More chat actions" disabled={!onMore && !moreButtonProps.popoverTarget && !moreButtonProps.onClick}
        {...moreButtonProps} onClick={onMore ?? moreButtonProps.onClick} />
      {onPropertiesToggle ? <IconButton icon="buttonCanvas" label={propertiesOpen ? 'Hide properties' : 'Show properties'}
        pressed={propertiesOpen} aria-expanded={propertiesOpen} {...panelButtonProps} onClick={onPropertiesToggle} /> : canvasControl}
      {onPropertiesToggle && showCanvasControl && canvasControl}
    </div>
  </div>;
}
