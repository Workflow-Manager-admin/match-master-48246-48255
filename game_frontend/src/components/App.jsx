import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import LevelSelect from "./LevelSelect";
import GameBoard from "./GameBoard";
import Leaderboard from "./Leaderboard";
import Auth from "./Auth";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../styles/layout.css";

function MainAppLayout() {
  const { user } = useAuth();
  const [page, setPage] = useState(user ? "level" : "auth");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Page navigation logic
  React.useEffect(() => {
    if (!user) setPage("auth");
    else if (page === "auth") setPage("level");
  }, [user]);

  let mainContent = null;
  switch (page) {
    case "auth":
      mainContent = <Auth onAuth={() => setPage("level")} />;
      break;
    case "level":
      mainContent = (
        <LevelSelect
          onSelectLevel={(level) => {
            setSelectedLevel(level);
            setPage("game");
          }}
          onLeaderboard={() => setPage("leaderboard")}
        />
      );
      break;
    case "game":
      mainContent = (
        <GameBoard
          level={selectedLevel}
          onBackToLevels={() => setPage("level")}
          onGameOver={(result) => {
            setGameResult(result);
            setPage("leaderboard");
          }}
        />
      );
      break;
    case "leaderboard":
      mainContent = (
        <Leaderboard
          gameResult={gameResult}
          onBack={() => setPage(user ? "level" : "auth")}
        />
      );
      break;
    default:
      mainContent = null;
  }

  return (
    <div className="app-root">
      <Header
        onLogo={() => setPage(user ? "level" : "auth")}
        onLeaderboard={() => setPage("leaderboard")}
      />
      <div className="app-main-area">
        <Sidebar page={page} />
        <main className="app-content">{mainContent}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  // PUBLIC_INTERFACE
  /**
   * Main application entry with Auth context provider
   * Handles routing and top-level app context
   */
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}
