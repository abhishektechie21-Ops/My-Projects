import React, { useState } from "react";
import Login from "./Login";

const Tooltip = ({ text, children }) => ( <span className="tooltip-wrapper">
{children} <span className="tooltip">{text}</span> </span>
);

export default function App() {
// 🔐 Auth
const [loggedIn, setLoggedIn] = useState(false);

// 🌍 Workspace & UI State
const [workspace, setWorkspace] = useState("dev");
const [loading, setLoading] = useState(false);
const [runs, setRuns] = useState([]);
const [status, setStatus] = useState("IDLE");

// 🚀 Actions
const runAction = (type) => {
setLoading(true);
setStatus("RUNNING");


setTimeout(() => {
  setRuns([
    {
      type,
      time: new Date().toLocaleString(),
      ws: workspace,
      status: "success",
    },
    ...runs,
  ]);
  setLoading(false);
  setStatus("SUCCESS");
}, 1200);


};

// 🔐 Login gate (AFTER hooks)
if (!loggedIn) {
return <Login onLogin={() => setLoggedIn(true)} />;
}

return ( <div className="app">
{/* Header */} <header className="header"> <div> <div className="logo"> <span className="logo-mark">⬢</span> <span className="logo-text">InfraOps</span> </div> <p className="subtitle">Terraform Control Plane</p> </div>


    <div className="header-actions">
      <select
        value={workspace}
        onChange={(e) => setWorkspace(e.target.value)}
      >
        <option>dev</option>
        <option>stage</option>
        <option>prod</option>
      </select>
      <button>Dark</button>
    </div>
  </header>

  {/* Actions */}
  <div className="actions">
    <Tooltip text="Initialize Terraform backend">
      <button onClick={() => runAction("init")}>Init</button>
    </Tooltip>

    <Tooltip text="Preview infrastructure changes">
      <button onClick={() => runAction("plan")}>Plan</button>
    </Tooltip>

    <Tooltip text="Apply infrastructure changes">
      <button onClick={() => runAction("apply")}>Apply</button>
    </Tooltip>

    <Tooltip text="Destroy all resources">
      <button className="danger" onClick={() => runAction("destroy")}>
        Destroy
      </button>
    </Tooltip>

    {loading && <span className="spinner">⏳</span>}
    <span className={`status ${status.toLowerCase()}`}>
      Status: {status}
    </span>
  </div>

  {/* Main Layout */}
  <div className="content">
    {/* Logs */}
    <section className="logs">
      <div className="logs-header">
        <h3>Execution Output</h3>
        <button
          onClick={() =>
            navigator.clipboard.writeText("Terraform execution logs")
          }
        >
          Copy Logs
        </button>
      </div>
      <pre>


Initializing Terraform backend...
Provider plugins initialized successfully.
Terraform ready. </pre> </section>


    {/* Run History */}
    <section className="history">
      <h3>Run History</h3>
      {runs.length === 0 && <p className="muted">No runs yet</p>}

      {runs.map((r, i) => (
        <div className="run-item" key={i}>
          <div>
            <strong>{r.type}</strong>
            <div className="meta">{r.time}</div>
            <div className="meta">ws: {r.ws}</div>
          </div>
          <span className="badge success">success</span>
        </div>
      ))}
    </section>
  </div>
</div>


);
}

