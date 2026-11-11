import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isConfigured } from './supabaseClient';

export interface AuthUser { id: string; name: string; email: string; institution?: string; city?: string }
export interface ResultRow { type: 'pretest' | 'posttest'; score: number; total: number; at: string }

interface Ctx {
  user: AuthUser | null;
  results: ResultRow[];
  ready: boolean;
  hasPretest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (f: { name: string; email: string; password: string; institution?: string; city?: string }) => Promise<{ needsConfirm: boolean }>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveResult: (type: 'pretest' | 'posttest', score: number, answers: unknown) => Promise<{ synced: boolean }>;
}

const AuthContext = createContext<Ctx | null>(null);

const toUser = (s: Session | null): AuthUser | null => {
  const u = s?.user;
  if (!u) return null;
  const m: any = u.user_metadata || {};
  return {
    id: u.id,
    email: u.email || '',
    name: m.name || m.full_name || (u.email || '').split('@')[0],
    institution: m.institution,
    city: m.city,
  };
};

const friendly = (msg: string) => {
  if (/Invalid login credentials/i.test(msg)) return 'Email atau kata sandi salah.';
  if (/already registered|already been registered/i.test(msg)) return 'Email sudah terdaftar. Silakan masuk.';
  if (/Email not confirmed/i.test(msg)) return 'Email belum dikonfirmasi. Cek kotak masuk email Anda.';
  if (/provider is not enabled|Unsupported provider/i.test(msg)) return 'Login Google belum diaktifkan di Supabase (Authentication > Providers > Google).';
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Tidak dapat terhubung ke Supabase. Periksa koneksi dan kunci proyek.';
  return msg;
};

const PENDING_KEY = 'kge_pending_results';
const readPending = (): any[] => { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch { return []; } };
const writePending = (x: any[]) => localStorage.setItem(PENDING_KEY, JSON.stringify(x));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [ready, setReady] = useState(false);
  const logged = useRef<string | null>(null);

  const loadResults = useCallback(async (uid: string) => {
    const { data } = await supabase.from('results').select('type,score,total,at').eq('user_id', uid).order('at', { ascending: true });
    setResults((data as ResultRow[]) || []);
  }, []);

  const recordLogin = useCallback(async (u: AuthUser, provider: string, isRegister: boolean) => {
    const key = `kge_logged_${u.id}`;
    if (logged.current === u.id || sessionStorage.getItem(key)) return;
    logged.current = u.id;
    sessionStorage.setItem(key, '1');
    await supabase.from('login_events').insert({ user_id: u.id, name: u.name, email: u.email, provider, is_register: isRegister });
  }, []);

  // Kirim ulang nilai yang sempat gagal tersimpan (mis. koneksi putus / tabel belum siap)
  const flushPending = useCallback(async (uid: string) => {
    const all = readPending();
    const mine = all.filter((r) => r.user_id === uid);
    if (!mine.length) return;
    const rest = all.filter((r) => r.user_id !== uid);
    const failed: any[] = [];
    for (const r of mine) {
      const { error } = await supabase.from('results').insert(r);
      if (error) failed.push(r);
    }
    writePending([...rest, ...failed]);
    if (failed.length < mine.length) await loadResults(uid);
  }, [loadResults]);

  useEffect(() => {
    if (!user) return;
    flushPending(user.id);
    const t = setInterval(() => flushPending(user.id), 20000);
    return () => clearInterval(t);
  }, [user, flushPending]);

  useEffect(() => {
    if (!isConfigured) { setReady(true); return; }
    let alive = true;
    const apply = async (s: Session | null, event?: string) => {
      const u = toUser(s);
      if (!alive) return;
      setUser(u);
      if (u) {
        const provider = (s?.user.app_metadata as any)?.provider || 'email';
        const fresh = Date.now() - new Date(s!.user.created_at).getTime() < 60_000;
        await Promise.all([loadResults(u.id), event === 'SIGNED_IN' || event === 'INITIAL_SESSION' ? recordLogin(u, provider, fresh) : Promise.resolve()]);
      } else {
        setResults([]);
      }
      if (alive) setReady(true);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      // jangan await supabase di dalam callback langsung (hindari deadlock)
      setTimeout(() => apply(s, event), 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [loadResults, recordLogin]);

  const guard = () => {
    if (!isConfigured) throw new Error('Kunci Supabase belum diisi di src/app/lib/supabaseClient.ts.');
  };

  const value: Ctx = {
    user, results, ready,
    hasPretest: results.some((r) => r.type === 'pretest') || (!!user && localStorage.getItem(`kge_pre_${user.id}`) === '1'),
    login: async (email, password) => {
      guard();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw new Error(friendly(error.message));
    },
    register: async (f) => {
      guard();
      const { data, error } = await supabase.auth.signUp({
        email: f.email.trim().toLowerCase(),
        password: f.password,
        options: { data: { name: f.name.trim(), institution: f.institution || '', city: f.city || '' } },
      });
      if (error) throw new Error(friendly(error.message));
      // email sudah terdaftar (Supabase mengembalikan user tanpa identities)
      if (data.user && data.user.identities && data.user.identities.length === 0) throw new Error('Email sudah terdaftar. Silakan masuk.');
      return { needsConfirm: !data.session };
    },
    loginGoogle: async () => {
      guard();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/login', skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
      });
      if (error) throw new Error(friendly(error.message));
      if (!data?.url) throw new Error('Gagal memulai login Google.');
      // Google menolak dibuka di dalam iframe (preview), jadi pakai jendela popup.
      const w = 500, h = 640;
      const pop = window.open(data.url, 'google-login', `width=${w},height=${h},left=${Math.max(0, (window.screen.width - w) / 2)},top=${Math.max(0, (window.screen.height - h) / 2)}`);
      if (!pop) {
        // popup diblokir: buka di jendela utama (atau jendela paling atas)
        try { (window.top || window).location.href = data.url; } catch { window.location.href = data.url; }
      }
    },
    logout: async () => {
      await supabase.auth.signOut();
      logged.current = null;
      setUser(null);
      setResults([]);
    },
    saveResult: async (type, score, answers) => {
      if (!user) throw new Error('Silakan masuk terlebih dahulu.');
      const row = { user_id: user.id, name: user.name, email: user.email, type, score, total: 40, answers, at: new Date().toISOString() };
      let synced = true;
      try {
        if (!isConfigured) throw new Error('not configured');
        const { error } = await supabase.from('results').insert(row);
        if (error) throw error;
      } catch (e) {
        // jangan hilangkan data responden: simpan di perangkat lalu kirim otomatis nanti
        synced = false;
        writePending([...readPending(), row]);
        console.warn('Nilai disimpan sementara di perangkat:', e);
      }
      if (type === 'pretest') localStorage.setItem(`kge_pre_${user.id}`, '1');
      setResults((p) => [...p, { type, score, total: 40, at: row.at }]);
      return { synced };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
