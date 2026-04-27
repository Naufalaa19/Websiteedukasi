import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, RotateCcw, Dice6 } from 'lucide-react';
import { Link } from 'react-router';

// ── Board layout ──────────────────────────────────────────────
// Square 1 = bottom-left, Square 100 = top-left.
// Even rows (from bottom, 0-indexed) go left→right,
// odd rows go right→left.
const squareToPos = (sq: number) => {
  const rowFromBottom = Math.floor((sq - 1) / 10);
  const posInRow = (sq - 1) % 10;
  const col = rowFromBottom % 2 === 0 ? posInRow : 9 - posInRow;
  return { row: 9 - rowFromBottom, col };
};

const posToSquare = (row: number, col: number) => {
  const rowFromBottom = 9 - row;
  const posInRow = rowFromBottom % 2 === 0 ? col : 9 - col;
  return rowFromBottom * 10 + posInRow + 1;
};

// ── Snakes (head → tail) ──────────────────────────────────────
const SNAKES: Record<number, number> = {
  97: 27,  // Tidak sikat gigi sebulan!
  79: 19,  // Minum soda setiap hari
  56: 13,  // Tidur tanpa gosok gigi
  44: 8,   // Tidak ke dokter gigi 5 tahun
  63: 33,  // Gigi berlubang dibiarkan
};

const SNAKE_INFO: Record<number, { title: string; fact: string }> = {
  97: { title: '🐍 Tidak sikat gigi sebulan!', fact: 'Plak mengeras jadi karang gigi dalam 72 jam. Bakteri terus merusak email gigi 24 jam sehari!' },
  79: { title: '🐍 Kecanduan minuman soda!', fact: 'Asam fosfat dalam soda langsung melarutkan email gigi. Bahkan diet soda sama asamnya!' },
  56: { title: '🐍 Tidur tanpa gosok gigi!', fact: 'Bakteri paling aktif saat tidur karena air liur berkurang. Sikat gigi malam adalah yang paling penting!' },
  44: { title: '🐍 Tidak ke dokter gigi 5 tahun!', fact: 'Karies dan karang gigi bisa berkembang diam-diam. Pemeriksaan 6 bulan sekali wajib!' },
  63: { title: '🐍 Gigi berlubang dibiarkan!', fact: 'Karies yang tidak diobati merusak pulpa (saraf), menyebabkan abses, bahkan infeksi tulang rahang!' },
};

// ── Ladders (bottom → top) ────────────────────────────────────
const LADDERS: Record<number, number> = {
  4:  38,  // Sikat gigi teknik benar
  17: 53,  // Rutin ke dokter gigi
  29: 62,  // Pakai benang gigi
  48: 82,  // Makan makanan bergizi
  67: 91,  // Minum air putih cukup
};

const LADDER_INFO: Record<number, { title: string; fact: string }> = {
  4:  { title: '🪜 Sikat gigi teknik yang benar!', fact: 'Sikat 2 menit dua kali sehari dengan sudut 45° dan gerakan melingkar kecil. Ini standar WHO!' },
  17: { title: '🪜 Rutin periksa gigi tiap 6 bulan!', fact: 'Dokter gigi bisa deteksi karies white spot yang belum terasa sakit. Perawatan dini jauh lebih mudah!' },
  29: { title: '🪜 Pakai benang gigi setiap hari!', fact: 'Benang gigi membersihkan 35% area gigi yang tidak bisa dijangkau sikat. Ini rekomendasi ADA dan WHO!' },
  48: { title: '🪜 Rajin makan makanan bergizi!', fact: 'Kalsium, fosfor, vitamin D memperkuat email gigi. Keju menetralkan asam mulut dan melindungi gigi!' },
  67: { title: '🪜 Minum air putih 8 gelas sehari!', fact: 'Air membantu produksi air liur pelindung gigi. Air berfluoride memperkuat email sesuai rekomendasi Kemenkes!' },
};

