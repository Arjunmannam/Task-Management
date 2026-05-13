import { mockTasks, mockProjects } from "../../data/mockData";
import { statusColor, priorityColor } from "../../utils/helpers";

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

export default Dashboard;
