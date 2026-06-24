import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

// ── Scenario-based decision game for parents ─────────────────────────────
interface Scenario {
  id: number;
  context: string;
  situation: string;
  emoji: string;
  options: string[];
  correct: number;
  explanation: string;
  tip: string;
  source: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: '😢',
    context: 'Si Kecil (3 tahun) selalu menangis saat waktu sikat gigi.',
    situation: 'Bagaimana cara terbaik menangani situasi ini?',
    options: [
      'Paksa anak karena sikat gigi itu kewajiban dan tidak bisa ditawar',
      'Biarkan saja untuk sementara, nanti mau sendiri',
      'Gunakan sikat bergambar karakter favorit, pasta rasa buah, dan jadikan rutinitas menyenangkan',
      'Cukup berikan obat kumur saja sebagai pengganti sikat gigi',
    ],
    correct: 2,
    explanation: 'Memaksa anak hanya akan membuat trauma dan membuat anak semakin menolak. Teknik yang menyenangkan (sikat karakter, pasta rasa buah, lagu 2 menit, sikat bersama) terbukti lebih efektif membentuk kebiasaan jangka panjang.',
    tip: 'AAPD merekomendasikan: ciptakan asosiasi positif dengan sikat gigi sejak dini. Anak yang menikmati rutinitas sikat gigi di usia balita hampir pasti melanjutkan kebiasaan ini hingga dewasa.',
    source: 'AAPD Policy on Preventive Dental Practices (2023)',
  },
  {
    id: 2,
    emoji: '⬜',
    context: 'Saat memeriksa gigi anak (4 tahun), Anda melihat bintik putih pudar pada gigi depan atas.',
    situation: 'Apa langkah paling tepat?',
    options: [
      'Abaikan saja, mungkin hanya kotoran atau sisa susu',
      'Gosok lebih keras saat menyikat gigi agar bintik tersebut hilang',
      'Tunggu sampai gigi permanen tumbuh menggantikannya',
      'Segera bawa ke dokter gigi, karena ini tanda karies awal (white spot) yang masih bisa diperbaiki',
    ],
    correct: 3,
    explanation: 'Bintik putih (white spot lesion) adalah tanda demineralisasi email — karies stadium paling awal. Jika ditangani segera dengan fluoride oleh dokter gigi, kondisi ini masih bisa diperbaiki tanpa pengeboran. Jika dibiarkan, dalam beberapa bulan akan menjadi lubang yang memerlukan penambalan.',
    tip: 'Pemeriksaan rutin 6 bulan sekali ke dokter gigi memungkinkan deteksi white spot sebelum berkembang menjadi karies yang menyakitkan dan mahal.',
    source: 'Fejerskov, O. & Kidd, E. Dental Caries (2015); Kemenkes RI Pedoman UKGS (2012)',
  },
  {
    id: 3,
    emoji: '🍼',
    context: 'Bayi Anda (8 bulan) selalu tertidur sambil menyusu dari botol susu formula.',
    situation: 'Apa yang harus Anda lakukan?',
    options: [
      'Biarkan saja, bayi membutuhkan kenyang agar tidur nyenyak',
      'Cabut botol saat bayi mulai tertidur, dan lap gusi dengan kain basah setelah menyusu',
      'Ganti susu formula dengan susu kental manis yang lebih manis agar bayi cepat kenyang',
      'Tambahkan madu ke dalam botol untuk membantu tidur lebih cepat',
    ],
    correct: 1,
    explanation: 'Membiarkan bayi tidur dengan botol susu adalah penyebab utama Early Childhood Caries (ECC/karies botol). Saat tidur, aliran saliva berkurang drastis sehingga gula dari susu terus berkontak dengan gigi tanpa dinetralisir. Riskesdas 2018 menemukan 93% anak 3-5 tahun di Indonesia mengalami karies, sebagian besar akibat kebiasaan ini.',
    tip: 'Jika bayi tidak mau tidur tanpa botol, isi botol dengan air putih saja. Ini perubahan kebiasaan paling efektif mencegah karies botol.',
    source: 'AAPD Policy on ECC (2023); Riskesdas 2018, Kemenkes RI',
  },
  {
    id: 4,
    emoji: '🏥',
    context: 'Anak Anda baru berusia 1 tahun dan gigi pertamanya baru saja tumbuh.',
    situation: 'Kapan sebaiknya kunjungan pertama ke dokter gigi dilakukan?',
    options: [
      'Tunggu sampai semua gigi susu lengkap (usia 2-3 tahun)',
      'Tunggu sampai ada keluhan sakit gigi dulu',
      'Sekarang — usia 1 tahun adalah waktu ideal kunjungan pertama menurut AAPD dan IDGAI',
      'Cukup ke dokter anak biasa saja, dokter gigi belum diperlukan',
    ],
    correct: 2,
    explanation: 'AAPD, WHO, dan Ikatan Dokter Gigi Anak Indonesia (IDGAI) merekomendasikan kunjungan pertama saat gigi pertama tumbuh atau paling lambat usia 1 tahun. Kunjungan ini lebih fokus pada edukasi orang tua dan deteksi risiko dini daripada prosedur. Semakin dini, semakin sedikit biaya dan rasa sakit yang harus ditanggung.',
    tip: 'Kunjungan pertama ke dokter gigi bukan tentang pengeboran atau perawatan — ini sesi edukasi untuk Anda sebagai orang tua!',
    source: 'AAPD Policy on Dental Home (2023); IDGAI Pedoman Klinis 2021',
  },
  {
    id: 5,
    emoji: '🕳️',
    context: 'Dokter gigi mengatakan gigi susu anak (5 tahun) berlubang dan perlu ditambal.',
    situation: 'Apa keputusan terbaik Anda?',
    options: [
      'Tolak penambalan — gigi susu toh akan diganti gigi permanen',
      'Minta dicabut saja sekalian supaya tidak repot bolak-balik',
      'Tunggu dulu sampai anak mengeluh sakit, baru ditangani',
      'Setuju ditambal — gigi susu penting untuk fungsi mengunyah, berbicara, dan estetika',
    ],
    correct: 3,
    explanation: 'Gigi susu bukan sekadar "sementara". Fungsinya: (1) mengunyah dan pencernaan, (2) perkembangan bicara, (3) menahan ruang untuk gigi permanen. Mencabut gigi susu terlalu dini menyebabkan gigi lain bergeser dan ruang untuk gigi permanen menjadi sempit, yang memerlukan perawatan ortodontik mahal di masa depan.',
    tip: 'Gigi susu yang dicabut terlalu dini adalah salah satu penyebab utama maloklusi (gigi tidak rapi) yang membutuhkan kawat gigi. Merawat gigi susu adalah investasi untuk gigi permanen anak.',
    source: 'Welbury R. Paediatric Dentistry 4th Ed. (2012); Kemenkes UKGS (2012)',
  },
  {
    id: 6,
    emoji: '😨',
    context: 'Anak Anda (7 tahun) sangat takut ke dokter gigi karena pernah merasa sakit.',
    situation: 'Cara terbaik mengatasi dental anxiety pada anak?',
    options: [
      'Paksa pergi ke dokter gigi, anak harus belajar berani',
      'Bujuk dengan menjanjikan es krim atau permen setelah periksa gigi',
      'Hindari dokter gigi sampai anak siap sendiri',
      'Cari dokter gigi anak yang berpengalaman, ceritakan ketakutan anak, dan gunakan teknik tell-show-do',
    ],
    correct: 3,
    explanation: 'Dental anxiety pada anak sangat umum dan bisa diatasi dengan pendekatan yang tepat. Teknik "tell-show-do" (ceritakan prosedur, tunjukkan alat, lakukan) yang digunakan dokter gigi anak terlatih terbukti efektif mengurangi kecemasan. Memaksa atau menjanjikan makanan manis (kontradiktif) justru memperburuk situasi.',
    tip: 'Dental anxiety yang tidak ditangani bisa berlanjut hingga dewasa dan menyebabkan penghindaran perawatan gigi seumur hidup. Investasi mengatasi ketakutan ini sangat berharga.',
    source: 'AAPD Behavior Guidance for Pediatric Dental Patients (2023)',
  },
  {
    id: 7,
    emoji: '👅',
    context: 'Anak Anda (3 tahun) masih mengisap jempol dan sangat sulit dihentikan.',
    situation: 'Apa sikap yang tepat sebagai orang tua?',
    options: [
      'Tidak perlu khawatir, mengisap jempol adalah hal normal pada bayi dan balita',
      'Paksa hentikan segera dengan memberi cabai atau larutan pahit di jempol',
      'Biarkan terus — kebiasaan ini akan berhenti sendiri',
      'Mulai batasi secara bertahap, konsultasikan ke dokter gigi jika masih berlanjut di usia 4-5 tahun',
    ],
    correct: 3,
    explanation: 'Mengisap jempol sampai usia 3 tahun masih dalam batas normal (non-nutritive sucking). Namun jika berlanjut setelah usia 4-5 tahun, dapat mempengaruhi perkembangan rahang, posisi gigi depan, dan pola bicara. Penghentian paksa dan traumatis justru tidak efektif.',
    tip: 'Jika kebiasaan mengisap jempol berlanjut di atas usia 4-5 tahun, konsultasikan ke dokter gigi anak. Dokter dapat membantu dengan pendekatan positif dan jika perlu, mouth guard khusus.',
    source: 'AAPD Policy on Non-Nutritive Sucking Habits (2023); Proffit WR Contemporary Orthodontics (2018)',
  },
  {
    id: 8,
    emoji: '🦷',
    context: 'Anak Anda (8 tahun) jatuh dan gigi permanennya lepas dari soketnya.',
    situation: 'Apa yang harus dilakukan dalam 30 menit pertama?',
    options: [
      'Cuci gigi dengan sabun dan air yang mengalir, lalu simpan dalam tisu',
      'Pegang mahkota gigi (bukan akar), bilas dengan air atau susu, segera bawa ke dokter gigi dalam 30 menit',
      'Jangan sentuh gigi, bawa anak ke dokter esok hari',
      'Buang saja dan tunggu gigi baru tumbuh — gigi permanen pasti tumbuh lagi',
    ],
    correct: 1,
    explanation: 'Gigi permanen yang avulsi (lepas) masih bisa diselamatkan jika ditangani dalam 30-60 menit! Jangan pegang akar gigi (sel ligamen periodontal masih hidup di sana). Bilas dengan susu atau salin — jangan air sabun. Simpan dalam susu atau selipkan di bawah lidah pasien jika kooperatif, lalu SEGERA ke dokter gigi. Gigi permanen tidak tumbuh lagi!',
    tip: 'Simpan nomor telepon dokter gigi darurat di HP Anda. Trauma gigi adalah kedaruratan gigi yang membutuhkan respons cepat untuk menyelamatkan gigi anak.',
    source: 'International Association of Dental Traumatology (IADT) Guidelines (2020); Andreasen JO Textbook of Traumatic Injuries (2007)',
  },
];

