import { ArrowRight, BookOpen, Heart, Star, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { articles } from '../data/articles';

const tools = [
  {
    to: '/tools/timer',
    emoji: '⏱️',
    title: 'Timer Sikat Gigi',
    desc: '2 menit interaktif dengan panduan area per area. Jadikan sikat gigi lebih menyenangkan!',
    color: 'bg-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    to: '/games/ortu',
    emoji: '👨‍👩‍👧',
    title: 'Orang Tua Cerdas',
    desc: '8 skenario nyata tentang keputusan kesehatan gigi anak. Uji dan tingkatkan pengetahuan Anda!',
    color: 'bg-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    to: '/games/tts',
    emoji: '📝',
    title: 'TTS Gigi Sehat',
    desc: 'Teka-teki silang istilah kesehatan gigi yang edukatif. Belajar sambil bermain!',
    color: 'bg-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    to: '/games/ular-tangga',
    emoji: '🎲',
    title: 'Ular Tangga',
    desc: 'Permainan papan 2 pemain dengan fakta kesehatan gigi. Main bersama anak!',
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
];

const parentArticles = articles.filter(a => a.forParents).slice(0, 4);

const ageGroups = [
  { emoji: '👶', label: '0–2 Tahun', desc: 'Gigi bayi & ECC', color: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-700', articles: ['gigi-bayi', 'karies-botol'] },
  { emoji: '🧒', label: '3–5 Tahun', desc: 'Gigi susu & kebiasaan', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', articles: ['kunjungan-pertama-dokter', 'gigi-anak'] },
  { emoji: '🏫', label: '6–12 Tahun', desc: 'Masa transisi gigi', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', articles: ['gigi-anak-sekolah', 'tumbuh-gigi-anak'] },
  { emoji: '🤰', label: 'Ibu Hamil', desc: 'Gigi & kesehatan janin', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', articles: ['ibu-hamil-gigi'] },
];

export function ParentHub() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-orange-50/60 to-amber-50/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Heart size={14} />
            Khusus untuk Orang Tua
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Pusat Panduan <span className="text-orange-600">Orang Tua</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menjaga senyum sehat Si Kecil — dari bayi hingga remaja.
            Berbasis jurnal ilmiah, WHO, Kemenkes RI, dan AAPD.
          </p>
        </div>

        {/* Age Group Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {ageGroups.map((group) => (
            <Link
              key={group.label}
              to={`/materi/${group.articles[0]}`}
              className={`${group.color} border-2 rounded-2xl p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 group`}
            >
              <div className="text-3xl mb-2">{group.emoji}</div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${group.badge}`}>{group.label}</div>
              <p className="text-gray-600 text-xs">{group.desc}</p>
            </Link>
          ))}
        </div>

        {/* Parent Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
              📚 Materi untuk Orang Tua
              <span className="ml-2 text-sm text-gray-400 font-normal">Berdasarkan jurnal WHO, AAPD & Kemenkes RI</span>
            </h3>
            <Link to="/#materi" className="text-teal-600 text-sm hover:text-teal-700 flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {parentArticles.map(article => (
              <Link
                key={article.id}
                to={`/materi/${article.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{article.category}</span>
                  </div>
                  {article.forParents && (
                    <div className="absolute top-2 right-2 bg-white/90 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      👨‍👩‍👧 Orang Tua
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-gray-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors" style={{ fontWeight: 600 }}>
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star size={11} fill="currentColor" className="text-amber-400" />
                    <span>{article.rating}</span>
                    <span>·</span>
                    <BookOpen size={11} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Tools */}
        <div>
          <h3 className="text-gray-800 mb-6" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            🎮 Tools & Games Interaktif
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map(tool => (
              <Link
                key={tool.to}
                to={tool.to}
                className={`${tool.bg} border-2 ${tool.border} rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group`}
              >
                <div className="text-3xl mb-3">{tool.emoji}</div>
                <h4 className="text-gray-800 font-semibold text-sm mb-1.5">{tool.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{tool.desc}</p>
                <div className="flex items-center gap-1 text-teal-600 text-xs font-medium group-hover:gap-2 transition-all">
                  Mulai <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* WHO/Kemenkes stamp */}
        <div className="mt-10 flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-wrap">
          <Shield size={32} className="text-teal-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-semibold text-sm">Konten Berbasis Bukti Ilmiah</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Semua artikel di bagian Orang Tua dilengkapi referensi dari: WHO, Kementerian Kesehatan RI (Kemenkes), American Academy of Pediatric Dentistry (AAPD), Ikatan Dokter Gigi Anak Indonesia (IDGAI), dan jurnal kedokteran gigi terindeks internasional.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['WHO', 'Kemenkes RI', 'AAPD', 'IDGAI'].map(org => (
              <span key={org} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full font-medium border border-teal-200">{org}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}