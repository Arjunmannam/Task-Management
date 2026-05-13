import { useState } from "react";
import { mockProjects, mockTasks, nextId } from "../../data/mockData";
import { getUser } from "../../utils/helpers";

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

export default ProjectsPage;
