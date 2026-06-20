import React, { useCallback, useRef, useState } from 'react';

interface ResizablePanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number; // px
  minLeftWidth?: number;
  maxLeftWidth?: number;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  left,
  right,
  defaultLeftWidth = 300,
  minLeftWidth = 200,
  maxLeftWidth = 600,
  collapsed = false,
  onCollapseToggle,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = moveEvent.clientX - rect.left;
      setLeftWidth(Math.min(maxLeftWidth, Math.max(minLeftWidth, newWidth)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [minLeftWidth, maxLeftWidth]);

  return (
    // CRITICAL: position:relative so the toggle button's absolute positioning works correctly
    <div
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', position: 'relative', minHeight: 0 }}
    >
      {/* Left Panel */}
      {!collapsed && (
        <div
          style={{
            width: leftWidth,
            minWidth: minLeftWidth,
            maxWidth: maxLeftWidth,
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {left}
        </div>
      )}

      {/* Drag Handle — only shown when not collapsed */}
      {!collapsed && (
        <div
          onMouseDown={onMouseDown}
          title="Drag to resize"
          style={{
            width: 14,
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
            zIndex: 10,
            position: 'relative',
          }}
          className="group"
        >
          {/* Vertical gutter line */}
          <div
            style={{ width: 2, height: '100%', borderRadius: 999 }}
            className="bg-white/5 group-hover:bg-indigo-500/50 transition-colors duration-200"
          />
          {/* Centre grip pill */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              height: 56,
              width: 5,
              borderRadius: 999,
              padding: '4px 0',
            }}
            className="bg-white/10 group-hover:bg-indigo-400/70 transition-all duration-200"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{ display: 'block', width: 2, height: 2, borderRadius: '50%' }}
                className="bg-white/50 group-hover:bg-white transition-colors duration-150"
              />
            ))}
          </div>
        </div>
      )}

      {/* Right Panel — always fills remaining space */}
      <div style={{ flex: 1, height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Collapse / Expand toggle button — positioned inside the right panel */}
        <button
          onClick={onCollapseToggle}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.7rem',
            fontWeight: 600,
            fontFamily: 'Outfit, sans-serif',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#cbd5e1',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.25)';
            (e.currentTarget as HTMLButtonElement).style.color = '#a5b4fc';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(15, 23, 42, 0.85)';
            (e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {collapsed ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 12, height: 12 }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Show Browser
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 12, height: 12 }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Hide Browser
            </>
          )}
        </button>

        {/* Actual right content */}
        <div style={{ width: '100%', height: '100%' }}>
          {right}
        </div>
      </div>
    </div>
  );
};

export default ResizablePanel;
