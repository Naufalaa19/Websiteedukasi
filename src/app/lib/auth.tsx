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
  saveResult: (type: 'pretest' | 'posttest', score: number, answers: unknown) => Promise<void>;
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/login' },
      });
      if (error) throw new Error(friendly(error.message));
    },
    logout: async () => {
      await supabase.auth.signOut();
      logged.current = null;
      setUser(null);
      setResults([]);
    },
    saveResult: async (type, score, answers) => {
      guard();
      if (!user) throw new Error('Silakan masuk terlebih dahulu.');
      const { error } = await supabase.from('results').insert({ user_id: user.id, name: user.name, email: user.email, type, score, total: 40, answers });
      if (error) {
        if (/relation .* does not exist|schema cache/i.test(error.message)) throw new Error('Tabel belum dibuat. Jalankan supabase/schema.sql di SQL Editor Supabase.');
        throw new Error(friendly(error.message));
      }
      if (type === 'pretest') localStorage.setItem(`kge_pre_${user.id}`, '1');
      setResults((p) => [...p, { type, score, total: 40, at: new Date().toISOString() }]);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
