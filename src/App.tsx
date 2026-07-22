import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'

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
const DaoStudyPage = lazy(() => import('./pages/DaoStudyPage').then(({ DaoStudyPage: page }) => ({ default: page })))
const DaoPracticePage = lazy(() => import('./pages/DaoPracticePage').then(({ DaoPracticePage: page }) => ({ default: page })))
const DaoLivingPage = lazy(() => import('./pages/DaoLivingPage').then(({ DaoLivingPage: page }) => ({ default: page })))
const IChingPage = lazy(() => import('./pages/IChingPage').then(({ IChingPage: page }) => ({ default: page })))

export function App() {
  return (
    <Routes>
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
        <Route path="dao/study" element={<DaoStudyPage />} />
        <Route path="dao/practice" element={<DaoPracticePage />} />
        <Route path="dao/living" element={<DaoLivingPage />} />
        <Route path="start" element={<Navigate to="/iching/guide" replace />} />
        <Route path="learn" element={<Navigate to="/iching/guide" replace />} />
        <Route path="library" element={<Navigate to="/iching/library" replace />} />
        <Route path="hexagrams/:number" element={<HexagramPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
