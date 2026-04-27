import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Features } from '../components/Features';
import { Tips } from '../components/Tips';
import { Gallery } from '../components/Gallery';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { CourseCard } from '../components/CourseCard';
import { WHOStandards } from '../components/WHOStandards';
import { articles } from '../data/articles';
import { Gamepad2, HelpCircle, MessageSquare, ChevronRight } from 'lucide-react';

const interactiveFeatures = [
  {
    to: '/games',
    icon: Gamepad2,
    emoji: '🎮',
    title: 'Games Edukatif',
    desc: '5 game interaktif: Sikat Gigi, Pilah Makanan, Cocokkan Masalah, TTS, dan Ular Tangga! Belajar sambil bermain!',
    color: 'from-teal-400 to-cyan-500',
    btnColor: 'bg-teal-600 hover:bg-teal-700',
    badge: '5 Game',
  },
  {
    to: '/quiz',
    icon: HelpCircle,
    emoji: '❓',
    title: 'Quiz Pengetahuan',
    desc: '15 soal pilihan ganda komprehensif tentang kesehatan gigi & mulut. Ukur seberapa jauh pemahamanmu!',
    color: 'from-indigo-400 to-purple-500',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700',
    badge: '15 Soal',
  },
  {
    to: '/komentar',
    icon: MessageSquare,
    emoji: '💬',
    title: 'Papan Komentar',
    desc: 'Papan diskusi interaktif ala Padlet. Bagikan pengalaman, tips, atau tanyakan sesuatu kepada komunitas!',
    color: 'from-pink-400 to-rose-500',
    btnColor: 'bg-pink-600 hover:bg-pink-700',
    badge: 'Komunitas',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <About />

      {/* Interactive Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Fitur Interaktif
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
              Belajar dengan Cara yang Menyenangkan
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Lebih dari sekedar membaca — uji pengetahuan, mainkan game, dan berdiskusi bersama komunitas!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {interactiveFeatures.map((feat) => (
              <Link key={feat.to} to={feat.to} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`h-36 bg-gradient-to-br ${feat.color} flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">{feat.emoji}</span>
                  <span className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">{feat.badge}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 group-hover:text-teal-600 transition-colors" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {feat.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{feat.desc}</p>
                  <div className={`inline-flex items-center gap-2 ${feat.btnColor} text-white text-sm px-5 py-2.5 rounded-full transition-colors`}>
                    Mulai <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Materi Section */}
      <section id="materi" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Materi Edukasi
            </div>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
              Artikel & Materi Kesehatan Gigi
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Kumpulan artikel dan panduan lengkap tentang kesehatan gigi dan mulut yang ditulis oleh dokter gigi berpengalaman
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} to={`/materi/${article.id}`} className="block">
                <CourseCard
                  title={article.title}
                  description={article.description}
                  author={article.author}
                  readers={article.readers}
                  rating={article.rating}
                  category={article.category}
                  image={article.image}
                  isFree={article.isFree}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <WHOStandards />
      <Tips />
      <Gallery />

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></span>
            Mulai Perjalanan Sehat Anda
          </div>
          <h2 className="text-white mb-4" style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.3 }}>
            Jadikan Kesehatan Gigi<br />Prioritas Anda Sekarang
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan masyarakat Indonesia yang telah sadar akan pentingnya
            kesehatan gigi. Mulai dengan langkah kecil, hasilkan perubahan besar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz" className="bg-white text-teal-700 px-8 py-3.5 rounded-full hover:bg-teal-50 transition-all font-medium text-base shadow-lg">
              Ikuti Quiz Sekarang
            </Link>
            <Link to="/games" className="border-2 border-white/50 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-all text-base">
              Main Game Edukatif
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
}