// ── Questions triggered on special squares ────────────────────
const QUESTIONS: Record<number, { q: string; options: string[]; correct: number; explanation: string }> = {
  10: {
    q: 'Berapa lama waktu ideal menyikat gigi menurut WHO?',
    options: ['30 detik', '1 menit', '2 menit', '5 menit'],
    correct: 2,
    explanation: 'WHO merekomendasikan menyikat gigi minimal 2 menit, 2 kali sehari dengan pasta gigi berfluoride.',
  },
  30: {
    q: 'Bakteri utama penyebab karies gigi adalah?',
    options: ['E. coli', 'Streptococcus mutans', 'Lactobacillus', 'Staphylococcus'],
    correct: 1,
    explanation: 'Streptococcus mutans mengubah gula menjadi asam yang melarutkan email gigi dan menyebabkan karies.',
  },
  50: {
    q: 'Apa itu fluoride pada pasta gigi?',
    options: ['Pewarna gigi', 'Mineral penguat email', 'Bahan pemutih', 'Pengawet'],
    correct: 1,
    explanation: 'Fluoride memperkuat email gigi melalui remineralisasi dan melindunginya dari serangan asam bakteri.',
  },
  70: {
    q: 'Scaling gigi sebaiknya dilakukan berapa bulan sekali?',
    options: ['1 bulan', '3 bulan', '6 bulan', '1 tahun'],
    correct: 2,
    explanation: 'Scaling setiap 6 bulan adalah standar WHO dan Kemenkes untuk mencegah penumpukan karang gigi.',
  },
  90: {
    q: 'Penyakit gusi yang bila dibiarkan dapat merusak tulang rahang adalah?',
    options: ['Karies', 'Gingivitis', 'Periodontitis', 'Halitosis'],
    correct: 2,
    explanation: 'Periodontitis adalah infeksi bakteri serius yang merusak jaringan dan tulang pendukung gigi secara ireversibel.',
  },
};

type Phase = 'setup' | 'playing' | 'question' | 'message' | 'win';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const PLAYER_COLORS = ['bg-blue-500', 'bg-red-500'];
const PLAYER_EMOJI = ['🔵', '🔴'];
const PLAYER_NAMES_DEFAULT = ['Pemain 1', 'Pemain 2'];

