import { BookOpen, Users, Star } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  author: string;
  readers: string;
  rating: number;
  category: string;
  image: string;
  isFree?: boolean;
}

export function CourseCard({ title, description, author, readers, rating, category, image, isFree }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1 cursor-pointer h-full">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            {category}
          </span>
          {isFree && (
            <span className="bg-amber-400 text-white text-xs px-3 py-1 rounded-full font-medium">
              Gratis
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2" style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{readers} pembaca</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-gray-600">{rating}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 bg-teal-50 group-hover:bg-teal-600 group-hover:text-white text-teal-700 py-2.5 rounded-xl text-sm font-medium transition-all duration-300">
          Baca Materi →
        </div>
      </div>
    </div>
  );
}