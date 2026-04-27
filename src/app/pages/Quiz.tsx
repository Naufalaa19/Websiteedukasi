import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckCircle, XCircle, RefreshCw, Trophy, Star, ChevronRight, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'Berapa lama waktu ideal untuk menyikat gigi?',
    options: ['30 detik', '1 menit', '2 menit', '5 menit'],
    correct: 2,
    explanation: 'Waktu ideal menyikat gigi adalah 2 menit (120 detik) — 30 detik untuk setiap kuadran mulut. Ini cukup untuk membersihkan plak tanpa merusak email.',
    category: 'Kebersihan Dasar',
  },
  {
    id: 2,
    question: 'Apa nama proses pembersihan karang gigi oleh dokter gigi?',
    options: ['Polishing', 'Scaling', 'Bleaching', 'Bonding'],
    correct: 1,
    explanation: 'Scaling adalah prosedur pembersihan karang gigi (dental calculus) secara profesional menggunakan alat scaler ultrasonik atau manual.',
    category: 'Prosedur Gigi',
  },
  {
    id: 3,
    question: 'Seberapa sering dianjurkan memeriksa gigi ke dokter gigi?',
    options: ['Setiap bulan', 'Setiap 3 bulan', 'Setiap 6 bulan', 'Setahun sekali'],
    correct: 2,
    explanation: 'Pemeriksaan gigi rutin dianjurkan setiap 6 bulan untuk deteksi dini karies, karang gigi, dan masalah lainnya sebelum berkembang serius.',
    category: 'Perawatan Rutin',
  },
  {
    id: 4,
    question: 'Bakteri apa yang paling bertanggung jawab atas karies gigi?',
    options: ['E. coli', 'Streptococcus mutans', 'Lactobacillus acidophilus', 'Staphylococcus aureus'],
    correct: 1,
    explanation: 'Streptococcus mutans adalah bakteri utama penyebab karies. Bakteri ini mengubah gula menjadi asam yang melarutkan email gigi.',
    category: 'Karies',
  },
  {
    id: 5,
    question: 'Apa yang dimaksud dengan gingivitis?',
    options: [
      'Infeksi tulang rahang',
      'Radang gusi akibat plak',
      'Gigi yang berlubang',
      'Bau mulut kronis',
    ],
    correct: 1,
    explanation: 'Gingivitis adalah peradangan (inflamasi) gusi yang disebabkan oleh penumpukan plak di garis gusi. Gejalanya: gusi merah, bengkak, mudah berdarah.',
    category: 'Penyakit Gusi',
  },
  {
    id: 6,
    question: 'Makanan berikut yang BAIK untuk kesehatan gigi adalah...',
    options: ['Permen gummy', 'Minuman bersoda', 'Keju', 'Jus buah kemasan'],
    correct: 2,
    explanation: 'Keju mengandung kalsium dan fosfat yang memperkuat email gigi, serta menstimulasi produksi air liur yang menetralkan asam. Keju juga meningkatkan pH mulut.',
    category: 'Nutrisi',
  },
  {
    id: 7,
    question: 'Fluoride pada pasta gigi berfungsi untuk...',
    options: [
      'Memutihkan gigi',
      'Membunuh semua bakteri mulut',
      'Memperkuat email gigi dan mencegah karies',
      'Menghilangkan bau mulut',
    ],
    correct: 2,
    explanation: 'Fluoride memperkuat email gigi melalui proses remineralisasi, membuatnya lebih tahan terhadap serangan asam bakteri. Ini adalah cara utama pasta gigi mencegah karies.',
    category: 'Pencegahan',
  },
  {
    id: 8,
    question: 'Plak gigi jika tidak dibersihkan akan mengeras menjadi karang gigi dalam waktu...',
    options: ['1-2 jam', '24-72 jam', '1 minggu', '1 bulan'],
    correct: 1,
    explanation: 'Plak yang tidak dibersihkan akan mengalami mineralisasi (mengeras) dalam 24-72 jam menjadi karang gigi yang tidak bisa dihilangkan hanya dengan sikat gigi biasa.',
    category: 'Karang Gigi',
  },
  {
    id: 9,
    question: 'Apa penyebab utama gigi sensitif?',
    options: [
      'Terlalu banyak makan gula',
      'Email gigi menipis sehingga dentin terbuka',
      'Kekurangan vitamin C',
      'Terlalu sering sikat gigi',
    ],
    correct: 1,
    explanation: 'Gigi sensitif terjadi ketika lapisan dentin terbuka akibat email yang menipis atau gusi menyusut. Dentin memiliki tubulus yang terhubung ke saraf gigi.',
    category: 'Gigi Sensitif',
  },
  {
    id: 10,
    question: 'Berapa kali sehari yang dianjurkan untuk menyikat gigi?',
    options: ['1 kali (pagi)', '2 kali (pagi & malam)', '3 kali (setiap setelah makan)', 'Setiap jam'],
    correct: 1,
    explanation: 'Menyikat gigi 2 kali sehari — pagi setelah sarapan dan malam sebelum tidur — sudah cukup. Yang terpenting adalah teknik dan durasi yang benar, bukan frekuensinya.',
    category: 'Kebersihan Dasar',
  },
  {
    id: 11,
    question: 'Penyakit gigi yang disebut "silent killer" karena sering tidak terasa sakit di awal adalah...',
    options: ['Gingivitis', 'Periodontitis', 'Karies Email', 'Gigi Sensitif'],
    correct: 1,
    explanation: 'Periodontitis sering disebut "silent disease" karena berkembang perlahan tanpa rasa sakit yang berarti, hingga tiba-tiba gigi goyang atau tulang sudah rusak signifikan.',
    category: 'Penyakit Gusi',
  },
  {
    id: 12,
    question: 'Kapan waktu terbaik untuk mulai mengajarkan anak menyikat gigi?',
    options: [
      'Saat usia 5 tahun',
      'Saat semua gigi susu sudah tumbuh',
      'Sejak gigi pertama muncul (~6 bulan)',
      'Saat masuk sekolah',
    ],
    correct: 2,
    explanation: 'Perawatan gigi dimulai sejak gigi pertama tumbuh (~6 bulan). Bahkan sebelum itu, gusi bayi perlu dibersihkan dengan kain lembab setelah menyusu.',
    category: 'Gigi Anak',
  },
  {
    id: 13,
    question: 'Apa yang dimaksud dengan "karies botol" (baby bottle tooth decay)?',
    options: [
      'Karies akibat minum dengan botol kaca',
      'Karies parah pada bayi akibat tidur dengan botol susu/jus',
      'Karies yang menyerupai bentuk botol',
      'Karies yang diobati dengan teknik botol',
    ],
    correct: 1,
    explanation: 'Karies botol terjadi saat bayi sering tidur dengan botol berisi susu, jus, atau minuman manis. Gula dari minuman tersebut terus menempel di gigi bayi sepanjang malam.',
    category: 'Gigi Anak',
  },
  {
    id: 14,
    question: 'Senyawa kimia apa dalam minuman soda yang paling merusak email gigi?',
    options: ['Kafein', 'Asam fosfat dan asam sitrat', 'CO2 (karbondioksida)', 'Pewarna buatan'],
    correct: 1,
    explanation: 'Asam fosfat dan asam sitrat dalam soda langsung melarutkan mineral email gigi (demineralisasi). Proses ini disebut erosi asam dan membuat gigi rentan karies.',
    category: 'Nutrisi',
  },
  {
    id: 15,
    question: 'Penelitian menunjukkan periodontitis (penyakit gusi berat) meningkatkan risiko...',
    options: [
      'Gangguan penglihatan',
      'Penyakit jantung dan stroke',
      'Masalah sendi lutut',
      'Gangguan tidur',
    ],
    correct: 1,
    explanation: 'Bakteri dari infeksi periodontal dapat masuk ke aliran darah dan menyebabkan inflamasi sistemik, meningkatkan risiko penyakit jantung, stroke, dan komplikasi diabetes.',
    category: 'Hubungan Sistemik',
  },
];

