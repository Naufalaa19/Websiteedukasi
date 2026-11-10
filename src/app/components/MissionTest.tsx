import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Check, X, ArrowLeft, ArrowRight, Star, Flame, Trophy, RotateCcw, CloudOff, Home, CheckCircle2, XCircle } from 'lucide-react';
import { questions, answerKey, getCategory } from '../data/evaluasiQuestions';
import { useAuth } from '../lib/auth';

type Mode = 'pretest' | 'posttest';
type Ans = Record<number, 'B' | 'S'>;

const PER_STAGE = 10;
const stages = [
  { name: 'Pos Kebiasaan Menyikat', emoji: '🪥', blurb: 'Sikat, pasta, dan waktu menyikat', color: 'from-teal-400 to-emerald-500' },
  { name: 'Pos Gula & Karies', emoji: '🍬', blurb: 'Makanan, minuman, dan gigi berlubang', color: 'from-amber-400 to-orange-500' },
  { name: 'Pos Dokter Gigi', emoji: '🩺', blurb: 'Kapan dan mengapa perlu periksa', color: 'from-sky-400 to-indigo-500' },
  { name: 'Pos Mitos & Fakta', emoji: '🔎', blurb: 'Gusi, rasa ngilu, dan kebiasaan', color: 'from-fuchsia-400 to-rose-500' },
];

const rankTitle = (s: number) =>
  s >= 36 ? 'Pahlawan Gigi Emas' : s >= 28 ? 'Penjaga Senyum Perak' : s >= 20 ? 'Pejuang Gigi Perunggu' : 'Pemula Gigi Sehat';

const cfg = {
  pretest: {
    title: 'Misi Pahlawan Gigi Sehat',
    kicker: 'MISI 1 · PRETEST',
    intro: 'Selesaikan 4 pos petualangan dan kumpulkan XP. Jawab sesuai pengetahuan Anda saat ini, tidak ada jawaban yang dihakimi. Hasil ini menjadi titik awal belajar Anda.',
    cta: 'Mulai Petualangan',
  },
  posttest: {
    title: 'Misi Akhir: Uji Kemajuan',
    kicker: 'MISI 2 · POSTTEST',
    intro: 'Setelah belajar materi, saatnya melihat sejauh mana Anda berkembang. Lewati 4 pos yang sama dan bandingkan dengan pretest Anda.',
    cta: 'Mulai Misi Akhir',
  },
};

