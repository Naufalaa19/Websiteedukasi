import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router';

const quickLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Materi Edukasi', href: '/#materi' },
  { label: 'Games Gigi', href: '/games' },
  { label: 'Quiz Kesehatan', href: '/quiz' },
  { label: 'Papan Komentar', href: '/komentar' },
  { label: 'FAQ', href: '/#faq' },
];

const materials = [
  'Karies & Gigi Berlubang',
  'Gingivitis & Periodontitis',
  'Karang Gigi & Scaling',
  'Gigi Sensitif',
  'Kesehatan Gigi Anak',
  'Nutrisi & Kesehatan Gigi',
];

export function Footer() {
  return (
    <footer id="kontak" className="bg-gray-900 text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2C8 2 4 5 4 8c0 2 1 4 1 6s-1 4-1 6c0 1.5 1.5 2 3 2 1 0 2-.5 2.5-1.5L12 18l2.5 2.5C15 21.5 16 22 17 22c1.5 0 3-.5 3-2 0-2-1-4-1-6s1-4 1-6c0-3-4-6-8-6z"/>
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-tight block">Kesehatan Gigi</span>
                <span className="text-gray-400 text-xs">& Mulut</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Portal edukasi kesehatan gigi dan mulut terpercaya untuk masyarakat Indonesia.
              Kami berkomitmen menyebarkan informasi yang akurat dan mudah dipahami.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Topik Materi
            </h3>
            <ul className="space-y-2.5">
              {materials.map((m) => (
                <li key={m}>
                  <Link
                    to="/#materi"
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Kontak Kami
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Komplek Manglayang Regency</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-teal-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">085721574807</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-teal-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">naufal06102003@gmail.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-gray-300 text-sm mb-3">
                Dapatkan tips gigi sehat di email Anda:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0">
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm text-center">
            © 2025 KarangGigiEdu. Semua hak dilindungi.
          </p>
          <p className="text-gray-600 text-xs text-center">
            Informasi di website ini bersifat edukatif dan bukan pengganti konsultasi dokter gigi.
          </p>
        </div>
      </div>
    </footer>
  );
}