const categoryColors: Record<string, string> = {
  'Kebersihan Dasar': 'bg-teal-100 text-teal-700',
  'Prosedur Gigi': 'bg-blue-100 text-blue-700',
  'Perawatan Rutin': 'bg-cyan-100 text-cyan-700',
  'Karies': 'bg-amber-100 text-amber-700',
  'Penyakit Gusi': 'bg-red-100 text-red-700',
  'Nutrisi': 'bg-green-100 text-green-700',
  'Pencegahan': 'bg-emerald-100 text-emerald-700',
  'Karang Gigi': 'bg-yellow-100 text-yellow-700',
  'Gigi Sensitif': 'bg-orange-100 text-orange-700',
  'Gigi Anak': 'bg-pink-100 text-pink-700',
  'Hubungan Sistemik': 'bg-purple-100 text-purple-700',
};

export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ correct: boolean; selected: number }[]>([]);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentIndex];
  const total = quizQuestions.length;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const isCorrect = idx === question.correct;
    if (isCorrect) setScore(s => s + 1);
    setResults(prev => [...prev, { correct: isCorrect, selected: idx }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setResults([]);
    setFinished(false);
  };

  const percentage = Math.round((score / total) * 100);
  const getStars = () => percentage >= 87 ? 3 : percentage >= 60 ? 2 : 1;
  const getGrade = () => {
    if (percentage >= 87) return { label: 'Luar Biasa!', sub: 'Kamu ahli kesehatan gigi!', emoji: '🏆', color: 'text-teal-600' };
    if (percentage >= 60) return { label: 'Bagus!', sub: 'Pengetahuanmu cukup baik tentang kesehatan gigi.', emoji: '😊', color: 'text-blue-600' };
    return { label: 'Perlu Belajar Lagi', sub: 'Yuk, baca materi edukasi kami untuk menambah pengetahuan!', emoji: '📚', color: 'text-amber-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-white mb-3" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Quiz Kesehatan Gigi & Mulut
          </h1>
          <p className="text-indigo-100 text-lg">
            Uji seberapa jauh pengetahuanmu tentang kesehatan gigi dan mulut. 15 soal pilihan ganda!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* START SCREEN */}
        {!started && !finished && (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center border border-gray-100">
            <div className="text-5xl mb-5">🦷</div>
            <h2 className="text-gray-800 mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Siap Mulai Quiz?
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Quiz ini mencakup 15 pertanyaan tentang berbagai topik kesehatan gigi dan mulut, dari kebersihan dasar hingga penyakit gigi yang serius.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { icon: '📝', label: '15 Soal', sub: 'Pilihan ganda' },
                { icon: '⏱️', label: 'Bebas Waktu', sub: 'Tidak ada batas' },
                { icon: '📊', label: '15 Topik', sub: 'Komprehensif' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-gray-800 text-sm font-medium">{item.label}</div>
                  <div className="text-gray-400 text-xs">{item.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStarted(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-full transition-colors flex items-center gap-2 mx-auto"
            >
              Mulai Quiz <ArrowRight size={16} />
            </button>

            <p className="text-gray-400 text-xs mt-4">
              Referensi: Pertanyaan berbasis panduan kesehatan gigi WHO dan Kemenkes RI
            </p>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {started && !finished && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                  <span>Soal {currentIndex + 1} dari {total}</span>
                  <span className="text-indigo-600 font-medium">Skor: {score}/{currentIndex + (answered ? 1 : 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${((currentIndex) / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Category badge & question */}
              <div className="p-6 pb-4 border-b border-gray-50">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full mb-3 inline-block ${categoryColors[question.category] || 'bg-gray-100 text-gray-600'}`}>
                  {question.category}
                </span>
                <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 }}>
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {question.options.map((opt, idx) => {
                  let style = 'bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50';
                  if (answered) {
                    if (idx === question.correct) style = 'bg-green-50 border-green-400 text-green-800';
                    else if (idx === selectedAnswer && idx !== question.correct) style = 'bg-red-50 border-red-400 text-red-800';
                    else style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all text-sm flex items-center gap-3 ${style} ${!answered ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : 'cursor-default'}`}
                    >
                      <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {answered && idx === question.correct ? <CheckCircle size={16} className="text-green-600" /> :
                         answered && idx === selectedAnswer ? <XCircle size={16} className="text-red-600" /> :
                         String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className={`mx-6 mb-6 p-4 rounded-2xl text-sm leading-relaxed ${selectedAnswer === question.correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                  <p className="font-medium mb-1">
                    {selectedAnswer === question.correct ? '✅ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              )}

              {/* Next button */}
              {answered && (
                <div className="px-6 pb-6">
                  <button
                    onClick={handleNext}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    {currentIndex + 1 >= total ? 'Lihat Hasil' : 'Soal Berikutnya'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-6">
              {quizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i < results.length
                      ? results[i].correct ? 'bg-green-500 w-4' : 'bg-red-400 w-4'
                      : i === currentIndex ? 'bg-indigo-400 w-4' : 'bg-gray-200 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {finished && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center border-b border-gray-100">
              <div className="text-6xl mb-3">{getGrade().emoji}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={28} fill={i < getStars() ? '#f59e0b' : '#e5e7eb'} className={i < getStars() ? 'text-amber-400' : 'text-gray-300'} />
                ))}
              </div>
              <h2 className={`mb-1 ${getGrade().color}`} style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {getGrade().label}
              </h2>
              <p className="text-gray-500 text-sm mb-4">{getGrade().sub}</p>
              <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-sm">
                <Trophy size={22} className="text-amber-500" />
                <span className="text-gray-800" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{score}</span>
                <span className="text-gray-400">/ {total} benar</span>
                <span className="text-indigo-600 font-bold">({percentage}%)</span>
              </div>
            </div>

            {/* Per-question review */}
            <div className="p-6">
              <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Rekap Jawaban:</h3>
              <div className="space-y-2 mb-6">
                {quizQuestions.map((q, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${results[i]?.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    {results[i]?.correct
                      ? <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      : <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${results[i]?.correct ? 'text-green-700' : 'text-red-700'}`}>
                        Soal {i + 1}: {q.question}
                      </p>
                      {!results[i]?.correct && (
                        <p className="text-red-600 text-xs mt-0.5">Jawaban benar: {q.options[q.correct]}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[q.category] || 'bg-gray-100 text-gray-600'}`}>
                      {q.category}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={restart}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Ulangi Quiz
                </button>
                <a
                  href="/#materi"
                  className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Baca Materi →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
