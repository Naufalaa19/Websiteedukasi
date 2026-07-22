import { useState, useEffect } from 'react';
import { X, User, Building2, MapPin, Mail, Heart, Send } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-be29dd90`;
const STORAGE_KEY = 'karanggigi_visitor_registered';

export function VisitorModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    institution: '',
    city: '',
    email: '',
  });

  useEffect(() => {
    const already = localStorage.getItem(STORAGE_KEY);
    if (!already) {
      // Delay 1.5s agar halaman sempat render
      const t = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) {
      setError('Nama dan kota wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan data.');
      localStorage.setItem(STORAGE_KEY, 'true');
      setStep('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
      setError(msg);
      console.error('Visitor modal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step === 'success' ? handleClose : undefined}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header dekoratif */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 px-6 pt-6 pb-10 text-white text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-4xl mb-2">🦷</div>
          <h2 className="text-xl font-bold leading-tight">Selamat Datang di KarangGigiEdu!</h2>
          <p className="text-teal-100 text-sm mt-1">
            Website edukasi kesehatan gigi & mulut untuk keluarga Indonesia
          </p>
        </div>

        {/* Wave connector */}
        <div className="h-6 bg-gradient-to-br from-teal-500 to-emerald-600 relative">
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[2rem]" />
        </div>

        <div className="px-6 pb-6">
          {step === 'form' ? (
            <>
              <p className="text-gray-600 text-sm text-center mb-5">
                Agar kami mengenal Anda, mohon isi data singkat di bawah ini.
                <br />
                <span className="text-gray-400 text-xs">Data Anda aman dan tidak akan disebarluaskan.</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                  </div>
                </div>

                {/* Instansi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Asal Instansi / Sekolah
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      placeholder="Contoh: SDN 1 Bandung / Orang tua"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                  </div>
                </div>

                {/* Kota */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kota / Kabupaten <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Contoh: Bandung"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                  </div>
                </div>

                {/* Email (opsional) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Contoh: budi@email.com"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? 'Menyimpan...' : 'Mulai Belajar'}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-gray-400 text-xs hover:text-gray-600 transition-colors py-1"
                >
                  Lewati, lanjutkan tanpa mendaftar
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">Terima kasih, {form.name}!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Senang bertemu Anda dari <strong>{form.city}</strong>
                {form.institution ? ` — ${form.institution}` : ''}.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Selamat belajar dan semoga informasi di KarangGigiEdu bermanfaat untuk keluarga Anda!
              </p>
              <div className="flex items-center justify-center gap-1 text-teal-500 text-xs mb-4">
                <Heart size={13} fill="currentColor" />
                <span>Salam sehat gigi dan mulut!</span>
              </div>
              <button
                onClick={handleClose}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Mulai Belajar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
