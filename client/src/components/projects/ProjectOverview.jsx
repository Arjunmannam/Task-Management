import { mockTasks } from "../../data/mockData";
import { getUser } from "../../utils/helpers";

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

export default ProjectOverview;
