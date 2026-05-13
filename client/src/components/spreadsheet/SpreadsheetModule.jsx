import { useState } from "react";
import Icon from "../common/Icon";
import { mockSpreadsheets, nextId } from "../../data/mockData";

function SpreadsheetModule({ project }) {
  const existing = mockSpreadsheets.find(s => s.projectId === project.id);
  const [data, setData] = useState(() => existing || {
    id: ++nextId.ss, projectId: project.id, name: "Data Tracker",
    columns: ["Item", "Value", "Status", "Notes"],
    rows: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
  });

  const updateCell = (ri, ci, val) => {
    const newRows = data.rows.map((row, r) => r === ri ? row.map((cell, c) => c === ci ? val : cell) : row);
    setData({ ...data, rows: newRows });
  };

  const addRow = () => setData({ ...data, rows: [...data.rows, Array(data.columns.length).fill("")] });
  const addCol = () => {
    const name = `Col ${data.columns.length + 1}`;
    setData({ ...data, columns: [...data.columns, name], rows: data.rows.map(r => [...r, ""]) });
  };
  const deleteRow = (ri) => setData({ ...data, rows: data.rows.filter((_, i) => i !== ri) });
  const updateHeader = (ci, val) => setData({ ...data, columns: data.columns.map((c, i) => i === ci ? val : c) });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <input value={data.name} onChange={e => setData({...data, name: e.target.value})}
          style={{ background: "transparent", border: "none", fontSize: 16, fontWeight: 700, width: "auto" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={addCol} style={{ fontSize: 12 }}>+ Column</button>
          <button className="btn-primary" onClick={addRow} style={{ fontSize: 12 }}>+ Row</button>
        </div>
      </div>
      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: "center", background: "var(--surface3)" }}>#</th>
              {data.columns.map((col, ci) => (
                <th key={ci}>
                  <input value={col} onChange={e => updateHeader(ci, e.target.value)}
                    style={{ background: "transparent", border: "none", fontWeight: 700, color: "var(--text2)", fontSize: 12 }} />
                </th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri}>
                <td style={{ textAlign: "center", fontSize: 12, color: "var(--text3)", padding: "10px 8px", borderRight: "1px solid var(--border)", background: "var(--surface2)" }}>{ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci}><input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} /></td>
                ))}
                <td style={{ textAlign: "center", padding: "0 4px" }}>
                  <button className="btn-icon" onClick={() => deleteRow(ri)}><Icon name="x" size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpreadsheetModule;
