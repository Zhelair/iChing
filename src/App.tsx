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

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reading" element={<MethodPage />} />
        <Route path="cast/:method" element={<CastPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="start" element={<LearnPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="hexagrams/:number" element={<HexagramPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
