import { ArrowRight, Clock, Tag } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  color: string;
}

export function ArticleCard({ title, excerpt, category, readTime, image, color }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 ${color} opacity-30`} />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-teal-700 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
            <Tag size={10} />
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-gray-900 mb-2 group-hover:text-teal-600 transition-colors" style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 }}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Clock size={12} />
            <span>{readTime} baca</span>
          </div>
          <button className="flex items-center gap-1 text-teal-600 text-xs font-medium hover:gap-2 transition-all">
            Baca Selengkapnya
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
