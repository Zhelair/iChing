import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { SoundProvider } from './audio/SoundContext'
import { I18nProvider } from './i18n/I18nContext'
import './index.css'

const ENTRY_SESSION_KEY = 'yi-path:entry:v1'

// A browser can reopen the last address in a fresh/private tab. An empty journal
// is not a useful first encounter, so a new tab that lands there begins at home.
try {
  const isFreshTab = sessionStorage.getItem(ENTRY_SESSION_KEY) !== '1'
  sessionStorage.setItem(ENTRY_SESSION_KEY, '1')
  if (isFreshTab && window.location.pathname.replace(/\/+$/, '') === '/journal') {
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
