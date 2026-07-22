import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Games from './pages/Games';
import GameTTS from './pages/GameTTS';
import GameUlarTangga from './pages/GameUlarTangga';
import GameParents from './pages/GameParents';
import BrushingTimer from './pages/BrushingTimer';
import Quiz from './pages/Quiz';
import Komentar from './pages/Komentar';
import Evaluasi from './pages/Evaluasi';
import AdminVisitors from './pages/AdminVisitors';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/materi/:id', Component: ArticleDetail },
  { path: '/games', Component: Games },
  { path: '/games/tts', Component: GameTTS },
  { path: '/games/ular-tangga', Component: GameUlarTangga },
  { path: '/games/ortu', Component: GameParents },
  { path: '/tools/timer', Component: BrushingTimer },
  { path: '/quiz', Component: Quiz },
  { path: '/komentar', Component: Komentar },
  { path: '/evaluasi', Component: Evaluasi },
  { path: '/admin', Component: AdminVisitors },
]);
