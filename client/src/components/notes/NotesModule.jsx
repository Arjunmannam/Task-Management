import { useState } from "react";
import Icon from "../common/Icon";
import { mockNotes, nextId } from "../../data/mockData";

function NotesModule({ project, user }) {
  const [notes, setNotes] = useState(() => mockNotes.filter(n => n.projectId === project.id));
  const [activeNote, setActiveNote] = useState(notes[0] || null);
  const [saved, setSaved] = useState(true);

  const createNote = () => {
    const nn = { id: ++nextId.note, projectId: project.id, title: "Untitled Note", content: "<p>Start writing...</p>", updatedAt: new Date().toISOString().slice(0,10) };
    mockNotes.push(nn);
    setNotes(mockNotes.filter(n => n.projectId === project.id));
    setActiveNote(nn);
  };

  const execCmd = (cmd, val = null) => { document.execCommand(cmd, false, val); };

  const onInput = (e) => {
    if (!activeNote) return;
    const updated = { ...activeNote, content: e.currentTarget.innerHTML, updatedAt: new Date().toISOString().slice(0,10) };
    const idx = mockNotes.findIndex(n => n.id === activeNote.id);
    if (idx !== -1) mockNotes[idx] = updated;
    setActiveNote(updated);
    setSaved(false);
    setTimeout(() => setSaved(true), 1500);
  };

  const deleteNote = (id) => {
    const idx = mockNotes.findIndex(n => n.id === id);
    if (idx !== -1) mockNotes.splice(idx, 1);
    const remaining = mockNotes.filter(n => n.projectId === project.id);
    setNotes(remaining);
    setActiveNote(remaining[0] || null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, height: "70vh" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>NOTES</span>
          <button className="btn-icon" onClick={createNote}><Icon name="plus" size={14} /></button>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          {notes.map(n => (
            <div key={n.id} onClick={() => setActiveNote(n)}
              style={{ padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", background: activeNote?.id === n.id ? "var(--surface2)" : "transparent" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{n.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>

      {activeNote ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center", background: "var(--surface2)" }}>
            <input value={activeNote.title} onChange={e => {
              const upd = { ...activeNote, title: e.target.value };
              const idx = mockNotes.findIndex(n => n.id === activeNote.id);
              if (idx !== -1) mockNotes[idx] = upd;
              setActiveNote(upd);
              setNotes(mockNotes.filter(n => n.projectId === project.id));
            }} style={{ background: "transparent", border: "none", fontSize: 14, fontWeight: 700, flex: 1, padding: "4px 0" }} />
            <span style={{ fontSize: 11, color: saved ? "var(--green)" : "var(--amber)" }}>{saved ? "✓ Saved" : "Saving..."}</span>
            <button className="btn-icon" onClick={() => deleteNote(activeNote.id)}><Icon name="trash" size={14} /></button>
          </div>
          <div className="editor-toolbar">
            {[
              { label: "B", cmd: "bold", style: { fontWeight: 800 } },
              { label: "I", cmd: "italic", style: { fontStyle: "italic" } },
              { label: "U", cmd: "underline", style: { textDecoration: "underline" } },
            ].map(b => <button key={b.cmd} className="toolbar-btn" style={b.style} onClick={() => execCmd(b.cmd)}>{b.label}</button>)}
            <div className="toolbar-divider" />
            {[
              { label: "H1", cmd: "formatBlock", val: "h2" },
              { label: "H2", cmd: "formatBlock", val: "h3" },
              { label: "¶", cmd: "formatBlock", val: "p" },
            ].map(b => <button key={b.label} className="toolbar-btn" onClick={() => execCmd(b.cmd, b.val)}>{b.label}</button>)}
            <div className="toolbar-divider" />
            {[
              { label: "• List", cmd: "insertUnorderedList" },
              { label: "1. List", cmd: "insertOrderedList" },
            ].map(b => <button key={b.label} className="toolbar-btn" onClick={() => execCmd(b.cmd)}>{b.label}</button>)}
          </div>
          <div className="editor-content" contentEditable suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: activeNote.content }}
            onInput={onInput} style={{ flex: 1, overflowY: "auto" }} />
        </div>
      ) : (
        <div className="empty-state">
          <h3>No note selected</h3>
          <p>Select a note or create a new one</p>
          <button className="btn-primary" style={{ marginTop: 14 }} onClick={createNote}>+ New Note</button>
        </div>
      )}
    </div>
  );
}

export default NotesModule;
