content = '''import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Grid3X3, RotateCcw, Trophy } from "lucide-react";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";

type GameTab = "tictactoe" | "sudoku";
type CellValue = "X" | "O" | null;

function calculateWinner(board: CellValue[]): CellValue {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function getWinningLine(board: CellValue[]): number[] | null {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = isXNext ? "X" : "O";
    setBoard(next);
    setIsXNext(!isXNext);
    const w = calculateWinner(next);
    if (w) setScores((s) => ({ ...s, [w]: s[w as keyof typeof s] + 1 }));
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <div className={`text-center px-4 py-2 rounded-lg ${isXNext && !winner ? "bg-primary/15 ring-1 ring-primary/30" : "bg-white/5"}`}>
          <p className="text-lg font-extrabold gradient-text">X</p>
          <p className="text-xs text-muted-foreground">{scores.X} wins</p>
        </div>
        <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">VS</div>
        <div className={`text-center px-4 py-2 rounded-lg ${!isXNext && !winner ? "bg-accent/15 ring-1 ring-accent/30" : "bg-white/5"}`}>
          <p className="text-lg font-extrabold text-accent">O</p>
          <p className="text-xs text-muted-foreground">{scores.O} wins</p>
        </div>
      </div>
      <div className="text-sm font-semibold text-foreground">
        {winner ? (
          <span className="gradient-text">Player {winner} wins!</span>
        ) : isDraw ? (
          <span className="text-muted-foreground">It\'s a draw!</span>
        ) : (
          <span>Player <span className={isXNext ? "text-primary" : "text-accent"}>{isXNext ? "X" : "O"}</span>\'s turn</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const winLine = winner ? getWinningLine(board) : null;
          const isWinCell = winLine?.includes(i);
          return (
            <motion.button
              key={i}
              whileHover={!cell && !winner ? { scale: 1.05 } : {}}
              whileTap={!cell && !winner ? { scale: 0.9 } : {}}
              onClick={() => handleClick(i)}
              className={`w-20 h-20 rounded-xl text-2xl font-extrabold flex items-center justify-center transition-all ${isWinCell ? "bg-primary/20 ring-2 ring-primary glow-primary" : "glass-panel hover:bg-white/10"} ${cell === "X" ? "text-primary" : cell === "O" ? "text-accent" : "text-transparent"}`}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        New Game
      </motion.button>
    </div>
  );
}

const easySudoku = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

const sudokuSolution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

function Sudoku() {
  const [grid, setGrid] = useState<number[][]>(easySudoku.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [shakeCell, setShakeCell] = useState<string | null>(null);

  const isOriginal = (r: number, c: number) => easySudoku[r][c] !== 0;

  const handleCellClick = (r: number, c: number) => {
    if (isOriginal(r, c)) return;
    setSelected([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (isOriginal(r, c)) return;
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
    if (num !== 0 && num !== sudokuSolution[r][c]) {
      const key = `${r}-${c}`;
      setErrors((prev) => new Set([...prev, key]));
      setShakeCell(key);
      setTimeout(() => setShakeCell(null), 500);
    } else {
      setErrors((prev) => {
        const next = new Set(prev);
        next.delete(`${r}-${c}`);
        return next;
      });
    }
  };

  const reset = () => {
    setGrid(easySudoku.map((r) => [...r]));
    setSelected(null);
    setErrors(new Set());
  };

  const isSolved = grid.every((row, r) => row.every((cell, c) => cell === sudokuSolution[r][c]));

  return (
    <div className="flex flex-col items-center gap-5">
      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 text-green-400 text-sm font-bold"
        >
          <Trophy className="h-4 w-4" /> Puzzle Solved!
        </motion.div>
      )}
      <div className="grid grid-cols-9 gap-0 rounded-xl overflow-hidden border border-white/10">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isSameRow = selected?.[0] === r;
            const isSameCol = selected?.[1] === c;
            const isHighlighted = isSameRow || isSameCol;
            const isError = errors.has(`${r}-${c}`);
            const isShaking = shakeCell === `${r}-${c}`;
            const borderR = (c + 1) % 3 === 0 && c < 8 ? "border-r border-white/20" : "border-r border-white/5";
            const borderB = (r + 1) % 3 === 0 && r < 8 ? "border-b border-white/20" : "border-b border-white/5";
            return (
              <motion.button
                key={`${r}-${c}`}
                animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleCellClick(r, c)}
                className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-sm font-bold transition-all ${borderR} ${borderB} ${isSelected ? "bg-primary/20 ring-1 ring-primary/50" : isHighlighted ? "bg-white/[0.03]" : "bg-transparent"} ${isOriginal(r, c) ? "text-foreground" : isError ? "text-destructive" : "text-accent"} ${!isOriginal(r, c) ? "cursor-pointer hover:bg-white/5" : "cursor-default"}`}
              >
                {cell !== 0 ? cell : ""}
              </motion.button>
            );
          })
        )}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumberInput(num)}
            className="w-9 h-9 rounded-lg bg-white/5 text-sm font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-all"
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNumberInput(0)}
          className="w-9 h-9 rounded-lg bg-white/5 text-xs font-bold text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
        >
          CLR
        </motion.button>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Puzzle
      </motion.button>
    </div>
  );
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameTab>("tictactoe");
  const games = [
    { id: "tictactoe" as GameTab, icon: Grid3X3, label: "Tic-Tac-Toe", desc: "Classic 2-player" },
    { id: "sudoku" as GameTab, icon: Gamepad2, label: "Sudoku", desc: "Logic puzzle" },
  ];

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 glass-panel-strong rounded-none border-x-0 border-t-0 px-4 md:px-6 py-4">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">Games</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Play while you practice English</p>
          </div>
        </header>
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="flex gap-3 mb-8">
            {games.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveGame(game.id)}
                className={`glass-panel p-4 flex items-center gap-3 transition-all flex-1 ${activeGame === game.id ? "border-primary/40 glow-primary" : "hover:border-white/20"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeGame === game.id ? "bg-gradient-to-br from-primary to-accent" : "bg-white/5"}`}>
                  <game.icon className={`h-5 w-5 ${activeGame === game.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{game.label}</p>
                  <p className="text-[10px] text-muted-foreground">{game.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center">
            {activeGame === "tictactoe" ? <TicTacToe /> : <Sudoku />}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
'''

with open("src/pages/GamesPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("✓ GamesPage.tsx fixed!")
