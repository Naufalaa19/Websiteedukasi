const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc21pbGUlMjB3aGl0ZSUyMHRlZXRofGVufDF8fHx8MTc3Njc3MzAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Senyum Sehat & Percaya Diri",
    span: "col-span-2 row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1758205308181-d52b41e00cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjaGVja3VwJTIwY2xpbmljfGVufDF8fHx8MTc3Njc3MzAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Pemeriksaan Gigi Rutin",
    span: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1619642532128-30519b11291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMGJydXNoaW5nJTIwdGVldGh8ZW58MXx8fHwxNzc2NzczMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Ajarkan Anak Sikat Gigi",
    span: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwZG9jdG9yJTIwc21pbGV8ZW58MXx8fHwxNzc2NzczMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Konsultasi dengan Dokter Gigi",
    span: "col-span-2 row-span-1",
  },
];

export function Gallery() {
  return (
    <section id="galeri" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Galeri
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Galeri Kesehatan Gigi
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Dokumentasi kegiatan edukasi dan informasi visual seputar kesehatan gigi dan mulut
          </p>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`${img.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
