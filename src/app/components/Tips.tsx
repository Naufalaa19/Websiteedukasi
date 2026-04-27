const tipsImage = "https://images.unsplash.com/photo-1593010997923-65947b08b772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b290aGJydXNoJTIwdG9vdGhwYXN0ZSUyMGh5Z2llbmV8ZW58MXx8fHwxNzc2NzczMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080";

const tips = [
  {
    step: '01',
    title: 'Sikat Gigi dengan Benar',
    desc: 'Sikat gigi selama 2 menit dengan gerakan melingkar. Jangan lupa bagian belakang gigi dan garis gusi.',
    color: 'border-teal-400 bg-teal-50',
    textColor: 'text-teal-700',
    numColor: 'text-teal-400',
  },
  {
    step: '02',
    title: 'Gunakan Benang Gigi',
    desc: 'Flossing setiap hari untuk membersihkan sela-sela gigi yang tidak bisa dijangkau sikat gigi.',
    color: 'border-blue-400 bg-blue-50',
    textColor: 'text-blue-700',
    numColor: 'text-blue-400',
  },
  {
    step: '03',
    title: 'Kurangi Makanan Manis',
    desc: 'Bakteri dalam mulut mengonsumsi gula dan menghasilkan asam yang merusak email gigi dan membentuk plak.',
    color: 'border-amber-400 bg-amber-50',
    textColor: 'text-amber-700',
    numColor: 'text-amber-400',
  },
  {
    step: '04',
    title: 'Minum Air Putih',
    desc: 'Air membantu membilas sisa makanan dan menjaga air liur yang berfungsi sebagai pelindung alami gigi.',
    color: 'border-cyan-400 bg-cyan-50',
    textColor: 'text-cyan-700',
    numColor: 'text-cyan-400',
  },
  {
    step: '05',
    title: 'Rutin ke Dokter Gigi',
    desc: 'Periksa gigi setiap 6 bulan untuk deteksi dini masalah gigi dan pembersihan karang secara profesional.',
    color: 'border-green-400 bg-green-50',
    textColor: 'text-green-700',
    numColor: 'text-green-400',
  },
  {
    step: '06',
    title: 'Hindari Merokok',
    desc: 'Rokok mempercepat pembentukan karang gigi, menyebabkan bau mulut, dan meningkatkan risiko kanker mulut.',
    color: 'border-red-400 bg-red-50',
    textColor: 'text-red-700',
    numColor: 'text-red-400',
  },
];

export function Tips() {
  return (
    <section id="tips" className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Tips Praktis
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Tips Menjaga Kesehatan Gigi
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Kebiasaan sederhana ini dapat mencegah karang gigi dan menjaga senyum Anda tetap indah
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Tips Grid */}
          <div className="grid sm:grid-cols-2 gap-4 order-2 lg:order-1">
            {tips.map((tip, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border-l-4 ${tip.color} hover:shadow-md transition-all duration-300`}
              >
                <div className={`font-black mb-2 ${tip.numColor}`} style={{ fontSize: '2rem', lineHeight: 1 }}>
                  {tip.step}
                </div>
                <h3 className={`mb-1 ${tip.textColor}`} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {tip.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={tipsImage}
                alt="Tips Kesehatan Gigi"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5">
                  <p className="text-teal-800 text-sm font-semibold mb-1">💡 Tahukah Anda?</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Menyikat gigi setelah makan sebaiknya dilakukan 30 menit kemudian,
                    karena langsung menyikat dapat merusak email gigi yang sedang lunak
                    akibat asam makanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
