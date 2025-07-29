import React from "react";

export default function Footer() {
  // PUBLIC_INTERFACE
  /**
   * Application footer navigation/info
   */
  return (
    <footer className="footer">
      <span>
        Made with <span style={{ color: "var(--accent)", fontWeight: 700 }}>❤️</span> by MatchMaster Team |{" "}
        <a href="https://github.com" style={{ color: "var(--secondary)" }} target="_blank" rel="noreferrer">
          Source
        </a>
      </span>
    </footer>
  );
}
