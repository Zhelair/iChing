import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HistoryJourney } from '../components/HistoryJourney'

export function HistoryPage() {
  return <div className="page-shell py-10 sm:py-16"><div className="reading-column"><Link to="/iching" className="button-text"><ArrowLeft size={17} />Back to I Ching</Link><HistoryJourney /></div></div>
}
