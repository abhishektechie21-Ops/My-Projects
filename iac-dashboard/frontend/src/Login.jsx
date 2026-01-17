import React, { useState } from "react";

export default function Login({ onLogin }) {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e) => {
e.preventDefault();


// Demo-only auth
if (username && password) {
  onLogin();
}


};

return ( <div className="login-page"> <div className="login-card"> <h2>SLK InfraOps</h2> <p className="muted">Terraform Control Plane</p>


    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>

    <p className="hint">Demo environment with simplified authentication</p>
  </div>
</div>


);
}

