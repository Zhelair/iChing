import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { SoundProvider } from './audio/SoundContext'
import { I18nProvider } from './i18n/I18nContext'
import { shouldBeginAtHome } from './routing/entry'
import './index.css'

const ENTRY_SESSION_KEY = 'yi-path:entry:v1'

// Mobile browsers can reopen the last address in a fresh/private tab. Workflow
// pages are not useful as a first encounter, so a new tab restored there begins
// at home. Intentional study and Dao deep links remain untouched.
try {
  const isFreshTab = sessionStorage.getItem(ENTRY_SESSION_KEY) !== '1'
  sessionStorage.setItem(ENTRY_SESSION_KEY, '1')
  if (shouldBeginAtHome(isFreshTab, window.location.pathname)) {
    window.history.replaceState(null, '', `/${window.location.search}${window.location.hash}`)
  }
} catch {
  // Storage can be unavailable in hardened private modes; routing still works.
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
