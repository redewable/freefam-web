"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

// Leg colors for first-generation branches
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

  // Layout calculation
  const layoutTree = useCallback(() => {
    const nodes = [];
    const edges = [];

    // Center node (you)
    const centerLabel = partnerName ? `${userName} & ${partnerName}` : userName;
    nodes.push({
      id: 'root',
      x: 0, y: 0,
      label: centerLabel,
      ltdId: tree.user.ltd_id,
      radius: 40,
      color: colors.gold,
      isRoot: true,
      depth: 0,
    });

    // Layout downline radially
    const layoutChildren = (children, parentId, parentX, parentY, startAngle, endAngle, depth, legColorIdx) => {
      if (!children || children.length === 0 || depth > 6) return;

      const angleSpan = endAngle - startAngle;
      const anglePerChild = angleSpan / Math.max(children.length, 1);
      const baseRadius = 100 + depth * 80;

      children.forEach((child, i) => {
        const angle = startAngle + anglePerChild * (i + 0.5);
        const x = parentX + Math.cos(angle) * baseRadius;
        const y = parentY + Math.sin(angle) * baseRadius;

        const displayName = child.partner_name
          ? `${child.full_name} & ${child.partner_name}`
          : (child.full_name || 'Unnamed');

        const legColor = depth === 1 ? LEG_COLORS[legColorIdx % LEG_COLORS.length] : LEG_COLORS[legColorIdx % LEG_COLORS.length];
        const nodeRadius = Math.max(20, 35 - depth * 3);

        const nodeId = child.id || `node-${nodes.length}`;
        nodes.push({
          id: nodeId,
          x, y,
          label: displayName,
          ltdId: child.ltd_id,
          radius: nodeRadius,
          color: legColor,
          depth,
          totalDescendants: child.totalDescendants || 0,
          role: child.role,
        });

        edges.push({
          from: parentId,
          to: nodeId,
          color: legColor,
        });

        // Recurse
        if (child.children && child.children.length > 0) {
          const childAngleSpan = anglePerChild * 0.85;
          const childStart = angle - childAngleSpan / 2;
          const childEnd = angle + childAngleSpan / 2;
          layoutChildren(child.children, nodeId, x, y, childStart, childEnd, depth + 1, legColorIdx);
        }
      });
    };

    if (downline.length > 0) {
      const fullCircle = Math.PI * 2;
      const startAngle = -Math.PI / 2; // Start from top
      layoutChildren(downline, 'root', 0, 0, startAngle, startAngle + fullCircle, 1, 0);
    }

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
    const cy = rect.height / 2 + transform.y;
    const scale = transform.scale;

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw edges
    ctx.lineWidth = 1.5 * scale;
    for (const edge of layoutEdges) {
      const fromNode = layoutNodes.find(n => n.id === edge.from);
      const toNode = layoutNodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const fx = cx + fromNode.x * scale;
      const fy = cy + fromNode.y * scale;
      const tx = cx + toNode.x * scale;
      const ty = cy + toNode.y * scale;

      ctx.beginPath();
      ctx.strokeStyle = edge.color + '40';
      ctx.moveTo(fx, fy);
      // Curved line
      const midX = (fx + tx) / 2;
      const midY = (fy + ty) / 2;
      const dx = tx - fx;
      const dy = ty - fy;
      const perpX = -dy * 0.1;
      const perpY = dx * 0.1;
      ctx.quadraticCurveTo(midX + perpX, midY + perpY, tx, ty);
      ctx.stroke();
    }

    // Draw nodes
    nodesRef.current = [];
    for (const node of layoutNodes) {
      const nx = cx + node.x * scale;
      const ny = cy + node.y * scale;
      const r = node.radius * scale;

      // Store for hit testing
      nodesRef.current.push({ ...node, screenX: nx, screenY: ny, screenRadius: r });

      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;

      // Circle
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isSelected ? node.color + '30' : node.isRoot ? 'rgba(184,149,107,0.12)' : node.color + '15';
      ctx.fill();
      ctx.strokeStyle = isHovered || isSelected ? node.color : node.color + '60';
      ctx.lineWidth = (isHovered || isSelected ? 2 : 1) * scale;
      ctx.stroke();

      // Label
      const fontSize = Math.max(9, Math.min(13, 12 * scale));
      ctx.font = `${node.isRoot ? '600 ' : '500 '}${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = colors.dark;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Truncate if too long
      let label = node.label;
      const maxWidth = r * 2.5;
      while (ctx.measureText(label).width > maxWidth && label.length > 3) {
        label = label.slice(0, -4) + '...';
      }
      ctx.fillText(label, nx, ny - (node.ltdId ? 6 * scale : 0));

      // LTD ID below name
      if (node.ltdId && scale > 0.5) {
        ctx.font = `${Math.max(8, 10 * scale)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(26,26,26,0.35)';
        ctx.fillText(`#${node.ltdId}`, nx, ny + 8 * scale);
      }

      // Descendant count
      if (node.totalDescendants > 0 && scale > 0.6) {
        ctx.font = `600 ${Math.max(7, 9 * scale)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = node.color;
        ctx.fillText(`${node.totalDescendants}`, nx, ny + (node.ltdId ? 18 : 12) * scale);
      }
    }
  }, [layoutNodes, layoutEdges, transform, hoveredNode, selectedNode]);

  // Mouse/touch handlers
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

    // Hit test
    let found = null;
    for (const node of nodesRef.current) {
      const dx = mx - node.screenX;
      const dy = my - node.screenY;
      if (dx * dx + dy * dy < node.screenRadius * node.screenRadius) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
    canvas.style.cursor = found ? 'pointer' : dragging ? 'grabbing' : 'grab';

    if (dragging && dragStart) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.2, Math.min(3, prev.scale * delta)),
    }));
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      const dx = mx - node.screenX;
      const dy = my - node.screenY;
      if (dx * dx + dy * dy < node.screenRadius * node.screenRadius) {
        setSelectedNode(prev => prev === node.id ? null : node.id);
        return;
      }
    }
    setSelectedNode(null);
  };

  // Touch handlers for mobile
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
      const ratio = dist / lastPinchRef.current;
      setTransform(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3, prev.scale * ratio)) }));
      lastPinchRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    lastPinchRef.current = null;
  };

  // Reset view
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  // Selected node info
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
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.2, prev.scale * 0.8) }))}
          style={{ width: '32px', height: '32px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark }}>{'\u2212'}</button>
        <button onClick={resetView}
          style={{ height: '32px', padding: '0 10px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>Reset</button>
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', padding: '8px 12px', border: '1px solid rgba(26,26,26,0.08)', fontSize: '11px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(26,26,26,0.4)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Legs</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {downline.slice(0, 8).map((leg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: LEG_COLORS[i % LEG_COLORS.length] }} />
              <span style={{ color: 'rgba(26,26,26,0.5)' }}>{leg.full_name?.split(' ')[0] || `Leg ${i + 1}`}</span>
            </div>
          ))}
        </div>
      </div>

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
        Scroll to zoom {'\u00b7'} Drag to pan {'\u00b7'} Click a node for details
      </div>
    </div>
  );
}