export function MissionTest({ mode }: { mode: Mode }) {
  const { user, results, saveResult, hasPretest } = useAuth();
  const [phase, setPhase] = useState<'intro' | 'play' | 'stage' | 'saving' | 'done'>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Ans>({});
  const [picked, setPicked] = useState<'B' | 'S' | null>(null);
  const [saveErr, setSaveErr] = useState('');
  const [final, setFinal] = useState(0);
  const lock = useRef(false);

  const c = cfg[mode];
  const q = questions[idx];
  const stageIdx = Math.floor(idx / PER_STAGE);
  const answeredCount = Object.keys(answers).length;
  const xp = answeredCount * 10 + Math.floor(answeredCount / 5) * 5;
  const streakBonus = Math.floor(answeredCount / 5);
  const firstName = (user?.name || '').split(' ')[0];
  const pre = useMemo(() => results.find((r) => r.type === 'pretest'), [results]);

  async function finish(a: Ans) {
    const score = questions.reduce((s, x) => s + (a[x.no] === answerKey[x.no] ? 1 : 0), 0);
    setFinal(score);
    setPhase('saving');
    setSaveErr('');
    try {
      await saveResult(mode, score, a);
      setPhase('done');
    } catch (e: any) {
      setSaveErr(e.message || 'Gagal menyimpan nilai.');
      setPhase('saving');
    }
  }

  function choose(v: 'B' | 'S') {
    if (lock.current) return;
    lock.current = true;
    setPicked(v);
    const next = { ...answers, [q.no]: v };
    setAnswers(next);
    setTimeout(() => {
      setPicked(null);
      lock.current = false;
      if (idx === questions.length - 1) { finish(next); return; }
      if ((idx + 1) % PER_STAGE === 0) { setPhase('stage'); return; }
      setIdx(idx + 1);
    }, 420);
  }

  const wrap = 'font-friendly min-h-screen bg-gradient-to-b from-[#e8f7f3] via-[#f6fbf9] to-[#fff8ec]';

  // ─── INTRO ───
  if (phase === 'intro') {
    return (
      <div className={wrap}>
        <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="text-7xl mb-3 select-none">🦷</motion.div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-teal-600 mb-2">{c.kicker}</p>
            <h1 className="font-display text-4xl sm:text-5xl text-teal-950 mb-3 leading-tight">{c.title}</h1>
            <p className="text-lg text-teal-900/80 mb-1">Selamat datang, <strong>{firstName || 'Bapak/Ibu'}</strong>! 🎉</p>
            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">{c.intro}</p>
          </motion.div>

          <div className="relative grid sm:grid-cols-2 gap-3.5 mb-8">
            {stages.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-4 bg-white rounded-3xl p-4 border-2 border-white shadow-sm">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-md`}>{s.emoji}</div>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-gray-400 tracking-wider">POS {i + 1} · 10 PERNYATAAN</p>
                  <p className="font-display text-lg text-teal-950 leading-tight">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.blurb}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8 text-sm">
            {['⭐ Kumpulkan XP', '🔥 Bonus kombo tiap 5 jawaban', '🏅 Raih lencana pos', '⏱️ ± 8 menit'].map((t) => (
              <span key={t} className="px-3.5 py-1.5 rounded-full bg-white border border-teal-100 text-teal-800 font-semibold">{t}</span>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => setPhase('play')} className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-display text-xl shadow-xl shadow-teal-500/30 hover:scale-[1.03] active:scale-95 transition">
              {c.cta} <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
            {mode === 'posttest' && !hasPretest && <p className="text-xs text-amber-700 mt-4">Anda belum mengerjakan pretest.</p>}
            <div className="mt-5"><Link to={mode === 'posttest' ? '/' : '/login'} className="text-sm text-gray-400 hover:text-teal-600">{mode === 'posttest' ? '← Kembali ke beranda' : ''}</Link></div>
          </div>
        </div>
      </div>
    );
  }

  // ─── STAGE COMPLETE ───
  if (phase === 'stage') {
    const s = stages[stageIdx];
    return (
      <div className={`${wrap} flex items-center justify-center px-5`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="relative max-w-md w-full text-center bg-white rounded-[2rem] shadow-2xl shadow-teal-900/10 p-8 overflow-hidden">
          {['🎉', '⭐', '✨', '🎊', '⭐', '✨'].map((e, i) => (
            <motion.span key={i} className="absolute text-2xl" style={{ left: `${8 + i * 17}%`, top: '-4%' }}
              animate={{ y: [0, 260], opacity: [1, 0], rotate: [0, 40] }} transition={{ duration: 2 + (i % 3) * 0.4, repeat: Infinity, delay: i * 0.25 }}>{e}</motion.span>
          ))}
          <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-5xl shadow-lg mb-4`}>{s.emoji}</div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-teal-600 mb-1">POS {stageIdx + 1} SELESAI!</p>
          <h2 className="font-display text-3xl text-teal-950 mb-2">Lencana "{s.name.replace('Pos ', '')}"</h2>
          <p className="text-gray-500 mb-5">Hebat, {firstName || 'Bapak/Ibu'}! {4 - stageIdx - 1 > 0 ? `Tinggal ${4 - stageIdx - 1} pos lagi.` : ''}</p>
          <div className="flex justify-center gap-3 mb-6">
            <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-700 font-bold flex items-center gap-1.5"><Star size={16} className="fill-amber-400 text-amber-400" />{xp} XP</span>
            <span className="px-4 py-2 rounded-2xl bg-orange-50 text-orange-600 font-bold flex items-center gap-1.5"><Flame size={16} />Kombo ×{streakBonus}</span>
          </div>
          <button onClick={() => { setIdx(idx + 1); setPhase('play'); }} className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-display text-lg inline-flex items-center justify-center gap-2 transition">
            Lanjut ke {stages[stageIdx + 1]?.name} <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── SAVING ───
  if (phase === 'saving') {
    return (
      <div className={`${wrap} flex items-center justify-center px-5`}>
        <div className="text-center max-w-sm">
          {saveErr ? (
            <>
              <CloudOff size={48} className="mx-auto text-red-400 mb-3" />
              <h2 className="font-display text-2xl text-teal-950 mb-2">Nilai belum tersimpan</h2>
              <p className="text-sm text-gray-500 mb-5">{saveErr}</p>
              <button onClick={() => finish(answers)} className="px-7 py-3 rounded-full bg-teal-600 text-white font-bold hover:bg-teal-700">Coba simpan lagi</button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mb-4" />
              <p className="font-display text-xl text-teal-900">Menghitung hasil misi…</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── DONE ───
  if (phase === 'done') {
    const cat = getCategory(final);
    const stars = final >= 36 ? 3 : final >= 24 ? 2 : 1;
    return (
      <div className={wrap}>
        <div className="max-w-2xl mx-auto px-5 py-10">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] shadow-2xl shadow-teal-900/10 p-8 text-center">
            <Trophy size={44} className="mx-auto text-amber-400 mb-2" />
            <p className="text-xs font-extrabold tracking-[0.18em] text-teal-600 mb-1">MISI SELESAI</p>
            <div className="flex justify-center gap-1.5 mb-3">
              {[1, 2, 3].map((n) => (
                <motion.div key={n} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + n * 0.2, type: 'spring' }}>
                  <Star size={38} className={n <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'} />
                </motion.div>
              ))}
            </div>
            <h2 className="font-display text-3xl text-teal-950">{rankTitle(final)}</h2>
            <p className="font-display text-7xl text-teal-600 my-2">{final}<span className="text-3xl text-teal-300">/40</span></p>
            <p className="text-gray-500 mb-1">{cat.emoji} Kategori <strong>{cat.label}</strong> · {Math.round((final / 40) * 100)}%</p>
            <p className="text-amber-600 font-bold text-sm mb-5">+{xp} XP terkumpul</p>

            {mode === 'posttest' && pre && (
              <div className="grid grid-cols-3 gap-2 mb-5 text-sm">
                <div className="rounded-2xl bg-gray-50 p-3"><p className="text-gray-400 text-xs">Pretest</p><p className="font-display text-2xl text-gray-700">{pre.score}</p></div>
                <div className="rounded-2xl bg-teal-50 p-3"><p className="text-teal-500 text-xs">Posttest</p><p className="font-display text-2xl text-teal-700">{final}</p></div>
                <div className={`rounded-2xl p-3 ${final - pre.score >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <p className="text-xs text-gray-400">Selisih</p>
                  <p className={`font-display text-2xl ${final - pre.score >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{final - pre.score > 0 ? '+' : ''}{final - pre.score}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 bg-teal-50 rounded-2xl p-3.5 mb-6">
              ✅ Nilai tersimpan atas nama <strong>{user?.name}</strong>.
              {mode === 'pretest' ? ' Sekarang pelajari materi, lalu kerjakan Posttest di menu "Posttest".' : ''}
            </p>

            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-display text-lg shadow-lg shadow-teal-600/25 transition">
              <Home size={18} /> {mode === 'pretest' ? 'Mulai Belajar' : 'Ke Beranda'}
            </Link>
          </motion.div>

          {mode === 'posttest' && (
            <div className="mt-6 bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <p className="px-5 py-3.5 font-display text-teal-900 border-b border-gray-100">Pembahasan jawaban</p>
              <ul className="divide-y divide-gray-50 max-h-[28rem] overflow-y-auto">
                {questions.map((x) => {
                  const ok = answers[x.no] === answerKey[x.no];
                  return (
                    <li key={x.no} className={`flex gap-3 px-5 py-3 text-sm ${ok ? '' : 'bg-red-50/60'}`}>
                      {ok ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />}
                      <span className="text-gray-700 flex-1">{x.no}. {x.text}</span>
                      {!ok && <span className="text-xs text-gray-500 shrink-0">Jawaban: <b>{answerKey[x.no] === 'B' ? 'Benar' : 'Salah'}</b></span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── PLAY ───
  const s = stages[stageIdx];
  const inStage = idx % PER_STAGE;
  return (
    <div className={wrap}>
      <div className="max-w-2xl mx-auto px-4 sm:px-5 pt-5 pb-10">
        {/* HUD */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-teal-800 flex items-center gap-2"><span className="text-xl">🦷</span><span className="hidden sm:inline">{c.title}</span></span>
          <div className="flex gap-2 text-sm font-bold">
            <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" />{xp} XP</span>
            {streakBonus > 0 && <span className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 flex items-center gap-1"><Flame size={14} />×{streakBonus}</span>}
          </div>
        </div>

        {/* Jalur pos */}
        <div className="flex items-center gap-1.5 mb-3">
          {stages.map((st, i) => (
            <div key={st.name} className="flex-1">
              <div className={`h-2.5 rounded-full overflow-hidden ${i < stageIdx ? 'bg-teal-500' : 'bg-teal-100'}`}>
                {i === stageIdx && <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${((inStage + (answers[q.no] ? 1 : 0)) / PER_STAGE) * 100}%` }} />}
              </div>
              <p className={`text-center text-lg mt-1 ${i <= stageIdx ? '' : 'grayscale opacity-40'}`}>{i < stageIdx ? '✅' : st.emoji}</p>
            </div>
          ))}
        </div>

        <div className="flex items-baseline justify-between mb-3 px-1">
          <p className="font-display text-teal-900">{s.name}</p>
          <p className="text-sm font-bold text-teal-600">Soal {q.no} / 40</p>
        </div>

        {/* Kartu soal */}
        <motion.div key={q.no} initial={{ opacity: 0, x: 40, rotate: 1.5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-teal-900/8 border-2 border-white p-6 sm:p-9 mb-5">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${s.color} text-white text-xs font-extrabold tracking-wider mb-5`}>
            {s.emoji} PERNYATAAN {inStage + 1}/{PER_STAGE}
          </div>
          <p className="font-display text-2xl sm:text-[1.7rem] leading-snug text-teal-950 min-h-[8rem]">{q.text}</p>
          <p className="text-sm text-gray-400 mt-4">Apakah pernyataan di atas benar atau salah?</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {([['B', 'Benar', Check, 'from-emerald-400 to-teal-500', 'shadow-emerald-500/30'], ['S', 'Salah', X, 'from-rose-400 to-red-500', 'shadow-red-500/30']] as const).map(([k, label, Icon, grad, sh]) => {
            const active = picked === k || (!picked && answers[q.no] === k);
            return (
              <motion.button key={k} whileTap={{ scale: 0.94 }} onClick={() => choose(k)}
                className={`py-6 rounded-3xl text-white font-display text-2xl flex flex-col items-center gap-1 bg-gradient-to-br ${grad} shadow-xl ${sh} transition ${picked && picked !== k ? 'opacity-40' : ''} ${active ? 'ring-4 ring-offset-2 ring-amber-300' : ''}`}>
                <Icon size={30} strokeWidth={3} />
                {label}
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6 text-sm">
          <button onClick={() => idx > 0 && idx % PER_STAGE !== 0 && setIdx(idx - 1)} disabled={idx === 0 || idx % PER_STAGE === 0}
            className="inline-flex items-center gap-1.5 text-teal-700 disabled:opacity-30 font-semibold"><ArrowLeft size={16} />Sebelumnya</button>
          {answers[q.no] && idx < questions.length - 1 && (idx + 1) % PER_STAGE !== 0 ? (
            <button onClick={() => setIdx(idx + 1)} className="inline-flex items-center gap-1.5 text-teal-700 font-semibold">Lewati ke berikutnya<ArrowRight size={16} /></button>
          ) : <span />}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5"><RotateCcw size={12} />Anda bisa mengubah jawaban lewat tombol "Sebelumnya" selama masih di pos yang sama.</p>
      </div>
    </div>
  );
}
