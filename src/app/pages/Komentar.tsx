import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Heart, Plus, Send, X, MessageCircle, Trash2, RefreshCw, Loader2, Wifi, WifiOff } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-be29dd90`;
const LIKED_KEY = 'karanggigi_liked_comments';
const LIKES_STORAGE_KEY = 'karanggigi_comment_likes';

interface Reply {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface Comment {
  id: string;
  name: string;
  avatar: string;
  message: string;
  category: string;
  likes: number;
  replies: Reply[];
  createdAt: string;
}

const CATEGORIES = ['Pertanyaan', 'Pengalaman', 'Tips', 'Cerita', 'Saran', 'Informasi'];

const CAT_COLORS: Record<string, string> = {
  'Pertanyaan': 'bg-blue-100 text-blue-700',
  'Pengalaman': 'bg-purple-100 text-purple-700',
  'Tips': 'bg-green-100 text-green-700',
  'Cerita': 'bg-pink-100 text-pink-700',
  'Saran': 'bg-amber-100 text-amber-700',
  'Informasi': 'bg-teal-100 text-teal-700',
};

const CARD_COLORS = [
  'bg-yellow-50 border-yellow-200',
  'bg-teal-50 border-teal-200',
  'bg-pink-50 border-pink-200',
  'bg-blue-50 border-blue-200',
  'bg-purple-50 border-purple-200',
  'bg-green-50 border-green-200',
  'bg-orange-50 border-orange-200',
  'bg-cyan-50 border-cyan-200',
];

const EMOJI_AVATARS = ['😊', '🦷', '😁', '🌟', '💪', '👨‍⚕️', '👩‍⚕️', '🎓', '🌈', '🦊', '🐻', '🐸'];

function getCardColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getLiked(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveLiked(set: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
}

function getLikeOverrides(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveLikeOverrides(obj: Record<string, number>) {
  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(obj));
}

function apiFetch(path: string, opts?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...(opts?.headers || {}),
    },
  });
}

export default function Komentar() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterCat, setFilterCat] = useState('Semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'populer'>('terbaru');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(getLiked);
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>(getLikeOverrides);
  const [form, setForm] = useState({ name: '', message: '', category: 'Pengalaman', avatar: '😊' });
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      const res = await apiFetch('/comments');
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setComments(data.comments || []);
      setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setFormError('Nama dan pesan wajib diisi.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await apiFetch('/comments', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memposting.');
      setComments(prev => [data.comment, ...prev]);
      setForm({ name: '', message: '', category: 'Pengalaman', avatar: '😊' });
      setShowForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (comment: Comment) => {
    const alreadyLiked = liked.has(comment.id);
    const delta = alreadyLiked ? -1 : 1;

    // Optimistic update
    const newLiked = new Set(liked);
    if (alreadyLiked) newLiked.delete(comment.id); else newLiked.add(comment.id);
    setLiked(newLiked);
    saveLiked(newLiked);

    const newOverrides = { ...likeOverrides, [comment.id]: (likeOverrides[comment.id] ?? comment.likes) + delta };
    setLikeOverrides(newOverrides);
    saveLikeOverrides(newOverrides);

    try {
      await apiFetch('/comments/like', {
        method: 'POST',
        body: JSON.stringify({ commentId: comment.id, delta }),
      });
    } catch {
      // Revert on error
      const reverted = new Set(liked);
      setLiked(reverted);
      saveLiked(reverted);
      const revertedOverrides = { ...likeOverrides };
      setLikeOverrides(revertedOverrides);
      saveLikeOverrides(revertedOverrides);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyName.trim() || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const res = await apiFetch('/comments/reply', {
        method: 'POST',
        body: JSON.stringify({ commentId, name: replyName, message: replyMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments(prev => prev.map(c =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), data.reply] }
          : c
      ));
      setReplyingTo(null);
      setReplyName('');
      setReplyMessage('');
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (comment: Comment) => {
    if (!window.confirm(`Hapus komentar dari "${comment.name}"?`)) return;
    setComments(prev => prev.filter(c => c.id !== comment.id));
    try {
      await apiFetch(`/comments/${comment.id}`, { method: 'DELETE' });
    } catch {
      // Re-fetch to restore if delete failed
      fetchComments();
    }
  };

  const filtered = comments
    .filter(c => filterCat === 'Semua' || c.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'populer') {
        const likesA = likeOverrides[a.id] ?? a.likes;
        const likesB = likeOverrides[b.id] ?? b.likes;
        return likesB - likesA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalLikes = comments.reduce((s, c) => s + (likeOverrides[c.id] ?? c.likes), 0);
  const totalReplies = comments.reduce((s, c) => s + (c.replies?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="text-white mb-3" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Papan Komentar Komunitas
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Bagikan pengalaman, pertanyaan, dan tips seputar kesehatan gigi. Semua orang bisa melihat dan membalas!
          </p>
          <div className="flex justify-center gap-6 mt-6 text-teal-200 text-sm flex-wrap">
            <span>💬 {comments.length} postingan</span>
            <span>❤️ {totalLikes} suka</span>
            <span>↩️ {totalReplies} balasan</span>
            <span className={`flex items-center gap-1 ${online ? 'text-green-300' : 'text-red-300'}`}>
              {online ? <Wifi size={14} /> : <WifiOff size={14} />}
              {online ? 'Online — komentar terlihat semua orang' : 'Offline — coba muat ulang'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['Semua', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterCat === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setLoading(true); fetchComments(); }}
              disabled={loading}
              className="text-gray-400 hover:text-teal-600 transition-colors p-1"
              title="Refresh komentar"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'terbaru' | 'populer')}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-teal-400"
            >
              <option value="terbaru">Terbaru</option>
              <option value="populer">Terpopuler</option>
            </select>
            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full text-sm transition-colors"
            >
              <Plus size={15} /> Tulis Postingan
            </button>
          </div>
        </div>

        {/* Form tulis komentar */}
        {showForm && (
          <div ref={formRef} className="bg-white rounded-3xl shadow-lg border border-teal-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800 font-semibold">Tulis Postingan Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar picker */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-3xl">
                    {form.avatar}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                    {EMOJI_AVATARS.slice(0, 8).map(e => (
                      <button
                        key={e} type="button"
                        onClick={() => setForm(f => ({ ...f, avatar: e }))}
                        className={`text-sm w-6 h-6 rounded ${form.avatar === e ? 'ring-2 ring-teal-500' : ''}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Nama kamu"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    maxLength={40}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                  />
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat} type="button"
                        onClick={() => setForm(f => ({ ...f, category: cat }))}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          form.category === cat
                            ? (CAT_COLORS[cat] || 'bg-teal-100 text-teal-700') + ' ring-2 ring-offset-1 ring-teal-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Ceritakan pengalaman, tanyakan sesuatu, atau bagikan tips seputar kesehatan gigi dan mulut..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={4}
                maxLength={500}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none mb-2"
              />

              {formError && <p className="text-red-500 text-xs mb-2">{formError}</p>}

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{form.message.length}/500 karakter</span>
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim() || !form.message.trim()}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full text-sm transition-colors"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? 'Memposting...' : 'Posting'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Loader2 size={36} className="animate-spin mb-3" />
            <p className="text-sm">Memuat komentar komunitas...</p>
          </div>
        )}

        {/* Offline warning */}
        {!loading && !online && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-amber-700 text-sm">
            <WifiOff size={18} />
            <span>Tidak dapat terhubung ke server. Pastikan Edge Function sudah di-deploy, lalu klik ikon refresh.</span>
          </div>
        )}

        {/* Grid komentar */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">Belum ada postingan. Jadilah yang pertama!</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filtered.map(comment => {
              const isLiked = liked.has(comment.id);
              const likeCount = likeOverrides[comment.id] ?? comment.likes;

              return (
                <div
                  key={comment.id}
                  className={`break-inside-avoid mb-5 rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${getCardColor(comment.id)}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium leading-tight">{comment.name}</p>
                        <p className="text-gray-400 text-xs">{formatTime(comment.createdAt)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(comment)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      title="Hapus komentar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Category badge */}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 ${CAT_COLORS[comment.category] || 'bg-gray-100 text-gray-600'}`}>
                    {comment.category}
                  </span>

                  {/* Message */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.message}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => handleLike(comment)}
                      className={`flex items-center gap-1.5 text-xs transition-all px-2 py-1 rounded-full ${
                        isLiked
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-500 hover:text-red-400 hover:bg-red-50'
                      }`}
                    >
                      <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
                      {likeCount}
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 px-2 py-1 rounded-full hover:bg-teal-50 transition-all"
                    >
                      <MessageCircle size={13} />
                      Balas {(comment.replies?.length || 0) > 0 && `(${comment.replies.length})`}
                    </button>
                  </div>

                  {/* Replies */}
                  {(comment.replies?.length || 0) > 0 && (
                    <div className="bg-white/60 rounded-xl p-3 space-y-2 mb-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="text-xs">
                          <span className="font-medium text-gray-700">{reply.name}</span>
                          <span className="text-gray-400 ml-1">· {formatTime(reply.createdAt)}</span>
                          <p className="text-gray-600 mt-0.5">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="bg-white/70 rounded-xl p-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Nama kamu"
                        value={replyName}
                        onChange={e => setReplyName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-teal-400"
                      />
                      <textarea
                        placeholder="Tulis balasan..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-teal-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={sendingReply || !replyName.trim() || !replyMessage.trim()}
                          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          {sendingReply ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                          Kirim
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyName(''); setReplyMessage(''); }}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
          }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
          title="Tulis Postingan"
        >
          <Plus size={24} />
        </button>
      )}

      <Footer />
    </div>
  );
}
