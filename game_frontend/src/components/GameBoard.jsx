import React, { useState, useRef, useEffect } from "react";
import useSound from "../hooks/useSound";
import { useGame, GameProvider } from "../context/GameContext";

const GEM_EMOJIS = ["🍒", "💎", "🍋", "🍏", "🔮"];
const BOARD_SIZE = 8;
const MOVES_PER_LEVEL = 25;

function getInitialBoard() {
  // Fill an 8x8 with random gem indices (0..4)
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => Math.floor(Math.random() * GEM_EMOJIS.length))
  );
}

// Checks if swapping (r1,c1) with (r2,c2) is valid (adjacent and will match)
function isValidSwap(board, r1, c1, r2, c2) {
  if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return false;
  const testBoard = board.map(row => row.slice());
  const tmp = testBoard[r1][c1];
  testBoard[r1][c1] = testBoard[r2][c2];
  testBoard[r2][c2] = tmp;
  // Match found?
  return !!findMatches(testBoard).length;
}

// Find all matches of 3+ in a row or column, returns array of positions
function findMatches(board) {
  const matches = [];
  // Horizontal
  for (let r = 0; r < BOARD_SIZE; r++) {
    let count = 1;
    for (let c = 1; c < BOARD_SIZE; c++) {
      if (board[r][c] === board[r][c - 1]) count++;
      else { if (count >= 3) matches.push(...Array.from({length:count},(_,i)=>[r,c-1-i])); count=1; }
    }
    if (count >= 3) matches.push(...Array.from({length:count},(_,i)=>[r,BOARD_SIZE-1-i]));
  }
  // Vertical
  for (let c = 0; c < BOARD_SIZE; c++) {
    let count = 1;
    for (let r = 1; r < BOARD_SIZE; r++) {
      if (board[r][c] === board[r-1][c]) count++;
      else { if (count >= 3) matches.push(...Array.from({length:count},(_,i)=>[r-1-i,c])); count=1;}
    }
    if (count >= 3) matches.push(...Array.from({length:count},(_,i)=>[BOARD_SIZE-1-i,c]));
  }
  // Remove dups
  const key = ([r,c]) => r+"-"+c;
  return Array.from(new Set(matches.map(key))).map(k => k.split("-").map(Number));
}

// Drop empty cells (nulls), refill top, returns mutated board
function collapseBoard(board) {
  const newBoard = board.map(row => row.slice());
  for (let c = 0; c < BOARD_SIZE; c++) {
    let empty = [];
    for (let r = BOARD_SIZE-1; r >= 0; r--) {
      if (newBoard[r][c] === null) empty.push(r);
      else if (empty.length) {
        const swapR = empty.shift();
        newBoard[swapR][c] = newBoard[r][c];
        newBoard[r][c] = null;
        empty.push(r);
      }
    }
    // Fill new from top
    for (let idx = 0; idx < BOARD_SIZE; idx++) {
      if (newBoard[idx][c] === null)
        newBoard[idx][c] = Math.floor(Math.random() * GEM_EMOJIS.length);
    }
  }
  return newBoard;
}

