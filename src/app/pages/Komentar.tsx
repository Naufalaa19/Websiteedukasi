import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Heart, Plus, Send, X, ThumbsUp, MessageCircle, Smile, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  message: string;
  category: string;
  likes: number;
  likedByMe: boolean;
  timestamp: string;
  color: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

const COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-teal-100 border-teal-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-purple-100 border-purple-300',
  'bg-green-100 border-green-300',
  'bg-orange-100 border-orange-300',
  'bg-cyan-100 border-cyan-300',
];

const CATEGORIES = ['Pertanyaan', 'Pengalaman', 'Tips', 'Cerita', 'Saran', 'Informasi'];
const CAT_COLORS: Record<string, string> = {
  'Pertanyaan': 'bg-blue-100 text-blue-700',
  'Pengalaman': 'bg-purple-100 text-purple-700',
  'Tips': 'bg-green-100 text-green-700',
  'Cerita': 'bg-pink-100 text-pink-700',
  'Saran': 'bg-amber-100 text-amber-700',
  'Informasi': 'bg-teal-100 text-teal-700',
};

const EMOJI_AVATARS = ['😊', '🦷', '😁', '🌟', '💪', '👨‍⚕️', '👩‍⚕️', '🎓', '🌈', '🦊', '🐻', '🐸'];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    avatar: '😊',
    message: 'Setelah rutin scaling setiap 6 bulan, gusi saya jauh lebih sehat! Dulu selalu berdarah saat sikat gigi, sekarang sudah tidak lagi. Terima kasih info edukasinya!',
    category: 'Pengalaman',
    likes: 12,
    likedByMe: false,
    timestamp: '2 jam lalu',
    color: COLORS[0],
    replies: [],
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    avatar: '👩‍⚕️',
    message: 'Tips dari saya: setelah makan makanan manis, langsung minum air putih untuk menetralkan asam. Lebih efektif daripada langsung sikat gigi yang justru bisa merusak email!',
    category: 'Tips',
    likes: 25,
    likedByMe: false,
    timestamp: '5 jam lalu',
    color: COLORS[1],
    replies: [
      { id: 'r1', name: 'Dewi', message: 'Wah baru tahu ini! Makasih tipsnya kak 🙏', timestamp: '4 jam lalu' },
    ],
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    avatar: '🎓',
    message: 'Pertanyaan: apakah gigi susu anak perlu dirawat juga? Anakku 4 tahun sudah ada yang berlubang, tapi kata tetangga gak perlu ditambal karena bakal lepas sendiri. Benarkah?',
    category: 'Pertanyaan',
    likes: 8,
    likedByMe: false,
    timestamp: '1 hari lalu',
    color: COLORS[2],
    replies: [
      { id: 'r2', name: 'drg. Ana', message: 'Gigi susu WAJIB dirawat! Karies bisa menyebar dan menyakitkan anak. Kalau parah bisa mempengaruhi pertumbuhan gigi permanen. Segera ke dokter gigi anak ya!', timestamp: '23 jam lalu' },
    ],
  },
  {
    id: '4',
    name: 'Maya Indri',
    avatar: '🌟',
    message: 'Udah 2 tahun nggak ke dokter gigi karena takut. Baca artikel di sini jadi berani. Kemarin akhirnya periksa dan ternyata ada karies kecil yang bisa langsung ditambal. Senang banget!',
    category: 'Cerita',
    likes: 31,
    likedByMe: false,
    timestamp: '2 hari lalu',
    color: COLORS[3],
    replies: [],
  },
  {
    id: '5',
    name: 'Rudi Hermawan',
    avatar: '😁',
    message: 'Saran untuk website ini: tolong tambahkan video tutorial cara menyikat gigi yang benar. Banyak dari kita yang ternyata tekniknya masih salah!',
    category: 'Saran',
    likes: 19,
    likedByMe: false,
    timestamp: '3 hari lalu',
    color: COLORS[4],
    replies: [],
  },
  {
    id: '6',
    name: 'Lisa Permata',
    avatar: '🌈',
    message: 'INFO: menurut dokter gigi saya, sikat gigi terbaik adalah yang berbulu LEMBUT (soft), bukan medium atau hard. Bulu keras justru bisa merusak gusi dan email gigi!',
    category: 'Informasi',
    likes: 44,
    likedByMe: false,
    timestamp: '4 hari lalu',
    color: COLORS[5],
    replies: [
      { id: 'r3', name: 'Hendra', message: 'Beneran kak? Selama ini aku pakai medium soalnya pikir lebih bersih...', timestamp: '3 hari lalu' },
      { id: 'r4', name: 'Lisa Permata', message: 'Iya beneran! Soft sudah cukup asal tekniknya benar. Sikat lembut lebih aman untuk gusi!', timestamp: '3 hari lalu' },
    ],
  },
];

