import { useState } from "react";
import { mockUsers } from "../../data/mockData";

function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError("Invalid email or password.");
  };

  const handleRegister = () => {
    if (!name || !email || !password) { setError("All fields required."); return; }
    const exists = mockUsers.find(u => u.email === email);
    if (exists) { setError("Email already registered."); return; }
    const nu = { id: mockUsers.length + 1, name, email, password, role: "User", avatar: name.split(" ").map(n=>n[0]).join("").toUpperCase() };
    mockUsers.push(nu);
    onLogin(nu);
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" style={{ top: "10%", left: "20%" }} />
      <div className="login-glow" style={{ bottom: "10%", right: "20%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
      <div className="login-card">
        <div className="login-title">
          {tab === "login" ? "Welcome back" : "Get started"}
        </div>
        <div className="login-sub">
          {tab === "login" ? "Sign in to your workspace" : "Create your unified workspace"}
        </div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <div className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</div>
          <div className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); }}>Register</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        {tab === "register" && (
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
        )}
        <div className="form-field">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
        </div>
        <div className="form-field" style={{ marginBottom: 22 }}>
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
        </div>

        <button className="btn-primary w-full" style={{ width: "100%", padding: "12px" }}
          onClick={tab === "login" ? handleLogin : handleRegister}>
          {tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
          Demo: alex@demo.com / demo123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
