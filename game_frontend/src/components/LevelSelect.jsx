import React from "react";

const LEVELS = [
  { id: 1, name: "Sweet Start", target: 600 },
  { id: 2, name: "Jewel Jive", target: 900 },
  { id: 3, name: "Rainbow Rally", target: 1300 },
  { id: 4, name: "Combo Craze", target: 1700 },
  { id: 5, name: "Final Frenzy", target: 2100 }
];

export default function LevelSelect({ onSelectLevel, onLeaderboard }) {
  // PUBLIC_INTERFACE
  /**
   * Level selection menu
   */
  return (
    <div className="dialog-popin" style={{
      maxWidth: 410, margin: "2.5rem auto", background: "var(--surface)",
      borderRadius: "1.65rem", boxShadow: "0 2px 14px #4a90e220", padding: "2.8rem 2.5rem"
    }}>
      <h2 style={{color:"var(--primary)", marginBottom:"1.3rem"}}>Select a Level</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level)}
            style={{
              padding: "1.3em 1.1em", fontSize: "1.1em", letterSpacing: 0.05,
              border: "0", borderRadius: "0.9em", margin: 0,
              background: "var(--primary)",
              color: "#fff", fontWeight: 600, marginBottom: 3,
              cursor: "pointer", outline: "none",
              boxShadow: "0 1px 8px #e6ebfb42"
            }}
          >
            {level.name} &mdash; Target: {level.target}
          </button>
        ))}
        <button
          onClick={onLeaderboard}
          style={{
            marginTop: 16, fontWeight: 700, color: "#fff", background: "var(--secondary)",
            border: "none", borderRadius: "0.8em", fontSize: "1em", padding: "0.8em"
          }}
        >
          View Leaderboards
        </button>
      </div>
      <div style={{marginTop:"2.7rem", color: "var(--primary-dark)", fontStyle:"italic", fontSize:"0.97em"}}>
        Complete all levels to become a MatchMaster!
      </div>
    </div>
  );
}
