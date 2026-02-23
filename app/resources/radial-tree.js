"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const colors = { bg: '#fafaf8', dark: '#1a1a1a', gold: '#b8956b' };

const LEG_COLORS = [
  '#b8956b', '#3b82f6', '#22c55e', '#a855f7', '#f97316',
  '#ec4899', '#14b8a6', '#ef4444', '#6366f1', '#84cc16',
];

// Prospect status definitions
const PROSPECT_STATUSES = {
  looking:     { label: 'Checked Interest', short: 'Looking', border: 'none',   color: '#f59e0b' },
  qi_complete: { label: 'QI Complete',      short: 'QI',      border: 'underline', color: '#3b82f6' },
  saw_plan:    { label: 'Saw the Plan',     short: 'STP',     border: 'dashed', color: '#a855f7' },
};

const RELATIONSHIP_OPTIONS = ['Single', 'Dating', 'Engaged', 'Married', 'Divorced', 'Widowed'];
const NEXT_STEP_OPTIONS = ['Check Interest', 'Good News Call', 'PQI', 'QI1', 'QI2', '1st Look', 'Follow Up 1', '2nd Look', 'Follow Up 2', 'Final Review', 'GSM', 'Grand Opening'];

export default function RadialTree({ tree, onNodeAction }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [prospects, setProspects] = useState([]);
  const [addingProspect, setAddingProspect] = useState(null); // parentNodeId when adding
  const [prospectName, setProspectName] = useState('');
  const [prospectStatus, setProspectStatus] = useState('looking');
  const [saving, setSaving] = useState(false);
  // Vitals state for add modal
  const [prospectVitals, setProspectVitals] = useState({});
  // Editing vitals on selected prospect
  const [editingVitals, setEditingVitals] = useState(false);
  const [editVitalsForm, setEditVitalsForm] = useState({});
  const [legendOpen, setLegendOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [includeProspectsInCount, setIncludeProspectsInCount] = useState(false);
  const nodesRef = useRef([]);

  if (!tree || !tree.user) return null;

  const downline = tree.downline || [];
  const userName = tree.user.full_name || 'You';
  const partnerName = tree.partner?.full_name || null;

  // Load prospects
  useEffect(() => {
    fetch('/api/prospects')
      .then(r => r.json())
      .then(data => setProspects(data.prospects || []))
      .catch(() => {});
  }, []);

  // CRUD helpers
  const addProspect = async (name, parentNodeId, status, vitals) => {
    setSaving(true);
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentNodeId, status, vitals: Object.keys(vitals || {}).length > 0 ? vitals : undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects(prev => [...prev, data.prospect]);
        setAddingProspect(null);
        setProspectName('');
        setProspectStatus('looking');
        setProspectVitals({});
      }
    } catch {}
    setSaving(false);
  };

  const updateProspect = async (id, updates) => {
    setSaving(true);
    try {
      const res = await fetch('/api/prospects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects(prev => prev.map(p => {
          if (p.id !== id) return p;
          const updated = { ...p };
          if (updates.status) updated.status = updates.status;
          if (updates.name) updated.name = updates.name;
          if (updates.vitals) updated.vitals = { ...(p.vitals || {}), ...updates.vitals };
          return updated;
        }));
      }
    } catch {}
    setSaving(false);
  };

  const deleteProspect = async (id) => {
    setSaving(true);
    try {
      // Also delete any child prospects (recursively)
      const toDelete = [id];
      const findChildren = (parentId) => {
        prospects.filter(p => p.parentNodeId === parentId).forEach(child => {
          toDelete.push(child.id);
          findChildren(child.id);
        });
      };
      findChildren(id);

      for (const delId of toDelete) {
        await fetch(`/api/prospects?id=${delId}`, { method: 'DELETE' });
      }
      setProspects(prev => prev.filter(p => !toDelete.includes(p.id)));
      setSelectedNode(null);
    } catch {}
    setSaving(false);
  };

  // Top-down pyramid layout — includes prospect nodes (with nesting)
  const layoutTree = useCallback(() => {
    const nodes = [];
    const edges = [];
    const NODE_W = 120, NODE_H = 50, H_GAP = 20, V_GAP = 70;
    const PROSPECT_W = 100, PROSPECT_H = 40;

    // Recursive: get subtree width including prospect chains
    const getProspectsUnder = (nodeId) => prospects.filter(p => p.parentNodeId === nodeId);

    const getSubtreeWidth = (children, parentId) => {
      const pChildren = getProspectsUnder(parentId);
      const iboWidth = (!children || children.length === 0) ? 0 :
        children.reduce((sum, c) => sum + getSubtreeWidth(c.children, c.id), 0) + H_GAP * (children.length - 1);
      // Prospect chains can have their own sub-prospects
      const getProspectChainWidth = (prospectId) => {
        const subProspects = getProspectsUnder(prospectId);
        if (subProspects.length === 0) return PROSPECT_W;
        const childWidths = subProspects.reduce((sum, sp) => sum + getProspectChainWidth(sp.id), 0) + H_GAP * (subProspects.length - 1);
        return Math.max(PROSPECT_W, childWidths);
      };
      const prospectWidth = pChildren.length > 0
        ? pChildren.reduce((sum, p) => sum + getProspectChainWidth(p.id), 0) + H_GAP * (pChildren.length - 1)
        : 0;
      const totalChildren = iboWidth + (iboWidth > 0 && prospectWidth > 0 ? H_GAP : 0) + prospectWidth;
      return Math.max(NODE_W, totalChildren);
    };

    // Root node
    const centerLabel = partnerName ? `${userName} & ${partnerName}` : userName;
    const rootId = tree.user.id || 'root';
    // Compute root's leg/IBO counts
    const countAllIbos = (nodes) => {
      let c = 0;
      for (const n of (nodes || [])) { c += 1; if (n.children) c += countAllIbos(n.children); }
      return c;
    };
    const rootLegs = downline.length;
    const rootIbos = countAllIbos(downline);
    const countAllProspects = (nodeId) => {
      const direct = prospects.filter(p => p.parentNodeId === nodeId);
      let count = direct.length;
      const countSub = (pid) => {
        const subs = prospects.filter(p => p.parentNodeId === pid);
        count += subs.length;
        subs.forEach(sp => countSub(sp.id));
      };
      direct.forEach(p => countSub(p.id));
      return count;
    };
    const rootProspectCount = countAllProspects(rootId);
    const rootNode = {
      id: rootId, x: 0, y: 0,
      label: centerLabel,
      w: NODE_W + 30, h: NODE_H + 10,
      color: colors.gold, isRoot: true, depth: 0,
      profileId: rootId,
      legCount: rootLegs, iboCount: rootIbos, prospectCount: rootProspectCount,
    };
    nodes.push(rootNode);

    const totalTreeWidth = getSubtreeWidth(downline, rootId);

    // Recursively place prospect chains (prospect → sub-prospect → sub-sub-prospect...)
    const placeProspectChain = (prospectId, parentId, px, py, availW, startX, depth, legColor) => {
      const prospect = prospects.find(p => p.id === prospectId);
      if (!prospect) return;

      const cx = px;
      const cy = py;

      nodes.push({
        id: prospect.id,
        x: cx, y: cy,
        label: prospect.name,
        w: PROSPECT_W, h: PROSPECT_H,
        color: PROSPECT_STATUSES[prospect.status]?.color || '#f59e0b',
        depth,
        isProspect: true,
        prospectStatus: prospect.status,
        prospectId: prospect.id,
        prospectData: prospect,
      });

      edges.push({ from: parentId, to: prospect.id, color: legColor || 'rgba(26,26,26,0.2)', isDashed: true });

      // Place child prospects under this prospect
      const subProspects = getProspectsUnder(prospect.id);
      if (subProspects.length > 0) {
        const getChainW = (pid) => {
          const subs = getProspectsUnder(pid);
          if (subs.length === 0) return PROSPECT_W;
          return Math.max(PROSPECT_W, subs.reduce((s, sp) => s + getChainW(sp.id), 0) + H_GAP * (subs.length - 1));
        };
        const totalW = subProspects.reduce((s, sp) => s + getChainW(sp.id), 0) + H_GAP * (subProspects.length - 1);
        let cursor = cx - totalW / 2;

        subProspects.forEach(sp => {
          const spW = getChainW(sp.id);
          const spCx = cursor + spW / 2;
          const spCy = cy + V_GAP + PROSPECT_H;
          placeProspectChain(sp.id, prospect.id, spCx, spCy, spW, cursor, depth + 1, legColor);
          cursor += spW + H_GAP;
        });
      }
    };

    const placeChildren = (children, parentId, parentX, parentY, startX, availableWidth, depth, legIdx) => {
      if (depth > 8) return;

      const iboChildren = children || [];
      const parentProspects = getProspectsUnder(parentId);

      if (iboChildren.length === 0 && parentProspects.length === 0) return;

      // Calculate widths
      const iboWidths = iboChildren.map(c => getSubtreeWidth(c.children, c.id));
      const iboTotal = iboWidths.reduce((a, b) => a + b, 0) + (iboChildren.length > 0 ? H_GAP * (iboChildren.length - 1) : 0);

      const getChainW = (pid) => {
        const subs = getProspectsUnder(pid);
        if (subs.length === 0) return PROSPECT_W;
        return Math.max(PROSPECT_W, subs.reduce((s, sp) => s + getChainW(sp.id), 0) + H_GAP * (subs.length - 1));
      };
      const prospectTotal = parentProspects.length > 0
        ? parentProspects.reduce((s, p) => s + getChainW(p.id), 0) + H_GAP * (parentProspects.length - 1)
        : 0;

      const gap = iboTotal > 0 && prospectTotal > 0 ? H_GAP : 0;
      const totalNeeded = iboTotal + gap + prospectTotal;
      let cursorX = startX + (availableWidth - totalNeeded) / 2;

      // Place IBO children first
      iboChildren.forEach((child, i) => {
        const subtreeW = iboWidths[i];
        const cx = cursorX + subtreeW / 2;
        const cy = parentY + V_GAP + NODE_H;

        const displayName = child.partner_name
          ? `${child.full_name} & ${child.partner_name}`
          : (child.full_name || 'Unnamed');

        const colorIdx = depth === 1 ? i : legIdx;
        const nodeColor = LEG_COLORS[colorIdx % LEG_COLORS.length];
        const nodeId = child.id || `node-${nodes.length}`;

        // Compute legs (direct children), total IBOs (all descendants), and prospect count
        const directLegs = (child.children || []).length;
        const countIbos = (nodes) => {
          let c = 0;
          for (const n of (nodes || [])) { c += 1; if (n.children) c += countIbos(n.children); }
          return c;
        };
        const totalIbos = countIbos(child.children);
        // Count all prospects under this IBO (recursively)
        const countProspectsUnder = (nodeId) => {
          const direct = getProspectsUnder(nodeId);
          let count = direct.length;
          const countSubProspects = (pid) => {
            const subs = getProspectsUnder(pid);
            count += subs.length;
            subs.forEach(sp => countSubProspects(sp.id));
          };
          direct.forEach(p => countSubProspects(p.id));
          return count;
        };
        const prospectCount = countProspectsUnder(nodeId);

        nodes.push({
          id: nodeId, x: cx, y: cy,
          label: displayName,
          w: NODE_W, h: NODE_H, color: nodeColor,
          depth, totalDescendants: child.totalDescendants || 0,
          legCount: directLegs, iboCount: totalIbos, prospectCount,
          role: child.role, profileId: nodeId,
        });

        edges.push({ from: parentId, to: nodeId, color: nodeColor });

        if ((child.children && child.children.length > 0) || prospects.some(p => p.parentNodeId === nodeId)) {
          placeChildren(child.children, nodeId, cx, cy, cursorX, subtreeW, depth + 1, colorIdx);
        }

        cursorX += subtreeW + H_GAP;
      });

      // Place prospect nodes after IBOs
      if (gap > 0) cursorX += gap - H_GAP;
      parentProspects.forEach((prospect) => {
        const chainW = getChainW(prospect.id);
        const cx = cursorX + chainW / 2;
        const cy = parentY + V_GAP + NODE_H;
        const legColor = depth === 1 ? LEG_COLORS[(iboChildren.length) % LEG_COLORS.length] : LEG_COLORS[legIdx % LEG_COLORS.length];

        placeProspectChain(prospect.id, parentId, cx, cy, chainW, cursorX, depth, legColor);
        cursorX += chainW + H_GAP;
      });
    };

    placeChildren(downline, rootId, 0, 0, -totalTreeWidth / 2, totalTreeWidth, 1, 0);

    return { nodes, edges };
  }, [tree, downline, userName, partnerName, prospects]);

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

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw edges
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
      ctx.strokeStyle = edge.color + (edge.isDashed ? '60' : '50');
      ctx.lineWidth = (edge.isDashed ? 1 : 1.5) * scale;
      if (edge.isDashed) ctx.setLineDash([4 * scale, 3 * scale]);
      else ctx.setLineDash([]);
      ctx.moveTo(fx, fy);
      ctx.bezierCurveTo(fx, midY, tx, midY, tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);
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

      const r = 4 * scale;

      if (node.isProspect) {
        const status = node.prospectStatus;
        const statusDef = PROSPECT_STATUSES[status] || PROSPECT_STATUSES.looking;

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

        ctx.fillStyle = highlight ? statusDef.color + '15' : 'rgba(255,255,255,0.7)';
        ctx.fill();

        if (status === 'looking') {
          ctx.strokeStyle = highlight ? statusDef.color + '40' : 'transparent';
          ctx.lineWidth = 1 * scale;
          ctx.stroke();
        } else if (status === 'qi_complete') {
          ctx.strokeStyle = 'transparent';
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(nx - w/2 + 4 * scale, ny + h/2);
          ctx.lineTo(nx + w/2 - 4 * scale, ny + h/2);
          ctx.strokeStyle = statusDef.color;
          ctx.lineWidth = 2 * scale;
          ctx.stroke();
        } else if (status === 'saw_plan') {
          ctx.setLineDash([4 * scale, 3 * scale]);
          ctx.strokeStyle = highlight ? statusDef.color : statusDef.color + '80';
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Small status dot
        ctx.beginPath();
        ctx.arc(nx - w/2 + 8 * scale, ny, 3 * scale, 0, Math.PI * 2);
        ctx.fillStyle = statusDef.color;
        ctx.fill();

        // Label
        const fontSize = Math.max(7, Math.min(10, 9 * scale));
        ctx.font = `italic 500 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(26,26,26,0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let label = node.label;
        const maxWidth = w - 20 * scale;
        while (ctx.measureText(label).width > maxWidth && label.length > 3) {
          label = label.slice(0, -4) + '...';
        }
        ctx.fillText(label, nx + 4 * scale, ny);

        // Vitals hint: show next step as small text inside the node bottom area
        const pd = node.prospectData;
        if (pd?.vitals && scale > 0.5) {
          const nextStep = pd.vitals.nextStep;
          if (nextStep) {
            ctx.font = `${Math.max(5, 6.5 * scale)}px Inter, system-ui, sans-serif`;
            ctx.fillStyle = 'rgba(26,26,26,0.3)';
            ctx.fillText(nextStep, nx + 4 * scale, ny + h/2 - 4 * scale);
          }
        }

      } else {
        // IBO node rendering
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

        if (!node.isRoot) {
          ctx.fillStyle = node.color + '60';
          ctx.fillRect(nx - w/2, ny - h/2, 3 * scale, h);
        }

        const fontSize = Math.max(8, Math.min(12, 11 * scale));
        ctx.font = `${node.isRoot ? '600 ' : '500 '}${fontSize}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = colors.dark;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let label = node.label;
        const maxWidth = w - 12 * scale;
        // Use initials when name is too wide
        if (ctx.measureText(label).width > maxWidth && !node.isRoot) {
          const parts = label.split(' & ');
          const toInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase();
          if (parts.length === 2) {
            label = `${toInitials(parts[0])} & ${toInitials(parts[1])}`;
          } else {
            label = toInitials(label);
          }
        }
        while (ctx.measureText(label).width > maxWidth && label.length > 3) {
          label = label.slice(0, -4) + '...';
        }
        const hasTeamInfo = node.legCount > 0 || node.iboCount > 0;
        ctx.fillText(label, nx, ny - (hasTeamInfo && scale > 0.5 ? 7 * scale : 0));

        if (scale > 0.5 && hasTeamInfo) {
          ctx.font = `${Math.max(7, 9 * scale)}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = 'rgba(26,26,26,0.35)';
          let countText = `${node.legCount}/${node.iboCount}`;
          if (includeProspectsInCount && node.prospectCount > 0) {
            countText += ` +${node.prospectCount}p`;
          }
          ctx.fillText(countText, nx, ny + 8 * scale);
        }
      }
    }
  }, [layoutNodes, layoutEdges, transform, hoveredNode, selectedNode, includeProspectsInCount]);

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
        found = node.id; break;
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
        setEditingVitals(false);
        return;
      }
    }
    setSelectedNode(null);
    setAddingProspect(null);
    setEditingVitals(false);
  };

  // Touch
  const lastTouchRef = useRef(null);
  const lastPinchRef = useRef(null);
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    else if (e.touches.length === 2) {
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

  // Share / capture
  const handleShare = useCallback(async () => {
    if (sharing || layoutNodes.length === 0) return;
    setSharing(true);
    try {
      const PADDING = 40, SCALE = 2;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const n of layoutNodes) {
        minX = Math.min(minX, n.x - n.w / 2); maxX = Math.max(maxX, n.x + n.w / 2);
        minY = Math.min(minY, n.y - n.h / 2); maxY = Math.max(maxY, n.y + n.h / 2);
      }
      const treeW = maxX - minX + PADDING * 2;
      const treeH = maxY - minY + PADDING * 2 + 40;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = treeW * SCALE; offCanvas.height = treeH * SCALE;
      const ctx = offCanvas.getContext('2d');
      ctx.scale(SCALE, SCALE);
      ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, treeW, treeH);
      const offsetX = -minX + PADDING, offsetY = -minY + PADDING;

      // Edges
      for (const edge of layoutEdges) {
        const fromNode = layoutNodes.find(n => n.id === edge.from);
        const toNode = layoutNodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) continue;
        ctx.beginPath();
        ctx.strokeStyle = edge.color + (edge.isDashed ? '60' : '50');
        ctx.lineWidth = edge.isDashed ? 1 : 1.5;
        if (edge.isDashed) ctx.setLineDash([4, 3]); else ctx.setLineDash([]);
        const fx = offsetX + fromNode.x, fy = offsetY + fromNode.y + fromNode.h / 2;
        const tx = offsetX + toNode.x, ty = offsetY + toNode.y - toNode.h / 2;
        ctx.moveTo(fx, fy); ctx.bezierCurveTo(fx, (fy+ty)/2, tx, (fy+ty)/2, tx, ty); ctx.stroke();
        ctx.setLineDash([]);
      }
      // Nodes
      for (const node of layoutNodes) {
        const nx = offsetX + node.x, ny = offsetY + node.y, w = node.w, h = node.h, r = 4;
        ctx.beginPath();
        ctx.moveTo(nx-w/2+r,ny-h/2); ctx.lineTo(nx+w/2-r,ny-h/2);
        ctx.arcTo(nx+w/2,ny-h/2,nx+w/2,ny-h/2+r,r); ctx.lineTo(nx+w/2,ny+h/2-r);
        ctx.arcTo(nx+w/2,ny+h/2,nx+w/2-r,ny+h/2,r); ctx.lineTo(nx-w/2+r,ny+h/2);
        ctx.arcTo(nx-w/2,ny+h/2,nx-w/2,ny+h/2-r,r); ctx.lineTo(nx-w/2,ny-h/2+r);
        ctx.arcTo(nx-w/2,ny-h/2,nx-w/2+r,ny-h/2,r); ctx.closePath();

        if (node.isProspect) {
          const statusDef = PROSPECT_STATUSES[node.prospectStatus] || PROSPECT_STATUSES.looking;
          ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill();
          if (node.prospectStatus === 'saw_plan') {
            ctx.setLineDash([4,3]); ctx.strokeStyle = statusDef.color+'80'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
          } else if (node.prospectStatus === 'qi_complete') {
            ctx.strokeStyle = 'transparent'; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(nx-w/2+4, ny+h/2); ctx.lineTo(nx+w/2-4, ny+h/2);
            ctx.strokeStyle = statusDef.color; ctx.lineWidth = 2; ctx.stroke();
          } else { ctx.strokeStyle = 'transparent'; ctx.stroke(); }
          ctx.beginPath(); ctx.arc(nx-w/2+8, ny, 3, 0, Math.PI*2); ctx.fillStyle = statusDef.color; ctx.fill();
          ctx.font = 'italic 500 9px Inter, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(26,26,26,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          let label = node.label;
          while (ctx.measureText(label).width > w-20 && label.length > 3) label = label.slice(0,-4)+'...';
          ctx.fillText(label, nx+4, ny);
        } else {
          ctx.fillStyle = node.isRoot ? 'rgba(184,149,107,0.1)' : 'white'; ctx.fill();
          ctx.strokeStyle = node.isRoot ? 'rgba(184,149,107,0.4)' : 'rgba(26,26,26,0.12)'; ctx.lineWidth = 1; ctx.stroke();
          if (!node.isRoot) { ctx.fillStyle = node.color+'60'; ctx.fillRect(nx-w/2, ny-h/2, 3, h); }
          ctx.font = `${node.isRoot ? '600' : '500'} 11px Inter, system-ui, sans-serif`;
          ctx.fillStyle = colors.dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          let label = node.label;
          // Use initials if too wide
          if (ctx.measureText(label).width > w - 12 && !node.isRoot) {
            const parts = label.split(' & ');
            const toInit = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase();
            label = parts.length === 2 ? `${toInit(parts[0])} & ${toInit(parts[1])}` : toInit(label);
          }
          while (ctx.measureText(label).width > w-12 && label.length > 3) label = label.slice(0,-4)+'...';
          const hasInfo = node.legCount > 0 || node.iboCount > 0;
          ctx.fillText(label, nx, ny - (hasInfo ? 7 : 0));
          if (hasInfo) {
            ctx.font = '9px Inter, system-ui, sans-serif'; ctx.fillStyle = 'rgba(26,26,26,0.35)';
            ctx.fillText(`${node.legCount}/${node.iboCount}`, nx, ny + 8);
          }
        }
      }
      ctx.font = '500 10px Inter, system-ui, sans-serif'; ctx.fillStyle = 'rgba(26,26,26,0.2)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('Freedom Family \u00b7 ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' }), treeW / 2, treeH - 12);

      const blob = await new Promise(resolve => offCanvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'freedom-family-los.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My LOS Drawing' });
      } else {
        const url = URL.createObjectURL(blob); const a = document.createElement('a');
        a.href = url; a.download = 'freedom-family-los.png'; a.click(); URL.revokeObjectURL(url);
      }
    } catch (err) { if (err.name !== 'AbortError') console.error('Share failed:', err); }
    setSharing(false);
  }, [layoutNodes, layoutEdges, sharing]);

  const selectedInfo = selectedNode ? layoutNodes.find(n => n.id === selectedNode) : null;

  // Mobile-first panel styles
  const panelStyle = {
    position: 'absolute', bottom: '12px', left: '12px', right: '12px',
    background: 'white', padding: '14px 16px',
    maxWidth: '320px', borderRadius: '6px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxHeight: '50vh', overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  };

  const btnStyle = (bg, fg) => ({
    padding: '8px 12px', fontSize: '12px', background: bg, color: fg,
    border: 'none', cursor: saving ? 'wait' : 'pointer', borderRadius: '4px',
    letterSpacing: '0.03em', opacity: saving ? 0.6 : 1,
    WebkitTapHighlightColor: 'transparent',
    minHeight: '36px',
  });

  const smallInputStyle = {
    width: '100%', padding: '8px 10px', border: '1px solid rgba(26,26,26,0.12)',
    outline: 'none', fontSize: '14px', color: colors.dark, boxSizing: 'border-box',
    borderRadius: '3px', background: 'white',
    WebkitAppearance: 'none',
  };

  const vitalsLabelStyle = {
    fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'rgba(26,26,26,0.4)', display: 'block', marginBottom: '3px',
  };

  // Get prospect data for selected prospect
  const selectedProspect = selectedInfo?.isProspect ? prospects.find(p => p.id === selectedInfo.prospectId) : null;

  return (
    <div ref={containerRef} style={{
      position: fullscreen ? 'fixed' : 'relative',
      ...(fullscreen ? { inset: 0, zIndex: 999, borderRadius: 0 } : { width: '100%', height: 'min(75vh, 600px)', minHeight: '350px', borderRadius: '6px' }),
      background: colors.bg, border: fullscreen ? 'none' : '1px solid rgba(26,26,26,0.08)', overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        onWheel={handleWheel} onClick={handleClick}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      />

      {/* Controls — mobile-friendly sizing */}
      <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 10 }}>
        {/* Prospect toggle */}
        <button onClick={() => setIncludeProspectsInCount(prev => !prev)} aria-label="Toggle prospect count"
          title={includeProspectsInCount ? 'Hide prospects in count' : 'Include prospects in count'}
          style={{ height: '44px', padding: '0 10px', background: includeProspectsInCount ? 'rgba(184,149,107,0.12)' : 'white', border: `1px solid ${includeProspectsInCount ? 'rgba(184,149,107,0.3)' : 'rgba(26,26,26,0.15)'}`, cursor: 'pointer', fontSize: '10px', color: includeProspectsInCount ? colors.gold : 'rgba(26,26,26,0.4)', borderRadius: '6px', letterSpacing: '0.03em' }}>
          +P
        </button>
        <button onClick={() => setFullscreen(prev => !prev)} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          style={{ width: '44px', height: '44px', background: fullscreen ? 'rgba(184,149,107,0.12)' : 'white', border: `1px solid ${fullscreen ? 'rgba(184,149,107,0.3)' : 'rgba(26,26,26,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
          {fullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" /></svg>
          )}
        </button>
        <button onClick={handleShare} disabled={sharing} aria-label="Share drawing"
          style={{ width: '44px', height: '44px', background: sharing ? 'rgba(184,149,107,0.15)' : 'white', border: `1px solid ${sharing ? 'rgba(184,149,107,0.3)' : 'rgba(26,26,26,0.15)'}`, cursor: sharing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sharing ? colors.gold : colors.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }))} aria-label="Zoom in"
          style={{ width: '44px', height: '44px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, borderRadius: '6px' }}>+</button>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.15, prev.scale * 0.8) }))} aria-label="Zoom out"
          style={{ width: '44px', height: '44px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, borderRadius: '6px' }}>{'\u2212'}</button>
        <button onClick={resetView} aria-label="Reset view"
          style={{ height: '44px', padding: '0 14px', background: 'white', border: '1px solid rgba(26,26,26,0.15)', cursor: 'pointer', fontSize: '12px', color: 'rgba(26,26,26,0.5)', borderRadius: '6px' }}>Reset</button>
      </div>

      {/* Legend — collapsible */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(26,26,26,0.08)', fontSize: '10px', borderRadius: '6px', maxWidth: '180px', zIndex: 5, overflow: 'hidden' }}>
        <button onClick={() => setLegendOpen(!legendOpen)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', gap: '6px',
        }}>
          <span style={{ fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)' }}>Legend</span>
          <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.3)', transform: legendOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', lineHeight: 1 }}>{'\u25BE'}</span>
        </button>
        {legendOpen && (
          <div style={{ padding: '0 10px 8px' }}>
            {downline.length > 0 && (
              <>
                <p style={{ margin: '0 0 4px', color: 'rgba(26,26,26,0.4)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Legs</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {downline.slice(0, 6).map((leg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: LEG_COLORS[i % LEG_COLORS.length] }} />
                      <span style={{ color: 'rgba(26,26,26,0.5)', fontSize: '10px' }}>{leg.full_name?.split(' ')[0] || `Leg ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p style={{ margin: '0 0 3px', color: 'rgba(26,26,26,0.4)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Prospects</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '12px', background: 'rgba(245,158,11,0.08)', borderRadius: '2px' }} />
                <span style={{ color: 'rgba(26,26,26,0.5)' }}>Looking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: '2px', borderBottom: '2px solid #3b82f6' }} />
                <span style={{ color: 'rgba(26,26,26,0.5)' }}>QI Complete</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '12px', background: 'rgba(168,85,247,0.08)', borderRadius: '2px', border: '1.5px dashed #a855f7' }} />
                <span style={{ color: 'rgba(26,26,26,0.5)' }}>Saw the Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '12px', background: 'white', borderRadius: '2px', border: '1.5px solid rgba(26,26,26,0.15)' }} />
                <span style={{ color: 'rgba(26,26,26,0.5)' }}>IBO</span>
              </div>
            </div>
            <p style={{ margin: '6px 0 2px', color: 'rgba(26,26,26,0.4)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Counts</p>
            <span style={{ color: 'rgba(26,26,26,0.5)', fontSize: '9px' }}>legs / IBOs</span>
          </div>
        )}
      </div>

      {/* Selected IBO node — actions panel */}
      {selectedInfo && !selectedInfo.isProspect && !addingProspect && (
        <div style={{ ...panelStyle, border: `1px solid ${selectedInfo.color}40` }}>
          <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: '0 0 4px' }}>{selectedInfo.label}</p>
          {(selectedInfo.legCount > 0 || selectedInfo.iboCount > 0) && (
            <p style={{ fontSize: '11px', color: selectedInfo.color, margin: '0 0 10px' }}>
              {selectedInfo.legCount} leg{selectedInfo.legCount !== 1 ? 's' : ''}, {selectedInfo.iboCount} IBO{selectedInfo.iboCount !== 1 ? 's' : ''}
            </p>
          )}
          <button
            onClick={() => { setAddingProspect(selectedInfo.profileId || selectedInfo.id); setSelectedNode(null); }}
            style={{ ...btnStyle(colors.gold, 'white'), display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
          >
            <span style={{ fontSize: '16px', fontWeight: 700 }}>+</span> Add Prospect
          </button>
        </div>
      )}

      {/* Selected PROSPECT node — detail panel with vitals */}
      {selectedInfo && selectedInfo.isProspect && !addingProspect && (
        <div style={{ ...panelStyle, border: `1px solid ${selectedInfo.color}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <p style={{ fontSize: '15px', fontWeight: 500, color: colors.dark, margin: 0 }}>{selectedInfo.label}</p>
            <button onClick={() => deleteProspect(selectedInfo.prospectId)} disabled={saving}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '18px', padding: '4px 8px', minHeight: '36px' }}
              title="Delete prospect"
            >{'\u2715'}</button>
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Status: {PROSPECT_STATUSES[selectedInfo.prospectStatus]?.label || 'Unknown'}
          </p>

          {/* Vitals display */}
          {selectedProspect?.vitals && Object.keys(selectedProspect.vitals).length > 0 && !editingVitals && (
            <div style={{ marginBottom: '10px', padding: '8px 10px', background: 'rgba(26,26,26,0.02)', borderRadius: '4px', border: '1px solid rgba(26,26,26,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                {selectedProspect.vitals.age && <VitalRow label="Age" value={selectedProspect.vitals.age} />}
                {selectedProspect.vitals.relationship && <VitalRow label="Status" value={selectedProspect.vitals.relationship} />}
                {selectedProspect.vitals.kids !== undefined && <VitalRow label="Kids" value={selectedProspect.vitals.kids} />}
                {selectedProspect.vitals.city && <VitalRow label="City" value={selectedProspect.vitals.city} />}
                {selectedProspect.vitals.occupation && <VitalRow label="Work" value={selectedProspect.vitals.occupation} />}
              </div>
              {selectedProspect.vitals.nextStep && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
                  <span style={{ fontSize: '10px', color: colors.gold, fontWeight: 600 }}>Next: {selectedProspect.vitals.nextStep}</span>
                  {selectedProspect.vitals.nextStepDate && (
                    <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', marginLeft: '8px' }}>
                      {new Date(selectedProspect.vitals.nextStepDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Vitals edit form */}
          {editingVitals && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={vitalsLabelStyle}>Age</label>
                  <input type="text" inputMode="numeric" value={editVitalsForm.age || ''} onChange={e => setEditVitalsForm(prev => ({...prev, age: e.target.value}))} placeholder="—" style={smallInputStyle} />
                </div>
                <div>
                  <label style={vitalsLabelStyle}>Relationship</label>
                  <select value={editVitalsForm.relationship || ''} onChange={e => setEditVitalsForm(prev => ({...prev, relationship: e.target.value}))} style={{ ...smallInputStyle, height: '36px' }}>
                    <option value="">—</option>
                    {RELATIONSHIP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={vitalsLabelStyle}>Kids</label>
                  <input type="text" inputMode="numeric" value={editVitalsForm.kids ?? ''} onChange={e => setEditVitalsForm(prev => ({...prev, kids: e.target.value}))} placeholder="0" style={smallInputStyle} />
                </div>
                <div>
                  <label style={vitalsLabelStyle}>City</label>
                  <input type="text" value={editVitalsForm.city || ''} onChange={e => setEditVitalsForm(prev => ({...prev, city: e.target.value}))} placeholder="—" style={smallInputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={vitalsLabelStyle}>Occupation</label>
                  <input type="text" value={editVitalsForm.occupation || ''} onChange={e => setEditVitalsForm(prev => ({...prev, occupation: e.target.value}))} placeholder="—" style={smallInputStyle} />
                </div>
                <div>
                  <label style={vitalsLabelStyle}>Next Step</label>
                  <select value={editVitalsForm.nextStep || ''} onChange={e => setEditVitalsForm(prev => ({...prev, nextStep: e.target.value}))} style={{ ...smallInputStyle, height: '36px' }}>
                    <option value="">—</option>
                    {NEXT_STEP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={vitalsLabelStyle}>Date</label>
                  <input type="date" value={editVitalsForm.nextStepDate || ''} onChange={e => setEditVitalsForm(prev => ({...prev, nextStepDate: e.target.value}))} style={smallInputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={async () => {
                  await updateProspect(selectedInfo.prospectId, { vitals: editVitalsForm });
                  setEditingVitals(false);
                }} disabled={saving} style={{ ...btnStyle(colors.gold, 'white'), flex: 1, textAlign: 'center' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingVitals(false)} style={{ ...btnStyle('rgba(26,26,26,0.04)', 'rgba(26,26,26,0.5)'), flex: 1, textAlign: 'center' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status change buttons */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {Object.entries(PROSPECT_STATUSES).map(([key, val]) => (
              <button key={key}
                onClick={() => updateProspect(selectedInfo.prospectId, { status: key })}
                disabled={saving || selectedInfo.prospectStatus === key}
                style={{
                  ...btnStyle(
                    selectedInfo.prospectStatus === key ? val.color : 'rgba(26,26,26,0.04)',
                    selectedInfo.prospectStatus === key ? 'white' : 'rgba(26,26,26,0.5)'
                  ),
                  flex: 1, textAlign: 'center', minWidth: '60px',
                  opacity: selectedInfo.prospectStatus === key ? 1 : (saving ? 0.5 : 0.8),
                }}
              >
                {val.short}
              </button>
            ))}
          </div>

          {/* Action buttons row */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {/* Edit vitals */}
            {!editingVitals && (
              <button onClick={() => { setEditVitalsForm(selectedProspect?.vitals || {}); setEditingVitals(true); }}
                style={{ ...btnStyle('rgba(26,26,26,0.04)', 'rgba(26,26,26,0.6)'), flex: 1, textAlign: 'center' }}>
                {selectedProspect?.vitals && Object.keys(selectedProspect.vitals).length > 0 ? 'Edit Info' : 'Add Info'}
              </button>
            )}
            {/* Add sub-prospect */}
            <button onClick={() => { setAddingProspect(selectedInfo.prospectId); setSelectedNode(null); }}
              style={{ ...btnStyle('rgba(26,26,26,0.04)', 'rgba(26,26,26,0.6)'), flex: 1, textAlign: 'center' }}>
              + Prospect
            </button>
          </div>

          {/* Convert to IBO */}
          <button
            onClick={() => {
              const link = `${window.location.origin}/join`;
              if (navigator.share) {
                navigator.share({ title: 'Join Freedom Family', text: `Hey ${selectedInfo.label}! Create your account:`, url: link });
              } else {
                navigator.clipboard.writeText(link).then(() => alert('Invite link copied!'));
              }
            }}
            style={{ ...btnStyle(colors.dark, colors.bg), width: '100%', textAlign: 'center', marginTop: '6px' }}
          >
            Convert to IBO {'\u2192'} Send Invite
          </button>
        </div>
      )}

      {/* Add Prospect Modal */}
      {addingProspect && (
        <div style={{ ...panelStyle, border: `1px solid rgba(184,149,107,0.3)` }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.4)', margin: '0 0 10px' }}>New Prospect</p>
          <input
            type="text"
            placeholder="Name"
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            autoFocus
            style={{ ...smallInputStyle, marginBottom: '8px', fontSize: '16px', padding: '10px 12px' }}
            onKeyDown={(e) => { if (e.key === 'Enter' && prospectName.trim()) addProspect(prospectName, addingProspect, prospectStatus, prospectVitals); }}
          />
          {/* Status selector */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {Object.entries(PROSPECT_STATUSES).map(([key, val]) => (
              <button key={key}
                onClick={() => setProspectStatus(key)}
                style={{
                  ...btnStyle(prospectStatus === key ? val.color : 'rgba(26,26,26,0.04)', prospectStatus === key ? 'white' : 'rgba(26,26,26,0.5)'),
                  flex: 1, textAlign: 'center',
                }}
              >
                {val.short}
              </button>
            ))}
          </div>

          {/* Quick vitals (optional, collapsible) */}
          <details style={{ marginBottom: '10px' }}>
            <summary style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', cursor: 'pointer', padding: '4px 0', userSelect: 'none' }}>
              Add details (optional)
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
              <div>
                <label style={vitalsLabelStyle}>Age</label>
                <input type="text" inputMode="numeric" value={prospectVitals.age || ''} onChange={e => setProspectVitals(prev => ({...prev, age: e.target.value}))} style={smallInputStyle} />
              </div>
              <div>
                <label style={vitalsLabelStyle}>Relationship</label>
                <select value={prospectVitals.relationship || ''} onChange={e => setProspectVitals(prev => ({...prev, relationship: e.target.value}))} style={{ ...smallInputStyle, height: '36px' }}>
                  <option value="">—</option>
                  {RELATIONSHIP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={vitalsLabelStyle}>Kids</label>
                <input type="text" inputMode="numeric" value={prospectVitals.kids ?? ''} onChange={e => setProspectVitals(prev => ({...prev, kids: e.target.value}))} placeholder="0" style={smallInputStyle} />
              </div>
              <div>
                <label style={vitalsLabelStyle}>City</label>
                <input type="text" value={prospectVitals.city || ''} onChange={e => setProspectVitals(prev => ({...prev, city: e.target.value}))} style={smallInputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={vitalsLabelStyle}>Occupation</label>
                <input type="text" value={prospectVitals.occupation || ''} onChange={e => setProspectVitals(prev => ({...prev, occupation: e.target.value}))} style={smallInputStyle} />
              </div>
              <div>
                <label style={vitalsLabelStyle}>Next Step</label>
                <select value={prospectVitals.nextStep || ''} onChange={e => setProspectVitals(prev => ({...prev, nextStep: e.target.value}))} style={{ ...smallInputStyle, height: '36px' }}>
                  <option value="">—</option>
                  {NEXT_STEP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={vitalsLabelStyle}>Date</label>
                <input type="date" value={prospectVitals.nextStepDate || ''} onChange={e => setProspectVitals(prev => ({...prev, nextStepDate: e.target.value}))} style={smallInputStyle} />
              </div>
            </div>
          </details>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => { if (prospectName.trim()) addProspect(prospectName, addingProspect, prospectStatus, prospectVitals); }}
              disabled={!prospectName.trim() || saving}
              style={{ ...btnStyle(colors.gold, 'white'), flex: 1, textAlign: 'center' }}
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
            <button
              onClick={() => { setAddingProspect(null); setProspectName(''); setProspectVitals({}); }}
              style={{ ...btnStyle('rgba(26,26,26,0.04)', 'rgba(26,26,26,0.5)'), flex: 1, textAlign: 'center' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructions — hide when panel is open on mobile */}
      {!selectedInfo && !addingProspect && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: 'rgba(26,26,26,0.3)', zIndex: 5 }}>
          Scroll to zoom {'\u00b7'} Drag to pan {'\u00b7'} Tap node
        </div>
      )}
    </div>
  );
}

// Small helper component for vitals display
const VitalRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
    <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)' }}>{label}</span>
    <span style={{ fontSize: '11px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>{value}</span>
  </div>
);
