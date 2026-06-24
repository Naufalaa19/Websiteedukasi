import { ChevronDown, Heart } from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1738747727751-5f3df6f75785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHBhcmVudCUyMGNoaWxkJTIwc21pbGluZyUyMHRlZXRofGVufDF8fHx8MTc3Nzk3NjE2NXww&ixlib=rb-4.1.0&q=80&w=1080';

const stats = [
  { value: '93%', label: 'Anak 3-5 tahun di Indonesia alami karies', source: 'Riskesdas 2018' },
  { value: '2 Mnt', label: 'Durasi ideal sikat gigi per sesi', source: 'WHO 2022' },
  { value: '6 Bln', label: 'Frekuensi periksa gigi ke dokter', source: 'AAPD 2023' },
  { value: '16+', label: 'Materi & panduan untuk orang tua', source: 'Berbasis jurnal' },
];

export function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Keluarga Sehat Gigi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/92 via-teal-800/75 to-transparent" />
      </div>

      {/* Warm overlay accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-teal-950/30" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          {/* Parent badge */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-200 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
              <Heart size={13} />
              Untuk Orang Tua & Keluarga
            </div>
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 text-teal-200 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Portal Edukasi Kesehatan Gigi
            </div>
          </div>

          <h1 className="text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15 }}>
            Lindungi Senyum{' '}
            <span className="text-orange-300">Si Kecil</span>{' '}
            Mulai dari{' '}
            <span className="text-teal-300">Hari Ini</span>
          </h1>

          <p className="text-teal-100 text-lg mb-4 leading-relaxed">
            Portal edukasi kesehatan gigi dan mulut untuk <strong className="text-white">orang tua dan keluarga Indonesia</strong>.
            Panduan berbasis jurnal ilmiah, WHO, Kemenkes RI, dan AAPD — mulai dari merawat gigi bayi hingga strategi anak usia sekolah.
          </p>

          <p className="text-teal-200/80 text-sm mb-8">
            🦷 Gigi sehat anak dimulai dari pengetahuan orang tua yang tepat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#materi"
              className="bg-orange-500 hover:bg-orange-400 text-white px-7 py-3.5 rounded-full text-center transition-all hover:shadow-lg hover:shadow-orange-500/30 font-medium"
            >
              Panduan untuk Orang Tua
            </a>
            <a
              href="#tentang"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-7 py-3.5 rounded-full text-center backdrop-blur-sm transition-all"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-orange-300 font-black mb-1" style={{ fontSize: '1.6rem' }}>{stat.value}</div>
                <div className="text-teal-100 text-xs leading-snug mb-1">{stat.label}</div>
                <div className="text-teal-300/60 text-xs">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#tentang"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white flex flex-col items-center gap-1 transition-colors"
      >
        <span className="text-xs">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