export default function GameUlarTangga() {
  const [numPlayers, setNumPlayers] = useState<1 | 2>(2);
  const [playerNames, setPlayerNames] = useState(PLAYER_NAMES_DEFAULT);
  const [positions, setPositions] = useState([0, 0]); // 0 = before start
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [phase, setPhase] = useState<Phase>('setup');
  const [message, setMessage] = useState<{ title: string; fact: string; type: 'snake' | 'ladder' | 'win' } | null>(null);
  const [question, setQuestion] = useState<typeof QUESTIONS[number] & { sq: number } | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState<boolean | null>(null);
  const [bonusMove, setBonusMove] = useState(0);
  const [scores, setScores] = useState([0, 0]);

  const startGame = () => {
    setPositions(Array(numPlayers).fill(0));
    setCurrentPlayer(0);
    setDiceValue(null);
    setPhase('playing');
    setMessage(null);
    setQuestion(null);
    setScores(Array(numPlayers).fill(0));
  };

  const nextTurn = useCallback((positions: number[]) => {
    setCurrentPlayer(p => {
      const next = (p + 1) % numPlayers;
      return next;
    });
    setPhase('playing');
    setMessage(null);
    setQuestion(null);
    setQuestionAnswered(null);
    setBonusMove(0);
  }, [numPlayers]);

  const rollDice = () => {
    if (isRolling || phase !== 'playing') return;
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.ceil(Math.random() * 6));
      count++;
      if (count >= 8) {
        clearInterval(interval);
        const finalRoll = Math.ceil(Math.random() * 6);
        setDiceValue(finalRoll);
        setIsRolling(false);
        movePlayer(finalRoll);
      }
    }, 80);
  };

  const movePlayer = (roll: number) => {
    setPositions(prev => {
      const newPos = [...prev];
      let pos = prev[currentPlayer];
      pos = Math.min(pos + roll, 100);

      // Check snake
      if (SNAKES[pos]) {
        const info = SNAKE_INFO[pos];
        setMessage({ title: info.title, fact: info.fact, type: 'snake' });
        newPos[currentPlayer] = SNAKES[pos];
        setPhase('message');
        return newPos;
      }

      // Check ladder
      if (LADDERS[pos]) {
        const info = LADDER_INFO[pos];
        setMessage({ title: info.title, fact: info.fact, type: 'ladder' });
        newPos[currentPlayer] = LADDERS[pos];
        setPhase('message');
        return newPos;
      }

      // Check question square
      if (QUESTIONS[pos]) {
        const q = QUESTIONS[pos];
        setQuestion({ ...q, sq: pos });
        newPos[currentPlayer] = pos;
        setPhase('question');
        return newPos;
      }

      // Win
      if (pos >= 100) {
        newPos[currentPlayer] = 100;
        setMessage({ title: `🏆 ${playerNames[currentPlayer]} Menang!`, fact: `Selamat! Kamu berhasil menjaga kesehatan gigi sampai finish! Terus terapkan kebiasaan baik ini di kehidupan nyata.`, type: 'win' });
        setScores(s => { const ns = [...s]; ns[currentPlayer] += 100; return ns; });
        setPhase('win');
        return newPos;
      }

      newPos[currentPlayer] = pos;
      return newPos;
    });
  };

  const handleAnswer = (idx: number) => {
    if (!question || questionAnswered !== null) return;
    const correct = idx === question.correct;
    setQuestionAnswered(correct);
    if (correct) {
      setScores(s => { const ns = [...s]; ns[currentPlayer] += 20; return ns; });
    }
  };

  // ── Board rendering ────────────────────────────────────────
  const renderBoard = () => {
    const cells: JSX.Element[] = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const sq = posToSquare(row, col);
        const isSankeHead = SNAKES[sq] !== undefined;
        const isLadderBottom = LADDERS[sq] !== undefined;
        const isQuestionSq = QUESTIONS[sq] !== undefined;
        const playersHere = positions.map((p, i) => ({ pos: p, player: i })).filter(({ pos }) => pos === sq);

        let bg = 'bg-white';
        let border = 'border-gray-200';
        if (isSankeHead) { bg = 'bg-red-100'; border = 'border-red-400'; }
        else if (isLadderBottom) { bg = 'bg-green-100'; border = 'border-green-400'; }
        else if (isQuestionSq) { bg = 'bg-amber-50'; border = 'border-amber-300'; }
        else if (sq === 100) { bg = 'bg-yellow-100'; border = 'border-yellow-400'; }

        const isEvenRowFromBottom = (9 - row) % 2 === 0;

        cells.push(
          <div
            key={`${row}-${col}`}
            className={`${bg} border ${border} flex flex-col items-center justify-between p-0.5 relative`}
            style={{ aspectRatio: '1' }}
          >
            <span className="text-gray-400 leading-none" style={{ fontSize: '8px' }}>{sq}</span>
            <div className="flex flex-col items-center justify-center flex-1 gap-0">
              {sq === 100 && <span style={{ fontSize: '14px' }}>🏆</span>}
              {isSankeHead && <span style={{ fontSize: '12px' }}>🐍</span>}
              {isLadderBottom && <span style={{ fontSize: '12px' }}>🪜</span>}
              {isQuestionSq && !isSankeHead && !isLadderBottom && <span style={{ fontSize: '11px' }}>❓</span>}
              {playersHere.slice(0, numPlayers).map(({ player }) => (
                <span key={player} style={{ fontSize: '14px' }}>{PLAYER_EMOJI[player]}</span>
              ))}
            </div>
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 pt-24 pb-12 px-4 text-center">
        <div className="text-5xl mb-3">🎲</div>
        <h1 className="text-white mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Ular Tangga Kesehatan Gigi</h1>
        <p className="text-emerald-100">Belajar kebiasaan gigi sehat sambil bermain! Hindari ular, naiki tangga!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/games" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium mb-6">
          <ArrowLeft size={15} /> Kembali ke Games
        </Link>

        {/* SETUP SCREEN */}
        {phase === 'setup' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-gray-800 mb-6 text-center" style={{ fontWeight: 700, fontSize: '1.25rem' }}>Pengaturan Permainan</h2>

            <div className="mb-5">
              <p className="text-gray-600 text-sm mb-3 font-medium">Jumlah Pemain:</p>
              <div className="flex gap-3">
                {([1, 2] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setNumPlayers(n)}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${numPlayers === n ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}
                  >
                    {n} Pemain {n === 1 ? '👤' : '👥'}
                  </button>
                ))}
              </div>
            </div>

            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} className="mb-4">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-2 mb-1.5">
                  {PLAYER_EMOJI[i]} Nama {i === 0 ? 'Pemain 1' : 'Pemain 2'}:
                </label>
                <input
                  type="text"
                  value={playerNames[i]}
                  onChange={e => setPlayerNames(p => { const n = [...p]; n[i] = e.target.value || PLAYER_NAMES_DEFAULT[i]; return n; })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  maxLength={20}
                />
              </div>
            ))}

            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-xs text-gray-600">
              <p className="font-semibold text-gray-700 mb-2">Legenda Papan:</p>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-100 border border-red-400 rounded flex items-center justify-center text-xs">🐍</div><span>Ular — kebiasaan buruk gigi (mundur)</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-green-100 border border-green-400 rounded flex items-center justify-center text-xs">🪜</div><span>Tangga — kebiasaan baik gigi (maju)</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-amber-50 border border-amber-300 rounded flex items-center justify-center text-xs">❓</div><span>Pertanyaan — jawab untuk bonus poin</span></div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Dice6 size={18} /> Mulai Permainan!
            </button>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {phase !== 'setup' && (
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Board */}
            <div className="lg:col-span-2">
              <div
                className="grid border-2 border-gray-700 rounded-xl overflow-hidden shadow-md"
                style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
              >
                {renderBoard()}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500 flex-wrap justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-400 rounded" /> Ular (turun)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-400 rounded" /> Tangga (naik)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-50 border border-amber-300 rounded" /> Pertanyaan</div>
                <div className="flex items-center gap-1"><span>🔵</span> {playerNames[0]}</div>
                {numPlayers === 2 && <div className="flex items-center gap-1"><span>🔴</span> {playerNames[1]}</div>}
              </div>
            </div>

            {/* Control Panel */}
            <div className="space-y-4">
              {/* Scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-gray-700 text-sm font-semibold mb-3">Skor & Posisi</h3>
                {Array.from({ length: numPlayers }, (_, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl mb-2 ${currentPlayer === i && phase === 'playing' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <span>{PLAYER_EMOJI[i]}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{playerNames[i]}</p>
                        <p className="text-xs text-gray-500">Kotak {positions[i] || '(mulai)'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-600">{scores[i]}</p>
                      <p className="text-xs text-gray-400">poin</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dice & Roll */}
              {(phase === 'playing') && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-gray-600 text-sm mb-3 text-center">
                    Giliran: <strong className="text-teal-700">{playerNames[currentPlayer]} {PLAYER_EMOJI[currentPlayer]}</strong>
                  </p>
                  <div className="text-center mb-4">
                    <span
                      className={`text-7xl select-none transition-all duration-100 ${isRolling ? 'animate-spin opacity-60' : ''}`}
                    >
                      {diceValue ? DICE_FACES[diceValue - 1] : '🎲'}
                    </span>
                    {diceValue && !isRolling && (
                      <p className="text-gray-500 text-sm mt-1">Dadu: <strong>{diceValue}</strong></p>
                    )}
                  </div>
                  <button
                    onClick={rollDice}
                    disabled={isRolling}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Dice6 size={18} /> {isRolling ? 'Mengocok...' : 'Lempar Dadu!'}
                  </button>
                </div>
              )}

              {/* Snake/Ladder Message */}
              {phase === 'message' && message && (
                <div className={`rounded-2xl border-2 p-5 ${message.type === 'snake' ? 'bg-red-50 border-red-300' : message.type === 'ladder' ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                  <h3 className={`mb-2 ${message.type === 'snake' ? 'text-red-800' : message.type === 'ladder' ? 'text-green-800' : 'text-yellow-800'}`} style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {message.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 ${message.type === 'snake' ? 'text-red-700' : message.type === 'ladder' ? 'text-green-700' : 'text-yellow-700'}`}>
                    💡 {message.fact}
                  </p>
                  {phase !== 'win' ? (
                    <button
                      onClick={() => nextTurn(positions)}
                      className={`w-full py-2.5 rounded-xl text-white font-medium transition-colors ${message.type === 'snake' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      Lanjutkan →
                    </button>
                  ) : (
                    <button
                      onClick={() => setPhase('setup')}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={15} /> Main Lagi
                    </button>
                  )}
                </div>
              )}

              {/* Question */}
              {phase === 'question' && question && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">❓</span>
                    <div>
                      <p className="text-amber-800 text-xs font-medium">Pertanyaan Bonus (+20 poin jika benar!)</p>
                      <p className="text-amber-700 text-xs">{playerNames[currentPlayer]} {PLAYER_EMOJI[currentPlayer]}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm font-medium mb-3 leading-relaxed">{question.q}</p>
                  <div className="space-y-2 mb-3">
                    {question.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={questionAnswered !== null}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border-2 ${
                          questionAnswered === null
                            ? 'bg-white border-amber-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                            : i === question.correct
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : questionAnswered === false && i !== question.correct
                            ? 'bg-red-50 border-red-300 text-red-700 opacity-60'
                            : 'bg-white border-gray-200 text-gray-400 opacity-50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                  {questionAnswered !== null && (
                    <>
                      <div className={`rounded-xl p-3 text-xs mb-3 ${questionAnswered ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
                        {questionAnswered ? '✅ Benar!' : '❌ Kurang tepat.'} {question.explanation}
                      </div>
                      <button
                        onClick={() => nextTurn(positions)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-medium"
                      >
                        Lanjutkan →
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Win screen */}
              {phase === 'win' && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-yellow-800 font-bold mb-1">Permainan Selesai!</h3>
                  <div className="space-y-1 mb-4">
                    {Array.from({ length: numPlayers }, (_, i) => (
                      <div key={i} className="flex justify-between text-sm text-yellow-700 bg-yellow-100 rounded-lg px-3 py-2">
                        <span>{PLAYER_EMOJI[i]} {playerNames[i]}</span>
                        <span className="font-bold">{scores[i]} poin</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setPhase('setup')}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={15} /> Main Lagi
                  </button>
                </div>
              )}

              {/* Reset button */}
              {phase !== 'setup' && (
                <button
                  onClick={() => setPhase('setup')}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={14} /> Mulai Ulang
                </button>
              )}

              {/* Info */}
              <div className="bg-teal-50 rounded-xl p-4 text-xs text-teal-700 space-y-1.5">
                <p className="font-semibold text-teal-800">🦷 Fakta Sehat:</p>
                <p>• Sikat gigi 2× sehari = standar WHO</p>
                <p>• Periksa dokter gigi tiap 6 bulan</p>
                <p>• Fluoride memperkuat email gigi</p>
                <p>• Benang gigi membersihkan 35% area</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
