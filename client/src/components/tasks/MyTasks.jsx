import { useState } from "react";
import { mockTasks, mockProjects } from "../../data/mockData";
import { statusColor, priorityColor } from "../../utils/helpers";

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

export default MyTasks;
