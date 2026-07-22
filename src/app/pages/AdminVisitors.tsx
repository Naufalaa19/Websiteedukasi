import { useState } from 'react';
import {
  Users, Lock, Search, Download, RefreshCw,
  MapPin, Building2, Mail, Calendar, Shield, LogOut,
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Link } from 'react-router';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-be29dd90`;

interface Visitor {
  name: string;
  institution: string;
  city: string;
  email: string;
  visitedAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminVisitors() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_BASE}/visitors?password=${encodeURIComponent(password)}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password salah.');
      setVisitors(data.visitors || []);
      setLoggedIn(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(msg);
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/visitors?password=${encodeURIComponent(password)}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVisitors(data.visitors || []);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nama', 'Instansi', 'Kota', 'Email', 'Waktu Kunjungan'];
    const rows = filteredVisitors.map((v) => [
      v.name, v.institution, v.city, v.email, formatDate(v.visitedAt),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pengunjung-karanggigi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredVisitors = visitors.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.institution.toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q)
    );
  });

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 px-8 py-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={30} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">Admin KarangGigiEdu</h1>
              <p className="text-teal-100 text-sm mt-1">Panel Laporan Pengunjung</p>
            </div>

            <div className="px-8 py-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password Admin
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Masukkan password..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {loading && (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  )}
                  {loading ? 'Memuat...' : 'Masuk'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/" className="text-xs text-teal-600 hover:underline">
                  ← Kembali ke Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-teal-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">Panel Admin — KarangGigiEdu</h1>
              <p className="text-gray-400 text-xs">Data pengunjung website</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            >
              <Download size={13} />
              Export CSV
            </button>
            <button
              onClick={() => { setLoggedIn(false); setVisitors([]); setPassword(''); }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 px-2 py-2 rounded-xl text-xs transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs mb-1">Total Pengunjung</p>
            <p className="text-3xl font-bold text-teal-600">{visitors.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs mb-1">Kota Berbeda</p>
            <p className="text-3xl font-bold text-emerald-600">
              {new Set(visitors.map((v) => v.city.toLowerCase())).size}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-gray-400 text-xs mb-1">Pengunjung Terbaru</p>
            <p className="text-sm font-semibold text-gray-700 truncate">
              {visitors[0]?.name || '—'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {visitors[0] ? visitors[0].city : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, kota, atau instansi..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        {/* Table */}
        {filteredVisitors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada data pengunjung.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Instansi</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kota</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Waktu Kunjungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredVisitors.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{v.name}</td>
                      <td className="px-5 py-3.5 text-gray-500">{v.institution || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full">
                          <MapPin size={10} />
                          {v.city}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{v.email || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(v.visitedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredVisitors.map((v, i) => (
                <div key={i} className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                    <span className="text-gray-400 text-xs">#{i + 1}</span>
                  </div>
                  {v.institution && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Building2 size={11} /> {v.institution}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-teal-600 text-xs">
                    <MapPin size={11} /> {v.city}
                  </div>
                  {v.email && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Mail size={11} /> {v.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Calendar size={11} /> {formatDate(v.visitedAt)}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              Menampilkan {filteredVisitors.length} dari {visitors.length} pengunjung
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
