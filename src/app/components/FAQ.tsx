import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Apa itu karies gigi dan bagaimana cara mencegahnya?',
    a: 'Karies gigi (gigi berlubang) adalah kerusakan pada email dan dentin gigi akibat aktivitas bakteri Streptococcus mutans yang mengubah gula menjadi asam. Cara mencegahnya: sikat gigi 2x sehari dengan pasta berfluoride, kurangi konsumsi gula, gunakan benang gigi, dan periksa rutin ke dokter gigi setiap 6 bulan.',
  },
  {
    q: 'Apa bahaya karang gigi jika dibiarkan?',
    a: 'Karang gigi yang dibiarkan dapat menyebabkan radang gusi (gingivitis), periodontitis, bau mulut kronis, gigi goyang, hingga kehilangan gigi. Bakteri dari karang gigi juga dikaitkan dengan peningkatan risiko penyakit jantung, diabetes tidak terkontrol, dan komplikasi kehamilan.',
  },
  {
    q: 'Seberapa sering harus ke dokter gigi untuk scaling?',
    a: 'Dianjurkan melakukan scaling setiap 6 bulan sekali. Bagi penderita diabetes, perokok, atau yang memiliki riwayat penyakit gusi, scaling mungkin perlu dilakukan lebih sering yaitu setiap 3-4 bulan sesuai rekomendasi dokter gigi.',
  },
  {
    q: 'Apa perbedaan gingivitis dan periodontitis?',
    a: 'Gingivitis adalah peradangan gusi yang ringan dan reversibel — ditandai gusi merah, bengkak, dan mudah berdarah, tetapi belum merusak tulang. Periodontitis adalah tahap lanjut yang sudah merusak tulang dan jaringan pendukung gigi, bersifat ireversibel, dan bisa menyebabkan gigi goyang.',
  },
  {
    q: 'Apakah pasta gigi khusus bisa mengatasi gigi sensitif?',
    a: 'Ya, pasta gigi sensitif yang mengandung potassium nitrate atau stannous fluoride dapat membantu mengurangi rasa ngilu dengan menutup tubulus dentin. Namun hasilnya bertahap — gunakan secara konsisten minimal 4-6 minggu. Untuk kasus berat, konsultasikan ke dokter gigi untuk perawatan fluoride varnish atau bonding.',
  },
  {
    q: 'Bagaimana cara mengajarkan anak untuk rajin sikat gigi?',
    a: 'Jadikan sikat gigi menjadi rutinitas menyenangkan: gunakan pasta gigi rasa buah, sikat bergambar karakter favorit, nyanyikan lagu selama 2 menit sikat gigi, dan lakukan bersama seluruh keluarga. Berikan pujian atau stiker reward. Ingat, mulailah sejak gigi pertama tumbuh (~6 bulan)!',
  },
  {
    q: 'Apakah baking soda aman untuk memutihkan gigi di rumah?',
    a: 'Baking soda dapat membantu menghilangkan noda permukaan gigi karena bersifat abrasif ringan. Namun penggunaan berlebihan dapat merusak email gigi. Untuk pemutihan yang aman dan efektif, sebaiknya konsultasikan ke dokter gigi tentang pilihan bleaching profesional yang sudah teruji klinis.',
  },
  {
    q: 'Apakah ada hubungan antara kesehatan gigi dan penyakit jantung?',
    a: 'Ya! Penelitian menunjukkan bahwa bakteri penyebab periodontitis dapat masuk ke aliran darah dan menyebabkan inflamasi pada pembuluh darah, meningkatkan risiko penyakit jantung koroner, stroke, dan endokarditis. Menjaga kesehatan gigi dan mulut adalah bagian dari menjaga kesehatan jantung.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Pertanyaan Umum
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            FAQ Kesehatan Gigi & Mulut
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Jawaban atas pertanyaan yang paling sering ditanyakan seputar kesehatan gigi, mulut, dan cara perawatannya
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'border-teal-200 shadow-sm' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800 pr-4" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-teal-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}