import { useState, useRef, useMemo, useCallback } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckCircle, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router';

// =====================================================================
// CROSSWORD LAYOUT  (11 rows × 10 cols, 0-indexed)
//
//      0  1  2  3  4  5  6  7  8  9
//  0:  .  .  .  .  . [1] .  .  .  .          ← DENTIN (↓ #1) starts
//  1:  .  . [3] .  . [2] M  A  I  L          ← EMAIL (→ #2), PLAK (↓ #3)
//  2:  .  .  L  .  .  N  .  .  .  .
//  3: [4] .  A  .  .  T  .  .  .  .          ← GUSI (↓ #4)
//  4:  U  . [5/7]A  R  I  E  S  .  .         ← KARIES (→ #5) + KALSIUM (↓ #7)
//  5: [6] C  A  L  I  N  G  .  .  .          ← SCALING (→ #6)
//  6:  I  .  L  .  .  .  .  .  .  .
//  7:  .  . [8] I  K  A  T  .  .  .          ← SIKAT (→ #8)
//  8:  .  .  I  .  .  .  .  .  .  .
//  9:  .  .  U  .  .  .  .  .  .  .
// 10:  .  .  M  .  .  .  .  .  .  .
//
// Intersections verified:
//  (1,5)=E : DENTIN[1]  ∩ EMAIL[0]
//  (4,2)=K : PLAK[3]    ∩ KARIES[0] ∩ KALSIUM[0]
//  (5,0)=S : GUSI[2]    ∩ SCALING[0]
//  (4,5)=I : KARIES[3]  ∩ DENTIN[4]
//  (5,5)=N : SCALING[5] ∩ DENTIN[5]
//  (5,2)=A : SCALING[2] ∩ KALSIUM[1]
//  (7,2)=S : KALSIUM[3] ∩ SIKAT[0]
// =====================================================================

const GRID_ROWS = 11;
const GRID_COLS = 10;

interface WordDef {
  id: number;
  word: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  clue: string;
  clueNumber: number;
}

const WORDS: WordDef[] = [
  { id: 1, word: 'DENTIN', direction: 'down', startRow: 0, startCol: 5, clueNumber: 1,
    clue: 'Lapisan gigi di bawah email yang mengandung tubulus kecil terhubung ke saraf (6 huruf)' },
  { id: 2, word: 'EMAIL', direction: 'across', startRow: 1, startCol: 5, clueNumber: 2,
    clue: 'Lapisan terluar dan terkeras yang melindungi mahkota gigi (5 huruf)' },
  { id: 3, word: 'PLAK', direction: 'down', startRow: 1, startCol: 2, clueNumber: 3,
    clue: 'Lapisan lengket tak berwarna dari bakteri yang menempel di permukaan gigi (4 huruf)' },
  { id: 4, word: 'GUSI', direction: 'down', startRow: 3, startCol: 0, clueNumber: 4,
    clue: 'Jaringan lunak merah muda yang mengelilingi dan menopang akar gigi (4 huruf)' },
  { id: 5, word: 'KARIES', direction: 'across', startRow: 4, startCol: 2, clueNumber: 5,
    clue: 'Kerusakan struktur gigi akibat asam dari bakteri, dikenal sebagai gigi berlubang (6 huruf)' },
  { id: 6, word: 'SCALING', direction: 'across', startRow: 5, startCol: 0, clueNumber: 6,
    clue: 'Prosedur medis pembersihan karang gigi oleh dokter gigi profesional (7 huruf)' },
  { id: 7, word: 'KALSIUM', direction: 'down', startRow: 4, startCol: 2, clueNumber: 7,
    clue: 'Mineral utama yang membentuk dan menguatkan email serta tulang rahang (7 huruf)' },
  { id: 8, word: 'SIKAT', direction: 'across', startRow: 7, startCol: 2, clueNumber: 8,
    clue: 'Alat kebersihan yang digunakan setiap hari untuk membersihkan permukaan gigi (5 huruf)' },
];

interface CellData {
  letter: string;
  clueNumbers: number[];
  wordIds: number[];
}

