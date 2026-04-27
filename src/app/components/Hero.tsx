import { ChevronDown } from 'lucide-react';

const heroImage = "https://images.unsplash.com/photo-1763886034104-140f5d127102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBoZWFsdGglMjB0ZWV0aCUyMGNhcmV8ZW58MXx8fHwxNzc2NzczMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { value: '80%', label: 'Penduduk Indonesia menderita masalah gigi' },
  { value: '3x', label: 'Sikat gigi per hari yang dianjurkan' },
  { value: '6 Bln', label: 'Frekuensi periksa gigi ke dokter' },
  { value: '2 Mnt', label: 'Durasi ideal menyikat gigi' },
];

export function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Dental Health"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 text-teal-200 px-4 py-1.5 rounded-full text-sm mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            Portal Edukasi Kesehatan Gigi
          </div>

          <h1 className="text-white mb-6 leading-tight" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }}>
            Portal Edukasi{' '}
            <span className="text-teal-300">Kesehatan Gigi</span>{' '}
            & Mulut
          </h1>

          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Edukasi lengkap tentang kesehatan gigi dan mulut untuk masyarakat Indonesia.
            Pelajari cara menjaga kebersihan mulut, mencegah berbagai penyakit gigi,
            dan merawat gigi agar tetap sehat dan kuat sepanjang hidup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#materi"
              className="bg-teal-500 hover:bg-teal-400 text-white px-7 py-3.5 rounded-full text-center transition-all hover:shadow-lg hover:shadow-teal-500/30 font-medium"
            >
              Mulai Belajar
            </a>
            <a
              href="#tentang"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-7 py-3.5 rounded-full text-center backdrop-blur-sm transition-all"
            >
              Tentang Kami
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-teal-300 font-bold mb-1" style={{ fontSize: '1.75rem' }}>{stat.value}</div>
                <div className="text-teal-100 text-xs leading-snug">{stat.label}</div>
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