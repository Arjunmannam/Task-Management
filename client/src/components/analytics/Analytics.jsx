import { mockTasks, mockProjects } from "../../data/mockData";
import { priorityColor } from "../../utils/helpers";

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

export default Analytics;
