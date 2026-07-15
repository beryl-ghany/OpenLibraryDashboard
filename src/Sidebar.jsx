import { useNavigate, useLocation } from 'react-router-dom'

export const SUBJECTS = [
  { key: 'adventure', label: 'Adventure' },
  { key: 'travel', label: 'Travel' },
  { key: 'exploration', label: 'Exploration' },
  { key: 'sea_stories', label: 'Sea Stories' },
  { key: 'mountaineering', label: 'Mountaineering' },
]

function Sidebar({ subject, setSubject }) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleSubjectClick(key) {
    setSubject(key)
    if (location.pathname !== '/') navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="eyebrow">Field Catalogue No. 6</span>
        <h1>The Expedition Shelf</h1>
        <p className="dek">
          A running survey of volumes charted under a single heading —
          who wrote them, when they surfaced, and how far they travelled
          through print.
        </p>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Headings</span>
        {SUBJECTS.map((s) => (
          <button
            key={s.key}
            className={`subject-chip ${
              subject === s.key && location.pathname === '/' ? 'active' : ''
            }`}
            onClick={() => handleSubjectClick(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        Data courtesy of the Open Library API (openlibrary.org)
      </div>
    </aside>
  )
}

export default Sidebar
