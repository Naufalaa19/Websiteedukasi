import { CheckCircle, Target, Eye, Heart, Shield, Activity } from 'lucide-react';

const aboutImage = "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwZG9jdG9yJTIwc21pbGV8ZW58MXx8fHwxNzc2NzczMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080";

const points = [
  'Edukasi pencegahan karies, radang gusi, dan penyakit mulut lainnya',
  'Informasi berbasis ilmu kedokteran gigi terkini dan terpercaya',
  'Tips praktis perawatan gigi dan mulut sehari-hari',
  'Panduan pola makan sehat untuk menjaga kesehatan gigi',
  'Penjelasan kapan dan mengapa harus ke dokter gigi',
  'Konten mudah dipahami oleh semua kalangan usia',
];

export function About() {
  return (
    <section id="tentang" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={aboutImage}
                alt="Dokter Gigi"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-800" style={{ fontSize: '1.25rem' }}>5.000+</div>
                  <div className="text-gray-500 text-xs">Pengunjung Aktif</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Membantu masyarakat sadar kesehatan gigi</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Tentang Kesehatan Gigi & Mulut
            </div>
            <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3 }}>
              Mengapa Kesehatan Gigi & Mulut{' '}
              <span className="text-teal-600">Sangat Penting?</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Kesehatan gigi dan mulut adalah cerminan kesehatan tubuh secara keseluruhan.
              Mulut adalah pintu gerbang tubuh — kondisi gigi dan jaringan di sekitarnya
              berdampak langsung pada kemampuan makan, berbicara, dan kepercayaan diri kita setiap hari.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Data WHO menyebutkan bahwa <strong>3,5 miliar orang</strong> di dunia menderita penyakit mulut,
              dan lebih dari 80% penduduk Indonesia mengalami masalah gigi. Penyakit seperti karies,
              gingivitis, periodontitis, dan bau mulut bukan hanya masalah estetika — penelitian membuktikan
              hubungan eratnya dengan penyakit jantung, diabetes, dan komplikasi kehamilan.
              Dengan edukasi yang tepat, semua ini <em>bisa dicegah</em>.
            </p>

            {/* Points */}
            <ul className="space-y-3 mb-8">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{point}</span>
                </li>
              ))}
            </ul>

            {/* Vision Mission */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-800 text-sm">Misi Kami</span>
                </div>
                <p className="text-teal-700 text-xs leading-relaxed">
                  Menyebarkan edukasi kesehatan gigi dan mulut yang akurat, lengkap, dan mudah dipahami oleh seluruh lapisan masyarakat Indonesia.
                </p>
              </div>
              <div className="bg-cyan-50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-cyan-600" />
                  <span className="font-semibold text-cyan-800 text-sm">Visi Kami</span>
                </div>
                <p className="text-cyan-700 text-xs leading-relaxed">
                  Mewujudkan masyarakat Indonesia yang sadar akan kesehatan gigi dan mulut demi kualitas hidup yang lebih baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}