import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, Award, RefreshCw, ClipboardList } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const questions = [
  { no: 1,  text: 'Kebersihan gigi dan mulut dapat mempengaruhi kesehatan gigi.' },
  { no: 2,  text: 'Menggosok gigi hanya cukup 1 kali sehari pada waktu mandi pagi.' },
  { no: 3,  text: 'Pasta gigi menggunakan floured.' },
  { no: 4,  text: 'Sebelum tidur sebaiknya gosok gigi.' },
  { no: 5,  text: 'Anak-anak boleh mememakai sikat gigi orang dewasa.' },
  { no: 6,  text: 'Sikat gigi yang baik adalah yang tangkainya lurus dan kepala sikatnya kecil sehingga bisa masuk kedalam mulut dengan mudah.' },
  { no: 7,  text: 'Menggosok gigi dilakukan sesudah makan dan sebelum tidur.' },
  { no: 8,  text: 'Sikat gigi yang baik adalah sikat yang bulunya yang halus dan rata.' },
  { no: 9,  text: 'Menyikat gigi tidak perlu terlalu kuat agar gusi tidak mudah berdarah.' },
  { no: 10, text: 'Menyikat gigi cukup pada bagian gigi depan saja.' },
  { no: 11, text: 'Karies adalah penyakit gigi berlubang.' },
  { no: 12, text: 'Makan buah-buahan dan sayur-sayuran yang bergizi tidak terlalu penting untuk kesehatan gigi dan mulut.' },
  { no: 13, text: 'Gigi yang kotor dan yang tidak di bersihkan akan menyebabkan gigi berlubang.' },
  { no: 14, text: 'Makan yang manis dan lengket menyebabkan gigi berlubang.' },
  { no: 15, text: 'Gigi berlubang hanya disebabkan oleh bakteri saja.' },
  { no: 16, text: 'Coklat dan permen adalah makanan yang merusak gigi.' },
  { no: 17, text: 'Sehabis minum dan makan-makanan yang manis sebaiknya langsung berkumur dengan air putih.' },
  { no: 18, text: 'Mengurangi makan-makanan yang manis dapat mengurangi terjadinya gigi berlubang.' },
  { no: 19, text: 'Minimal 6 bulan 1 Kali perlu kedokter gigi untuk kontrol gigi.' },
  { no: 20, text: 'Tidak perlu kedokter gigi bila gigi tidak sakit.' },
  { no: 21, text: 'Kita boleh mencabut sendiri gigi anak anak yang sudah goyang.' },
  { no: 22, text: 'Jika ada gigi yang berlubang sebaiknaya pergi ke dokter gigi untuk dilakukan perawatan tambal gigi.' },
  { no: 23, text: 'Kotoran di sekeliling gigi yang sudah keras tidak perlu dihilangkan karena akan membuat gigi menjadi kuat.' },
  { no: 24, text: 'Gigi anak tidak perlu dirawat atau pun di tambal karena akan diganti dengan gigi yang baru.' },
  { no: 25, text: 'Setiap gigi yang berlubang harus di cabut.' },
  { no: 26, text: 'Gigi berlubang dapat ditularkan oleh orang lain.' },
  { no: 27, text: 'Menggunakan tusuk gigi dapat merusak struktur gigi.' },
  { no: 28, text: 'Gigi berlubang akan sembuh sendiri tanpa ditambal.' },
  { no: 29, text: 'Gigi akan ngilu saat minum/kumur kumur dengan air dingin/es.' },
  { no: 30, text: 'Jika belum timbul rasa sakit gigi tidak perlu diobati.' },
  { no: 31, text: 'Boleh bertukar sikat gigi dengan orang lain/keluarga.' },
  { no: 32, text: 'Gigi dicabut ketika sakit.' },
  { no: 33, text: 'Membersihkan gigi dengan megunakan sikat gigi dan pasta gigi.' },
  { no: 34, text: 'Gigi yang berlubang akan terasa sakit apabila makan makanan yang panas dan dingin pada saat bersamaan.' },
  { no: 35, text: 'Menyikat gigi di seluruh permukaan gigi.' },
  { no: 36, text: 'Sikat gigi yang baik memiliki warna dan bentuk yang menarik.' },
  { no: 37, text: 'Sakit gigi disebabkan oleh malas menggosok gigi.' },
  { no: 38, text: 'Gusi merah, bengkak dan mudah berdarah karena terlalu keras menyikat gigi.' },
  { no: 39, text: 'Gigi yang sehat adalah gigi yang kuat dan tidak berlubang.' },
  { no: 40, text: 'Merokok mempengaruhi kesehatan gigi dan mulut.' },
];

