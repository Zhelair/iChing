import { BookOpenText, Compass, Sprout, Wind } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { DaoCopy } from '../data/daoContent'
import type { DaoShellCopy } from '../data/daoShellContent'

const ITEMS = [
  { to: '/dao', copyKey: 'overview', icon: Compass, end: true },
  { to: '/dao/study/start', copyKey: 'study', icon: BookOpenText, end: false },
  { to: '/dao/practice', copyKey: 'practice', icon: Wind, end: false },
  { to: '/dao/living', copyKey: 'living', icon: Sprout, end: false },
] as const

export function DaoNavigation({ copy, shell }: { copy: DaoCopy; shell: DaoShellCopy }) {
  return <nav className="page-shell dao-path-nav" aria-label={copy.navDao}>
    {ITEMS.map(({ to, copyKey, icon: Icon, end }) => {
      const label = copyKey === 'overview' ? shell.overview : copy[copyKey]
      return <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'is-active' : ''}>
        <Icon size={17} aria-hidden="true" /><span>{label}</span>
      </NavLink>
    })}
  </nav>
}
