import { useState, useEffect, createContext, useContext } from "react";

// ─── Auth Context ───────────────────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ─── Mock Data Store ─────────────────────────────────────────────────────────
const mockUsers = [
  { id: 1, name: "Alex Chen", email: "alex@demo.com", password: "demo123", role: "Admin", avatar: "AC" },
  { id: 2, name: "Sara Kim",  email: "sara@demo.com", password: "demo123", role: "User",  avatar: "SK" },
];

let mockProjects = [
  { id: 1, name: "E-Commerce Platform", description: "Full-stack shopping app", color: "#6366f1", ownerId: 1, members: [1,2], createdAt: "2025-01-10" },
  { id: 2, name: "Analytics Dashboard", description: "Real-time data visualization", color: "#f59e0b", ownerId: 1, members: [1], createdAt: "2025-02-05" },
  { id: 3, name: "Mobile App Redesign", description: "UX overhaul for iOS/Android", color: "#10b981", ownerId: 2, members: [2], createdAt: "2025-03-01" },
];

let mockTasks = [
  { id: 1, projectId: 1, title: "Setup authentication", description: "JWT login flow", status: "Done", assignee: 1, deadline: "2025-04-01", priority: "High" },
  { id: 2, projectId: 1, title: "Design product page", description: "Product listing UI", status: "In Progress", assignee: 2, deadline: "2025-04-15", priority: "Medium" },
  { id: 3, projectId: 1, title: "Integrate payment gateway", description: "Stripe integration", status: "To Do", assignee: 1, deadline: "2025-04-30", priority: "High" },
  { id: 4, projectId: 1, title: "Write API documentation", description: "Swagger docs", status: "To Do", assignee: null, deadline: "2025-05-01", priority: "Low" },
  { id: 5, projectId: 2, title: "Chart components", description: "Line/bar/pie charts", status: "In Progress", assignee: 1, deadline: "2025-04-20", priority: "High" },
  { id: 6, projectId: 2, title: "Data pipeline setup", description: "ETL scripts", status: "To Do", assignee: 1, deadline: "2025-05-10", priority: "Medium" },
];

let mockNotes = [
  { id: 1, projectId: 1, title: "Architecture Overview", content: "<h2>System Architecture</h2><p>This project uses a <strong>microservices</strong> approach with the following components:</p><ul><li>Auth Service (JWT)</li><li>Product Service</li><li>Order Service</li></ul>", updatedAt: "2025-03-15" },
  { id: 2, projectId: 1, title: "API Endpoints", content: "<h2>REST API Reference</h2><p>Base URL: <strong>https://api.example.com/v1</strong></p><p>All endpoints require Bearer token authentication.</p>", updatedAt: "2025-03-20" },
];

let mockFiles = [
  { id: 1, projectId: 1, name: "requirements.pdf", type: "PDF", size: "1.2 MB", uploadedBy: 1, uploadedAt: "2025-03-10" },
  { id: 2, projectId: 1, name: "wireframes.pptx", type: "PPTX", size: "3.8 MB", uploadedBy: 2, uploadedAt: "2025-03-12" },
  { id: 3, projectId: 2, name: "data-schema.xlsx", type: "XLSX", size: "0.5 MB", uploadedBy: 1, uploadedAt: "2025-03-14" },
];

let mockSpreadsheets = [
  {
    id: 1, projectId: 1, name: "Sprint Tracker",
    columns: ["Feature", "Status", "Points", "Owner", "Sprint"],
    rows: [
      ["Login Page", "Done", "5", "Alex", "Sprint 1"],
      ["Dashboard", "In Progress", "8", "Sara", "Sprint 2"],
      ["Reports", "To Do", "13", "Alex", "Sprint 3"],
    ]
  }
];

let mockDiagrams = [
  { id: 1, projectId: 1, name: "System Architecture", shapes: [
    { id: "s1", type: "rect", x: 80, y: 80, w: 140, h: 50, label: "React Frontend", color: "#6366f1" },
    { id: "s2", type: "rect", x: 80, y: 200, w: 140, h: 50, label: "Spring Boot API", color: "#10b981" },
    { id: "s3", type: "rect", x: 280, y: 200, w: 140, h: 50, label: "MySQL Database", color: "#f59e0b" },
    { id: "s4", type: "arrow", x1: 150, y1: 130, x2: 150, y2: 200 },
    { id: "s5", type: "arrow", x1: 220, y1: 225, x2: 280, y2: 225 },
  ]}
];

let nextId = { task: 10, note: 10, file: 10, project: 10, shape: 20, ss: 10 };

