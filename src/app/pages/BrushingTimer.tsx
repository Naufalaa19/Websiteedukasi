import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';

const SECTIONS = [
  { id: 0, label: 'Gigi Kanan Atas', detail: 'Sikat bagian luar, dalam, dan kunyah', emoji: '↗️', color: 'bg-teal-500', lightColor: 'bg-teal-50 border-teal-200', tip: 'Sudut 45° ke garis gusi, gerakan melingkar kecil' },
  { id: 1, label: 'Gigi Kiri Atas', detail: 'Sikat bagian luar, dalam, dan kunyah', emoji: '↖️', color: 'bg-cyan-500', lightColor: 'bg-cyan-50 border-cyan-200', tip: 'Jangan lupa bagian dalam yang sering terlewat!' },
  { id: 2, label: 'Gigi Kanan Bawah', detail: 'Sikat bagian luar, dalam, dan kunyah', emoji: '↘️', color: 'bg-blue-500', lightColor: 'bg-blue-50 border-blue-200', tip: 'Miringkan sikat ke bawah untuk bagian dalam' },
  { id: 3, label: 'Gigi Kiri Bawah', detail: 'Sikat bagian luar, dalam, dan kunyah', emoji: '↙️', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 border-indigo-200', tip: 'Terakhir, sikat permukaan lidah untuk segar maksimal!' },
];

const TOTAL_SECONDS = 120; // 2 minutes
const SECTION_SECONDS = 30; // 30 seconds each

export default function BrushingTimer() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const elapsed = TOTAL_SECONDS - timeLeft;
  const currentSection = Math.min(Math.floor(elapsed / SECTION_SECONDS), 3);
  const sectionProgress = (elapsed % SECTION_SECONDS) / SECTION_SECONDS;
  const totalProgress = (elapsed / TOTAL_SECONDS) * 100;

  const playBeep = (frequency = 800, duration = 0.2) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setIsFinished(true);
          playBeep(1200, 0.5);
          return 0;
        }
        const newTime = prev - 1;
        const newElapsed = TOTAL_SECONDS - newTime;
        // Beep when changing section
        if (newElapsed % SECTION_SECONDS === 0) playBeep(600, 0.3);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const toggleTimer = () => {
    if (isFinished) return;
    setIsRunning(p => !p);
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setTimeLeft(TOTAL_SECONDS);
    setIsRunning(false);
    setIsFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Circular progress
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - totalProgress / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <Header />

      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 pt-24 pb-12 px-4 text-center">
        <div className="text-5xl mb-3">⏱️</div>
        <h1 className="text-white mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Timer Sikat Gigi 2 Menit</h1>
        <p className="text-teal-100">Panduan sikat gigi si kecil sesuai standar WHO — 30 detik per area!</p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to="/games" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm mb-6">
          <ArrowLeft size={15} /> Kembali ke Games
        </Link>

        {isFinished ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-teal-700 mb-2" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Selesai! Hebat!</h2>
            <p className="text-gray-600 mb-2">Si Kecil sudah menyikat semua area gigi selama 2 menit penuh!</p>
            <p className="text-teal-600 text-sm mb-6">Jangan lupa berkumur dan meludah pasta gigi ya! 🦷</p>
            <div className="bg-teal-50 rounded-2xl p-4 text-left text-sm text-teal-700 mb-6">
              <p className="font-semibold mb-2">✅ Yang sudah disikat:</p>
              {SECTIONS.map(s => (
                <div key={s.id} className="flex items-center gap-2 mb-1">
                  <span>✓</span> <span>{s.emoji} {s.label}</span>
                </div>
              ))}
            </div>
            <button onClick={reset} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto transition-colors">
              <RotateCcw size={16} /> Sikat Lagi
            </button>
          </div>
        ) : (
          <>
            {/* Timer display */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center mb-6">
              {/* Circular timer */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg width="240" height="240" className="-rotate-90">
                  {/* Background circle */}
                  <circle cx="120" cy="120" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  {/* Progress circle */}
                  <circle
                    cx="120" cy="120" r={radius}
                    stroke={isRunning ? '#0d9488' : '#94a3b8'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl mb-1">
                    {isFinished ? '🎉' : isRunning ? SECTIONS[currentSection]?.emoji : '🦷'}
                  </div>
                  <div className="text-4xl font-black text-gray-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {isRunning ? 'Sedang menyikat...' : timeLeft === TOTAL_SECONDS ? 'Tekan mulai' : 'Dijeda'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3 justify-center mb-6">
                <button
                  onClick={toggleTimer}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium transition-all ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  {isRunning ? <><Pause size={18} /> Jeda</> : <><Play size={18} /> {timeLeft === TOTAL_SECONDS ? 'Mulai!' : 'Lanjut'}</>}
                </button>
                <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Section indicators */}
              <div className="grid grid-cols-4 gap-2">
                {SECTIONS.map((s, i) => {
                  const isDone = elapsed >= (i + 1) * SECTION_SECONDS;
                  const isActive = i === currentSection && isRunning && !isFinished;
                  return (
                    <div key={s.id} className={`rounded-xl p-2 border-2 transition-all ${isDone ? 'bg-teal-50 border-teal-300' : isActive ? 'bg-teal-100 border-teal-400 scale-105 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="text-xl mb-1">{s.emoji}</div>
                      <div className={`text-xs font-medium ${isDone ? 'text-teal-700' : isActive ? 'text-teal-800' : 'text-gray-500'}`}>
                        {isDone ? '✓ Selesai' : isActive ? '⟳ Aktif' : s.label.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current section guidance */}
            {isRunning && (
              <div className={`rounded-2xl p-5 border-2 mb-6 transition-all ${SECTIONS[currentSection].lightColor}`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{SECTIONS[currentSection].emoji}</div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{SECTIONS[currentSection].label}</h3>
                    <p className="text-gray-600 text-sm mb-2">{SECTIONS[currentSection].detail}</p>
                    <p className="text-teal-700 text-xs bg-teal-50 rounded-lg px-3 py-2">💡 {SECTIONS[currentSection].tip}</p>
                  </div>
                </div>
                {/* Section progress bar */}
                <div className="mt-3 bg-white/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${SECTIONS[currentSection].color} rounded-full transition-all duration-1000`}
                    style={{ width: `${sectionProgress * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {SECTION_SECONDS - (elapsed % SECTION_SECONDS)} detik lagi
                </div>
              </div>
            )}
          </>
        )}

        {/* Dental hygiene facts */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-3 text-sm">🦷 Panduan Sikat Gigi yang Benar</h3>
          <div className="space-y-2.5">
            {[
              { icon: '⏱️', text: 'Sikat selama 2 menit — 30 detik per area (kanan atas, kiri atas, kanan bawah, kiri bawah)' },
              { icon: '📐', text: 'Sudut sikat 45° ke garis gusi untuk membersihkan area kritis di bawah gusi' },
              { icon: '🔄', text: 'Gerakan melingkar kecil, bukan menggosok horizontal — mencegah abrasi gusi' },
              { icon: '🧴', text: 'Gunakan pasta gigi berfluoride — anak <3 tahun: seujung jari; >3 tahun: sebesar kacang polong' },
              { icon: '📅', text: 'Sikat gigi 2x sehari: pagi setelah sarapan dan malam sebelum tidur (paling penting!)' },
            ].map((f, i) => (
              <div key={i} className="flex gap-2 text-xs text-gray-600">
                <span className="flex-shrink-0">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
            Sumber: WHO Oral Health Programme (2022); AAPD Reference Manual (2023)
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
