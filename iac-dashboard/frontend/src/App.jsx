import React, { useState } from "react";
import Login from "./Login";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [workspace, setWorkspace] = useState("dev");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [logs, setLogs] = useState("");
  const [runs, setRuns] = useState([]);

  const runAction = async (action) => {
    setLoading(true);
    setStatus("RUNNING");
    setLogs("");

    try {
      const res = await fetch(`${API_BASE}/${action}`, { method: "POST" });
      const data = await res.json();

      setLogs(data.output);
      setStatus(data.status.toUpperCase());

      setRuns((prev) => [
        {
          type: action,
          time: new Date().toLocaleString(),
          ws: workspace,
          status: data.status,
        },
        ...prev,
      ]);
    } catch (err) {
      setLogs(err.toString());
      setStatus("FAILED");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="logo">
            <span className="logo-mark">⬢</span> SLK InfraOps
          </div>
          <p className="subtitle">Terraform Control Plane</p>
        </div>

        <select value={workspace} onChange={(e) => setWorkspace(e.target.value)}>
          <option>dev</option>
          <option>stage</option>
          <option>prod</option>
        </select>
      </header>

      <div className="actions">
        <button onClick={() => runAction("init")}>Init</button>
        <button onClick={() => runAction("plan")}>Plan</button>
        <button onClick={() => runAction("apply")}>Apply</button>
        <button className="danger" onClick={() => runAction("destroy")}>
          Destroy
        </button>

        {loading && <span className="spinner">⏳</span>}
        <span className={`status ${status.toLowerCase()}`}>
          Status: {status}
        </span>
      </div>

      <div className="content">
        <section className="logs">
          <div className="logs-header">
            <h3>Execution Output</h3>
            <button onClick={() => navigator.clipboard.writeText(logs)}>
              Copy Logs
            </button>
          </div>

          <pre className="log-output">
            {logs || "Run a Terraform command to see output"}
          </pre>
        </section>

        <section className="history">
          <h3>Run History</h3>

          {runs.map((r, i) => (
            <div className="run-item" key={i}>
              <div>
                <strong>{r.type}</strong>
                <div className="meta">{r.time}</div>
                <div className="meta">ws: {r.ws}</div>
              </div>
              <span className={`badge ${r.status}`}>{r.status}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