const ANSWER_GRID: (CellData | null)[][] = (() => {
  const grid: (CellData | null)[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  WORDS.forEach(w => {
    for (let i = 0; i < w.word.length; i++) {
      const row = w.direction === 'down' ? w.startRow + i : w.startRow;
      const col = w.direction === 'across' ? w.startCol + i : w.startCol;
      if (!grid[row][col]) grid[row][col] = { letter: w.word[i], clueNumbers: [], wordIds: [] };
      const cell = grid[row][col]!;
      if (!cell.wordIds.includes(w.id)) cell.wordIds.push(w.id);
      if (i === 0 && !cell.clueNumbers.includes(w.clueNumber)) cell.clueNumbers.push(w.clueNumber);
    }
  });
  return grid;
})();

const getCellsForWord = (w: WordDef): string[] =>
  Array.from({ length: w.word.length }, (_, i) => {
    const row = w.direction === 'down' ? w.startRow + i : w.startRow;
    const col = w.direction === 'across' ? w.startCol + i : w.startCol;
    return `${row},${col}`;
  });

export default function GameTTS() {
  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [completed, setCompleted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeWord = useMemo(() => {
    if (!selected) return null;
    const { row, col } = selected;
    const containing = WORDS.filter(w => getCellsForWord(w).includes(`${row},${col}`));
    return containing.find(w => w.direction === direction) || containing[0] || null;
  }, [selected, direction]);

  const activeWordCells = useMemo(() =>
    new Set(activeWord ? getCellsForWord(activeWord) : []), [activeWord]);

  const checkComplete = useCallback((inp: Record<string, string>) => {
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++)
        if (ANSWER_GRID[r][c] && (inp[`${r},${c}`] || '') !== ANSWER_GRID[r][c]!.letter) return false;
    return true;
  }, []);

  const moveInWord = (w: WordDef, row: number, col: number, delta: number) => {
    const cells = getCellsForWord(w);
    const idx = cells.indexOf(`${row},${col}`);
    if (idx === -1) return null;
    const next = idx + delta;
    if (next < 0 || next >= cells.length) return null;
    const [r, c] = cells[next].split(',').map(Number);
    return { row: r, col: c };
  };

  const handleCellClick = (row: number, col: number) => {
    if (!ANSWER_GRID[row][col]) return;
    if (selected?.row === row && selected?.col === col)
      setDirection(d => d === 'across' ? 'down' : 'across');
    else setSelected({ row, col });
    gridRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selected) return;
    const { row, col } = selected;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const key = `${row},${col}`;
      if (userInput[key]) {
        setUserInput(p => ({ ...p, [key]: '' }));
      } else if (activeWord) {
        const prev = moveInWord(activeWord, row, col, -1);
        if (prev) { setSelected(prev); setUserInput(p => ({ ...p, [`${prev.row},${prev.col}`]: '' })); }
      }
      return;
    }
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      const newInput = { ...userInput, [`${row},${col}`]: letter };
      setUserInput(newInput);
      if (checkComplete(newInput)) { setCompleted(true); return; }
      if (activeWord) { const next = moveInWord(activeWord, row, col, 1); if (next) setSelected(next); }
      return;
    }
    const arrowMap: Record<string, { dr: number; dc: number; dir: 'across' | 'down' }> = {
      ArrowRight: { dr: 0, dc: 1, dir: 'across' },
      ArrowLeft: { dr: 0, dc: -1, dir: 'across' },
      ArrowDown: { dr: 1, dc: 0, dir: 'down' },
      ArrowUp: { dr: -1, dc: 0, dir: 'down' },
    };
    if (arrowMap[e.key]) {
      e.preventDefault();
      const { dr, dc, dir } = arrowMap[e.key];
      const nr = row + dr; const nc = col + dc;
      if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && ANSWER_GRID[nr][nc]) {
        setSelected({ row: nr, col: nc }); setDirection(dir);
      }
    }
  };

  const reset = () => { setUserInput({}); setSelected(null); setCompleted(false); setShowAll(false); };

  const revealAll = () => {
    const all: Record<string, string> = {};
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++)
        if (ANSWER_GRID[r][c]) all[`${r},${c}`] = ANSWER_GRID[r][c]!.letter;
    setUserInput(all); setShowAll(true);
  };

  const acrossWords = WORDS.filter(w => w.direction === 'across').sort((a, b) => a.clueNumber - b.clueNumber);
  const downWords = WORDS.filter(w => w.direction === 'down').sort((a, b) => a.clueNumber - b.clueNumber);

  const cellSize = 38;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 pt-24 pb-12 px-4 text-center">
        <div className="text-5xl mb-3">📝</div>
        <h1 className="text-white mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>TTS Kesehatan Gigi & Mulut</h1>
        <p className="text-amber-100">Teka-Teki Silang istilah kesehatan gigi — klik kotak lalu ketik jawabanmu!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link to="/games" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium">
            <ArrowLeft size={15} /> Kembali ke Games
          </Link>
          <div className="flex gap-2">
            <button onClick={revealAll} className="flex items-center gap-1.5 text-xs text-amber-700 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-full transition-colors">
              <Eye size={13} /> Tampilkan Semua
            </button>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-2 rounded-full transition-colors">
              <RefreshCw size={13} /> Reset
            </button>
          </div>
        </div>

        {completed && (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6 text-center">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
            <h3 className="text-green-800 mb-1" style={{ fontWeight: 700, fontSize: '1.1rem' }}>🎉 Selamat! Semua Benar!</h3>
            <p className="text-green-700 text-sm">Kamu berhasil melengkapi TTS Kesehatan Gigi & Mulut dengan sempurna!</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Grid */}
          <div>
            <div
              ref={gridRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="outline-none focus:ring-2 focus:ring-amber-400 rounded-xl inline-block"
            >
              <div
                className="inline-grid border-2 border-gray-700 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, ${cellSize}px)`,
                  gap: 0,
                }}
              >
                {Array.from({ length: GRID_ROWS }, (_, row) =>
                  Array.from({ length: GRID_COLS }, (_, col) => {
                    const cell = ANSWER_GRID[row][col];
                    const key = `${row},${col}`;
                    const isSelected = selected?.row === row && selected?.col === col;
                    const isActive = activeWordCells.has(key);
                    const userLetter = userInput[key] || '';
                    const isCorrect = userLetter !== '' && userLetter === cell?.letter;
                    const isWrong = userLetter !== '' && userLetter !== cell?.letter;

                    if (!cell) {
                      return (
                        <div
                          key={key}
                          className="border border-gray-600 bg-gray-800"
                          style={{ width: cellSize, height: cellSize }}
                        />
                      );
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => handleCellClick(row, col)}
                        className={`border border-gray-300 relative cursor-pointer flex items-center justify-center select-none transition-colors ${
                          isSelected
                            ? 'bg-amber-400'
                            : isActive
                            ? 'bg-amber-100'
                            : 'bg-white hover:bg-amber-50'
                        }`}
                        style={{ width: cellSize, height: cellSize }}
                      >
                        {cell.clueNumbers.length > 0 && (
                          <span
                            className="absolute top-0 left-0.5 text-gray-600 font-bold leading-none"
                            style={{ fontSize: '8px' }}
                          >
                            {cell.clueNumbers.join('/')}
                          </span>
                        )}
                        <span
                          className={`font-black select-none ${
                            showAll ? 'text-blue-600' :
                            isCorrect ? 'text-green-600' :
                            isWrong ? 'text-red-500' :
                            'text-gray-800'
                          }`}
                          style={{ fontSize: '15px', marginTop: cell.clueNumbers.length > 0 ? '4px' : '0' }}
                        >
                          {userLetter}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active word clue */}
            {activeWord && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeWord.clueNumber}
                  </span>
                  <span className="text-amber-700 text-xs font-medium uppercase tracking-wide">
                    {activeWord.direction === 'across' ? '→ Mendatar' : '↓ Menurun'}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{activeWord.clue}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 bg-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-600 mb-1">Cara Bermain:</p>
              <p>🖱️ <strong>Klik kotak</strong> untuk memilih · klik lagi untuk ganti arah (→/↓)</p>
              <p>⌨️ <strong>Ketik huruf</strong> untuk mengisi · bergerak otomatis ke kotak berikutnya</p>
              <p>🔙 <strong>Backspace</strong> untuk menghapus · ↑↓←→ untuk navigasi manual</p>
              <p>📋 <strong>Klik petunjuk</strong> di kanan untuk langsung ke soal tersebut</p>
            </div>
          </div>

          {/* Right: Clue panel */}
          <div className="space-y-5">
            {/* Across clues */}
            <div>
              <h3 className="text-gray-800 mb-2 flex items-center gap-2" style={{ fontWeight: 700 }}>
                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">→ Mendatar</span>
              </h3>
              <div className="space-y-1.5">
                {acrossWords.map(w => {
                  const cells = getCellsForWord(w);
                  const filled = cells.filter(k => userInput[k]).length;
                  const correct = cells.every(k => userInput[k] && userInput[k] === ANSWER_GRID[parseInt(k.split(',')[0])][parseInt(k.split(',')[1])]?.letter);
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        setSelected({ row: w.startRow, col: w.startCol });
                        setDirection('across');
                        gridRef.current?.focus();
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${
                        activeWord?.id === w.id
                          ? 'bg-amber-100 border border-amber-400 text-amber-900'
                          : correct ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-white border border-gray-100 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">{w.clueNumber}</span>
                      <div className="flex-1 min-w-0">
                        <p className="leading-relaxed">{w.clue}</p>
                        <div className="flex gap-0.5 mt-1.5">
                          {Array.from({ length: w.word.length }, (_, i) => {
                            const k = cells[i];
                            const letter = userInput[k] || '';
                            const cellData = ANSWER_GRID[parseInt(k.split(',')[0])][parseInt(k.split(',')[1])];
                            const ok = letter && letter === cellData?.letter;
                            return (
                              <div key={i} className={`h-1 flex-1 rounded-full ${ok ? 'bg-green-400' : letter ? 'bg-red-300' : 'bg-gray-200'}`} />
                            );
                          })}
                        </div>
                      </div>
                      {correct && <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Down clues */}
            <div>
              <h3 className="text-gray-800 mb-2 flex items-center gap-2" style={{ fontWeight: 700 }}>
                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">↓ Menurun</span>
              </h3>
              <div className="space-y-1.5">
                {downWords.map(w => {
                  const cells = getCellsForWord(w);
                  const correct = cells.every(k => {
                    const [r, c] = k.split(',').map(Number);
                    return userInput[k] && userInput[k] === ANSWER_GRID[r][c]?.letter;
                  });
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        setSelected({ row: w.startRow, col: w.startCol });
                        setDirection('down');
                        gridRef.current?.focus();
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${
                        activeWord?.id === w.id
                          ? 'bg-amber-100 border border-amber-400 text-amber-900'
                          : correct ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-white border border-gray-100 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">{w.clueNumber}</span>
                      <div className="flex-1 min-w-0">
                        <p className="leading-relaxed">{w.clue}</p>
                        <div className="flex gap-0.5 mt-1.5">
                          {Array.from({ length: w.word.length }, (_, i) => {
                            const k = cells[i];
                            const [r, c] = k.split(',').map(Number);
                            const letter = userInput[k] || '';
                            const ok = letter && letter === ANSWER_GRID[r][c]?.letter;
                            return <div key={i} className={`h-1 flex-1 rounded-full ${ok ? 'bg-green-400' : letter ? 'bg-red-300' : 'bg-gray-200'}`} />;
                          })}
                        </div>
                      </div>
                      {correct && <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded" /> Sel terpilih</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-100 rounded border border-amber-300" /> Kata aktif</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-100 rounded border border-green-300" /> Benar</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-50 rounded border border-red-300" /> Salah</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-800 rounded" /> Hitam</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
