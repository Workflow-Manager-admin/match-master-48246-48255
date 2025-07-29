import React from "react";
import logoUrl from "../assets/logo.svg";
import trophyUrl from "../assets/trophy.svg";

export default function Header({ onLogo, onLeaderboard }) {
  // PUBLIC_INTERFACE
  /**
   * Header navigation with logo and leaderboard
   */
  return (
    <header>
      <span style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={onLogo}>
        <img src={logoUrl} width={44} height={44} alt="logo" style={{ marginRight: 16 }} />
        <span>MatchMaster</span>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          title="Leaderboard"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 10,
            transition: "background .2s"
          }}
          onClick={onLeaderboard}
        >
          <img src={trophyUrl} width={34} height={34} alt="Leaderboard" />
        </button>
      </span>
    </header>
  );
}
