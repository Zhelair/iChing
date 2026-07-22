import { BookOpenText, ScrollText, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { StudyNotesCopy } from '../data/studyNotesContent'

export function JournalModeNav({ copy }: { copy: StudyNotesCopy }) {
  return <nav className="journal-mode-nav" aria-label={copy.contents}>
    <NavLink to="/journal" end><ScrollText size={18} aria-hidden="true" />{copy.journal}</NavLink>
    <NavLink to="/journal/notes"><Sparkles size={18} aria-hidden="true" />{copy.practiceNotes}</NavLink>
    <NavLink to="/journal/study"><BookOpenText size={18} aria-hidden="true" />{copy.studyNotes}</NavLink>
  </nav>
}
