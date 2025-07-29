import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Auth({ onAuth }) {
  // PUBLIC_INTERFACE
  /**
   * Simple authentication UI form (can be extended with backend API)
   */
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    if (!name.trim() || name.length > 24) {
      setError("Name must be 1-24 characters");
      return;
    }
    login({ name });
    setError(null);
    onAuth();
  }

  return (
    <div className="fade-in" style={{
      margin: "3rem auto", background: "var(--surface)", borderRadius: "1.6rem",
      boxShadow: "0 2px 14px #4a90e218", padding: "3rem 2.2rem", maxWidth: 340
    }}>
      <h2 style={{color: "var(--primary)", marginBottom: "1em"}}>Welcome to MatchMaster!</h2>
      <form onSubmit={handleLogin}>
        <label style={{fontWeight:700, display:"block"}}>
          Enter your player name:
        </label>
        <input
          type="text"
          value={name}
          autoFocus
          minLength={1}
          maxLength={24}
          required
          tabIndex={0}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. GemWizard"
          style={{
            margin: "1em 0", width: "100%", fontSize: "1.1em", padding: "0.6em",
            borderRadius: "0.8em", border: "1.8px solid var(--primary)", background: "#eef7fc"
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%", background: "var(--primary)",
            border: "none", color: "#fff", padding: "0.8em", fontSize: "1.16em",
            fontWeight: 700, borderRadius: "0.8em", marginTop: 16, cursor: "pointer"
          }}>
          Start Playing
        </button>
        {error && <div style={{ color: "var(--accent)", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}
