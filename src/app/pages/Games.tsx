import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Trophy, Star, RefreshCw, ChevronRight, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

// =====================
// GAME 1: Sikat Gigi - Brush all sections before timer runs out
// =====================
const TOOTH_SECTIONS = [
  { id: 'ul', label: 'Kiri Atas', x: 20, y: 20 },
  { id: 'ur', label: 'Kanan Atas', x: 60, y: 20 },
  { id: 'uf', label: 'Depan Atas', x: 40, y: 10 },
  { id: 'll', label: 'Kiri Bawah', x: 20, y: 70 },
  { id: 'lr', label: 'Kanan Bawah', x: 60, y: 70 },
  { id: 'lf', label: 'Depan Bawah', x: 40, y: 80 },
];

function BrushGame({ onExit }: { onExit: () => void }) {
  const [brushed, setBrushed] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(15);
  const [status, setStatus] = useState<'idle' | 'playing' | 'win' | 'lose'>('idle');
  const [score, setScore] = useState(0);

  const start = () => {
    setBrushed(new Set());
    setTimeLeft(15);
    setStatus('playing');
    setScore(0);
  };

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) { setStatus('lose'); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status]);

  const brushSection = (id: string) => {
    if (status !== 'playing') return;
    if (brushed.has(id)) return;
    const next = new Set(brushed);
    next.add(id);
    setBrushed(next);
    setScore(s => s + 10);
    if (next.size === TOOTH_SECTIONS.length) {
      setStatus('win');
      setScore(s => s + timeLeft * 5);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">🪥 Sikat Semua Gigi!</h2>
          {status === 'playing' && (
            <div className={`text-2xl font-bold px-4 py-1 rounded-xl ${timeLeft <= 5 ? 'bg-red-500' : 'bg-white/20'}`}>
              {timeLeft}s
            </div>
          )}
        </div>
        <p className="text-teal-100 text-sm">Klik setiap bagian gigi sebelum waktu habis!</p>
      </div>

      <div className="p-6">
        {status === 'idle' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🦷</div>
            <h3 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: '1.2rem' }}>Cara Bermain</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              Klik setiap bagian mulut untuk "menyikat" gigi. Sikat semua 6 bagian sebelum 15 detik habis!
            </p>
            <button onClick={start} className="bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto">
              <Play size={16} /> Mulai Game
            </button>
          </div>
        )}

        {(status === 'win' || status === 'lose') && (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">{status === 'win' ? '🏆' : '😅'}</div>
            <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '1.3rem', color: status === 'win' ? '#0d9488' : '#ef4444' }}>
              {status === 'win' ? 'Mantap! Gigi Bersih!' : 'Waktu Habis!'}
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              {status === 'win' ? `Semua gigi berhasil disikat! Skor: ${score}` : `Baru ${brushed.size} dari 6 bagian disikat. Coba lagi!`}
            </p>
            {status === 'win' && (
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(score >= 100 ? 3 : score >= 60 ? 2 : 1)].map((_, i) => (
                  <Star key={i} size={24} fill="#f59e0b" className="text-amber-400" />
                ))}
              </div>
            )}
            <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
              {status === 'win'
                ? 'Ingat: Sikat gigi 2x sehari, pagi setelah sarapan dan malam sebelum tidur!'
                : 'Tips: Mulai dari bagian belakang agar tidak terlewat!'}
            </p>
            <button onClick={start} className="bg-teal-600 text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={14} /> Main Lagi
            </button>
          </div>
        )}

        {status === 'playing' && (
          <>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{brushed.size}/{TOOTH_SECTIONS.length} bagian disikat</span>
                <span className="text-teal-600 font-medium">Skor: {score}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-teal-500 rounded-full h-2 transition-all"
                  style={{ width: `${(brushed.size / TOOTH_SECTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Mouth diagram */}
            <div className="relative bg-gradient-to-b from-pink-50 to-pink-100 rounded-2xl mx-auto border-2 border-pink-200"
              style={{ width: '100%', maxWidth: 320, height: 220 }}>
              <p className="absolute top-2 left-1/2 -translate-x-1/2 text-pink-400 text-xs">Mulut - Tampak Depan</p>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl select-none">👄</div>
              {TOOTH_SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => brushSection(s.id)}
                  style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}
                  className={`absolute w-14 h-14 rounded-2xl border-2 transition-all duration-200 text-xs font-medium flex flex-col items-center justify-center gap-0.5 ${
                    brushed.has(s.id)
                      ? 'bg-teal-400 border-teal-500 text-white scale-95'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-teal-400 hover:bg-teal-50 hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{brushed.has(s.id) ? '✓' : '🦷'}</span>
                  <span style={{ fontSize: '0.6rem' }}>{s.label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-3">Klik setiap kotak gigi untuk menyikat!</p>
          </>
        )}
      </div>
    </div>
  );
}

// =====================
// GAME 2: Pilah Makanan - Good vs Bad for teeth
// =====================
const FOODS = [
  { id: 1, name: 'Apel', emoji: '🍎', good: true, reason: 'Merangsang air liur & membersihkan gigi' },
  { id: 2, name: 'Permen', emoji: '🍬', good: false, reason: 'Mengandung gula tinggi, menyebabkan karies' },
  { id: 3, name: 'Susu', emoji: '🥛', good: true, reason: 'Kaya kalsium untuk memperkuat email gigi' },
  { id: 4, name: 'Soda', emoji: '🥤', good: false, reason: 'Asam fosfat melarutkan email gigi' },
  { id: 5, name: 'Wortel', emoji: '🥕', good: true, reason: 'Serat membersihkan gigi secara alami' },
  { id: 6, name: 'Cokelat Manis', emoji: '🍫', good: false, reason: 'Gula menempel di gigi, merusak email' },
  { id: 7, name: 'Keju', emoji: '🧀', good: true, reason: 'Menetralkan asam & mengandung kalsium' },
  { id: 8, name: 'Jus Kemasan', emoji: '🧃', good: false, reason: 'Gula & asam tinggi dalam kemasan' },
  { id: 9, name: 'Air Putih', emoji: '💧', good: true, reason: 'Membilas sisa makanan & bakteri' },
  { id: 10, name: 'Es Krim', emoji: '🍦', good: false, reason: 'Gula & suhu dingin sensitif gigi' },
];

function FoodSortGame({ onExit }: { onExit: () => void }) {
  const [remaining, setRemaining] = useState([...FOODS].sort(() => Math.random() - 0.5));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState<{ food: typeof FOODS[0]; correct: boolean }[]>([]);

  const reset = () => {
    setRemaining([...FOODS].sort(() => Math.random() - 0.5));
    setScore(0);
    setWrong(0);
    setFeedback(null);
    setDone(false);
    setAnswered([]);
  };

  const answer = (isGood: boolean) => {
    if (!remaining.length || feedback) return;
    const current = remaining[0];
    const correct = current.good === isGood;
    setAnswered(prev => [...prev, { food: current, correct }]);
    setFeedback({ text: correct ? `✅ Benar! ${current.reason}` : `❌ Salah! ${current.reason}`, good: correct });
    if (correct) setScore(s => s + 10);
    else setWrong(w => w + 1);

    setTimeout(() => {
      setFeedback(null);
      const next = remaining.slice(1);
      setRemaining(next);
      if (next.length === 0) setDone(true);
    }, 1800);
  };

  const current = remaining[0];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🍎 Baik atau Buruk untuk Gigi?</h2>
          <div className="text-right text-sm">
            <div className="font-bold">{score} poin</div>
            <div className="text-green-200">{wrong} salah</div>
          </div>
        </div>
        <p className="text-green-100 text-sm mt-1">Pilah makanan yang baik/buruk untuk kesehatan gigi!</p>
      </div>

      <div className="p-6">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">{score >= 80 ? '🏆' : score >= 50 ? '😊' : '📚'}</div>
            <h3 className="mb-1" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0d9488' }}>
              Selesai! Skor Akhir: {score}/{FOODS.length * 10}
            </h3>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(score >= 90 ? 3 : score >= 60 ? 2 : 1)].map((_, i) => (
                <Star key={i} size={22} fill="#f59e0b" className="text-amber-400" />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-5">
              {answered.map(({ food, correct }, i) => (
                <div key={i} className={`rounded-xl p-2 text-center text-xs ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="text-xl">{food.emoji}</div>
                  <div>{correct ? '✓' : '✗'}</div>
                </div>
              ))}
            </div>
            <button onClick={reset} className="bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={14} /> Main Lagi
            </button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{FOODS.length - remaining.length}/{FOODS.length} makanan</span>
                <span>{remaining.length} tersisa</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 rounded-full h-1.5 transition-all"
                  style={{ width: `${((FOODS.length - remaining.length) / FOODS.length) * 100}%` }}
                />
              </div>
            </div>

            {current && (
              <div className="text-center">
                <div className="text-8xl mb-3 select-none">{current.emoji}</div>
                <h3 className="text-gray-800 mb-6" style={{ fontWeight: 600, fontSize: '1.3rem' }}>{current.name}</h3>

                {feedback ? (
                  <div className={`rounded-2xl p-4 mb-4 text-sm ${feedback.good ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {feedback.text}
                  </div>
                ) : (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => answer(true)}
                      className="flex-1 max-w-[140px] bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      <div className="text-3xl mb-1">😁</div>
                      <div className="text-sm font-medium">Baik untuk Gigi</div>
                    </button>
                    <button
                      onClick={() => answer(false)}
                      className="flex-1 max-w-[140px] bg-red-50 hover:bg-red-100 border-2 border-red-300 text-red-700 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      <div className="text-3xl mb-1">😬</div>
                      <div className="text-sm font-medium">Buruk untuk Gigi</div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// =====================
// GAME 3: Tebak Masalah Gigi - Match symptom to dental problem
// =====================
const PROBLEMS = [
  { id: 'karies', name: 'Karies Gigi', emoji: '🕳️', symptom: 'Gigi terasa berlubang dan ngilu saat makan manis atau dingin' },
  { id: 'gingivitis', name: 'Gingivitis', emoji: '🩸', symptom: 'Gusi berdarah saat menyikat gigi, merah dan bengkak' },
  { id: 'karang', name: 'Karang Gigi', emoji: '🪨', symptom: 'Lapisan keras berwarna kuning/cokelat di sekitar gigi' },
  { id: 'sensitif', name: 'Gigi Sensitif', emoji: '⚡', symptom: 'Nyeri tajam saat minum es atau makanan panas' },
  { id: 'halitosis', name: 'Bau Mulut', emoji: '💨', symptom: 'Napas tidak segar yang tidak hilang meski sudah gosok gigi' },
];

function MatchGame({ onExit }: { onExit: () => void }) {
  const [shuffledProblems] = useState([...PROBLEMS].sort(() => Math.random() - 0.5));
  const [shuffledSymptoms] = useState([...PROBLEMS].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const reset = () => {
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setScore(0);
    setDone(false);
    setSelectedSymptom(null);
  };

  const handleProblemClick = (id: string) => {
    if (matched.has(id)) return;
    setSelected(id);
  };

  const handleSymptomClick = (id: string) => {
    if (matched.has(id)) return;
    if (!selected) return;
    if (selected === id) {
      const next = new Set(matched);
      next.add(id);
      setMatched(next);
      setScore(s => s + 20);
      setSelected(null);
      setSelectedSymptom(null);
      if (next.size === PROBLEMS.length) setDone(true);
    } else {
      setWrong(id);
      setTimeout(() => { setWrong(null); setSelected(null); }, 900);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🔗 Cocokkan Masalah Gigi!</h2>
          <div className="font-bold">{score} poin</div>
        </div>
        <p className="text-purple-100 text-sm mt-1">Pilih nama masalah, lalu klik gejala yang sesuai!</p>
      </div>

      <div className="p-6">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-teal-700 mb-2" style={{ fontWeight: 700, fontSize: '1.2rem' }}>
              Semua Cocok! Skor: {score}/100
            </h3>
            <p className="text-gray-500 text-sm mb-6">Kamu sekarang bisa mengenali masalah gigi dari gejalanya!</p>
            <button onClick={reset} className="bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={14} /> Main Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Problems (left) */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Nama Masalah</p>
              <div className="space-y-2">
                {shuffledProblems.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProblemClick(p.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                      matched.has(p.id)
                        ? 'bg-green-50 border-green-300 text-green-700 opacity-60'
                        : selected === p.id
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span className="mr-2">{p.emoji}</span>
                    {p.name}
                    {matched.has(p.id) && ' ✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms (right) */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Gejala</p>
              <div className="space-y-2">
                {shuffledSymptoms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSymptomClick(p.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-xs leading-relaxed transition-all ${
                      matched.has(p.id)
                        ? 'bg-green-50 border-green-300 text-green-700 opacity-60'
                        : wrong === p.id
                        ? 'bg-red-50 border-red-400 text-red-700 scale-95'
                        : selected
                        ? 'bg-amber-50 border-amber-300 text-gray-700 hover:border-purple-400 hover:scale-105 cursor-pointer'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {p.symptom}
                    {matched.has(p.id) && ' ✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {selected && !done && (
          <p className="text-center text-purple-600 text-xs mt-4 animate-pulse">
            "{shuffledProblems.find(p => p.id === selected)?.name}" dipilih — klik gejala yang cocok →
          </p>
        )}
      </div>
    </div>
  );
}

// =====================
// MAIN GAMES PAGE
// =====================
const GAMES = [
  {
    id: 'brush',
    title: 'Sikat Semua Gigi!',
    desc: 'Klik semua bagian mulut sebelum waktu habis. Latih kebiasaan menyikat gigi yang lengkap!',
    emoji: '🪥',
    color: 'from-teal-400 to-cyan-500',
    badge: 'Aksi Cepat',
    badgeColor: 'bg-teal-100 text-teal-700',
    route: null,
  },
  {
    id: 'food',
    title: 'Baik atau Buruk?',
    desc: 'Pilah makanan yang baik dan buruk untuk gigi. Kenali mana yang bisa merusak email gigi!',
    emoji: '🍎',
    color: 'from-green-400 to-teal-500',
    badge: 'Edukasi',
    badgeColor: 'bg-green-100 text-green-700',
    route: null,
  },
  {
    id: 'match',
    title: 'Cocokkan Masalah Gigi!',
    desc: 'Hubungkan nama masalah gigi dengan gejalanya. Uji seberapa paham kamu tentang kesehatan gigi!',
    emoji: '🔗',
    color: 'from-purple-400 to-pink-500',
    badge: 'Pengetahuan',
    badgeColor: 'bg-purple-100 text-purple-700',
    route: null,
  },
];

const EXTRA_GAMES = [
  {
    route: '/games/tts',
    title: 'TTS Kesehatan Gigi',
    desc: 'Teka-Teki Silang 8 kata seputar istilah kesehatan gigi dan mulut. Uji kosakata medismu!',
    emoji: '📝',
    color: 'from-amber-400 to-orange-500',
    badge: 'Teka-Teki',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    route: '/games/ular-tangga',
    title: 'Ular Tangga Gigi Sehat',
    desc: 'Permainan ular tangga klasik dengan edukasi kesehatan gigi! Hindari kebiasaan buruk, naiki tangga kebaikan.',
    emoji: '🎲',
    color: 'from-emerald-400 to-teal-600',
    badge: '2 Pemain',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Hero */}
      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h1 className="text-white mb-3" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Games Kesehatan Gigi
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Belajar kesehatan gigi dan mulut dengan cara yang menyenangkan! Main game, raih skor tertinggi!
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {!activeGame ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-gray-800 mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Pilih Game</h2>
              <p className="text-gray-500 text-sm">Tersedia <strong>5 game interaktif</strong> tentang kesehatan gigi dan mulut</p>
            </div>

            {/* Inline games */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Game Langsung</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {GAMES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setActiveGame(game.id)}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
                  >
                    <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{game.emoji}</span>
                    </div>
                    <div className="p-5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${game.badgeColor}`}>{game.badge}</span>
                      <h3 className="text-gray-800 mt-3 mb-2" style={{ fontWeight: 600, fontSize: '1rem' }}>{game.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{game.desc}</p>
                      <div className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
                        <Play size={14} /> Mainkan <ChevronRight size={14} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Route-based games */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Game Halaman Penuh</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {EXTRA_GAMES.map(game => (
                  <Link
                    key={game.route}
                    to={game.route}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className={`h-36 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{game.emoji}</span>
                      <span className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">{game.badge}</span>
                    </div>
                    <div className="p-5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${game.badgeColor}`}>{game.badge}</span>
                      <h3 className="text-gray-800 mt-3 mb-2" style={{ fontWeight: 600, fontSize: '1rem' }}>{game.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{game.desc}</p>
                      <div className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
                        <Play size={14} /> Mainkan <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-teal-800 mb-3" style={{ fontWeight: 600 }}>💡 Tahukah Kamu?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-teal-700">
                <div className="flex gap-2"><span>🦷</span><span>Sikat gigi yang ideal adalah 2 menit, 2x sehari, dengan pasta berfluoride</span></div>
                <div className="flex gap-2"><span>🧵</span><span>Benang gigi membersihkan 35% area gigi yang tidak bisa dijangkau sikat gigi</span></div>
                <div className="flex gap-2"><span>🏥</span><span>Periksakan gigi ke dokter setiap 6 bulan meski tidak ada keluhan</span></div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Daftar Game
            </button>

            {activeGame === 'brush' && <BrushGame onExit={() => setActiveGame(null)} />}
            {activeGame === 'food' && <FoodSortGame onExit={() => setActiveGame(null)} />}
            {activeGame === 'match' && <MatchGame onExit={() => setActiveGame(null)} />}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}