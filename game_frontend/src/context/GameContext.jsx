import React, { createContext, useContext, useState, useMemo } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // PUBLIC_INTERFACE
  /**
   * Provides game status (score, moves, target) for components (sidebar, etc.)
   */
  const [gameState, setGameState] = useState({
    movesLeft: 0,
    score: 0,
    target: 0,
    progress: 0
  });
  const value = useMemo(() => ({
    ...gameState, setGameState
  }), [gameState]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  // PUBLIC_INTERFACE
  /**
   * Access game status in child components
   */
  return useContext(GameContext);
}