// ─── Utilities ────────────────────────────────────────────────────────────────
const getUser = (id) => mockUsers.find(u => u.id === id);
const priorityColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };
const statusColor = { "To Do": "#64748b", "In Progress": "#6366f1", "Done": "#10b981" };

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    folder: <><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    table: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    cpu: <><rect x="9" y="9" width="6" height="6"/><path d="M15 9V4h-6v5M15 15v5h-6v-5M9 9H4v6h5M15 9h5v6h-5"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0b0f;
    --surface: #13151c;
    --surface2: #1c1f2a;
    --surface3: #242836;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #e8eaf0;
    --text2: #8b91a8;
    --text3: #555c72;
    --accent: #6366f1;
    --accent2: #818cf8;
    --accent-glow: rgba(99,102,241,0.3);
    --green: #10b981;
    --amber: #f59e0b;
    --red: #ef4444;
    --radius: 12px;
    --radius2: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow2: 0 2px 8px rgba(0,0,0,0.3);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; font-size: 14px; }
  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; line-height: 1.2; }

  input, textarea, select {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface2);
    border: 1px solid var(--border2);
    color: var(--text);
    border-radius: var(--radius2);
    padding: 10px 14px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  button {
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: none;
    border-radius: var(--radius2);
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    padding: 10px 20px;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 16px var(--accent-glow); }

  .btn-ghost {
    background: transparent;
    color: var(--text2);
    padding: 8px 14px;
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }

  .btn-danger {
    background: rgba(239,68,68,0.15);
    color: var(--red);
    padding: 8px 14px;
    border: 1px solid rgba(239,68,68,0.3);
  }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }

  .btn-icon {
    background: transparent;
    color: var(--text3);
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
  .btn-icon:hover { background: var(--surface3); color: var(--text); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 3px; }

  /* layout */
  .app-shell { display: flex; height: 100vh; overflow: hidden; }

  .sidebar {
    width: 230px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo h2 {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--accent2), var(--green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sidebar-logo span { font-size: 11px; color: var(--text3); font-weight: 400; display: block; margin-top: 2px; }

  .sidebar-section { padding: 16px 12px 8px; }
  .sidebar-section-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--text3); text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius2);
    cursor: pointer;
    color: var(--text2);
    font-size: 13.5px;
    font-weight: 400;
    transition: all 0.15s;
    user-select: none;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-glow); color: var(--accent2); }
  .nav-item.active svg { stroke: var(--accent2); }

  .project-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .sidebar-footer {
    margin-top: auto;
    padding: 12px;
    border-top: 1px solid var(--border);
  }
  .user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: var(--radius2);
    cursor: pointer;
  }
  .user-pill:hover { background: var(--surface2); }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .main-content { flex: 1; overflow-y: auto; background: var(--bg); }

  .topbar {
    padding: 20px 32px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0;
  }
  .topbar h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .topbar-actions { display: flex; gap: 8px; align-items: center; }

  .page-body { padding: 28px 32px; }

  /* cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }
  .card:hover { border-color: var(--border2); }

  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  @media (max-width: 1200px) { .grid-4 { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 900px)  { .grid-3,.grid-2 { grid-template-columns: 1fr; } }

  /* stat cards */
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
  }
  .stat-label { font-size: 12px; color: var(--text3); font-weight: 500; letter-spacing: 0.5px; margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1; }
  .stat-sub { font-size: 12px; color: var(--text3); margin-top: 6px; }

  /* project card */
  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--project-color, var(--accent));
  }
  .project-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--shadow); }
  .project-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .project-card p { font-size: 12.5px; color: var(--text2); margin-bottom: 14px; }
  .project-meta { display: flex; gap: 12px; font-size: 11px; color: var(--text3); }

  /* badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: var(--surface3);
    color: var(--text2);
  }

  /* kanban */
  .kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; align-items: flex-start; }
  .kanban-col {
    flex-shrink: 0;
    width: 300px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .kanban-col-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .kanban-col-title { font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .kanban-col-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 200px; }

  .task-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius2);
    padding: 14px;
    cursor: grab;
    transition: all 0.2s;
  }
  .task-card:hover { border-color: var(--border2); box-shadow: var(--shadow2); }
  .task-card.dragging { opacity: 0.5; }
  .task-card h4 { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
  .task-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .priority-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

  /* rich text editor */
  .rich-editor {
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .editor-toolbar {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .toolbar-btn {
    padding: 5px 10px;
    background: transparent;
    color: var(--text2);
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
  }
  .toolbar-btn:hover { background: var(--surface3); color: var(--text); }
  .toolbar-divider { width: 1px; background: var(--border); margin: 0 4px; }
  .editor-content {
    padding: 16px;
    min-height: 300px;
    outline: none;
    font-size: 14px;
    line-height: 1.7;
  }
  .editor-content h2 { font-size: 20px; margin-bottom: 10px; }
  .editor-content ul { padding-left: 20px; }

  /* diagram */
  .diagram-canvas {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    position: relative;
    overflow: hidden;
  }
  .diagram-toolbar {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 8px;
    background: var(--surface);
    align-items: center;
  }

  /* spreadsheet */
  .spreadsheet-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .spreadsheet-table th {
    background: var(--surface2);
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    border: 1px solid var(--border);
    color: var(--text2);
    font-size: 12px;
    letter-spacing: 0.3px;
  }
  .spreadsheet-table td {
    padding: 0;
    border: 1px solid var(--border);
  }
  .spreadsheet-table td input {
    border: none;
    border-radius: 0;
    background: transparent;
    padding: 10px 14px;
    color: var(--text);
  }
  .spreadsheet-table td input:focus {
    background: rgba(99,102,241,0.08);
    box-shadow: inset 0 0 0 2px var(--accent);
    border-radius: 0;
  }
  .spreadsheet-table tr:hover td { background: var(--surface3); }

  /* file manager */
  .file-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius2);
    background: var(--surface);
    transition: all 0.2s;
  }
  .file-item:hover { border-color: var(--border2); background: var(--surface2); }
  .file-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* charts */
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
  .bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .bar { border-radius: 4px 4px 0 0; width: 100%; transition: height 0.5s ease; }
  .bar-label { font-size: 11px; color: var(--text3); }

  /* donut */
  .donut-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .donut-center { position: absolute; text-align: center; }

  /* modals */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: var(--radius);
    padding: 28px;
    width: 480px;
    max-width: 90vw;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  .modal h3 { font-size: 17px; margin-bottom: 20px; }
  .form-field { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; letter-spacing: 0.3px; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

  /* login */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }
  .login-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .login-card {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 44px;
    width: 400px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.4);
    position: relative;
  }
  .login-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; }
  .login-sub { color: var(--text2); font-size: 14px; margin-bottom: 32px; }
  .login-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--red); border-radius: var(--radius2); padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }

  /* tabs */
  .tabs { display: flex; gap: 2px; background: var(--surface2); padding: 4px; border-radius: var(--radius2); width: fit-content; margin-bottom: 20px; }
  .tab {
    padding: 7px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    cursor: pointer;
    transition: all 0.15s;
  }
  .tab.active { background: var(--surface3); color: var(--text); }
  .tab:hover:not(.active) { color: var(--text); }

  /* progress bar */
  .progress-bar { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* empty state */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-state h3 { font-size: 15px; color: var(--text2); margin-bottom: 6px; }
  .empty-state p { font-size: 13px; }

  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-header h2 { font-size: 16px; font-weight: 700; }

  .gap-2 { gap: 8px; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .flex-col { flex-direction: column; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-3 { margin-bottom: 12px; }
  .mt-4 { margin-top: 16px; }
  .w-full { width: 100%; }
  .text-sm { font-size: 12px; color: var(--text2); }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid;
  }

  .notification-dot {
    width: 6px; height: 6px;
    background: var(--red);
    border-radius: 50%;
    position: absolute;
    top: 2px; right: 2px;
  }

  .avatar-stack { display: flex; }
  .avatar-stack .avatar { margin-left: -6px; border: 2px solid var(--surface); }
  .avatar-stack .avatar:first-child { margin-left: 0; }
`;

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError("Invalid email or password.");
  };

  const handleRegister = () => {
    if (!name || !email || !password) { setError("All fields required."); return; }
    const exists = mockUsers.find(u => u.email === email);
    if (exists) { setError("Email already registered."); return; }
    const nu = { id: mockUsers.length + 1, name, email, password, role: "User", avatar: name.split(" ").map(n=>n[0]).join("").toUpperCase() };
    mockUsers.push(nu);
    onLogin(nu);
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" style={{ top: "10%", left: "20%" }} />
      <div className="login-glow" style={{ bottom: "10%", right: "20%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
      <div className="login-card">
        <div className="login-title">
          {tab === "login" ? "Welcome back" : "Get started"}
        </div>
        <div className="login-sub">
          {tab === "login" ? "Sign in to your workspace" : "Create your unified workspace"}
        </div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <div className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</div>
          <div className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); }}>Register</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        {tab === "register" && (
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
        )}
        <div className="form-field">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
        </div>
        <div className="form-field" style={{ marginBottom: 22 }}>
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
        </div>

        <button className="btn-primary w-full" style={{ width: "100%", padding: "12px" }}
          onClick={tab === "login" ? handleLogin : handleRegister}>
          {tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
          Demo: alex@demo.com / demo123
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ currentView, onNav, currentProject, onSelectProject, user, onLogout }) {
  const userProjects = mockProjects.filter(p => p.members.includes(user.id));

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>UNIFY</h2>
        <span>Project Platform</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Workspace</div>
        {[
          { id: "dashboard", icon: "home", label: "Dashboard" },
          { id: "projects",  icon: "folder", label: "All Projects" },
          { id: "tasks",     icon: "check", label: "My Tasks" },
          { id: "analytics", icon: "chart", label: "Analytics" },
        ].map(item => (
          <div key={item.id} className={`nav-item ${currentView === item.id && !currentProject ? "active" : ""}`}
            onClick={() => { onNav(item.id); onSelectProject(null); }}>
            <Icon name={item.icon} size={15} />
            {item.label}
          </div>
        ))}
      </div>

      {userProjects.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Projects</div>
          {userProjects.map(p => (
            <div key={p.id} className={`nav-item ${currentProject?.id === p.id ? "active" : ""}`}
              onClick={() => { onSelectProject(p); onNav("project-detail"); }}>
              <div className="project-dot" style={{ background: p.color }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-footer">
        <div className="user-pill" onClick={onLogout}>
          <div className="avatar" style={{ fontSize: 11 }}>{user.avatar}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{user.role}</div>
          </div>
          <Icon name="logout" size={14} color="var(--text3)" />
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, onNav, onSelectProject }) {
  const myTasks = mockTasks.filter(t => t.assignee === user.id);
  const myProjects = mockProjects.filter(p => p.members.includes(user.id));
  const done = myTasks.filter(t => t.status === "Done").length;
  const inProg = myTasks.filter(t => t.status === "In Progress").length;
  const todo = myTasks.filter(t => t.status === "To Do").length;

  const recentTasks = [...myTasks].sort((a,b) => a.id - b.id).slice(-5).reverse();

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Good morning, {user.name.split(" ")[0]} 👋</h1>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn-primary" onClick={() => onNav("projects")}>+ New Project</button>
        </div>
      </div>
      <div className="page-body">
        <div className="grid-4 mb-4">
          {[
            { label: "Projects", value: myProjects.length, sub: "Active workspaces", color: "var(--accent2)" },
            { label: "Total Tasks", value: myTasks.length, sub: `${done} completed`, color: "var(--green)" },
            { label: "In Progress", value: inProg, sub: "Tasks ongoing", color: "var(--amber)" },
            { label: "Pending", value: todo, sub: "Not yet started", color: "var(--red)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          <div>
            <div className="section-header">
              <h2>My Projects</h2>
              <button className="btn-ghost" onClick={() => onNav("projects")}>View all</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myProjects.slice(0, 4).map(p => {
                const pts = mockTasks.filter(t => t.projectId === p.id);
                const pdone = pts.filter(t => t.status === "Done").length;
                const pct = pts.length ? Math.round(pdone / pts.length * 100) : 0;
                return (
                  <div key={p.id} className="project-card" style={{ "--project-color": p.color }}
                    onClick={() => { onSelectProject(p); onNav("project-detail"); }}>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text3)" }}>
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: pct + "%", background: p.color }} />
                      </div>
                    </div>
                    <div className="project-meta">
                      <span>{pts.length} tasks</span>
                      <span>•</span>
                      <span>{pdone} done</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="section-header"><h2>Recent Tasks</h2></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentTasks.map(t => {
                const proj = mockProjects.find(p => p.id === t.projectId);
                return (
                  <div key={t.id} className="card" style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{proj?.name}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <span className="chip" style={{ borderColor: statusColor[t.status] + "40", color: statusColor[t.status], background: statusColor[t.status] + "15" }}>
                          {t.status}
                        </span>
                        <span style={{ fontSize: 11, color: priorityColor[t.priority] }}>{t.priority}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="section-header"><h2>Task Status</h2></div>
              <div className="card">
                <div style={{ display: "flex", gap: 20 }}>
                  <div className="bar-chart" style={{ flex: 1 }}>
                    {[
                      { label: "To Do", val: todo, max: myTasks.length || 1, color: "#64748b" },
                      { label: "Prog", val: inProg, max: myTasks.length || 1, color: "var(--accent)" },
                      { label: "Done", val: done, max: myTasks.length || 1, color: "var(--green)" },
                    ].map(b => (
                      <div key={b.label} className="bar-col">
                        <div className="bar" style={{ height: `${(b.val / (myTasks.length || 1)) * 90}px`, background: b.color, minHeight: 4 }} />
                        <div className="bar-label">{b.label}</div>
                        <div className="bar-label" style={{ fontWeight: 700, color: "var(--text)" }}>{b.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                    {[
                      { label: "To Do", val: todo, color: "#64748b" },
                      { label: "In Progress", val: inProg, color: "var(--accent)" },
                      { label: "Done", val: done, color: "var(--green)" },
                    ].map(i => (
                      <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: i.color, flexShrink: 0 }} />
                        <span style={{ color: "var(--text2)" }}>{i.label}</span>
                        <span style={{ fontWeight: 700 }}>{i.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Projects List ────────────────────────────────────────────────────────────
function ProjectsPage({ user, onSelectProject, onNav }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1" });
  const myProjects = mockProjects.filter(p => p.members.includes(user.id));

  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

  const createProject = () => {
    if (!form.name) return;
    const np = { id: ++nextId.project, name: form.name, description: form.description, color: form.color, ownerId: user.id, members: [user.id], createdAt: new Date().toISOString().slice(0,10) };
    mockProjects.push(np);
    setShowModal(false);
    setForm({ name: "", description: "", color: "#6366f1" });
  };

  return (
    <>
      <div className="topbar">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>
      <div className="page-body">
        {myProjects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
          </div>
        ) : (
          <div className="grid-3">
            {myProjects.map(p => {
              const pts = mockTasks.filter(t => t.projectId === p.id);
              const pdone = pts.filter(t => t.status === "Done").length;
              const pct = pts.length ? Math.round(pdone / pts.length * 100) : 0;
              const members = p.members.map(getUser).filter(Boolean);
              return (
                <div key={p.id} className="project-card" style={{ "--project-color": p.color }}
                  onClick={() => { onSelectProject(p); onNav("project-detail"); }}>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "var(--text3)" }}>
                      <span>Progress</span><span style={{ fontWeight: 600, color: p.color }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: pct + "%", background: p.color }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="project-meta">
                      <span>{pts.length} tasks</span>
                      <span>•</span>
                      <span>Since {p.createdAt}</span>
                    </div>
                    <div className="avatar-stack">
                      {members.slice(0, 3).map(m => (
                        <div key={m.id} className="avatar" style={{ width: 22, height: 22, fontSize: 9, background: p.color }}>{m.avatar}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>Create New Project</h3>
            <div className="form-field">
              <label className="form-label">Project Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. E-Commerce App" />
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." rows={3} style={{ resize: "vertical" }} />
            </div>
            <div className="form-field">
              <label className="form-label">Color</label>
              <div style={{ display: "flex", gap: 8 }}>
                {colors.map(c => (
                  <div key={c} onClick={() => setForm({...form, color: c})}
                    style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: form.color === c ? "3px solid white" : "3px solid transparent", transition: "border 0.1s" }} />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={createProject}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Project Detail (tabs) ────────────────────────────────────────────────────
function ProjectDetail({ project, user }) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "notes", label: "Notes" },
    { id: "files", label: "Files" },
    { id: "spreadsheet", label: "Spreadsheet" },
    { id: "diagram", label: "Diagram" },
  ];

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: project.color }} />
          <h1>{project.name}</h1>
        </div>
      </div>
      <div className="page-body">
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
          ))}
        </div>

        {tab === "overview" && <ProjectOverview project={project} />}
        {tab === "tasks" && <KanbanBoard project={project} user={user} />}
        {tab === "notes" && <NotesModule project={project} user={user} />}
        {tab === "files" && <FileManager project={project} user={user} />}
        {tab === "spreadsheet" && <SpreadsheetModule project={project} />}
        {tab === "diagram" && <DiagramTool project={project} />}
      </div>
    </>
  );
}

function ProjectOverview({ project }) {
  const tasks = mockTasks.filter(t => t.projectId === project.id);
  const done = tasks.filter(t => t.status === "Done").length;
  const inProg = tasks.filter(t => t.status === "In Progress").length;
  const todo = tasks.filter(t => t.status === "To Do").length;
  const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const members = project.members.map(getUser).filter(Boolean);

  return (
    <div>
      <div className="grid-3 mb-4">
        {[
          { label: "Total Tasks", value: tasks.length, color: "var(--text)" },
          { label: "Completed", value: done, color: "var(--green)" },
          { label: "In Progress", value: inProg, color: "var(--accent2)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: 28 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div style={{ marginBottom: 14, fontWeight: 600, fontSize: 14 }}>Overall Progress</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 36, fontFamily: "Syne", fontWeight: 800, color: project.color }}>{pct}%</div>
            <div style={{ flex: 1 }}>
              <div className="progress-bar" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: pct + "%", background: project.color }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{done} of {tasks.length} tasks complete</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ l: "To Do", v: todo, c: "#64748b" }, { l: "In Progress", v: inProg, c: "var(--accent)" }, { l: "Done", v: done, c: "var(--green)" }].map(i => (
              <div key={i.l} style={{ flex: 1, background: "var(--surface2)", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: i.c }}>{i.v}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{i.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: 14, fontWeight: 600, fontSize: 14 }}>Team Members</div>
          {members.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div className="avatar" style={{ background: project.color }}>{m.avatar}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{m.role}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span className="badge">{mockTasks.filter(t => t.projectId === project.id && t.assignee === m.id).length} tasks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────
function KanbanBoard({ project, user }) {
  const [tasks, setTasks] = useState(() => mockTasks.filter(t => t.projectId === project.id));
  const [dragId, setDragId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", deadline: "", assignee: "" });

  const columns = ["To Do", "In Progress", "Done"];

  const onDrop = (status) => {
    if (!dragId) return;
    const updated = mockTasks.map(t => t.id === dragId ? { ...t, status } : t);
    mockTasks.length = 0; mockTasks.push(...updated);
    setTasks(updated.filter(t => t.projectId === project.id));
    setDragId(null);
  };

  const addTask = () => {
    if (!form.title) return;
    const nt = { id: ++nextId.task, projectId: project.id, title: form.title, description: form.description, status: "To Do", priority: form.priority, deadline: form.deadline, assignee: form.assignee ? parseInt(form.assignee) : null };
    mockTasks.push(nt);
    setTasks(mockTasks.filter(t => t.projectId === project.id));
    setShowModal(false);
    setForm({ title: "", description: "", priority: "Medium", deadline: "", assignee: "" });
  };

  const deleteTask = (id) => {
    const idx = mockTasks.findIndex(t => t.id === id);
    if (idx !== -1) mockTasks.splice(idx, 1);
    setTasks(mockTasks.filter(t => t.projectId === project.id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>
      <div className="kanban-board">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          return (
            <div key={col} className="kanban-col"
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col)}>
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <div style={{ width: 8, height: 8, borderRadius: 50, background: statusColor[col] }} />
                  {col}
                  <span className="badge">{colTasks.length}</span>
                </div>
              </div>
              <div className="kanban-col-body">
                {colTasks.map(t => {
                  const assignee = getUser(t.assignee);
                  return (
                    <div key={t.id} className={`task-card ${dragId === t.id ? "dragging" : ""}`}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => setDragId(null)}>
                      <h4>{t.title}</h4>
                      {t.description && <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>{t.description}</div>}
                      <div className="task-card-meta">
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div className="priority-dot" style={{ background: priorityColor[t.priority] }} />
                          <span style={{ fontSize: 11, color: priorityColor[t.priority] }}>{t.priority}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {t.deadline && <span style={{ fontSize: 11, color: "var(--text3)" }}>{t.deadline}</span>}
                          {assignee && <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{assignee.avatar}</div>}
                          <button className="btn-icon" onClick={() => deleteTask(t.id)}><Icon name="trash" size={12} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>Add New Task</h3>
            <div className="form-field">
              <label className="form-label">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Task title" />
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Details..." rows={2} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-field">
                <label className="form-label">Priority</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Assign To</label>
              <select value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})}>
                <option value="">Unassigned</option>
                {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notes Module ─────────────────────────────────────────────────────────────
function NotesModule({ project, user }) {
  const [notes, setNotes] = useState(() => mockNotes.filter(n => n.projectId === project.id));
  const [activeNote, setActiveNote] = useState(notes[0] || null);
  const [saved, setSaved] = useState(true);

  const createNote = () => {
    const nn = { id: ++nextId.note, projectId: project.id, title: "Untitled Note", content: "<p>Start writing...</p>", updatedAt: new Date().toISOString().slice(0,10) };
    mockNotes.push(nn);
    setNotes(mockNotes.filter(n => n.projectId === project.id));
    setActiveNote(nn);
  };

  const execCmd = (cmd, val = null) => { document.execCommand(cmd, false, val); };

  const onInput = (e) => {
    if (!activeNote) return;
    const updated = { ...activeNote, content: e.currentTarget.innerHTML, updatedAt: new Date().toISOString().slice(0,10) };
    const idx = mockNotes.findIndex(n => n.id === activeNote.id);
    if (idx !== -1) mockNotes[idx] = updated;
    setActiveNote(updated);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const deleteNote = (id) => {
    const idx = mockNotes.findIndex(n => n.id === id);
    if (idx !== -1) mockNotes.splice(idx, 1);
    const remaining = mockNotes.filter(n => n.projectId === project.id);
    setNotes(remaining);
    setActiveNote(remaining[0] || null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, height: "70vh" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>NOTES</span>
          <button className="btn-icon" onClick={createNote}><Icon name="plus" size={14} /></button>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          {notes.map(n => (
            <div key={n.id} onClick={() => setActiveNote(n)}
              style={{ padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", background: activeNote?.id === n.id ? "var(--surface2)" : "transparent" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{n.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>

      {activeNote ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center", background: "var(--surface2)" }}>
            <input value={activeNote.title} onChange={e => {
              const upd = { ...activeNote, title: e.target.value };
              const idx = mockNotes.findIndex(n => n.id === activeNote.id);
              if (idx !== -1) mockNotes[idx] = upd;
              setActiveNote(upd);
              setNotes(mockNotes.filter(n => n.projectId === project.id));
            }} style={{ background: "transparent", border: "none", fontSize: 14, fontWeight: 700, flex: 1, padding: "4px 0" }} />
            <span style={{ fontSize: 11, color: saved ? "var(--green)" : "var(--amber)" }}>{saved ? "✓ Saved" : "Saving..."}</span>
            <button className="btn-icon" onClick={() => deleteNote(activeNote.id)}><Icon name="trash" size={14} /></button>
          </div>
          <div className="editor-toolbar">
            {[
              { label: "B", cmd: "bold", style: { fontWeight: 800 } },
              { label: "I", cmd: "italic", style: { fontStyle: "italic" } },
              { label: "U", cmd: "underline", style: { textDecoration: "underline" } },
            ].map(b => <button key={b.cmd} className="toolbar-btn" style={b.style} onClick={() => execCmd(b.cmd)}>{b.label}</button>)}
            <div className="toolbar-divider" />
            {[
              { label: "H1", cmd: "formatBlock", val: "h2" },
              { label: "H2", cmd: "formatBlock", val: "h3" },
              { label: "¶", cmd: "formatBlock", val: "p" },
            ].map(b => <button key={b.label} className="toolbar-btn" onClick={() => execCmd(b.cmd, b.val)}>{b.label}</button>)}
            <div className="toolbar-divider" />
            {[
              { label: "• List", cmd: "insertUnorderedList" },
              { label: "1. List", cmd: "insertOrderedList" },
            ].map(b => <button key={b.label} className="toolbar-btn" onClick={() => execCmd(b.cmd)}>{b.label}</button>)}
          </div>
          <div className="editor-content" contentEditable suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: activeNote.content }}
            onInput={onInput} style={{ flex: 1, overflowY: "auto" }} />
        </div>
      ) : (
        <div className="empty-state">
          <h3>No note selected</h3>
          <p>Select a note or create a new one</p>
          <button className="btn-primary" style={{ marginTop: 14 }} onClick={createNote}>+ New Note</button>
        </div>
      )}
    </div>
  );
}

// ─── File Manager ─────────────────────────────────────────────────────────────
function FileManager({ project, user }) {
  const [files, setFiles] = useState(() => mockFiles.filter(f => f.projectId === project.id));
  const typeColors = { PDF: "#ef4444", PPTX: "#f59e0b", XLSX: "#10b981", DOC: "#6366f1", DOCX: "#6366f1", default: "#64748b" };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toUpperCase();
    const nf = { id: ++nextId.file, projectId: project.id, name: file.name, type: ext, size: (file.size / 1024 / 1024).toFixed(1) + " MB", uploadedBy: user.id, uploadedAt: new Date().toISOString().slice(0,10) };
    mockFiles.push(nf);
    setFiles(mockFiles.filter(f => f.projectId === project.id));
  };

  const deleteFile = (id) => {
    const idx = mockFiles.findIndex(f => f.id === id);
    if (idx !== -1) mockFiles.splice(idx, 1);
    setFiles(mockFiles.filter(f => f.projectId === project.id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 8 }}>
        <label className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", cursor: "pointer" }}>
          <Icon name="upload" size={14} />
          Upload File
          <input type="file" accept=".pdf,.pptx,.docx,.xlsx,.doc" style={{ display: "none" }} onChange={handleUpload} />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <h3>No files uploaded</h3>
          <p>Upload PDFs, presentations, spreadsheets, and more</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map(f => {
            const uploader = getUser(f.uploadedBy);
            const color = typeColors[f.type] || typeColors.default;
            return (
              <div key={f.id} className="file-item">
                <div className="file-icon" style={{ background: color + "20", color }}>
                  {f.type}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{f.size} • Uploaded by {uploader?.name} • {f.uploadedAt}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="eye" size={12} /> Preview
                  </button>
                  <button className="btn-icon" onClick={() => deleteFile(f.id)}><Icon name="trash" size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Spreadsheet Module ───────────────────────────────────────────────────────
function SpreadsheetModule({ project }) {
  const existing = mockSpreadsheets.find(s => s.projectId === project.id);
  const [data, setData] = useState(() => existing || {
    id: ++nextId.ss, projectId: project.id, name: "Data Tracker",
    columns: ["Item", "Value", "Status", "Notes"],
    rows: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
  });

  const updateCell = (ri, ci, val) => {
    const newRows = data.rows.map((row, r) => r === ri ? row.map((cell, c) => c === ci ? val : cell) : row);
    setData({ ...data, rows: newRows });
  };

  const addRow = () => setData({ ...data, rows: [...data.rows, Array(data.columns.length).fill("")] });
  const addCol = () => {
    const name = `Col ${data.columns.length + 1}`;
    setData({ ...data, columns: [...data.columns, name], rows: data.rows.map(r => [...r, ""]) });
  };
  const deleteRow = (ri) => setData({ ...data, rows: data.rows.filter((_, i) => i !== ri) });
  const updateHeader = (ci, val) => setData({ ...data, columns: data.columns.map((c, i) => i === ci ? val : c) });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <input value={data.name} onChange={e => setData({...data, name: e.target.value})}
          style={{ background: "transparent", border: "none", fontSize: 16, fontWeight: 700, width: "auto" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={addCol} style={{ fontSize: 12 }}>+ Column</button>
          <button className="btn-primary" onClick={addRow} style={{ fontSize: 12 }}>+ Row</button>
        </div>
      </div>
      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: "center", background: "var(--surface3)" }}>#</th>
              {data.columns.map((col, ci) => (
                <th key={ci}>
                  <input value={col} onChange={e => updateHeader(ci, e.target.value)}
                    style={{ background: "transparent", border: "none", fontWeight: 700, color: "var(--text2)", fontSize: 12 }} />
                </th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri}>
                <td style={{ textAlign: "center", fontSize: 12, color: "var(--text3)", padding: "10px 8px", borderRight: "1px solid var(--border)", background: "var(--surface2)" }}>{ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} />
                  </td>
                ))}
                <td style={{ textAlign: "center", padding: "0 4px" }}>
                  <button className="btn-icon" onClick={() => deleteRow(ri)}><Icon name="x" size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Diagram Tool ─────────────────────────────────────────────────────────────
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

  const deleteShape = (id) => { setShapes(s => s.filter(sh => sh.id !== id)); setSaved(false); };

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

// ─── My Tasks ─────────────────────────────────────────────────────────────────
function MyTasks({ user }) {
  const [filter, setFilter] = useState("All");
  const myTasks = mockTasks.filter(t => t.assignee === user.id);
  const filtered = filter === "All" ? myTasks : myTasks.filter(t => t.status === filter);

  return (
    <>
      <div className="topbar"><h1>My Tasks</h1></div>
      <div className="page-body">
        <div className="tabs">
          {["All", "To Do", "In Progress", "Done"].map(f => (
            <div key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><h3>No tasks found</h3><p>Tasks assigned to you will appear here</p></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(t => {
              const proj = mockProjects.find(p => p.id === t.projectId);
              return (
                <div key={t.id} className="card" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{t.description}</div>}
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>{proj?.name}</span>
                        {t.deadline && <span style={{ fontSize: 11, color: "var(--text3)" }}>Due {t.deadline}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                      <span className="chip" style={{ borderColor: statusColor[t.status] + "40", color: statusColor[t.status], background: statusColor[t.status] + "15" }}>
                        {t.status}
                      </span>
                      <span style={{ fontSize: 11, color: priorityColor[t.priority], fontWeight: 600 }}>{t.priority}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics({ user }) {
  const allTasks = mockTasks;
  const done = allTasks.filter(t => t.status === "Done").length;
  const inProg = allTasks.filter(t => t.status === "In Progress").length;
  const todo = allTasks.filter(t => t.status === "To Do").length;

  const projectStats = mockProjects.map(p => {
    const pts = allTasks.filter(t => t.projectId === p.id);
    return { ...p, total: pts.length, done: pts.filter(t => t.status === "Done").length, pct: pts.length ? Math.round(pts.filter(t => t.status === "Done").length / pts.length * 100) : 0 };
  });

  const maxTasks = Math.max(...projectStats.map(p => p.total), 1);

  return (
    <>
      <div className="topbar"><h1>Analytics</h1></div>
      <div className="page-body">
        <div className="grid-4 mb-4">
          {[
            { label: "Total Tasks", value: allTasks.length, color: "var(--text)" },
            { label: "Completed", value: done, color: "var(--green)" },
            { label: "In Progress", value: inProg, color: "var(--accent2)" },
            { label: "Completion Rate", value: allTasks.length ? Math.round(done/allTasks.length*100)+"%" : "0%", color: "var(--amber)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Tasks by Project</div>
            {projectStats.map(p => (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span>{p.name}</span>
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>{p.done}/{p.total} tasks</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: p.pct + "%", background: p.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Task Distribution</div>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
              <div className="bar-chart" style={{ flex: 1, height: 160 }}>
                {projectStats.map(p => (
                  <div key={p.id} className="bar-col">
                    <div className="bar" style={{ height: `${(p.total / maxTasks) * 130}px`, background: p.color, minHeight: 4 }} />
                    <div className="bar-label" style={{ fontSize: 10, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name.split(" ")[0]}</div>
                    <div className="bar-label" style={{ fontWeight: 700, color: "var(--text)" }}>{p.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Status Overview</div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "To Do", val: todo, color: "#64748b" },
                { label: "In Progress", val: inProg, color: "#6366f1" },
                { label: "Done", val: done, color: "#10b981" },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, textAlign: "center", background: "var(--surface2)", borderRadius: 10, padding: "16px 10px" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Syne", color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: item.color, marginTop: 2 }}>
                    {allTasks.length ? Math.round(item.val / allTasks.length * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Priority Breakdown</div>
            {["High", "Medium", "Low"].map(pri => {
              const cnt = allTasks.filter(t => t.priority === pri).length;
              const pct = allTasks.length ? Math.round(cnt / allTasks.length * 100) : 0;
              return (
                <div key={pri} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 50, background: priorityColor[pri] }} />
                      {pri} Priority
                    </span>
                    <span style={{ color: "var(--text3)", fontSize: 12 }}>{cnt} tasks ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: pct + "%", background: priorityColor[pri] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [currentProject, setCurrentProject] = useState(null);

  if (!user) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={setUser} />
    </>
  );

  const renderView = () => {
    if (view === "project-detail" && currentProject) return <ProjectDetail project={currentProject} user={user} />;
    if (view === "projects") return <ProjectsPage user={user} onSelectProject={setCurrentProject} onNav={setView} />;
    if (view === "tasks") return <MyTasks user={user} />;
    if (view === "analytics") return <Analytics user={user} />;
    return <Dashboard user={user} onNav={setView} onSelectProject={setCurrentProject} />;
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <style>{css}</style>
      <div className="app-shell">
        <Sidebar
          currentView={view} onNav={setView}
          currentProject={currentProject}
          onSelectProject={setCurrentProject}
          user={user}
          onLogout={() => setUser(null)}
        />
        <div className="main-content">{renderView()}</div>
      </div>
    </AuthContext.Provider>
  );
}
