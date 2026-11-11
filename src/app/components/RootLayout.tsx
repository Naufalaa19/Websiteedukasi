import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { ScrollToTop } from './ScrollToTop';
import { AuthProvider, useAuth } from '../lib/auth';

function Gate() {
  const { user, ready, hasPretest } = useAuth();
  const { pathname } = useLocation();
  const isPopup = typeof window !== 'undefined' && !!window.opener && window.opener !== window;

  // Jendela popup login Google menutup dirinya sendiri setelah sesi tersimpan
  useEffect(() => {
    if (isPopup && user && pathname === '/login') window.close();
  }, [isPopup, user, pathname]);

  if (pathname.startsWith('/admin')) return <Outlet />;
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }
  if (!user) return pathname === '/login' ? <Outlet /> : <Navigate to="/login" replace />;
  if (pathname === '/login' && isPopup) return <div className="min-h-screen flex items-center justify-center text-teal-700">Berhasil masuk. Jendela ini akan tertutup…</div>;
  if (pathname === '/login') return <Navigate to={hasPretest ? '/' : '/pretest'} replace />;
  if (!hasPretest && pathname !== '/pretest') return <Navigate to="/pretest" replace />;
  return <Outlet />;
}

export function RootLayout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Gate />
    </AuthProvider>
  );
}
