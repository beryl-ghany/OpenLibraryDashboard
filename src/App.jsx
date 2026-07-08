import { useState, useEffect, useMemo } from 'react'

const SUBJECTS = [
  { key: 'adventure', label: 'Adventure' },
  { key: 'travel', label: 'Travel' },
  { key: 'exploration', label: 'Exploration' },
  { key: 'sea_stories', label: 'Sea Stories' },
  { key: 'mountaineering', label: 'Mountaineering' },
]

function decadeOf(year) {
  if (!year) return null
  return Math.floor(year / 10) * 10
}

function App() {
  const [subject, setSubject] = useState('adventure')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [decadeFilter, setDecadeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [minEditions, setMinEditions] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setQuery('')
    setDecadeFilter('all')
    setTagFilter('all')
    setMinEditions(0)

    async function fetchBooks() {
      try {
        const res = await fetch(
          `https://openlibrary.org/subjects/${subject}.json?limit=100`
        )
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        if (cancelled) return

        const works = (data.works || [])
          .filter((w) => w.title)
          .map((w) => ({
            id: w.key,
            title: w.title,
            author: w.authors?.[0]?.name || 'Unknown voyager',
            year: w.first_publish_year || null,
            editions: w.edition_count || 0,
            cover: w.cover_id
              ? `https://covers.openlibrary.org/b/id/${w.cover_id}-M.jpg`
              : null,
            tags: (w.subject || []).slice(0, 4),
          }))

        setBooks(works)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBooks()
    return () => {
      cancelled = true
    }
  }, [subject])

  const decades = useMemo(() => {
    const set = new Set()
    books.forEach((b) => {
      const d = decadeOf(b.year)
      if (d) set.add(d)
    })
    return Array.from(set).sort((a, b) => a - b)
  }, [books])

  const topTags = useMemo(() => {
    const counts = {}
    books.forEach((b) =>
      b.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1
      })
    )
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)
  }, [books])

  const maxEditions = useMemo(
    () => books.reduce((max, b) => Math.max(max, b.editions), 0),
    [books]
  )

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesQuery = b.title
        .toLowerCase()
        .includes(query.trim().toLowerCase())
      const matchesDecade =
        decadeFilter === 'all' || decadeOf(b.year) === Number(decadeFilter)
      const matchesTag = tagFilter === 'all' || b.tags.includes(tagFilter)
      const matchesEditions = b.editions >= minEditions
      return matchesQuery && matchesDecade && matchesTag && matchesEditions
    })
  }, [books, query, decadeFilter, tagFilter, minEditions])

  const stats = useMemo(() => {
    if (books.length === 0) {
      return { total: 0, avgYear: '—', topDecade: '—', totalEditions: 0 }
    }
    const yearsKnown = books.filter((b) => b.year)
    const avgYear = yearsKnown.length
      ? Math.round(
          yearsKnown.reduce((sum, b) => sum + b.year, 0) / yearsKnown.length
        )
      : '—'

    const decadeCounts = {}
    books.forEach((b) => {
      const d = decadeOf(b.year)
      if (d) decadeCounts[d] = (decadeCounts[d] || 0) + 1
    })
    const topDecadeEntry = Object.entries(decadeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]
    const topDecade = topDecadeEntry ? `${topDecadeEntry[0]}s` : '—'

    const totalEditions = books.reduce((sum, b) => sum + b.editions, 0)

    return { total: books.length, avgYear, topDecade, totalEditions }
  }, [books])

  return (
    <div className="shelf">
      <header className="masthead">
        <div className="masthead-top">
          <span className="eyebrow">Field Catalogue No. 5</span>
          <span className="eyebrow">Est. from the Open Library Archive</span>
        </div>
        <h1>The Expedition Shelf</h1>
        <p className="dek">
          A running survey of volumes charted under a single heading —
          who wrote them, when they surfaced, and how far they travelled
          through print.
        </p>

        <div className="subject-picker">
          {SUBJECTS.map((s) => (
            <button
              key={s.key}
              className={`subject-chip ${subject === s.key ? 'active' : ''}`}
              onClick={() => setSubject(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="banner-error">
          The archive didn't answer: {error}. Try another heading above.
        </div>
      )}

      {loading ? (
        <div className="loading-block">Charting the shelf…</div>
      ) : (
        <>
          <section className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Volumes catalogued</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Average publication year</span>
              <span className="stat-value">{stats.avgYear}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Best-represented decade</span>
              <span className="stat-value">{stats.topDecade}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Editions in print, combined</span>
              <span className="stat-value">{stats.totalEditions}</span>
            </div>
          </section>

          <section className="controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search titles on this shelf…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="control-group">
              <label htmlFor="decade-select">Era</label>
              <select
                id="decade-select"
                value={decadeFilter}
                onChange={(e) => setDecadeFilter(e.target.value)}
              >
                <option value="all">All eras</option>
                {decades.map((d) => (
                  <option key={d} value={d}>
                    {d}s
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="tag-select">Theme</label>
              <select
                id="tag-select"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="all">All themes</option>
                {topTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group slider-group">
              <label htmlFor="edition-range">
                Min. editions in print: <strong>{minEditions}</strong>
              </label>
              <input
                id="edition-range"
                type="range"
                min="0"
                max={maxEditions || 1}
                value={minEditions}
                onChange={(e) => setMinEditions(Number(e.target.value))}
              />
            </div>
          </section>

          <section className="results-meta">
            Showing {filtered.length} of {books.length} volumes
          </section>

          <section className="book-list">
            {filtered.length === 0 && (
              <div className="empty-state">
                Nothing matches that combination. Loosen a filter to widen
                the search.
              </div>
            )}
            {filtered.map((b) => (
              <article key={b.id} className="book-row">
                <div className="book-cover">
                  {b.cover ? (
                    <img src={b.cover} alt={b.title} loading="lazy" />
                  ) : (
                    <div className="cover-placeholder">No plate</div>
                  )}
                </div>
                <div className="book-body">
                  <h3>{b.title}</h3>
                  <p className="book-author">{b.author}</p>
                  <div className="book-meta">
                    {b.year && (
                      <span className="stamp">
                        {decadeOf(b.year)}s · {b.year}
                      </span>
                    )}
                    <span className="edition-badge">
                      {b.editions} edition{b.editions === 1 ? '' : 's'}
                    </span>
                  </div>
                  {b.tags.length > 0 && (
                    <div className="tag-row">
                      {b.tags.map((t) => (
                        <span key={t} className="tag-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      <footer className="shelf-footer">
        Data courtesy of the Open Library API (openlibrary.org)
      </footer>
    </div>
  )
}

export default App
