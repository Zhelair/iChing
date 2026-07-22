import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { GoldenPawPracticePage } from './pages/GoldenPawPracticePage'

const MethodPage = lazy(() => import('./pages/MethodPage').then(({ MethodPage: page }) => ({ default: page })))
const CastPage = lazy(() => import('./pages/CastPage').then(({ CastPage: page }) => ({ default: page })))
const ResultPage = lazy(() => import('./pages/ResultPage').then(({ ResultPage: page }) => ({ default: page })))
const LearnPage = lazy(() => import('./pages/LearnPage').then(({ LearnPage: page }) => ({ default: page })))
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(({ LibraryPage: page }) => ({ default: page })))
const HexagramPage = lazy(() => import('./pages/HexagramPage').then(({ HexagramPage: page }) => ({ default: page })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(({ SettingsPage: page }) => ({ default: page })))
const JournalPage = lazy(() => import('./pages/JournalPage').then(({ JournalPage: page }) => ({ default: page })))
const SupportPage = lazy(() => import('./pages/SupportPage').then(({ SupportPage: page }) => ({ default: page })))
const DaoPage = lazy(() => import('./pages/DaoPage').then(({ DaoPage: page }) => ({ default: page })))
const DaoStartPage = lazy(() => import('./pages/DaoStartPage').then(({ DaoStartPage: page }) => ({ default: page })))
const DaoThemesPage = lazy(() => import('./pages/DaoThemesPage').then(({ DaoThemesPage: page }) => ({ default: page })))
const DaoPracticePage = lazy(() => import('./pages/DaoPracticePage').then(({ DaoPracticePage: page }) => ({ default: page })))
const DaoSettlingPage = lazy(() => import('./pages/DaoSettlingPage').then(({ DaoSettlingPage: page }) => ({ default: page })))
const DaoQuietSittingPage = lazy(() => import('./pages/DaoQuietSittingPage').then(({ DaoQuietSittingPage: page }) => ({ default: page })))
const DaoLivingPage = lazy(() => import('./pages/DaoLivingPage').then(({ DaoLivingPage: page }) => ({ default: page })))
const IChingPage = lazy(() => import('./pages/IChingPage').then(({ IChingPage: page }) => ({ default: page })))
const StudyNotesPage = lazy(() => import('./pages/StudyNotesPage').then(({ StudyNotesPage: page }) => ({ default: page })))
const PracticeNotesPage = lazy(() => import('./pages/PracticeNotesPage').then(({ PracticeNotesPage: page }) => ({ default: page })))
const MonthlyPatternsPage = lazy(() => import('./pages/MonthlyPatternsPage').then(({ MonthlyPatternsPage: page }) => ({ default: page })))

export function App() {
  return (
    <Routes>
      <Route path="companion/golden-paw" element={<GoldenPawPracticePage />} />
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="iching/reading" element={<MethodPage />} />
        <Route path="reading" element={<Navigate to="/iching/reading" replace />} />
        <Route path="cast/:method" element={<CastPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="iching" element={<IChingPage />} />
        <Route path="iching/guide" element={<LearnPage />} />
        <Route path="iching/library" element={<LibraryPage />} />
        <Route path="dao" element={<DaoPage />} />
        <Route path="dao/study" element={<Navigate to="/dao/study/start" replace />} />
        <Route path="dao/study/start" element={<DaoStartPage />} />
        <Route path="dao/study/themes" element={<DaoThemesPage />} />
        <Route path="dao/practice" element={<DaoPracticePage />} />
        <Route path="dao/practice/settling" element={<DaoSettlingPage />} />
        <Route path="dao/practice/quiet-sitting" element={<DaoQuietSittingPage />} />
        <Route path="dao/practice/open-attention" element={<Navigate to="/dao/practice/quiet-sitting" replace />} />
        <Route path="dao/living" element={<DaoLivingPage />} />
        <Route path="start" element={<Navigate to="/iching/guide" replace />} />
        <Route path="learn" element={<Navigate to="/iching/guide" replace />} />
        <Route path="library" element={<Navigate to="/iching/library" replace />} />
        <Route path="hexagrams/:number" element={<HexagramPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="journal/notes" element={<PracticeNotesPage />} />
        <Route path="journal/study" element={<StudyNotesPage />} />
        <Route path="journal/patterns" element={<MonthlyPatternsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
