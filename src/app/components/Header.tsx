import { useState } from 'react';
import { Menu, X, Gamepad2, HelpCircle, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const homeHref = (hash: string) => isHome ? hash : `/${hash}`;

  const navLinks = [
    { label: 'Beranda', href: homeHref('#beranda'), isRoute: false },
    { label: 'Tentang', href: homeHref('#tentang'), isRoute: false },
    { label: 'Materi', href: homeHref('#materi'), isRoute: false },
    { label: 'Tips', href: homeHref('#tips'), isRoute: false },
    { label: 'Games', href: '/games', isRoute: true, icon: Gamepad2 },
    { label: 'Quiz', href: '/quiz', isRoute: true, icon: HelpCircle },
    { label: 'Komentar', href: '/komentar', isRoute: true, icon: MessageSquare },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 2C8 2 4 5 4 8c0 2 1 4 1 6s-1 4-1 6c0 1.5 1.5 2 3 2 1 0 2-.5 2.5-1.5L12 18l2.5 2.5C15 21.5 16 22 17 22c1.5 0 3-.5 3-2 0-2-1-4-1-6s1-4 1-6c0-3-4-6-8-6z"/>
              </svg>
            </div>
            <div>
              <span className="text-teal-700 font-bold text-lg leading-tight">Kesehatan Gigi</span>
              <span className="text-gray-500 text-xs block -mt-0.5">& Mulut</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(link.href)
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {link.icon && <link.icon size={14} />}
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm transition-colors hover:bg-teal-50"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={homeHref('#kontak')}
              className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm hover:bg-teal-700 transition-colors"
            >
              Konsultasi Gratis
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-teal-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(link.href)
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {link.icon && <link.icon size={14} />}
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href={homeHref('#kontak')}
              className="block bg-teal-600 text-white px-4 py-2 rounded-full text-sm text-center mt-3 hover:bg-teal-700 transition-colors"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}