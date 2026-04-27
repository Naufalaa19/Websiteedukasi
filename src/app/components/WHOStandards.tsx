import { Shield, Award, Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

const guidelines = [
  {
    org: 'WHO',
    orgFull: 'World Health Organization',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-700',
    items: [
      { icon: Clock, text: 'Sikat gigi minimal 2 menit, 2× sehari (pagi & malam)' },
      { icon: Shield, text: 'Gunakan pasta gigi mengandung fluoride (1000–1500 ppm)' },
      { icon: CheckCircle2, text: 'Bersihkan sela gigi dengan benang gigi setiap hari' },
      { icon: BookOpen, text: 'Batasi konsumsi gula bebas < 10% dari total energi harian' },
      { icon: Award, text: 'Periksa dokter gigi minimal setiap 6 bulan sekali' },
    ],
  },
  {
    org: 'Kemenkes RI',
    orgFull: 'Kementerian Kesehatan Republik Indonesia',
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-100 text-red-700',
    items: [
      { icon: Clock, text: 'Gosok gigi setelah sarapan pagi dan sebelum tidur malam' },
      { icon: Shield, text: 'Konsumsi air putih berfluoride sesuai standar air minum' },
      { icon: CheckCircle2, text: 'Hindari kebiasaan merokok yang merusak gusi dan gigi' },
      { icon: BookOpen, text: 'Edukasi anak menyikat gigi sejak gigi susu pertama tumbuh' },
      { icon: Award, text: 'Manfaatkan BPJS untuk pemeriksaan & scaling gigi gratis' },
    ],
  },
];

const stats = [
  { value: '80%', label: 'Penduduk Indonesia alami masalah gigi', source: 'RISKESDAS 2018' },
  { value: '3,5 M', label: 'Orang di dunia menderita penyakit mulut', source: 'WHO 2022' },
  { value: '93%', label: 'Kasus karies bisa dicegah dengan edukasi', source: 'Kemenkes RI' },
  { value: '6 Bln', label: 'Interval ideal periksa dokter gigi', source: 'Standar Internasional' },
];

export function WHOStandards() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Shield size={14} />
            Standar Internasional
          </div>
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Panduan Berdasarkan Standar{' '}
            <span className="text-blue-600">WHO & Kemenkes</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Seluruh konten edukasi di website ini mengacu pada pedoman resmi WHO dan
            Kementerian Kesehatan Republik Indonesia untuk memastikan akurasi informasi.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div className="text-gray-900 mb-1" style={{ fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
              <p className="text-gray-600 text-sm leading-snug mb-2">{s.label}</p>
              <span className="text-gray-400 text-xs bg-gray-50 px-2 py-0.5 rounded-full">{s.source}</span>
            </div>
          ))}
        </div>

        {/* Guidelines */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {guidelines.map((g) => (
            <div key={g.org} className={`${g.bgLight} border ${g.border} rounded-3xl overflow-hidden`}>
              <div className={`bg-gradient-to-r ${g.color} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{g.org}</div>
                    <div className="text-white/80 text-xs">{g.orgFull}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {g.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg ${g.badgeColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <item.icon size={14} />
                    </div>
                    <p className={`${g.textColor} text-sm leading-relaxed`}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-semibold mb-1">Catatan Penting</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              Informasi di website ini bersifat edukatif dan merupakan pengetahuan umum berdasarkan standar WHO dan Kemenkes RI.
              Untuk kondisi kesehatan gigi yang spesifik, selalu konsultasikan dengan <strong>dokter gigi berlisensi</strong>.
              Jangan menunda kunjungan ke dokter gigi jika mengalami nyeri, pembengkakan, atau gejala serius lainnya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
