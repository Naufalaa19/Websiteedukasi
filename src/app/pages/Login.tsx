import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Building2, MapPin, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../lib/auth';

const HERO = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dentist_in_Mexico_attending_a_child.jpg?width=1200';

function Field({ icon: Icon, ...props }: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/60" />
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-2 border-teal-100 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition"
      />
    </div>
  );
}

export default function Login() {
  const { login, register, loginGoogle } = useAuth();
  const [info, setInfo] = useState('');
  const [mode, setMode] = useState<'masuk' | 'daftar'>('daftar');
  const [f, setF] = useState({ name: '', email: '', password: '', institution: '', city: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErr('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setInfo('');
    try {
      if (mode === 'masuk') await login(f.email, f.password);
      else {
        const r = await register(f);
        if (r.needsConfirm) { setInfo('Pendaftaran berhasil! Cek email Anda dan klik tautan konfirmasi, lalu masuk.'); setMode('masuk'); }
      }
    } catch (x: any) {
      setErr(x.message || 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="font-friendly min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-[#f3fbf9]">
      {/* Sisi visual */}
      <div className="relative hidden lg:block overflow-hidden bg-teal-900">
        <img src={HERO} alt="Dokter gigi memeriksa gigi anak di klinik" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/60 to-teal-700/30" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl">🦷</div>
            <span className="font-display text-xl">KarangGigiEdu</span>
          </div>
          <div>
            <p className="inline-flex items-center gap-2 text-sm bg-white/15 backdrop-blur px-3.5 py-1.5 rounded-full mb-5">
              <Sparkles size={14} /> Edukasi untuk Orang Tua
            </p>
            <h1 className="font-display text-5xl leading-[1.08] mb-5">
              Gigi sehat anak<br />dimulai dari <span className="text-amber-300">orang tuanya.</span>
            </h1>
            <p className="text-teal-50/90 max-w-md leading-relaxed mb-8">
              Masuk untuk belajar lewat materi bergambar klinis, bermain game, dan mengikuti Misi Pretest yang seru.
            </p>
            <ul className="space-y-3 text-sm text-teal-50">
              {[
                [ClipboardCheck, 'Misi Pretest 40 pernyataan, dikemas seperti petualangan'],
                [ShieldCheck, 'Nilai Anda tersimpan aman dan terhubung ke akun Anda'],
              ].map(([I, t], i) => {
                const Icon = I as typeof Mail;
                return (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center"><Icon size={16} /></span>
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-xl">🦷</span>
            <span className="font-display text-xl text-teal-800">KarangGigiEdu</span>
          </div>

          <h2 className="font-display text-3xl text-teal-950 mb-1.5">
            {mode === 'daftar' ? 'Halo, Bapak/Ibu! 👋' : 'Selamat datang kembali'}
          </h2>
          <p className="text-gray-500 mb-6 text-[15px]">
            {mode === 'daftar' ? 'Buat akun singkat agar nilai Anda tercatat atas nama Anda.' : 'Masuk untuk melanjutkan belajar.'}
          </p>

          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-teal-100/70 mb-6">
            {(['daftar', 'masuk'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErr(''); }}
                className={`py-2.5 rounded-xl text-sm font-bold transition ${mode === m ? 'bg-white text-teal-800 shadow-sm' : 'text-teal-700/70 hover:text-teal-800'}`}
              >
                {m === 'daftar' ? 'Daftar Baru' : 'Sudah Punya Akun'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={async () => { setErr(''); try { await loginGoogle(); } catch (x: any) { setErr(x.message); } }}
            className="w-full mb-4 py-3.5 rounded-2xl bg-white border-2 border-teal-100 hover:border-teal-300 text-gray-700 font-bold text-[15px] flex items-center justify-center gap-3 transition"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>
            Lanjutkan dengan Google
          </button>
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-400"><span className="flex-1 h-px bg-teal-100" />atau pakai email<span className="flex-1 h-px bg-teal-100" /></div>

          <form onSubmit={submit} className="space-y-3.5">
            {mode === 'daftar' && (
              <Field icon={User} required placeholder="Nama lengkap" value={f.name} onChange={set('name')} autoComplete="name" />
            )}
            <Field icon={Mail} required type="email" placeholder="Email" value={f.email} onChange={set('email')} autoComplete="email" />
            <div className="relative">
              <Field icon={Lock} required type={show ? 'text' : 'password'} placeholder="Kata sandi (min. 6 karakter)" value={f.password} onChange={set('password')} autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setShow(!show)} aria-label="Tampilkan kata sandi" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {mode === 'daftar' && (
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Field icon={Building2} placeholder="Instansi (opsional)" value={f.institution} onChange={set('institution')} />
                <Field icon={MapPin} placeholder="Kota (opsional)" value={f.city} onChange={set('city')} />
              </div>
            )}

            {info && <p role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">{info}</p>}
            {err && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="group w-full mt-2 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition"
            >
              {busy ? <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : (
                <>
                  {mode === 'daftar' ? 'Daftar & Mulai Misi' : 'Masuk'}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 leading-relaxed text-center">
            Data Anda dipakai untuk keperluan penelitian edukasi kesehatan gigi dan tidak dibagikan ke pihak lain.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
