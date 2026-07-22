import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DaoHubCard({ to, icon: Icon, title, body, action, className = '' }: { to: string; icon: LucideIcon; title: string; body: string; action: string; className?: string }) {
  return <Link to={to} className={`surface dao-hub-card ${className}`.trim()}>
    <span><Icon size={23} aria-hidden="true" /></span>
    <h2>{title}</h2>
    <p>{body}</p>
    <strong>{action}<ArrowRight size={16} aria-hidden="true" /></strong>
  </Link>
}
