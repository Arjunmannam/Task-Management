import Icon from "../common/Icon";
import { mockProjects } from "../../data/mockData";

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

export default Sidebar;