const answerKey: Record<number, 'B' | 'S'> = {
  1:'B', 2:'S', 3:'B', 4:'B', 5:'S', 6:'B', 7:'B', 8:'B', 9:'B', 10:'S',
  11:'B', 12:'S', 13:'B', 14:'B', 15:'S', 16:'B', 17:'B', 18:'B', 19:'B', 20:'S',
  21:'S', 22:'B', 23:'S', 24:'S', 25:'S', 26:'S', 27:'B', 28:'S', 29:'S', 30:'S',
  31:'S', 32:'S', 33:'B', 34:'B', 35:'B', 36:'S', 37:'B', 38:'B', 39:'B', 40:'B',
};

function getCategory(score: number) {
  if (score >= 36) return { label: 'Sangat Baik', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', emoji: '🏆', desc: 'Pengetahuan Anda tentang kesehatan gigi dan mulut sangat baik! Pertahankan dan terus terapkan dalam kehidupan sehari-hari.' };
  if (score >= 28) return { label: 'Baik', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', emoji: '👍', desc: 'Pengetahuan Anda sudah baik. Ada beberapa hal yang masih perlu diperdalam — baca kembali materi yang belum dijawab dengan benar.' };
  if (score >= 20) return { label: 'Cukup', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', emoji: '📚', desc: 'Pengetahuan Anda cukup, namun masih banyak yang perlu dipelajari. Pelajari kembali materi kesehatan gigi dan mulut dengan saksama.' };
  return { label: 'Perlu Ditingkatkan', color: 'text-red-700', bg: 'bg-red-50 border-red-200', emoji: '💪', desc: 'Masih banyak konsep yang perlu dipahami. Jangan putus asa — pelajari semua materi dari awal dan coba lagi evaluasi ini.' };
}

export default function Evaluasi() {
  const [answers, setAnswers] = useState<Record<number, 'B' | 'S'>>({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score = submitted
    ? questions.reduce((acc, q) => acc + (answers[q.no] === answerKey[q.no] ? 1 : 0), 0)
    : 0;

  const category = submitted ? getCategory(score) : null;

  function handleSelect(no: number, val: 'B' | 'S') {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [no]: val }));
  }

  function handleSubmit() {
    if (answered < 40) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="pt-16 bg-gradient-to-br from-teal-600 to-cyan-700">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <ClipboardList size={14} />
            Evaluasi Pengetahuan
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Evaluasi Pengetahuan Orang Tua
          </h1>
          <p className="text-teal-100 max-w-xl mx-auto text-sm leading-relaxed">
            Uji pemahaman Anda tentang menjaga kebersihan gigi dan mulut pada anak. Berilah tanda <strong className="text-white">B</strong> jika pernyataan <strong className="text-white">Benar</strong> dan <strong className="text-white">S</strong> jika pernyataan <strong className="text-white">Salah</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Result card — shown after submission */}
        {submitted && category && (
          <div className={`rounded-3xl border-2 p-8 mb-8 text-center ${category.bg}`}>
            <div className="text-5xl mb-3">{category.emoji}</div>
            <p className="text-gray-500 text-sm mb-1">Skor Anda</p>
            <p className={`text-5xl font-black mb-1 ${category.color}`}>{score}<span className="text-2xl font-semibold">/40</span></p>
            <p className="text-gray-400 text-sm mb-3">{Math.round((score / 40) * 100)}%</p>
            <span className={`inline-block px-5 py-1.5 rounded-full text-sm font-semibold mb-4 ${category.color} bg-white/70 border ${category.bg}`}>
              {category.label}
            </span>
            <p className={`text-sm leading-relaxed max-w-lg mx-auto ${category.color}`}>{category.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} />
                Coba Lagi
              </button>
              <Link
                to="/#materi"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Pelajari Materi
              </Link>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!submitted && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center gap-4 shadow-sm">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progress</span>
                <span>{answered} / 40 dijawab</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${(answered / 40) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-teal-600 text-sm font-semibold flex-shrink-0">
              {Math.round((answered / 40) * 100)}%
            </div>
          </div>
        )}

        {/* Question table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="py-3.5 px-4 text-center w-12 font-semibold">NO</th>
                  <th className="py-3.5 px-4 text-left font-semibold">PERNYATAAN</th>
                  <th className="py-3.5 px-4 text-center w-16 font-semibold">B</th>
                  <th className="py-3.5 px-4 text-center w-16 font-semibold">S</th>
                  {submitted && <th className="py-3.5 px-4 text-center w-20 font-semibold">Hasil</th>}
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => {
                  const userAns = answers[q.no];
                  const correct = answerKey[q.no];
                  const isCorrect = submitted ? userAns === correct : null;
                  const rowBg = submitted
                    ? isCorrect
                      ? 'bg-emerald-50'
                      : 'bg-red-50'
                    : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';

                  return (
                    <tr key={q.no} className={`border-t border-gray-100 ${rowBg} transition-colors`}>
                      <td className="py-3 px-4 text-center text-gray-500 font-medium">{q.no}</td>
                      <td className="py-3 px-4 text-gray-700 leading-snug">{q.text}</td>

                      {/* B column */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleSelect(q.no, 'B')}
                          disabled={submitted}
                          className={`w-9 h-9 rounded-full border-2 font-bold text-sm transition-all ${
                            userAns === 'B'
                              ? submitted
                                ? isCorrect
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'bg-red-500 border-red-500 text-white'
                                : 'bg-teal-500 border-teal-500 text-white'
                              : 'border-gray-200 text-gray-400 hover:border-teal-300 hover:text-teal-500'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          B
                        </button>
                      </td>

                      {/* S column */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleSelect(q.no, 'S')}
                          disabled={submitted}
                          className={`w-9 h-9 rounded-full border-2 font-bold text-sm transition-all ${
                            userAns === 'S'
                              ? submitted
                                ? isCorrect
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'bg-red-500 border-red-500 text-white'
                                : 'bg-teal-500 border-teal-500 text-white'
                              : 'border-gray-200 text-gray-400 hover:border-teal-300 hover:text-teal-500'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          S
                        </button>
                      </td>

                      {/* Result column */}
                      {submitted && (
                        <td className="py-3 px-4 text-center">
                          {isCorrect ? (
                            <CheckCircle2 size={20} className="text-emerald-500 mx-auto" />
                          ) : (
                            <div className="flex flex-col items-center gap-0.5">
                              <XCircle size={20} className="text-red-500" />
                              <span className="text-xs text-gray-400">
                                Jwb: <strong className="text-gray-600">{correct}</strong>
                              </span>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score legend when submitted */}
        {submitted && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} className="text-teal-600" />
              <h3 className="text-gray-800 font-semibold text-sm">Kategori Penilaian</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { range: '36–40', label: 'Sangat Baik', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { range: '28–35', label: 'Baik', color: 'bg-teal-50 text-teal-700 border-teal-200' },
                { range: '20–27', label: 'Cukup', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { range: '< 20', label: 'Perlu Ditingkatkan', color: 'bg-red-50 text-red-700 border-red-200' },
              ].map((cat) => (
                <div key={cat.range} className={`rounded-xl border p-3 text-center ${cat.color}`}>
                  <p className="font-black text-lg">{cat.range}</p>
                  <p className="text-xs font-medium mt-0.5">{cat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit / Back buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-600 text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={answered < 40}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all ${
                answered === 40
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Award size={16} />
              {answered < 40 ? `Jawab ${40 - answered} Soal Lagi` : 'Lihat Skor Saya'}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw size={16} />
              Ulangi Evaluasi
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
