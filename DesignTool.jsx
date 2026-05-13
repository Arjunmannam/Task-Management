import { useState, useRef, useEffect, useCallback } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  .dt-shell {
    display: flex;
    height: calc(100vh - 140px);
    background: #0d0e12;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  /* ── Toolbar (top) ── */
  .dt-topbar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 44px;
    background: #13151c;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 10px;
    z-index: 20;
  }
  .dt-tool-btn {
    width: 32px; height: 32px;
    border-radius: 7px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #8b91a8;
    transition: all 0.15s;
    font-size: 13px;
    position: relative;
  }
  .dt-tool-btn:hover { background: rgba(255,255,255,0.07); color: #e8eaf0; }
  .dt-tool-btn.active { background: rgba(99,102,241,0.25); color: #818cf8; }
  .dt-tool-btn .tooltip {
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8eaf0;
    font-size: 10px;
    padding: 3px 7px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 100;
  }
  .dt-tool-btn:hover .tooltip { opacity: 1; }
  .dt-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.08); margin: 0 6px; }
  .dt-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .dt-zoom-ctrl { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #8b91a8; }
  .dt-zoom-ctrl button { background: transparent; border: none; color: #8b91a8; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
  .dt-zoom-ctrl button:hover { background: rgba(255,255,255,0.07); color: #e8eaf0; }
  .dt-zoom-val { min-width: 36px; text-align: center; font-size: 11px; }
  .dt-btn-primary { background: #6366f1; color: white; border: none; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .dt-btn-primary:hover { background: #818cf8; }

  /* ── Left Panel (layers + components) ── */
  .dt-left {
    width: 220px;
    flex-shrink: 0;
    background: #13151c;
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    margin-top: 44px;
    overflow: hidden;
  }
  .dt-panel-tabs {
    display: flex;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .dt-ptab {
    flex: 1;
    padding: 9px 0;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #555c72;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
  }
  .dt-ptab:hover { color: #8b91a8; }
  .dt-ptab.active { color: #818cf8; border-bottom-color: #6366f1; }

  .dt-panel-body { overflow-y: auto; flex: 1; padding: 8px; }

  .dt-layer-item {
    display: flex; align-items: center; gap: 7px;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #8b91a8;
    font-size: 11px;
    transition: all 0.15s;
    user-select: none;
  }
  .dt-layer-item:hover { background: rgba(255,255,255,0.05); color: #e8eaf0; }
  .dt-layer-item.selected { background: rgba(99,102,241,0.2); color: #818cf8; }
  .dt-layer-icon { width: 14px; height: 14px; flex-shrink: 0; opacity: 0.7; }
  .dt-layer-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dt-layer-eye { opacity: 0; cursor: pointer; }
  .dt-layer-item:hover .dt-layer-eye { opacity: 1; }

  .dt-component-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 4px; }
  .dt-comp-card {
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 10px 8px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-size: 10px;
    color: #8b91a8;
  }
  .dt-comp-card:hover { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.08); }
  .dt-comp-preview { height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
  .dt-section-label { font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #555c72; padding: 10px 8px 4px; }

  /* ── Canvas ── */
  .dt-canvas-wrap {
    flex: 1;
    overflow: hidden;
    position: relative;
    margin-top: 44px;
    background:
      radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%),
      #0d0e12;
    cursor: default;
  }
  .dt-canvas-inner {
    position: absolute;
    top: 0; left: 0;
    transform-origin: 0 0;
  }
  .dt-grid-svg { position: absolute; top: 0; left: 0; pointer-events: none; }

  .dt-frame {
    position: absolute;
    outline: none;
  }
  .dt-frame-label {
    position: absolute;
    top: -18px; left: 0;
    font-size: 10px;
    color: #555c72;
    white-space: nowrap;
    pointer-events: none;
    font-family: 'DM Sans', sans-serif;
  }
  .dt-element {
    position: absolute;
    cursor: move;
    user-select: none;
    transition: box-shadow 0.1s;
  }
  .dt-element.selected {
    outline: 2px solid #6366f1;
    outline-offset: 1px;
  }
  .dt-element:hover:not(.selected) {
    outline: 1px solid rgba(99,102,241,0.5);
    outline-offset: 1px;
  }
  .dt-resize-handle {
    position: absolute;
    width: 8px; height: 8px;
    background: #6366f1;
    border: 1.5px solid #0d0e12;
    border-radius: 2px;
    cursor: nwse-resize;
    z-index: 10;
  }
  .dt-proto-connector {
    position: absolute;
    width: 12px; height: 12px;
    background: #f59e0b;
    border-radius: 50%;
    right: -6px; top: 50%;
    transform: translateY(-50%);
    cursor: crosshair;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .dt-element.selected .dt-proto-connector { opacity: 1; }
  .dt-element:hover .dt-proto-connector { opacity: 0.6; }

  /* ── Right Panel (properties) ── */
  .dt-right {
    width: 240px;
    flex-shrink: 0;
    background: #13151c;
    border-left: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    margin-top: 44px;
    overflow-y: auto;
  }
  .dt-prop-section {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 12px 14px;
  }
  .dt-prop-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #555c72;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dt-prop-row { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
  .dt-prop-label { font-size: 10px; color: #555c72; width: 20px; flex-shrink: 0; }
  .dt-prop-input {
    flex: 1;
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8eaf0;
    border-radius: 5px;
    padding: 4px 7px;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
    width: 0;
    min-width: 0;
  }
  .dt-prop-input:focus { border-color: #6366f1; }
  .dt-color-swatch {
    width: 22px; height: 22px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.15);
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .dt-color-swatch input[type=color] {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer;
    width: 100%; height: 100%;
    border: none; padding: 0;
  }

  .dt-style-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; }
  .dt-style-chip {
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 6px 8px;
    cursor: pointer;
    font-size: 10px;
    color: #8b91a8;
    text-align: center;
    transition: all 0.15s;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
  }
  .dt-style-chip:hover { border-color: #6366f1; color: #818cf8; }
  .dt-style-chip.active { border-color: #6366f1; background: rgba(99,102,241,0.15); color: #818cf8; }

  .dt-font-select {
    width: 100%;
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8eaf0;
    border-radius: 5px;
    padding: 5px 8px;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    margin-bottom: 7px;
    cursor: pointer;
  }
  .dt-color-palette { display: flex; flex-wrap: wrap; gap: 5px; }
  .dt-palette-swatch {
    width: 22px; height: 22px;
    border-radius: 5px;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: transform 0.15s;
    position: relative;
  }
  .dt-palette-swatch:hover { transform: scale(1.2); }
  .dt-palette-swatch.active { border-color: white; }
  .dt-proto-link-item {
    display: flex; align-items: center; gap: 6px;
    background: #1c1f2a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 11px;
    color: #8b91a8;
    margin-bottom: 5px;
  }
  .dt-proto-link-item select {
    flex: 1; background: transparent; border: none; color: #e8eaf0; font-size: 11px; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer;
  }

  /* ── Screen tabs ── */
  .dt-screen-tabs {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    background: rgba(19,21,28,0.95);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 4px;
    z-index: 20;
    backdrop-filter: blur(8px);
  }
  .dt-screen-tab {
    padding: 5px 12px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 500;
    color: #8b91a8;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .dt-screen-tab:hover { color: #e8eaf0; background: rgba(255,255,255,0.05); }
  .dt-screen-tab.active { background: #6366f1; color: white; }
  .dt-screen-add {
    padding: 5px 8px;
    border-radius: 7px;
    font-size: 13px;
    color: #555c72;
    cursor: pointer;
    transition: all 0.15s;
  }
  .dt-screen-add:hover { color: #e8eaf0; background: rgba(255,255,255,0.05); }

  /* ── Proto arrows SVG overlay ── */
  .dt-proto-svg {
    position: absolute;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 5;
  }

  /* ── Prototype preview modal ── */
  .dt-preview-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(6px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
  }
  .dt-preview-frame {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    position: relative;
    width: 375px;
    min-height: 500px;
  }
  .dt-preview-close {
    position: fixed; top: 20px; right: 24px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white; border-radius: 8px;
    padding: 7px 14px; font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .dt-preview-close:hover { background: rgba(255,255,255,0.2); }
  .dt-preview-label { color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 1px; font-family: 'DM Sans', sans-serif; }

  /* ── Empty state ── */
  .dt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #555c72; gap: 10px; }
  .dt-empty h3 { font-size: 14px; color: #8b91a8; }
  .dt-empty p { font-size: 12px; }

  /* scrollbar */
  .dt-left::-webkit-scrollbar, .dt-right::-webkit-scrollbar, .dt-panel-body::-webkit-scrollbar { width: 3px; }
  .dt-left::-webkit-scrollbar-thumb, .dt-right::-webkit-scrollbar-thumb, .dt-panel-body::-webkit-scrollbar-thumb { background: #242836; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const FONTS = ["DM Sans", "Syne", "Inter", "Georgia", "Courier New", "Arial", "Roboto", "Playfair Display"];
const PALETTE = ["#6366f1","#818cf8","#10b981","#34d399","#f59e0b","#fbbf24","#ef4444","#f87171","#8b5cf6","#06b6d4","#ec4899","#64748b","#1e293b","#ffffff","#000000","#f8fafc"];
const DEFAULT_SCREENS = [
  { id: "s1", name: "Home", elements: [
    { id:"e1", type:"rect", x:20, y:80, w:335, h:200, fill:"#6366f1", rx:16, text:"", fontSize:14, fontFamily:"DM Sans", fontWeight:"400", color:"#ffffff", opacity:1, locked:false },
    { id:"e2", type:"text", x:20, y:20, w:200, h:36, fill:"transparent", rx:0, text:"My App", fontSize:22, fontFamily:"Syne", fontWeight:"700", color:"#1e293b", opacity:1, locked:false },
    { id:"e3", type:"rect", x:20, y:300, w:150, h:80, fill:"#f8fafc", rx:12, text:"Card 1", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#1e293b", opacity:1, locked:false },
    { id:"e4", type:"rect", x:185, y:300, w:150, h:80, fill:"#f8fafc", rx:12, text:"Card 2", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#1e293b", opacity:1, locked:false },
    { id:"e5", type:"rect", x:20, y:400, w:335, h:50, fill:"#6366f1", rx:12, text:"Get Started →", fontSize:14, fontFamily:"DM Sans", fontWeight:"500", color:"#ffffff", opacity:1, locked:false },
  ], links:[], colorStyles:[] },
  { id: "s2", name: "Dashboard", elements: [
    { id:"e6", type:"rect", x:20, y:20, w:335, h:50, fill:"#1e293b", rx:10, text:"Dashboard", fontSize:16, fontFamily:"Syne", fontWeight:"700", color:"#ffffff", opacity:1, locked:false },
    { id:"e7", type:"rect", x:20, y:90, w:100, h:80, fill:"#ecfdf5", rx:10, text:"Tasks\n12", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#065f46", opacity:1, locked:false },
    { id:"e8", type:"rect", x:130, y:90, w:100, h:80, fill:"#eff6ff", rx:10, text:"Files\n8", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#1e40af", opacity:1, locked:false },
    { id:"e9", type:"rect", x:240, y:90, w:115, h:80, fill:"#fef3c7", rx:10, text:"Notes\n5", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#92400e", opacity:1, locked:false },
    { id:"e10", type:"rect", x:20, y:190, w:335, h:260, fill:"#f8fafc", rx:12, text:"", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#1e293b", opacity:1, locked:false },
  ], links:[{ from:"e5", toScreen:"s2" }], colorStyles:[] },
];

const COMPONENT_PRESETS = [
  { name: "Button", preview: "btn", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:140, h:44, fill:"#6366f1", rx:10, text:"Click me", fontSize:14, fontFamily:"DM Sans", fontWeight:"500", color:"#ffffff", opacity:1, locked:false }) },
  { name: "Input", preview: "input", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:200, h:42, fill:"#f8fafc", rx:8, text:"Placeholder...", fontSize:13, fontFamily:"DM Sans", fontWeight:"400", color:"#94a3b8", opacity:1, locked:false }) },
  { name: "Card", preview: "card", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:200, h:120, fill:"#ffffff", rx:14, text:"Card Title", fontSize:14, fontFamily:"DM Sans", fontWeight:"500", color:"#1e293b", opacity:1, locked:false }) },
  { name: "Navbar", preview: "nav", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:335, h:52, fill:"#1e293b", rx:0, text:"← Nav Bar", fontSize:14, fontFamily:"Syne", fontWeight:"700", color:"#ffffff", opacity:1, locked:false }) },
  { name: "Badge", preview: "badge", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:80, h:28, fill:"#ecfdf5", rx:20, text:"Active", fontSize:11, fontFamily:"DM Sans", fontWeight:"600", color:"#065f46", opacity:1, locked:false }) },
  { name: "Avatar", preview: "av", make: (x,y) => ({ id:`e${Date.now()}`, type:"circle", x, y, w:56, h:56, fill:"#6366f1", rx:28, text:"AC", fontSize:16, fontFamily:"DM Sans", fontWeight:"700", color:"#ffffff", opacity:1, locked:false }) },
  { name: "Divider", preview: "div", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:300, h:2, fill:"#e2e8f0", rx:1, text:"", fontSize:0, fontFamily:"DM Sans", fontWeight:"400", color:"transparent", opacity:1, locked:false }) },
  { name: "Tag", preview: "tag", make: (x,y) => ({ id:`e${Date.now()}`, type:"rect", x, y, w:70, h:26, fill:"#eff6ff", rx:6, text:"Tag", fontSize:11, fontFamily:"DM Sans", fontWeight:"600", color:"#1e40af", opacity:1, locked:false }) },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DesignTool({ project }) {
  const [screens, setScreens] = useState(DEFAULT_SCREENS);
  const [activeScreen, setActiveScreen] = useState("s1");
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState("select"); // select | rect | text | circle
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [leftTab, setLeftTab] = useState("layers"); // layers | components | styles
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showProtoArrows, setShowProtoArrows] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewScreen, setPreviewScreen] = useState("s1");
  const [protoLinking, setProtoLinking] = useState(null); // element id linking from
  const [saved, setSaved] = useState(true);
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);

  const screen = screens.find(s => s.id === activeScreen);
  const selected = screen?.elements.find(e => e.id === selectedId);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const updateScreen = useCallback((sid, updater) => {
    setScreens(prev => prev.map(s => s.id === sid ? updater(s) : s));
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  }, []);

  const updateElement = useCallback((eid, changes) => {
    updateScreen(activeScreen, s => ({
      ...s,
      elements: s.elements.map(e => e.id === eid ? { ...e, ...changes } : e)
    }));
  }, [activeScreen, updateScreen]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    updateScreen(activeScreen, s => ({ ...s, elements: s.elements.filter(e => e.id !== selectedId) }));
    setSelectedId(null);
  }, [selectedId, activeScreen, updateScreen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && !e.target.contentEditable) {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, deleteSelected]);

  // ── Canvas click / draw ───────────────────────────────────────────────────
  const canvasMouseDown = (e) => {
    if (e.target === canvasWrapRef.current || e.target.classList.contains("dt-canvas-inner") || e.target.classList.contains("dt-frame")) {
      if (tool === "select") {
        setSelectedId(null);
        return;
      }
      if (tool === "rect" || tool === "text" || tool === "circle") {
        const rect = canvasWrapRef.current.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left - pan.x) / zoom);
        const y = Math.round((e.clientY - rect.top - pan.y) / zoom);
        const newEl = {
          id: `e${Date.now()}`,
          type: tool === "circle" ? "circle" : "rect",
          x, y,
          w: tool === "text" ? 160 : 120,
          h: tool === "text" ? 40 : 80,
          fill: tool === "text" ? "transparent" : "#e2e8f0",
          rx: tool === "circle" ? 60 : 8,
          text: tool === "text" ? "Text" : "",
          fontSize: 14,
          fontFamily: "DM Sans",
          fontWeight: "400",
          color: "#1e293b",
          opacity: 1,
          locked: false,
        };
        updateScreen(activeScreen, s => ({ ...s, elements: [...s.elements, newEl] }));
        setSelectedId(newEl.id);
        setTool("select");
      }
    }
  };

  // ── Element drag ──────────────────────────────────────────────────────────
  const startDrag = (e, el) => {
    if (el.locked) return;
    e.stopPropagation();
    if (tool !== "select") return;
    setSelectedId(el.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x, origY = el.y;
    setIsDragging(true);

    const onMove = (me) => {
      const dx = Math.round((me.clientX - startX) / zoom);
      const dy = Math.round((me.clientY - startY) / zoom);
      updateElement(el.id, { x: origX + dx, y: origY + dy });
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Resize ────────────────────────────────────────────────────────────────
  const startResize = (e, el) => {
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const origW = el.w, origH = el.h;
    setIsResizing(true);
    const onMove = (me) => {
      const dw = Math.round((me.clientX - startX) / zoom);
      const dh = Math.round((me.clientY - startY) / zoom);
      updateElement(el.id, { w: Math.max(20, origW + dw), h: Math.max(20, origH + dh) });
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Add screen ───────────────────────────────────────────────────────────
  const addScreen = () => {
    const id = `s${Date.now()}`;
    const newScreen = { id, name: `Screen ${screens.length + 1}`, elements: [], links: [], colorStyles: [] };
    setScreens(prev => [...prev, newScreen]);
    setActiveScreen(id);
    setSelectedId(null);
  };

  // ── Add proto link ───────────────────────────────────────────────────────
  const addProtoLink = (fromId, toScreenId) => {
    updateScreen(activeScreen, s => {
      const existing = s.links.filter(l => l.from !== fromId);
      return { ...s, links: [...existing, { from: fromId, toScreen: toScreenId }] };
    });
    setProtoLinking(null);
  };

  // ── Drop component ───────────────────────────────────────────────────────
  const dropComponent = (preset) => {
    const el = preset.make(40, 40 + screen.elements.length * 20);
    updateScreen(activeScreen, s => ({ ...s, elements: [...s.elements, el] }));
    setSelectedId(el.id);
    setLeftTab("layers");
  };

  // ── Proto arrows ─────────────────────────────────────────────────────────
  const renderProtoArrows = () => {
    if (!showProtoArrows || !screen) return null;
    return screen.links.map(link => {
      const fromEl = screen.elements.find(e => e.id === link.from);
      const toScreen = screens.find(s => s.id === link.toScreen);
      if (!fromEl) return null;
      const x1 = (fromEl.x + fromEl.w) * zoom + pan.x;
      const y1 = (fromEl.y + fromEl.h / 2) * zoom + pan.y;
      const x2 = x1 + 60;
      const y2 = y1;
      return (
        <g key={link.from}>
          <path d={`M${x1},${y1} C${x1+30},${y1} ${x2-30},${y2} ${x2},${y2}`}
            stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,3" />
          <circle cx={x2} cy={y2} r={5} fill="#f59e0b" />
          <text x={x2+8} y={y2+4} fill="#f59e0b" fontSize="10" fontFamily="DM Sans">{toScreen?.name}</text>
        </g>
      );
    });
  };

  // ── Preview renderer ─────────────────────────────────────────────────────
  const PreviewScreen = ({ sid }) => {
    const sc = screens.find(s => s.id === sid);
    if (!sc) return null;
    return (
      <div style={{ position: "relative", width: 375, height: 600, background: "#f8fafc", overflow: "hidden" }}>
        {sc.elements.map(el => {
          const link = sc.links.find(l => l.from === el.id);
          return (
            <div key={el.id}
              onClick={() => link && setPreviewScreen(link.toScreen)}
              style={{
                position: "absolute",
                left: el.x, top: el.y,
                width: el.w, height: el.h,
                background: el.fill,
                borderRadius: el.rx,
                display: "flex", alignItems: "center", justifyContent: "center",
                textAlign: "center",
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                color: el.color,
                opacity: el.opacity,
                cursor: link ? "pointer" : "default",
                padding: "4px 8px",
                whiteSpace: "pre-wrap",
                userSelect: "none",
                boxShadow: link ? "0 0 0 2px #f59e0b" : "none",
                transition: "opacity 0.15s",
              }}
            >
              {el.text}
            </div>
          );
        })}
      </div>
    );
  };

  const FRAME_W = 375, FRAME_H = 600;

  return (
    <>
      <style>{css}</style>

      <div className="dt-shell">
        {/* ── Top Toolbar ── */}
        <div className="dt-topbar">
          {[
            { id: "select", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-7 1-4 7z"/></svg>, tip: "Select (V)" },
            { id: "rect",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>, tip: "Rectangle (R)" },
            { id: "circle", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>, tip: "Circle (O)" },
            { id: "text",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>, tip: "Text (T)" },
          ].map(t => (
            <button key={t.id} className={`dt-tool-btn ${tool === t.id ? "active" : ""}`} onClick={() => setTool(t.id)}>
              {t.icon}
              <span className="tooltip">{t.tip}</span>
            </button>
          ))}

          <div className="dt-divider" />

          <button className={`dt-tool-btn ${showProtoArrows ? "active" : ""}`} onClick={() => setShowProtoArrows(v => !v)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span className="tooltip">Proto links</span>
          </button>

          <button className="dt-tool-btn" onClick={deleteSelected} style={{ color: selectedId ? "#ef4444" : undefined }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            <span className="tooltip">Delete</span>
          </button>

          <div className="dt-topbar-right">
            <div className="dt-zoom-ctrl">
              <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2))}>−</button>
              <span className="dt-zoom-val">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}>+</button>
            </div>
            <div className="dt-divider" />
            <span style={{ fontSize: 10, color: saved ? "#10b981" : "#f59e0b" }}>{saved ? "✓ Saved" : "Saving…"}</span>
            <button className="dt-btn-primary" onClick={() => { setPreviewScreen(screens[0].id); setShowPreview(true); }}>
              ▶ Preview
            </button>
          </div>
        </div>

        {/* ── Left Panel ── */}
        <div className="dt-left">
          <div className="dt-panel-tabs">
            {["layers","components","styles"].map(t => (
              <div key={t} className={`dt-ptab ${leftTab === t ? "active" : ""}`} onClick={() => setLeftTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>
          <div className="dt-panel-body">
            {leftTab === "layers" && (
              <>
                <div className="dt-section-label">Layers — {screen?.name}</div>
                {screen?.elements.length === 0 && (
                  <div style={{ padding: "20px 8px", textAlign: "center", fontSize: 11, color: "#555c72" }}>No elements yet.<br/>Draw on the canvas.</div>
                )}
                {[...(screen?.elements || [])].reverse().map(el => (
                  <div key={el.id} className={`dt-layer-item ${selectedId === el.id ? "selected" : ""}`}
                    onClick={() => setSelectedId(el.id)}>
                    <svg className="dt-layer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {el.type === "circle"
                        ? <circle cx="12" cy="12" r="9"/>
                        : el.type === "text" || (el.fill === "transparent")
                        ? <polyline points="4 7 4 4 20 4 20 7"/><line x1="12" y1="4" x2="12" y2="20"/>
                        : <rect x="3" y="3" width="18" height="18" rx="2"/>}
                    </svg>
                    <span className="dt-layer-name">{el.text || el.type}</span>
                    <span className="dt-layer-eye" onClick={e => { e.stopPropagation(); updateElement(el.id, { opacity: el.opacity === 0 ? 1 : 0 }); }}>
                      {el.opacity === 0 ? "🙈" : "👁"}
                    </span>
                  </div>
                ))}
              </>
            )}

            {leftTab === "components" && (
              <>
                <div className="dt-section-label">UI Components</div>
                <div className="dt-component-grid">
                  {COMPONENT_PRESETS.map(preset => (
                    <div key={preset.name} className="dt-comp-card" onClick={() => dropComponent(preset)}>
                      <div className="dt-comp-preview">
                        <CompPreview type={preset.preview} />
                      </div>
                      {preset.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            {leftTab === "styles" && (
              <>
                <div className="dt-section-label">Color Styles</div>
                <div className="dt-color-palette" style={{ padding: "4px 8px 12px" }}>
                  {PALETTE.map(c => (
                    <div key={c} className={`dt-palette-swatch ${selected?.fill === c ? "active" : ""}`}
                      style={{ background: c, border: c === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : undefined }}
                      onClick={() => selected && updateElement(selectedId, { fill: c })} />
                  ))}
                </div>
                <div className="dt-section-label">Typography Styles</div>
                {[
                  { label: "Display", font: "Syne", size: 24, weight: "800" },
                  { label: "Heading", font: "Syne", size: 18, weight: "700" },
                  { label: "Body", font: "DM Sans", size: 14, weight: "400" },
                  { label: "Caption", font: "DM Sans", size: 11, weight: "400" },
                  { label: "Button", font: "DM Sans", size: 14, weight: "500" },
                  { label: "Mono", font: "Courier New", size: 13, weight: "400" },
                ].map(s => (
                  <div key={s.label}
                    className="dt-style-chip"
                    style={{ width: "100%", textAlign: "left", flexDirection: "row", justifyContent: "space-between", padding: "7px 10px", marginBottom: 4 }}
                    onClick={() => selected && updateElement(selectedId, { fontFamily: s.font, fontSize: s.size, fontWeight: s.weight })}>
                    <span style={{ fontFamily: s.font, fontSize: 13, fontWeight: s.weight }}>{s.label}</span>
                    <span style={{ fontSize: 10, color: "#555c72" }}>{s.font} {s.size}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Canvas ── */}
        <div className="dt-canvas-wrap" ref={canvasWrapRef} onMouseDown={canvasMouseDown}
          style={{ cursor: tool === "select" ? "default" : "crosshair" }}>
          {/* Grid */}
          <svg className="dt-grid-svg" width="100%" height="100%">
            <defs>
              <pattern id="dtgrid" width={20*zoom} height={20*zoom} patternUnits="userSpaceOnUse"
                x={pan.x % (20*zoom)} y={pan.y % (20*zoom)}>
                <path d={`M ${20*zoom} 0 L 0 0 0 ${20*zoom}`} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dtgrid)"/>
          </svg>

          <div className="dt-canvas-inner" ref={canvasRef} style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}>
            {/* Frame */}
            <div className="dt-frame" style={{ width: FRAME_W, height: FRAME_H, background: "white", borderRadius: 0, boxShadow: "0 4px 40px rgba(0,0,0,0.5)", position: "relative" }}>
              <div className="dt-frame-label">{screen?.name || "Screen"} — {FRAME_W}×{FRAME_H}</div>

              {screen?.elements.map(el => (
                <div key={el.id} className={`dt-element ${selectedId === el.id ? "selected" : ""}`}
                  style={{
                    left: el.x, top: el.y, width: el.w, height: el.h,
                    background: el.fill,
                    borderRadius: el.rx,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: el.opacity,
                    cursor: tool === "select" ? (el.locked ? "not-allowed" : "move") : "crosshair",
                    fontSize: el.fontSize,
                    fontFamily: el.fontFamily,
                    fontWeight: el.fontWeight,
                    color: el.color,
                    textAlign: "center",
                    padding: "4px 8px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    zIndex: selectedId === el.id ? 5 : 1,
                  }}
                  onMouseDown={e => startDrag(e, el)}
                  onClick={e => { e.stopPropagation(); if (tool === "select") { setSelectedId(el.id); if (protoLinking) { addProtoLink(protoLinking, activeScreen); } } }}>
                  {el.text}

                  {selectedId === el.id && (
                    <>
                      <div className="dt-resize-handle"
                        style={{ bottom: -4, right: -4 }}
                        onMouseDown={e => startResize(e, el)} />
                      <div className="dt-proto-connector"
                        title="Link to screen"
                        onMouseDown={e => { e.stopPropagation(); setProtoLinking(el.id); }} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Proto arrows overlay */}
          <svg className="dt-proto-svg" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            {renderProtoArrows()}
          </svg>

          {/* Proto linking hint */}
          {protoLinking && (
            <div style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#1e293b", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, zIndex: 30 }}>
              Click a screen tab below to link →
            </div>
          )}

          {/* Screen tabs */}
          <div className="dt-screen-tabs">
            {screens.map(s => (
              <div key={s.id} className={`dt-screen-tab ${activeScreen === s.id ? "active" : ""}`}
                onClick={() => { if (protoLinking) { addProtoLink(protoLinking, s.id); } setActiveScreen(s.id); setSelectedId(null); }}>
                {s.name}
              </div>
            ))}
            <div className="dt-screen-add" onClick={addScreen}>+</div>
          </div>
        </div>

        {/* ── Right Properties Panel ── */}
        <div className="dt-right">
          {!selected ? (
            <div className="dt-empty" style={{ padding: 20 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555c72" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <h3>No selection</h3>
              <p style={{ textAlign: "center", fontSize: 11 }}>Select an element<br/>to see its properties</p>
            </div>
          ) : (
            <>
              {/* Position & Size */}
              <div className="dt-prop-section">
                <div className="dt-prop-title">Position & Size</div>
                <div className="dt-prop-row">
                  <span className="dt-prop-label">X</span>
                  <input className="dt-prop-input" type="number" value={selected.x}
                    onChange={e => updateElement(selectedId, { x: +e.target.value })} />
                  <span className="dt-prop-label">Y</span>
                  <input className="dt-prop-input" type="number" value={selected.y}
                    onChange={e => updateElement(selectedId, { y: +e.target.value })} />
                </div>
                <div className="dt-prop-row">
                  <span className="dt-prop-label">W</span>
                  <input className="dt-prop-input" type="number" value={selected.w}
                    onChange={e => updateElement(selectedId, { w: +e.target.value })} />
                  <span className="dt-prop-label">H</span>
                  <input className="dt-prop-input" type="number" value={selected.h}
                    onChange={e => updateElement(selectedId, { h: +e.target.value })} />
                </div>
                <div className="dt-prop-row">
                  <span className="dt-prop-label" style={{ width: 40 }}>Radius</span>
                  <input className="dt-prop-input" type="number" value={selected.rx}
                    onChange={e => updateElement(selectedId, { rx: +e.target.value })} />
                </div>
              </div>

              {/* Fill & Color */}
              <div className="dt-prop-section">
                <div className="dt-prop-title">Fill & Stroke</div>
                <div className="dt-prop-row">
                  <span className="dt-prop-label">Fill</span>
                  <div className="dt-color-swatch" style={{ background: selected.fill }}>
                    <input type="color" value={selected.fill === "transparent" ? "#ffffff" : selected.fill}
                      onChange={e => updateElement(selectedId, { fill: e.target.value })} />
                  </div>
                  <input className="dt-prop-input" value={selected.fill}
                    onChange={e => updateElement(selectedId, { fill: e.target.value })} />
                </div>
                <div className="dt-prop-row">
                  <span className="dt-prop-label" style={{ width: 50 }}>Opacity</span>
                  <input type="range" min="0" max="1" step="0.05" value={selected.opacity}
                    onChange={e => updateElement(selectedId, { opacity: +e.target.value })}
                    style={{ flex: 1, accentColor: "#6366f1" }} />
                  <span style={{ fontSize: 10, color: "#8b91a8", minWidth: 26 }}>{Math.round(selected.opacity * 100)}%</span>
                </div>
              </div>

              {/* Typography */}
              <div className="dt-prop-section">
                <div className="dt-prop-title">Typography</div>
                <select className="dt-font-select" value={selected.fontFamily}
                  onChange={e => updateElement(selectedId, { fontFamily: e.target.value })}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="dt-prop-row">
                  <span className="dt-prop-label">Sz</span>
                  <input className="dt-prop-input" type="number" value={selected.fontSize}
                    onChange={e => updateElement(selectedId, { fontSize: +e.target.value })} />
                  <span className="dt-prop-label">Col</span>
                  <div className="dt-color-swatch" style={{ background: selected.color }}>
                    <input type="color" value={selected.color}
                      onChange={e => updateElement(selectedId, { color: e.target.value })} />
                  </div>
                </div>
                <div className="dt-style-grid">
                  {["400","500","700","800"].map(w => (
                    <div key={w} className={`dt-style-chip ${selected.fontWeight === w ? "active" : ""}`}
                      onClick={() => updateElement(selectedId, { fontWeight: w })}>
                      <span style={{ fontWeight: w, fontSize: 12 }}>Aa</span>
                      <span style={{ fontSize: 10 }}>{w === "400" ? "Reg" : w === "500" ? "Med" : w === "700" ? "Bold" : "Black"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: "relative" }}>
                  <textarea value={selected.text}
                    onChange={e => updateElement(selectedId, { text: e.target.value })}
                    placeholder="Element text…"
                    rows={3}
                    style={{ width: "100%", background: "#1c1f2a", border: "1px solid rgba(255,255,255,0.08)", color: "#e8eaf0", borderRadius: 6, padding: "7px 10px", fontSize: 12, fontFamily: "DM Sans", outline: "none", resize: "none" }} />
                </div>
              </div>

              {/* Prototype Links */}
              <div className="dt-prop-section">
                <div className="dt-prop-title">
                  Prototype
                  <span style={{ fontSize: 10, color: "#f59e0b", cursor: "pointer" }}
                    onClick={() => setProtoLinking(selectedId)}>+ Link</span>
                </div>
                {screen.links.filter(l => l.from === selectedId).length === 0 ? (
                  <div style={{ fontSize: 11, color: "#555c72", padding: "4px 0" }}>No links. Click + Link then a screen tab.</div>
                ) : (
                  screen.links.filter(l => l.from === selectedId).map(lk => (
                    <div key={lk.toScreen} className="dt-proto-link-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      <span style={{ flex: 1 }}>→ {screens.find(s => s.id === lk.toScreen)?.name}</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ cursor: "pointer" }}
                        onClick={() => updateScreen(activeScreen, s => ({ ...s, links: s.links.filter(l => !(l.from === selectedId && l.toScreen === lk.toScreen)) }))}>
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                  ))
                )}
              </div>

              {/* Auto-layout */}
              <div className="dt-prop-section">
                <div className="dt-prop-title">Auto-layout</div>
                <div className="dt-style-grid">
                  {[
                    { label: "None", icon: "—" },
                    { label: "Row", icon: "→" },
                    { label: "Col", icon: "↓" },
                    { label: "Grid", icon: "⊞" },
                  ].map(al => (
                    <div key={al.label} className="dt-style-chip">
                      <span style={{ fontSize: 14 }}>{al.icon}</span>
                      <span style={{ fontSize: 10 }}>{al.label}</span>
                    </div>
                  ))}
                </div>
                <div className="dt-prop-row" style={{ marginTop: 4 }}>
                  <span className="dt-prop-label" style={{ width: 36 }}>Gap</span>
                  <input className="dt-prop-input" type="number" defaultValue={8} />
                  <span className="dt-prop-label" style={{ width: 36 }}>Pad</span>
                  <input className="dt-prop-input" type="number" defaultValue={12} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Prototype Preview ── */}
      {showPreview && (
        <div className="dt-preview-overlay" onClick={e => e.target === e.currentTarget && setShowPreview(false)}>
          <button className="dt-preview-close" onClick={() => setShowPreview(false)}>✕ Close Preview</button>
          <div className="dt-preview-label">PROTOTYPE PREVIEW — {screens.find(s=>s.id===previewScreen)?.name?.toUpperCase()}</div>
          <div className="dt-preview-frame">
            <PreviewScreen sid={previewScreen} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {screens.map(s => (
              <button key={s.id}
                onClick={() => setPreviewScreen(s.id)}
                style={{ background: previewScreen === s.id ? "#6366f1" : "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans" }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Tiny component preview shapes ───────────────────────────────────────────
function CompPreview({ type }) {
  const s = { display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" };
  if (type === "btn") return <div style={{ ...s }}><div style={{ background:"#6366f1", color:"white", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:500 }}>Button</div></div>;
  if (type === "input") return <div style={{ ...s }}><div style={{ background:"#f1f5f9", borderRadius:6, padding:"4px 10px", fontSize:10, color:"#94a3b8", width:80, border:"1px solid #e2e8f0" }}>Text…</div></div>;
  if (type === "card") return <div style={{ ...s }}><div style={{ background:"white", borderRadius:10, padding:"6px 10px", fontSize:10, color:"#1e293b", width:70, border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>Card</div></div>;
  if (type === "nav") return <div style={{ ...s }}><div style={{ background:"#1e293b", borderRadius:6, padding:"4px 10px", fontSize:10, color:"white", width:80 }}>← Nav</div></div>;
  if (type === "badge") return <div style={{ ...s }}><div style={{ background:"#ecfdf5", borderRadius:20, padding:"2px 8px", fontSize:10, color:"#065f46", fontWeight:600 }}>Active</div></div>;
  if (type === "av") return <div style={{ ...s }}><div style={{ background:"#6366f1", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"white", fontWeight:700 }}>AC</div></div>;
  if (type === "div") return <div style={{ ...s }}><div style={{ width:60, height:1, background:"#e2e8f0" }} /></div>;
  if (type === "tag") return <div style={{ ...s }}><div style={{ background:"#eff6ff", borderRadius:5, padding:"2px 7px", fontSize:10, color:"#1e40af", fontWeight:600 }}>Tag</div></div>;
  return null;
}
