import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-be29dd90`;
const TOKEN_KEY = 'kge_token';
const USER_KEY = 'kge_user';

export interface AuthUser { id: string; name: string; email: string; institution?: string; city?: string }
export interface ResultRow { type: 'pretest' | 'posttest'; score: number; total: number; at: string }

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; token?: string | null } = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...(opts.token ? { 'X-User-Token': opts.token } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let data: any = {};
  try { data = await res.json(); } catch { /* non-json */ }
  if (!res.ok) {
    const e: any = new Error(data.error || (res.status === 404 ? 'Server belum aktif. Deploy ulang Edge Function dari Make Settings.' : 'Terjadi kesalahan.'));
    e.status = res.status;
    throw e;
  }
  return data as T;
}

interface Ctx {
  user: AuthUser | null;
  token: string | null;
  results: ResultRow[];
  ready: boolean;
  hasPretest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (f: { name: string; email: string; password: string; institution?: string; city?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshResults: () => Promise<void>;
  markResult: (r: ResultRow) => void;
}

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  });
  const [results, setResults] = useState<ResultRow[]>([]);
  const [ready, setReady] = useState(false);

  const loadResults = useCallback(async (t: string) => {
    const d = await api<{ results: ResultRow[] }>('/results/me', { token: t });
    setResults(d.results || []);
  }, []);

  useEffect(() => {
    (async () => {
      if (token) {
        try { await loadResults(token); }
        catch (e: any) {
          if (e.status === 401) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null); }
        }
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = async (d: { token: string; user: AuthUser }) => {
    localStorage.setItem(TOKEN_KEY, d.token);
    localStorage.setItem(USER_KEY, JSON.stringify(d.user));
    setToken(d.token); setUser(d.user);
    try { await loadResults(d.token); } catch { setResults([]); }
  };

  const value: Ctx = {
    user, token, results, ready,
    hasPretest: results.some((r) => r.type === 'pretest') || localStorage.getItem(`kge_pre_${user?.id}`) === '1',
    login: async (email, password) => finish(await api('/auth/login', { method: 'POST', body: { email, password } })),
    register: async (f) => finish(await api('/auth/register', { method: 'POST', body: f })),
    logout: async () => {
      try { if (token) await api('/auth/logout', { method: 'POST', token }); } catch { /* ignore */ }
      localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
      setToken(null); setUser(null); setResults([]);
    },
    refreshResults: async () => { if (token) await loadResults(token); },
    markResult: (r) => {
      if (r.type === 'pretest' && user) localStorage.setItem(`kge_pre_${user.id}`, '1');
      setResults((p) => [...p, r]);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
