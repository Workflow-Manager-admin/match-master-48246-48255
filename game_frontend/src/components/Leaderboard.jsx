import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Leaderboard({ gameResult, onBack }) {
  // PUBLIC_INTERFACE
  /**
   * Leaderboard component: Shows top scores, highlights user
   */
  const { user } = useAuth();
  const [scores, setScores] = useState([
    { name: "GemWizard", score: 1200, level: "Sweet Start" },
    { name: "JewelDuke", score: 900, level: "Jewel Jive" },
    { name: "RubyRider", score: 800, level: "Rainbow Rally" }
  ]);

  useEffect(() => {
    // In a real app, fetch leaderboard from backend here (optionally save result)
    if (gameResult && gameResult.score) {
      setScores(prev =>
        [{ name: user?.name ?? "You", score: gameResult.score, level: gameResult.level ? gameResult.level.name : "--" }, ...prev]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      );
    }
  }, [gameResult, user]);

  return (
    <div className="dialog-popin" style={{
      maxWidth: 420, margin: "3rem auto", background: "var(--surface)",
      borderRadius:"1.17rem",boxShadow:"0 2px 13px #4a90e233", padding:"2.7rem 2.1rem"
    }}>
      <h2 style={{color:"var(--primary)",marginBottom:"1.5rem"}}>Leaderboard 🏆</h2>
      <table style={{
        width:"100%",borderCollapse:"separate",borderSpacing:"0 0.29em",fontSize:"1.06em"
      }}>
        <thead>
          <tr>
            <th align="left">Player</th>
            <th>Score</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, idx) => (
            <tr key={idx} style={{
              color: s.name === (user?.name ?? "You") ? "var(--accent)" : undefined,
              background: idx === 0 ? "rgba(254,220,125,0.28)" : idx < 3 ? "#e8f0ff6b" : "transparent",
              fontWeight: idx === 0 ? 700 : 500
            }}>
              <td>{s.name}</td>
              <td align="center">{s.score}</td>
              <td align="center">{s.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onBack}
        style={{
          marginTop: 34, width: "100%", background: "var(--secondary)",
          color: "#fff", border: "none", borderRadius: "0.88em", padding: "1em 0", fontWeight: 700, fontSize: "1.1em"
        }}>
        Back
      </button>
      {gameResult && (
        <div style={{marginTop:14,color:gameResult.success?"var(--success)":"var(--danger)",fontWeight:700}}>
          {gameResult.success ? "Level Complete!" : "Try Again!"}
        </div>
      )}
    </div>
  );
}
