import { useParams, Link } from 'react-router';
import { ArrowLeft, Clock, Calendar, BookOpen, Star, Share2, ChevronRight, PlayCircle } from 'lucide-react';
import { articles } from '../data/articles';
import type { ArticleSection } from '../data/articles';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function SectionBlock({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case 'heading':
      return (
        <h2 className="text-gray-900 mt-8 mb-3" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
          {section.text}
        </h2>
      );
    case 'subheading':
      return (
        <h3 className="text-gray-800 mt-6 mb-2" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
          {section.text}
        </h3>
      );
    case 'paragraph':
      return (
        <p className="text-gray-600 leading-relaxed mb-4">
          {section.text}
        </p>
      );
    case 'list':
      return (
        <ul className="space-y-2.5 mb-5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
              <span className="leading-relaxed text-sm">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'warning':
      return (
        <div className="my-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
            <p className="text-amber-800 text-sm leading-relaxed">{section.text}</p>
          </div>
        </div>
      );
    case 'tip':
      return (
        <div className="my-5 bg-teal-50 border-l-4 border-teal-400 rounded-r-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-teal-500 text-lg flex-shrink-0">💡</span>
            <p className="text-teal-800 text-sm leading-relaxed">{section.text}</p>
          </div>
        </div>
      );
    case 'video':
      return (
        <div className="my-6 rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-white">
          {section.videoId ? (
            <div className="relative aspect-video bg-gray-900">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${section.videoId}`}
                title={section.videoTitle || 'Video edukasi kesehatan gigi'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-red-500 via-rose-500 to-red-700 h-44 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <PlayCircle size={52} className="text-white drop-shadow-lg" />
              <p className="text-white font-semibold text-base leading-snug drop-shadow max-w-sm">{section.videoTitle}</p>
            </div>
          )}
          <div className="p-4 bg-gray-50">
            <p className="text-gray-800 font-semibold text-sm mb-1">{section.videoTitle}</p>
            <p className="text-gray-500 text-sm">{section.videoDesc}</p>
          </div>
        </div>
      );
    case 'table':
      return (
        <div className="my-5 overflow-hidden rounded-2xl border border-gray-100">
          {section.rows?.map((row, i) => (
            <div key={row.label} className={`grid sm:grid-cols-[180px_1fr] gap-2 p-4 text-sm ${i % 2 === 0 ? 'bg-teal-50/50' : 'bg-white'}`}>
              <div className="font-semibold text-teal-800">{row.label}</div>
              <div className="text-gray-600 leading-relaxed">{row.value}</div>
            </div>
          ))}
        </div>
      );
    case 'sources':
      return (
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-gray-500" />
            <h3 className="text-gray-700 text-sm" style={{ fontWeight: 700 }}>Referensi & Sumber Ilmiah</h3>
          </div>
          <ol className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);
  const relatedArticles = articles.filter((a) => a.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🦷</div>
          <h2 className="text-gray-800 mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Materi Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-6">Artikel yang Anda cari tidak tersedia.</p>
          <Link
            to="/"
            className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="relative pt-16 h-72 md:h-96 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full font-medium mb-3 inline-block">
              {article.category}
            </span>
            <h1 className="text-white leading-tight" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 700 }}>
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-teal-600 transition-colors">Beranda</Link>
          <ChevronRight size={14} />
          <Link to="/#materi" className="hover:text-teal-600 transition-colors">Materi</Link>
          <ChevronRight size={14} />
          <span className="text-teal-600 truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article body */}
          <div className="lg:col-span-2">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-teal-500" />
                <span>{article.readTime} baca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-teal-500" />
                <span>{article.publishDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-teal-500" />
                <span>{article.readers} pembaca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-500" fill="currentColor" />
                <span>{article.rating}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-teal-700 bg-teal-50 rounded-2xl p-5 mb-6 text-sm leading-relaxed border border-teal-100">
              {article.description}
            </p>

            {/* Article sections */}
            <div className="prose-content">
              {article.content.map((section, i) => (
                <SectionBlock key={i} section={section} />
              ))}
            </div>

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-700 text-sm font-medium mb-1">Bagikan artikel ini:</p>
                <p className="text-gray-400 text-xs">Bantu sebarkan informasi kesehatan gigi</p>
              </div>
              <button className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-5 py-2.5 rounded-full text-sm transition-colors">
                <Share2 size={14} />
                Bagikan
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related articles */}
            <div>
              <h3 className="text-gray-800 mb-4" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                Materi Lainnya
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/materi/${rel.id}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:opacity-90 transition-opacity"
                    />
                    <div>
                      <span className="text-teal-600 text-xs font-medium">{rel.category}</span>
                      <p className="text-gray-700 text-xs leading-snug group-hover:text-teal-600 transition-colors line-clamp-3 mt-0.5">
                        {rel.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-teal-600 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">🦷</div>
              <p className="font-semibold text-sm mb-1">Ada pertanyaan tentang gigi Anda?</p>
              <p className="text-teal-100 text-xs mb-4">Konsultasikan dengan tim dokter gigi kami secara gratis.</p>
              <Link
                to="/#kontak"
                className="block bg-white text-teal-700 text-center py-2 rounded-xl text-xs font-semibold hover:bg-teal-50 transition-colors"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}