import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Games from './pages/Games';
import GameTTS from './pages/GameTTS';
import GameUlarTangga from './pages/GameUlarTangga';
import Quiz from './pages/Quiz';
import Komentar from './pages/Komentar';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/materi/:id',
    Component: ArticleDetail,
  },
  {
    path: '/games',
    Component: Games,
  },
  {
    path: '/games/tts',
    Component: GameTTS,
  },
  {
    path: '/games/ular-tangga',
    Component: GameUlarTangga,
  },
  {
    path: '/quiz',
    Component: Quiz,
  },
  {
    path: '/komentar',
    Component: Komentar,
  },
]);
