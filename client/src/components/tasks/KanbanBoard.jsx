import { useState } from "react";
import Icon from "../common/Icon";
import { mockTasks, mockUsers, nextId } from "../../data/mockData";
import { getUser, priorityColor, statusColor } from "../../utils/helpers";

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

export default KanbanBoard;
