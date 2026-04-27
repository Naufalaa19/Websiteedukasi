import { AlertTriangle, Shield, Stethoscope, Sparkles, Droplets, Apple, Heart, Activity } from 'lucide-react';

const features = [
  {
    icon: Shield,
    color: 'bg-teal-50 text-teal-600',
    title: 'Pencegahan Karies Gigi',
    desc: 'Karies gigi dapat dicegah dengan menyikat gigi 2x sehari menggunakan pasta berfluoride, membatasi gula, dan melakukan pemeriksaan rutin.',
  },
  {
    icon: AlertTriangle,
    color: 'bg-amber-50 text-amber-600',
    title: 'Penyakit Gusi',
    desc: 'Gingivitis dan periodontitis disebabkan oleh plak yang menumpuk di garis gusi. Gusi merah, bengkak, dan berdarah adalah tanda peringatan awal.',
  },
  {
    icon: Stethoscope,
    color: 'bg-blue-50 text-blue-600',
    title: 'Perawatan Medis Gigi',
    desc: 'Scaling, tambal gigi, perawatan saluran akar, dan prosedur lainnya membantu mengatasi masalah gigi sebelum berkembang lebih serius.',
  },
  {
    icon: Sparkles,
    color: 'bg-purple-50 text-purple-600',
    title: 'Kebersihan Mulut Optimal',
    desc: 'Kombinasi sikat gigi, benang gigi, sikat lidah, dan obat kumur antiseptik menciptakan kebersihan mulut yang menyeluruh.',
  },
  {
    icon: Droplets,
    color: 'bg-cyan-50 text-cyan-600',
    title: 'Fluoride & Air Putih',
    desc: 'Air putih membantu membersihkan sisa makanan dan bakteri. Fluoride memperkuat email gigi dan mencegah demineralisasi.',
  },
  {
    icon: Apple,
    color: 'bg-green-50 text-green-600',
    title: 'Nutrisi untuk Gigi Sehat',
    desc: 'Kalsium, fosfor, dan vitamin D memperkuat gigi. Sayur dan buah segar merangsang produksi air liur yang melindungi gigi.',
  },
  {
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
    title: 'Gigi & Kesehatan Tubuh',
    desc: 'Kesehatan mulut yang buruk berhubungan dengan penyakit jantung, diabetes, dan komplikasi kehamilan. Jaga gigi = jaga tubuh.',
  },
  {
    icon: Activity,
    color: 'bg-orange-50 text-orange-600',
    title: 'Deteksi Dini Masalah Gigi',
    desc: 'Pemeriksaan rutin setiap 6 bulan membantu mendeteksi karies, keretakan, perubahan jaringan lunak, bahkan kanker mulut sejak dini.',
  },
];

export function Features() {
  return (
    <section id="fitur" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Informasi Penting
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Kenali Kesehatan Gigi & Mulut
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Pahami berbagai aspek penting kesehatan gigi dan mulut — dari pencegahan, perawatan,
            hingga hubungannya dengan kesehatan tubuh secara keseluruhan
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feat.icon size={22} />
              </div>
              <h3 className="text-gray-900 mb-2" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}