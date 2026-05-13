import { useState } from "react";
import Icon from "../common/Icon";
import { mockFiles, nextId } from "../../data/mockData";
import { getUser } from "../../utils/helpers";

function FileManager({ project, user }) {
  const [files, setFiles] = useState(() => mockFiles.filter(f => f.projectId === project.id));
  const typeColors = { PDF: "#ef4444", PPTX: "#f59e0b", XLSX: "#10b981", DOC: "#6366f1", DOCX: "#6366f1", default: "#64748b" };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toUpperCase();
    const nf = { id: ++nextId.file, projectId: project.id, name: file.name, type: ext, size: (file.size / 1024 / 1024).toFixed(1) + " MB", uploadedBy: user.id, uploadedAt: new Date().toISOString().slice(0,10) };
    mockFiles.push(nf);
    setFiles(mockFiles.filter(f => f.projectId === project.id));
  };

  const deleteFile = (id) => {
    const idx = mockFiles.findIndex(f => f.id === id);
    if (idx !== -1) mockFiles.splice(idx, 1);
    setFiles(mockFiles.filter(f => f.projectId === project.id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 8 }}>
        <label className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", cursor: "pointer" }}>
          <Icon name="upload" size={14} />
          Upload File
          <input type="file" accept=".pdf,.pptx,.docx,.xlsx,.doc" style={{ display: "none" }} onChange={handleUpload} />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <h3>No files uploaded</h3>
          <p>Upload PDFs, presentations, spreadsheets, and more</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map(f => {
            const uploader = getUser(f.uploadedBy);
            const color = typeColors[f.type] || typeColors.default;
            return (
              <div key={f.id} className="file-item">
                <div className="file-icon" style={{ background: color + "20", color }}>
                  {f.type}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{f.size} • Uploaded by {uploader?.name} • {f.uploadedAt}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="eye" size={12} /> Preview
                  </button>
                  <button className="btn-icon" onClick={() => deleteFile(f.id)}><Icon name="trash" size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileManager;
