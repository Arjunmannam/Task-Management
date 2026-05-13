import { useState } from "react";
import ProjectOverview from "./ProjectOverview";
import KanbanBoard from "../tasks/KanbanBoard";
import NotesModule from "../notes/NotesModule";
import FileManager from "../files/FileManager";
import SpreadsheetModule from "../spreadsheet/SpreadsheetModule";
import DiagramTool from "../diagram/DiagramTool";

function ProjectDetail({ project, user }) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "notes", label: "Notes" },
    { id: "files", label: "Files" },
    { id: "spreadsheet", label: "Spreadsheet" },
    { id: "diagram", label: "Diagram" },
  ];

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: project.color }} />
          <h1>{project.name}</h1>
        </div>
      </div>
      <div className="page-body">
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
          ))}
        </div>

        {tab === "overview" && <ProjectOverview project={project} />}
        {tab === "tasks" && <KanbanBoard project={project} user={user} />}
        {tab === "notes" && <NotesModule project={project} user={user} />}
        {tab === "files" && <FileManager project={project} user={user} />}
        {tab === "spreadsheet" && <SpreadsheetModule project={project} />}
        {tab === "diagram" && <DiagramTool project={project} />}
      </div>
    </>
  );
}

export default ProjectDetail;
