import { useState } from "react";
import { mockDiagrams, nextId } from "../../data/mockData";

function DiagramTool({ project }) {
  const existing = mockDiagrams.find(d => d.projectId === project.id);
  const [shapes, setShapes] = useState(existing?.shapes || []);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState("select");
  const [saved, setSaved] = useState(true);

  const addShape = (type) => {
    const shape = type === "rect"
      ? { id: `s${++nextId.shape}`, type: "rect", x: 120, y: 120, w: 140, h: 50, label: "New Box", color: "var(--accent)" }
      : type === "diamond"
      ? { id: `s${++nextId.shape}`, type: "diamond", x: 200, y: 150, w: 120, h: 80, label: "Decision", color: "var(--amber)" }
      : { id: `s${++nextId.shape}`, type: "circle", x: 200, y: 150, r: 40, label: "Node", color: "var(--green)" };
    setShapes(s => [...s, shape]);
    setSaved(false);
  };

  const addArrow = () => {
    const sh = shapes[shapes.length - 1];
    if (!sh) return;
    const newArr = { id: `s${++nextId.shape}`, type: "arrow", x1: sh.x + (sh.w||0)/2, y1: sh.y + (sh.h||0), x2: sh.x + (sh.w||0)/2, y2: sh.y + (sh.h||0) + 60 };
    setShapes(s => [...s, newArr]);
    setSaved(false);
  };

  const onMouseDown = (e, id) => {
    if (selectedTool !== "select") return;
    e.stopPropagation();
    const rect = e.currentTarget.closest("svg").getBoundingClientRect();
    const sh = shapes.find(s => s.id === id);
    setDragging(id);
    setOffset({ x: e.clientX - rect.left - (sh.x || sh.x1 || 0), y: e.clientY - rect.top - (sh.y || sh.y1 || 0) });
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - rect.left - offset.x;
    const ny = e.clientY - rect.top - offset.y;
    setShapes(prev => prev.map(s => s.id === dragging
      ? s.type === "arrow" ? { ...s, x1: nx, y1: ny, x2: nx + (s.x2 - s.x1), y2: ny + (s.y2 - s.y1) } : { ...s, x: nx, y: ny }
      : s));
    setSaved(false);
  };

  const renderShape = (s) => {
    const color = s.color === "var(--accent)" ? "#6366f1" : s.color === "var(--amber)" ? "#f59e0b" : s.color === "var(--green)" ? "#10b981" : s.color || "#6366f1";
    if (s.type === "arrow") {
      const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
      const len = Math.sqrt(dx*dx + dy*dy);
      const ux = dx/len, uy = dy/len;
      const hx = s.x2 - ux*12, hy = s.y2 - uy*12;
      const px = -uy*6, py = ux*6;
      return (
        <g key={s.id} onMouseDown={e => onMouseDown(e, s.id)} style={{ cursor: "move" }}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#8b91a8" strokeWidth="2" />
          <polygon points={`${s.x2},${s.y2} ${hx+px},${hy+py} ${hx-px},${hy-py}`} fill="#8b91a8" />
        </g>
      );
    }
    if (s.type === "diamond") {
      const cx = s.x + s.w/2, cy = s.y + s.h/2;
      const pts = `${cx},${s.y} ${s.x+s.w},${cy} ${cx},${s.y+s.h} ${s.x},${cy}`;
      return (
        <g key={s.id} onMouseDown={e => onMouseDown(e, s.id)} style={{ cursor: "move" }}>
          <polygon points={pts} fill={color + "25"} stroke={color} strokeWidth="1.5" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="11" fontFamily="DM Sans">{s.label}</text>
        </g>
      );
    }
    if (s.type === "circle") {
      return (
        <g key={s.id} onMouseDown={e => onMouseDown(e, s.id)} style={{ cursor: "move" }}>
          <circle cx={s.x} cy={s.y} r={s.r} fill={color + "25"} stroke={color} strokeWidth="1.5" />
          <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="11" fontFamily="DM Sans">{s.label}</text>
        </g>
      );
    }
    return (
      <g key={s.id} onMouseDown={e => onMouseDown(e, s.id)} style={{ cursor: "move" }}>
        <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="8" fill={color + "20"} stroke={color} strokeWidth="1.5" />
        <text x={s.x + s.w/2} y={s.y + s.h/2} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="12" fontFamily="DM Sans" fontWeight="600">{s.label}</text>
      </g>
    );
  };

  return (
    <div>
      <div className="diagram-canvas">
        <div className="diagram-toolbar">
          <button className={`btn-ghost ${selectedTool==="select"?"active":""}`} onClick={() => setSelectedTool("select")} style={{ fontSize: 12 }}>↖ Select</button>
          <button className="btn-ghost" onClick={() => addShape("rect")} style={{ fontSize: 12 }}>□ Box</button>
          <button className="btn-ghost" onClick={() => addShape("diamond")} style={{ fontSize: 12 }}>◇ Decision</button>
          <button className="btn-ghost" onClick={() => addShape("circle")} style={{ fontSize: 12 }}>○ Circle</button>
          <button className="btn-ghost" onClick={addArrow} style={{ fontSize: 12 }}>→ Arrow</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: saved ? "var(--green)" : "var(--amber)" }}>{saved ? "✓ Saved" : "Unsaved changes"}</span>
        </div>
        <svg width="100%" height="500" style={{ cursor: selectedTool === "select" ? "default" : "crosshair" }}
          onMouseMove={onMouseMove} onMouseUp={() => setDragging(null)}>
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {shapes.map(renderShape)}
        </svg>
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>Drag shapes to move • Use toolbar to add new shapes</div>
    </div>
  );
}

export default DiagramTool;