function GameBoardInternal({ level, onBackToLevels, onGameOver }) {
  // PUBLIC_INTERFACE
  /**
   * The core match-three gameboard with gameplay, animations, sounds.
   */
  const [board, setBoard] = useState(getInitialBoard());
  const [selected, setSelected] = useState(null);
  const [clearing, setClearing] = useState([]); // positions being cleared
  const [animating, setAnimating] = useState(false);
  const [movesLeft, setMovesLeft] = useState(MOVES_PER_LEVEL);
  const [score, setScore] = useState(0);
  const [comboSplash, setComboSplash] = useState(null);

  const matchSound = useSound("match");
  const swapSound = useSound("swap");
  const endSound = useSound("end");

  // Provide game context to sidebar (moves, score, progress, target)
  const { setGameState } = useGame();

  useEffect(() => {
    setGameState({
      movesLeft,
      score,
      target: level.target,
      progress: Math.min(100, Math.floor((score / level.target) * 100))
    });
  }, [movesLeft, score, level, setGameState]);

  // Auto-match/clear at the start so board always playable
  useEffect(() => {
    let changed = true;
    let b = board.map(row => row.slice());
    while (changed) {
      changed = false;
      let matches = findMatches(b);
      if (matches.length) {
        for (const [r, c] of matches) b[r][c] = Math.floor(Math.random() * GEM_EMOJIS.length);
        changed = true;
      }
    }
    setBoard(b);
    // eslint-disable-next-line
  }, []);

  // Swap handler
  function handleGemClick(r, c) {
    if (animating) return;
    if (!selected) { setSelected([r, c]); return; }
    if (selected[0] === r && selected[1] === c) { setSelected(null); return; }
    if (isValidSwap(board, selected[0], selected[1], r, c)) {
      swapSound();
      doSwap(selected, [r, c]);
      setSelected(null);
    } else {
      setSelected([r, c]);
    }
  }

  function doSwap(pos1, pos2) {
    setAnimating(true);
    setTimeout(() => {
      let newBoard = board.map(row => row.slice());
      let [r1, c1] = pos1, [r2, c2] = pos2;
      [newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]];
      setBoard(newBoard);
      processMatches(newBoard);
      setMovesLeft(movesLeft - 1);
      setAnimating(false);
    }, 120);
  }

  // Process matching/clearing logic, chaining as needed for combos
  function processMatches(curBoard, combo=1) {
    const matches = findMatches(curBoard);
    if (matches.length) {
      setTimeout(() => {
        matchSound();
        setClearing(matches);
        setComboSplash(combo > 1 ? `Combo x${combo}!` : "Nice!");
        setTimeout(() => {
          setComboSplash(null);
          const scInc = matches.length * 80 * combo;
          setScore(s => s + scInc);
          // Clear and collapse
          let newBoard = curBoard.map(row => row.slice());
          for (const [r, c] of matches) newBoard[r][c] = null;
          const collapsed = collapseBoard(newBoard);
          setBoard(collapsed);
          setClearing([]);
          processMatches(collapsed, combo+1);
        }, 330);
      }, 100);
    }
  }

  // Endgame detection
  useEffect(() => {
    if (movesLeft === 0) {
      setTimeout(() => {
        endSound();
        onGameOver({
          score,
          level: level,
          success: score >= level.target,
        });
      }, 900);
    }
    // eslint-disable-next-line
  }, [movesLeft]);

  return (
    <div className="game-board-root fade-in">
      <div style={{display:"flex",width:"100%",justifyContent:"space-between",alignItems:"center"}}>
        <button
          onClick={onBackToLevels}
          style={{
            background:"var(--secondary)", border:"none",color:"#fff",padding:"0.65em 1.2em",
            fontWeight:700, borderRadius:"1em", fontSize:"1.04em",letterSpacing:"0.01em",marginBottom:"0.8em"
          }}>
          ⬅ Levels
        </button>
        <span style={{fontWeight:700, fontSize:"1.17em",color:"var(--primary-dark)"}}>
          {level.name} ({level.target} pts)
        </span>
        <span />
      </div>
      {comboSplash && <div className="combo-splash">{comboSplash}</div>}
      <div className="match-three-board">
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={r + "-" + c}
              tabIndex={0}
              className={
                "gem-tile gem-" + val +
                (selected && selected[0] === r && selected[1] === c ? " selected" : "") +
                (clearing.some(([rc, cc]) => rc === r && cc === c) ? " cleared" : "")
              }
              onClick={() => handleGemClick(r, c)}
              aria-label={`Gem at ${r + 1},${c + 1}`}
              style={{ transition: "background .2s, transform .13s" }}
            >
              {GEM_EMOJIS[val]}
            </div>
          ))
        )}
      </div>
      <div style={{width:"100%", textAlign:"center",marginBottom:0,marginTop:-9}}>
        <span style={{color:"var(--secondary)",fontWeight:700}}>Moves left: {movesLeft} | Score: {score}</span>
      </div>
    </div>
  );
}

// Wrap GameBoard in provider for game context
export default function GameBoardWrapper({ level, ...props }) {
  return (
    <GameProvider>
      <GameBoardInternal level={level} {...props} />
    </GameProvider>
  );
}
