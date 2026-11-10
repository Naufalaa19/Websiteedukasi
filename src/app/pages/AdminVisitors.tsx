import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Users, Lock, Search, Download, RefreshCw, Shield, LogOut, ClipboardCheck, LogIn, TrendingUp, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Score { score: number; total: number; at: string }
interface Row {
  id: string; name: string; email: string; institution?: string; city?: string;
  registeredAt: string; loginCount: number; lastLogin: string | null;
  pretest: Score | null; posttest: Score | null; posttestAttempts: number;
}
interface LoginEntry { name: string; email: string; at: string; provider?: string; isRegister?: boolean }

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const cat = (s: number) => (s >= 36 ? 'Sangat Baik' : s >= 28 ? 'Baik' : s >= 20 ? 'Cukup' : 'Perlu Ditingkatkan');

export default function AdminVisitors() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [log, setLog] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'nilai' | 'login'>('nilai');

  async function load(pw = password) {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase.rpc('admin_report', { p_password: pw });
      if (err) throw new Error(/Password admin salah/.test(err.message) ? 'Password admin salah.' : /admin_report|schema cache/.test(err.message) ? 'Fungsi admin_report belum dibuat. Jalankan supabase/schema.sql di SQL Editor.' : err.message);
      const d = data as { rows: Row[]; loginLog: LoginEntry[] };
      setRows(d.rows || []);
      setLog(d.loginLog || []);
      setAuthed(true);
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => [r.name, r.email, r.institution, r.city].some((v) => (v || '').toLowerCase().includes(q)));
  }, [rows, search]);

  const stats = useMemo(() => {
    const both = rows.filter((r) => r.pretest && r.posttest);
    const avg = (xs: number[]) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : '—');
    return {
      total: rows.length,
      pre: rows.filter((r) => r.pretest).length,
      post: rows.filter((r) => r.posttest).length,
      avgPre: avg(rows.filter((r) => r.pretest).map((r) => r.pretest!.score)),
      avgPost: avg(rows.filter((r) => r.posttest).map((r) => r.posttest!.score)),
      avgGain: avg(both.map((r) => r.posttest!.score - r.pretest!.score)),
    };
  }, [rows]);

  function exportCSV() {
    const head = ['No', 'Nama', 'Email', 'Instansi', 'Kota', 'Terdaftar', 'Jumlah Login', 'Login Terakhir', 'Nilai Pretest', 'Waktu Pretest', 'Nilai Posttest', 'Waktu Posttest', 'Selisih', 'Kategori Posttest'];
    const body = filtered.map((r, i) => [
      i + 1, r.name, r.email, r.institution || '', r.city || '', fmt(r.registeredAt), r.loginCount, fmt(r.lastLogin),
      r.pretest?.score ?? '', fmt(r.pretest?.at), r.posttest?.score ?? '', fmt(r.posttest?.at),
      r.pretest && r.posttest ? r.posttest.score - r.pretest.score : '', r.posttest ? cat(r.posttest.score) : '',
    ]);
    const csv = '\ufeff' + [head, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = `nilai-responden-karanggigi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 px-8 py-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield size={30} /></div>
            <h1 className="text-xl font-bold">Panel Peneliti</h1>
            <p className="text-teal-100 text-sm mt-1">Login responden & nilai pretest/posttest</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="px-8 py-6 space-y-4">
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Password admin"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button disabled={loading || !password} className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white py-2.5 rounded-xl font-semibold text-sm">
              {loading ? 'Memuat…' : 'Masuk'}
            </button>
            <div className="text-center"><Link to="/" className="text-xs text-teal-600 hover:underline">← Kembali ke Website</Link></div>
          </form>
        </div>
      </div>
    );
  }

  const th = 'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap';
  const Badge = ({ s }: { s: Score | null }) =>
    s ? (
      <div>
        <span className="font-bold text-gray-800 text-base">{s.score}</span><span className="text-gray-400 text-xs">/{s.total}</span>
        <p className="text-[11px] text-gray-400 whitespace-nowrap">{fmt(s.at)}</p>
      </div>
    ) : <span className="text-gray-300 text-xs">belum</span>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center"><ClipboardCheck size={18} className="text-teal-600" /></div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">Panel Peneliti — KarangGigiEdu</h1>
              <p className="text-gray-400 text-xs">Responden, login, dan nilai tes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => load()} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-xl text-xs font-medium"><Download size={13} />Export CSV</button>
            <button onClick={() => { setAuthed(false); setPassword(''); setRows([]); }} className="text-gray-400 hover:text-gray-600 p-2" aria-label="Keluar"><LogOut size={14} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { l: 'Responden Terdaftar', v: stats.total, i: Users, c: 'text-teal-600' },
            { l: 'Selesai Pretest', v: stats.pre, i: UserCheck, c: 'text-sky-600' },
            { l: 'Selesai Posttest', v: stats.post, i: UserCheck, c: 'text-indigo-600' },
            { l: 'Rata-rata Pre → Post', v: `${stats.avgPre} → ${stats.avgPost}`, i: TrendingUp, c: 'text-amber-600' },
            { l: 'Rata-rata Peningkatan', v: stats.avgGain, i: TrendingUp, c: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs mb-1 flex items-center gap-1.5"><s.i size={12} />{s.l}</p>
              <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="inline-flex p-1 bg-white border border-gray-200 rounded-xl self-start">
            {([['nilai', 'Nilai Responden', ClipboardCheck], ['login', 'Riwayat Login', LogIn]] as const).map(([k, l, I]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === k ? 'bg-teal-600 text-white' : 'text-gray-500'}`}><I size={14} />{l}</button>
            ))}
          </div>
          <div className="relative sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, email, instansi…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        </div>

        {tab === 'nilai' ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className={th}>#</th><th className={th}>Nama Responden</th><th className={th}>Email</th><th className={th}>Instansi / Kota</th>
                <th className={th}>Pretest</th><th className={th}>Posttest</th><th className={th}>Selisih</th><th className={th}>Kategori</th><th className={th}>Login</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-14 text-gray-400">Belum ada responden.</td></tr>}
                {filtered.map((r, i) => {
                  const gain = r.pretest && r.posttest ? r.posttest.score - r.pretest.score : null;
                  return (
                    <tr key={r.id} className="hover:bg-teal-50/30">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{[r.institution, r.city].filter(Boolean).join(' · ') || '—'}</td>
                      <td className="px-4 py-3"><Badge s={r.pretest} /></td>
                      <td className="px-4 py-3"><Badge s={r.posttest} />{r.posttestAttempts > 1 && <p className="text-[11px] text-amber-600">{r.posttestAttempts}× mengerjakan</p>}</td>
                      <td className="px-4 py-3">
                        {gain === null ? <span className="text-gray-300">—</span> : (
                          <span className={`font-bold ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{gain > 0 ? '+' : ''}{gain}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{r.posttest ? cat(r.posttest.score) : r.pretest ? `Pre: ${cat(r.pretest.score)}` : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{r.loginCount}× · {fmt(r.lastLogin)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              Pretest = percobaan pertama · Posttest = percobaan terbaru · Skor maksimal 40
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className={th}>Waktu</th><th className={th}>Nama</th><th className={th}>Email</th><th className={th}>Aktivitas</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {log.filter((l) => [l.name, l.email].some((v) => v.toLowerCase().includes(search.toLowerCase()))).map((l, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmt(l.at)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{l.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{l.email}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${l.isRegister ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>{l.isRegister ? 'Mendaftar' : 'Masuk'}{l.provider === 'google' ? ' · Google' : ''}</span></td>
                  </tr>
                ))}
                {log.length === 0 && <tr><td colSpan={4} className="text-center py-14 text-gray-400">Belum ada aktivitas login.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
