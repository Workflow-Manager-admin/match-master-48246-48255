import React from "react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ page }) {
  // PUBLIC_INTERFACE
  /**
   * Sidebar for moves left, score, and player progress
   */
  const game = useGame();
  const { user } = useAuth();

  if (page !== "game" || !game) {
    return (
      <aside className="sidebar-root fade-in">
        <div className="sidebar-section">
          <span style={{ fontWeight: 700, color: "var(--primary-dark)" }}>
            {user ? `Hello, ${user.name}! 👋` : "Welcome!"}
          </span>
        </div>
        <div className="sidebar-section">
          <span style={{ fontSize: "1.13rem" }}>Select a level to begin your adventure!</span>
        </div>
      </aside>
    );
  }

  const { movesLeft, score, target, progress } = game;

  return (
    <aside className="sidebar-root fade-in">
      <div className="sidebar-section moves-remaining">
        <span>Moves: {movesLeft}</span>
      </div>
      <div className="sidebar-section current-score">
        Score: {score}
      </div>
      <div className="sidebar-section" style={{ marginBottom: "2rem" }}>
        <span style={{ color: "var(--primary-dark)", fontWeight: 600 }}>
          Target: {target}
        </span>
        <div className="progress-bar">
          <div
            className="progress-bar-inner"
            style={{ width: `${progress}%` }}
            aria-label="level-progress"
          ></div>
        </div>
      </div>
    </aside>
  );
}