export default function GameParents() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(SCENARIOS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const current = SCENARIOS[currentIdx];
  const answered = answers[currentIdx];
  const isLastScenario = currentIdx === SCENARIOS.length - 1;
  const totalCorrect = answers.filter((a, i) => a === SCENARIOS[i].correct).length;

  const handleAnswer = (idx: number) => {
    if (answers[currentIdx] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastScenario) {
      setSubmitted(true);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const reset = () => {
    setAnswers(Array(SCENARIOS.length).fill(null));
    setCurrentIdx(0);
    setSubmitted(false);
  };

  const scoreLevel = totalCorrect >= 7 ? 'Orang Tua Cerdas! 🏆' : totalCorrect >= 5 ? 'Orang Tua Baik 👍' : 'Perlu Belajar Lagi 📚';
  const scoreBg = totalCorrect >= 7 ? 'from-yellow-400 to-amber-500' : totalCorrect >= 5 ? 'from-teal-400 to-green-500' : 'from-blue-400 to-indigo-500';

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className={`bg-gradient-to-br ${scoreBg} rounded-3xl p-8 text-white text-center mb-8 shadow-xl`}>
              <div className="text-6xl mb-4">
                {totalCorrect >= 7 ? '🏆' : totalCorrect >= 5 ? '🌟' : '📚'}
              </div>
              <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: 800 }}>{scoreLevel}</h2>
              <p className="text-white/90 mb-4">Skor Anda: {totalCorrect}/{SCENARIOS.length} Skenario Benar</p>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">{totalCorrect}</div>
                    <div className="text-white/80 text-xs">Jawaban Benar</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">{SCENARIOS.length - totalCorrect}</div>
                    <div className="text-white/80 text-xs">Perlu Diperbaiki</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review answers */}
            <div className="space-y-4 mb-8">
              <h3 className="text-gray-800" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Review Jawaban Anda:</h3>
              {SCENARIOS.map((s, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === s.correct;
                return (
                  <div key={s.id} className={`rounded-2xl p-4 border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-gray-800 text-sm font-medium mb-1">{s.emoji} Skenario {s.id}: {s.context}</p>
                        {!isCorrect && <p className="text-red-600 text-xs mb-1">✗ Jawaban Anda: {s.options[userAnswer!]}</p>}
                        <p className={`text-xs font-medium mb-1 ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                          ✓ Jawaban Benar: {s.options[s.correct]}
                        </p>
                        <p className="text-gray-600 text-xs leading-relaxed">{s.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                <RotateCcw size={16} /> Coba Lagi
              </button>
              <Link to="/games" className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <ArrowLeft size={16} /> Kembali
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 pt-24 pb-12 px-4 text-center">
        <div className="text-5xl mb-3">👨‍👩‍👧</div>
        <h1 className="text-white mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Orang Tua Cerdas</h1>
        <p className="text-orange-100">Ambil keputusan terbaik untuk kesehatan gigi Si Kecil</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/games" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm">
            <ArrowLeft size={15} /> Kembali
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Skenario {currentIdx + 1} dari {SCENARIOS.length}</span>
            <div className="flex gap-1">
              {SCENARIOS.map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${
                  answers[i] !== null
                    ? answers[i] === SCENARIOS[i].correct ? 'bg-green-400' : 'bg-red-400'
                    : i === currentIdx ? 'bg-orange-400' : 'bg-gray-200'
                }`} />
              ))}
            </div>
          </div>
        </div>

        {/* Scenario card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Scenario header */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-orange-100">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{current.emoji}</div>
              <div>
                <div className="inline-flex items-center bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium mb-2">
                  Skenario {current.id}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{current.context}</p>
                <p className="text-gray-900 font-semibold text-sm">{current.situation}</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {current.options.map((opt, i) => {
              const isSelected = answered === i;
              const isCorrect = i === current.correct;
              let style = 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 cursor-pointer';
              if (answered !== null) {
                if (isCorrect) style = 'border-green-400 bg-green-50 text-green-800';
                else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-700';
                else style = 'border-gray-200 bg-gray-50 text-gray-400 cursor-default';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered !== null}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      answered !== null
                        ? isCorrect ? 'bg-green-400 text-white' : isSelected ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-500'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                    {answered !== null && isCorrect && <CheckCircle size={16} className="text-green-500 flex-shrink-0 ml-auto mt-0.5" />}
                    {answered !== null && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 flex-shrink-0 ml-auto mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered !== null && (
            <div className={`mx-6 mb-6 p-4 rounded-2xl ${answered === current.correct ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`font-semibold text-sm mb-2 ${answered === current.correct ? 'text-green-800' : 'text-blue-800'}`}>
                {answered === current.correct ? '✅ Pilihan Terbaik!' : '💡 Penjelasan:'}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{current.explanation}</p>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-teal-700 text-xs font-semibold mb-1">🦷 Tips Dokter Gigi:</p>
                <p className="text-gray-600 text-xs leading-relaxed">{current.tip}</p>
              </div>
              <p className="text-gray-400 text-xs mt-2 italic">📚 Sumber: {current.source}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {answered !== null && (
          <button
            onClick={handleNext}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLastScenario ? '🎉 Lihat Hasil' : 'Skenario Berikutnya'} <ChevronRight size={16} />
          </button>
        )}

        {/* Info box */}
        <div className="mt-6 bg-white rounded-2xl p-4 border border-gray-100 text-xs text-gray-500 space-y-1.5">
          <p className="font-semibold text-gray-700">ℹ️ Tentang Game Ini:</p>
          <p>Game ini berisi 8 skenario nyata yang sering dihadapi orang tua dalam menjaga kesehatan gigi anak. Semua jawaban dan penjelasan didasarkan pada pedoman resmi AAPD, WHO, Kemenkes RI, dan jurnal kedokteran gigi terindeks.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