const STORAGE_KEY = 'gigiSehat_comments_v1';

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function Komentar() {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch { return INITIAL_COMMENTS; }
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Pengalaman');
  const [avatar, setAvatar] = useState(EMOJI_AVATARS[0]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [filterCat, setFilterCat] = useState('Semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'populer'>('terbaru');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const addComment = () => {
    if (!name.trim() || !message.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      avatar,
      message: message.trim(),
      category,
      likes: 0,
      likedByMe: false,
      timestamp: 'Baru saja',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    setName('');
    setMessage('');
    setCategory('Pengalaman');
    setAvatar(EMOJI_AVATARS[0]);
    setShowForm(false);
  };

  const toggleLike = (id: string) => {
    setComments(prev => prev.map(c =>
      c.id === id
        ? { ...c, likes: c.likedByMe ? c.likes - 1 : c.likes + 1, likedByMe: !c.likedByMe }
        : c
    ));
  };

  const addReply = (commentId: string) => {
    if (!replyName.trim() || !replyMessage.trim()) return;
    const reply: Reply = {
      id: Date.now().toString(),
      name: replyName.trim(),
      message: replyMessage.trim(),
      timestamp: 'Baru saja',
    };
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
    ));
    setReplyingTo(null);
    setReplyName('');
    setReplyMessage('');
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const filtered = comments
    .filter(c => filterCat === 'Semua' || c.category === filterCat)
    .sort((a, b) => sortBy === 'populer' ? b.likes - a.likes : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="text-white mb-3" style={{ fontSize: '2.25rem', fontWeight: 700 }}>
            Papan Komentar Interaktif
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Bagikan pengalaman, pertanyaan, dan tips seputar kesehatan gigi. Belajar bersama komunitas!
          </p>
          <div className="flex justify-center gap-6 mt-6 text-teal-200 text-sm">
            <span>💬 {comments.length} postingan</span>
            <span>❤️ {comments.reduce((s, c) => s + c.likes, 0)} suka</span>
            <span>↩️ {comments.reduce((s, c) => s + c.replies.length, 0)} balasan</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Filter */}
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
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'terbaru' | 'populer')}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-teal-400"
            >
              <option value="terbaru">Terbaru</option>
              <option value="populer">Terpopuler</option>
            </select>
            <button
              onClick={() => { setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full text-sm transition-colors"
            >
              <Plus size={15} /> Tulis Postingan
            </button>
          </div>
        </div>

        {/* Add Comment Form */}
        {showForm && (
          <div ref={formRef} className="bg-white rounded-3xl shadow-lg border border-teal-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800" style={{ fontWeight: 600, fontSize: '1rem' }}>Tulis Postingan Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-3xl">
                  {avatar}
                </div>
                <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                  {EMOJI_AVATARS.slice(0, 6).map(e => (
                    <button
                      key={e}
                      onClick={() => setAvatar(e)}
                      className={`text-sm w-6 h-6 rounded ${avatar === e ? 'ring-2 ring-teal-500' : ''}`}
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
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={40}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                />
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        category === cat
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
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none mb-2"
            />
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">{message.length}/500 karakter</span>
              <button
                onClick={addComment}
                disabled={!name.trim() || !message.trim()}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                <Send size={14} /> Posting
              </button>
            </div>
          </div>
        )}

        {/* Masonry-style Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>Belum ada postingan di kategori ini.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-0">
            {filtered.map(comment => (
              <div
                key={comment.id}
                className={`break-inside-avoid mb-5 rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${comment.color}`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium leading-tight">{comment.name}</p>
                      <p className="text-gray-400 text-xs">{comment.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    title="Hapus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Category */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 ${CAT_COLORS[comment.category] || 'bg-gray-100 text-gray-600'}`}>
                  {comment.category}
                </span>

                {/* Message */}
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.message}</p>

                {/* Actions */}
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1.5 text-xs transition-all px-2 py-1 rounded-full ${
                      comment.likedByMe
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-500 hover:text-red-400 hover:bg-red-50'
                    }`}
                  >
                    <Heart size={13} fill={comment.likedByMe ? 'currentColor' : 'none'} />
                    {comment.likes}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 px-2 py-1 rounded-full hover:bg-teal-50 transition-all"
                  >
                    <MessageCircle size={13} />
                    Balas {comment.replies.length > 0 && `(${comment.replies.length})`}
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="bg-white/60 rounded-xl p-3 space-y-2 mb-3">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="text-xs">
                        <span className="font-medium text-gray-700">{reply.name}</span>
                        <span className="text-gray-400 ml-1">· {reply.timestamp}</span>
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
                        onClick={() => addReply(comment.id)}
                        disabled={!replyName.trim() || !replyMessage.trim()}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Send size={10} /> Kirim
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
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
            title="Tulis Postingan"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}
