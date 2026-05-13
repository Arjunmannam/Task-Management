// ─── Mock Data Store ─────────────────────────────────────────────────────────

export const mockUsers = [
  { id: 1, name: "Alex Chen", email: "alex@demo.com", password: "demo123", role: "Admin", avatar: "AC" },
  { id: 2, name: "Sara Kim",  email: "sara@demo.com", password: "demo123", role: "User",  avatar: "SK" },
];

export let mockProjects = [
  { id: 1, name: "E-Commerce Platform", description: "Full-stack shopping app", color: "#6366f1", ownerId: 1, members: [1,2], createdAt: "2025-01-10" },
  { id: 2, name: "Analytics Dashboard", description: "Real-time data visualization", color: "#f59e0b", ownerId: 1, members: [1], createdAt: "2025-02-05" },
  { id: 3, name: "Mobile App Redesign", description: "UX overhaul for iOS/Android", color: "#10b981", ownerId: 2, members: [2], createdAt: "2025-03-01" },
];

export let mockTasks = [
  { id: 1, projectId: 1, title: "Setup authentication", description: "JWT login flow", status: "Done", assignee: 1, deadline: "2025-04-01", priority: "High" },
  { id: 2, projectId: 1, title: "Design product page", description: "Product listing UI", status: "In Progress", assignee: 2, deadline: "2025-04-15", priority: "Medium" },
  { id: 3, projectId: 1, title: "Integrate payment gateway", description: "Stripe integration", status: "To Do", assignee: 1, deadline: "2025-04-30", priority: "High" },
  { id: 4, projectId: 1, title: "Write API documentation", description: "Swagger docs", status: "To Do", assignee: null, deadline: "2025-05-01", priority: "Low" },
  { id: 5, projectId: 2, title: "Chart components", description: "Line/bar/pie charts", status: "In Progress", assignee: 1, deadline: "2025-04-20", priority: "High" },
  { id: 6, projectId: 2, title: "Data pipeline setup", description: "ETL scripts", status: "To Do", assignee: 1, deadline: "2025-05-10", priority: "Medium" },
];

export let mockNotes = [
  { id: 1, projectId: 1, title: "Architecture Overview", content: "<h2>System Architecture</h2><p>This project uses a <strong>microservices</strong> approach with the following components:</p><ul><li>Auth Service (JWT)</li><li>Product Service</li><li>Order Service</li></ul>", updatedAt: "2025-03-15" },
  { id: 2, projectId: 1, title: "API Endpoints", content: "<h2>REST API Reference</h2><p>Base URL: <strong>https://api.example.com/v1</strong></p><p>All endpoints require Bearer token authentication.</p>", updatedAt: "2025-03-20" },
];

export let mockFiles = [
  { id: 1, projectId: 1, name: "requirements.pdf", type: "PDF", size: "1.2 MB", uploadedBy: 1, uploadedAt: "2025-03-10" },
  { id: 2, projectId: 1, name: "wireframes.pptx", type: "PPTX", size: "3.8 MB", uploadedBy: 2, uploadedAt: "2025-03-12" },
  { id: 3, projectId: 2, name: "data-schema.xlsx", type: "XLSX", size: "0.5 MB", uploadedBy: 1, uploadedAt: "2025-03-14" },
];

export let mockSpreadsheets = [
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

export let mockDiagrams = [
  { id: 1, projectId: 1, name: "System Architecture", shapes: [
    { id: "s1", type: "rect", x: 80, y: 80, w: 140, h: 50, label: "React Frontend", color: "#6366f1" },
    { id: "s2", type: "rect", x: 80, y: 200, w: 140, h: 50, label: "Spring Boot API", color: "#10b981" },
    { id: "s3", type: "rect", x: 280, y: 200, w: 140, h: 50, label: "MySQL Database", color: "#f59e0b" },
    { id: "s4", type: "arrow", x1: 150, y1: 130, x2: 150, y2: 200 },
    { id: "s5", type: "arrow", x1: 220, y1: 225, x2: 280, y2: 225 },
  ]}
];

export let nextId = { task: 10, note: 10, file: 10, project: 10, shape: 20, ss: 10 };
