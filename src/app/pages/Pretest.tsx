import { LogOut } from 'lucide-react';
import { MissionTest } from '../components/MissionTest';
import { useAuth } from '../lib/auth';

export default function Pretest() {
  const { user, logout } = useAuth();
  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 text-xs text-teal-800 bg-white/80 backdrop-blur rounded-full pl-3 pr-1.5 py-1 border border-teal-100">
        <span className="font-semibold truncate max-w-[9rem]">{user?.name}</span>
        <button onClick={logout} className="w-7 h-7 rounded-full hover:bg-teal-50 flex items-center justify-center" aria-label="Keluar"><LogOut size={14} /></button>
      </div>
      <MissionTest mode="pretest" />
    </div>
  );
}
