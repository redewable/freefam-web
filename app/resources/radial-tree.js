"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const LEG_COLORS = [
  '#b8956b', '#3b82f6', '#22c55e', '#a855f7', '#f97316',
  '#ec4899', '#14b8a6', '#ef4444', '#6366f1', '#84cc16',
];

export default function RadialTree({ tree }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const nodesRef = useRef([]);

  if (!tree || !tree.user) return null;

  const downline = tree.downline || [];
  const userName = tree.user.full_name || 'You';
  const partnerName = tree.partner?.full_name || null;

  // Top-down pyramid layout
  const layoutTree = useCallback(() => {
    const nodes = [];
    const edges = [];

    const NODE_W = 120;
    const NODE_H = 50;
    const H_GAP = 20;
    const V_GAP = 70;

    // Calculate subtree widths bottom-up
    const getSubtreeWidth = (children) => {
      if (!children || children.length === 0) return NODE_W;
      let total = 0;
      for (const c of children) {
        total += getSubtreeWidth(c.children);
      }
      return Math.max(NODE_W, total + H_GAP * (children.length - 1));
    };

    // Root node
    const centerLabel = partnerName ? `${userName} & ${partnerName}` : userName;
    const rootNode = {
      id: 'root',
      x: 0, y: 0,
      label: centerLabel,
      ltdId: tree.user.ltd_id,
      w: NODE_W + 30,
      h: NODE_H + 10,
      color: colors.gold,
      isRoot: true,
      depth: 0,
    };
    nodes.push(rootNode);

    const totalTreeWidth = getSubtreeWidth(downline);

    // Recursive placement
    const placeChildren = (children, parentId, parentX, parentY, startX, availableWidth, depth, legIdx) => {
      if (!children || children.length === 0 || depth > 8) return;

      const childWidths = children.map(c => getSubtreeWidth(c.children));
      const totalNeeded = childWidths.reduce((a, b) => a + b, 0) + H_GAP * (children.length - 1);
      let cursorX = startX + (availableWidth - totalNeeded) / 2;

      children.forEach((child, i) => {
        const subtreeW = childWidths[i];
        const cx = cursorX + subtreeW / 2;
        const cy = parentY + V_GAP + NODE_H;

        const displayName = child.partner_name
          ? `${child.full_name} & ${child.partner_name}`
          : (child.full_name || 'Unnamed');

        const colorIdx = depth === 1 ? i : legIdx;
        const nodeColor = LEG_COLORS[colorIdx % LEG_COLORS.length];

        const nodeId = child.id || `node-${nodes.length}`;
        nodes.push({
          id: nodeId,
          x: cx, y: cy,
          label: displayName,
          ltdId: child.ltd_id,
          w: NODE_W,
          h: NODE_H,
          color: nodeColor,
          depth,
          totalDescendants: child.totalDescendants || 0,
          role: child.role,
        });

        edges.push({ from: parentId, to: nodeId, color: nodeColor });

        // Recurse
        if (child.children && child.children.length > 0) {
          placeChildren(child.children, nodeId, cx, cy, cursorX, subtreeW, depth + 1, colorIdx);
        }

        cursorX += subtreeW + H_GAP;
      });
    };

    placeChildren(downline, 'root', 0, 0, -totalTreeWidth / 2, totalTreeWidth, 1, 0);

    return { nodes, edges };
  }, [tree, downline, userName, partnerName]);

  const { nodes: layoutNodes, edges: layoutEdges } = layoutTree();

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2 + transform.x;
    const cy = 60 + transform.y;
    const scale = transform.scale;

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw edges (curved connectors)
    for (const edge of layoutEdges) {
      const fromNode = layoutNodes.find(n => n.id === edge.from);
      const toNode = layoutNodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const fx = cx + fromNode.x * scale;
      const fy = cy + (fromNode.y + fromNode.h / 2) * scale;
      const tx = cx + toNode.x * scale;
      const ty = cy + (toNode.y - toNode.h / 2) * scale;
      const midY = (fy + ty) / 2;

      ctx.beginPath();
      ctx.strokeStyle = edge.color + '50';
      ctx.lineWidth = 1.5 * scale;
      ctx.moveTo(fx, fy);
      ctx.bezierCurveTo(fx, midY, tx, midY, tx, ty);
      ctx.stroke();
    }

    // Draw nodes
    nodesRef.current = [];
    for (const node of layoutNodes) {
      const nx = cx + node.x * scale;
      const ny = cy + node.y * scale;
      const w = node.w * scale;
      const h = node.h * scale;

      nodesRef.current.push({ ...node, screenX: nx, screenY: ny, screenW: w, screenH: h });

      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;
      const highlight = isHovered || isSelected;

      // Rounded rect
      const r = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(nx - w/2 + r, ny - h/2);
      ctx.lineTo(nx + w/2 - r, ny - h/2);
      ctx.arcTo(nx + w/2, ny - h/2, nx + w/2, ny - h/2 + r, r);
      ctx.lineTo(nx + w/2, ny + h/2 - r);
      ctx.arcTo(nx + w/2, ny + h/2, nx + w/2 - r, ny + h/2, r);
      ctx.lineTo(nx - w/2 + r, ny + h/2);
      ctx.arcTo(nx - w/2, ny + h/2, nx - w/2, ny + h/2 - r, r);
      ctx.lineTo(nx - w/2, ny - h/2 + r);
      ctx.arcTo(nx - w/2, ny - h/2, nx - w/2 + r, ny - h/2, r);
      ctx.closePath();

      ctx.fillStyle = node.isRoot ? 'rgba(184,149,107,0.1)' : highlight ? node.color + '18' : 'white';
      ctx.fill();
      ctx.strokeStyle = highlight ? node.color : node.isRoot ? 'rgba(184,149,107,0.4)' : 'rgba(26,26,26,0.12)';
      ctx.lineWidth = highlight ? 2 * scale : 1 * scale;
      ctx.stroke();

      // Color accent bar on left
      if (!node.isRoot) {
        ctx.fillStyle = node.color + '60';
        ctx.fillRect(nx - w/2, ny - h/2, 3 * scale, h);
      }

      // Label
      const fontSize = Math.max(8, Math.min(12, 11 * scale));
      ctx.font = `${node.isRoot ? '600 ' : '500 '}${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = colors.dark;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let label = node.label;
      const maxWidth = w - 12 * scale;
      while (ctx.measureText(label).width > maxWidth && label.length > 3) {
        label = label.slice(0, -4) + '...';
      }
      ctx.fillText(label, nx, ny - (node.ltdId && scale > 0.5 ? 7 * scale : 0));

      // Subtitle
      if (scale > 0.5) {
        ctx.font = `${Math.max(7, 9 * scale)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(26,26,26,0.35)';
        const sub = [];
        if (node.ltdId) sub.push(`#${node.ltdId}`);
        if (node.totalDescendants > 0) sub.push(`${node.totalDescendants} in leg`);
        if (sub.length > 0) ctx.fillText(sub.join(' \u00b7 '), nx, ny + 8 * scale);
      }
    }
  }, [layoutNodes, layoutEdges, transform, hoveredNode, selectedNode]);

  // Interaction handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    for (const node of nodesRef.current) {
      if (mx >= node.screenX - node.screenW/2 && mx <= node.screenX + node.screenW/2 &&
          my >= node.screenY - node.screenH/2 && my <= node.screenY + node.screenH/2) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
    canvas.style.cursor = found ? 'pointer' : dragging ? 'grabbing' : 'grab';

    if (dragging && dragStart) {
      setTransform(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
    }
  };

  const handleMouseUp = () => { setDragging(false); setDragStart(null); };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({ ...prev, scale: Math.max(0.15, Math.min(3, prev.scale * delta)) }));
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const node of nodesRef.current) {
      if (mx >= node.screenX - node.screenW/2 && mx <= node.screenX + node.screenW/2 &&
          my >= node.screenY - node.screenH/2 && my <= node.screenY + node.screenH/2) {
        setSelectedNode(prev => prev === node.id ? null : node.id);
        return;
      }
    }
    setSelectedNode(null);
  };

  // Touch
  const lastTouchRef = useRef(null);
  const lastPinchRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouchRef.current) {
      const dx = e.touches[0].clientX - lastTouchRef.current.x;
      const dy = e.touches[0].clientY - lastTouchRef.current.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastPinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setTransform(prev => ({ ...prev, scale: Math.max(0.15, Math.min(3, prev.scale * (dist / lastPinchRef.current))) }));
      lastPinchRef.current = dist;
    }
  };

  const handleTouchEnd = () => { lastTouchRef.current = null; lastPinchRef.current = null; };

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  const selectedInfo = selectedNode ? layoutNodes.find(n => n.id === selectedNode) : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '400px', background: colors.bg, border: '1px solid rgba(26,26,26,0.08)', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      />

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '4px' }}>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }))}
          style={{ width: '32px', height: '32px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark }}>+</button>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.15, prev.scale * 0.8) }))}
          style={{ width: '32px', height: '32px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark }}>{'\u2212'}</button>
        <button onClick={resetView}
          style={{ height: '32px', padding: '0 10px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>Reset</button>
      </div>

      {/* Legend */}
      {downline.length > 0 && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.92)', padding: '8px 12px', border: '1px solid rgba(26,26,26,0.08)', fontSize: '11px' }}>
          <p style={{ margin: '0 0 4px', color: 'rgba(26,26,26,0.4)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Legs</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {downline.slice(0, 8).map((leg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: LEG_COLORS[i % LEG_COLORS.length] }} />
                <span style={{ color: 'rgba(26,26,26,0.5)' }}>{leg.full_name?.split(' ')[0] || `Leg ${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected node info */}
      {selectedInfo && (
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '12px 16px', border: `1px solid ${selectedInfo.color}40`, maxWidth: '220px' }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: colors.dark, margin: '0 0 4px' }}>{selectedInfo.label}</p>
          {selectedInfo.ltdId && <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', margin: '0 0 2px' }}>LTD #{selectedInfo.ltdId}</p>}
          {selectedInfo.totalDescendants > 0 && <p style={{ fontSize: '11px', color: selectedInfo.color, margin: 0 }}>{selectedInfo.totalDescendants} in leg</p>}
        </div>
      )}

      {/* Instructions */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', color: 'rgba(26,26,26,0.3)' }}>
        Scroll to zoom {'\u00b7'} Drag to pan {'\u00b7'} Click for details
      </div>
    </div>
  );
}
