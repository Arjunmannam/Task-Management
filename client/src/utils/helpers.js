import { mockUsers } from "../data/mockData";

// ─── Utilities ────────────────────────────────────────────────────────────────
export const getUser = (id) => mockUsers.find(u => u.id === id);

export const priorityColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };

export const statusColor = { "To Do": "#64748b", "In Progress": "#6366f1", "Done": "#10b981" };
