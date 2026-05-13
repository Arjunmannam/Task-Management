import { useState } from "react";
import AuthContext from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectDetail from "./components/projects/ProjectDetail";
import MyTasks from "./components/tasks/MyTasks";
import Analytics from "./components/analytics/Analytics";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [currentProject, setCurrentProject] = useState(null);

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderView = () => {
    if (view === "project-detail" && currentProject) return <ProjectDetail project={currentProject} user={user} />;
    if (view === "projects") return <ProjectsPage user={user} onSelectProject={setCurrentProject} onNav={setView} />;
    if (view === "tasks") return <MyTasks user={user} />;
    if (view === "analytics") return <Analytics user={user} />;
    return <Dashboard user={user} onNav={setView} onSelectProject={setCurrentProject} />;
  };

  return (
    <AuthContext.Provider value={{ user }}>
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
