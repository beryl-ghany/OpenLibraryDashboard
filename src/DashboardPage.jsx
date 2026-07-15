import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { decadeOf, olidFromKey } from './lib'

function DashboardPage({ subject }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [decadeFilter, setDecadeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [minEditions, setMinEditions] = useState(0)
  const [eraChartMode, setEraChartMode] = useState('bar') // 'bar' | 'line'

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

  // Chart 1 data: volumes per decade (and cumulative, for the line toggle)
  const eraChartData = useMemo(() => {
    const decadeCounts = {}
    books.forEach((b) => {
      const d = decadeOf(b.year)
      if (d) decadeCounts[d] = (decadeCounts[d] || 0) + 1
    })
    const sortedDecades = Object.keys(decadeCounts)
      .map(Number)
      .sort((a, b) => a - b)

    let running = 0
    return sortedDecades.map((d) => {
      running += decadeCounts[d]
      return {
        decade: `${d}s`,
        count: decadeCounts[d],
        cumulative: running,
      }
    })
  }, [books])

  // Chart 2 data: top themes by frequency
  const tagChartData = useMemo(() => {
    const counts = {}
    books.forEach((b) =>
      b.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1
      })
    )
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }))
  }, [books])

  const busiestDecade = eraChartData.length
    ? eraChartData.reduce((a, b) => (b.count > a.count ? b : a))
    : null
  const leadingTag = tagChartData[0]

  return (
    <div className="page">
      {error && (
        <div className="banner-error">
          The archive didn't answer: {error}. Try another heading in the
          sidebar.
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

          <section className="charts-row">
            <div className="chart-card">
              <div className="chart-card-header">
                <h2>Volumes surfacing by decade</h2>
                <div className="toggle-group">
                  <button
                    className={eraChartMode === 'bar' ? 'active' : ''}
                    onClick={() => setEraChartMode('bar')}
                  >
                    By decade
                  </button>
                  <button
                    className={eraChartMode === 'line' ? 'active' : ''}
                    onClick={() => setEraChartMode('line')}
                  >
                    Running total
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                {eraChartMode === 'bar' ? (
                  <BarChart data={eraChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--line)"
                    />
                    <XAxis
                      dataKey="decade"
                      stroke="var(--ivory-dim)"
                      fontSize={11}
                    />
                    <YAxis stroke="var(--ivory-dim)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--ink-3)',
                        border: '1px solid var(--line)',
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="var(--brass)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={eraChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--line)"
                    />
                    <XAxis
                      dataKey="decade"
                      stroke="var(--ivory-dim)"
                      fontSize={11}
                    />
                    <YAxis stroke="var(--ivory-dim)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--ink-3)',
                        border: '1px solid var(--line)',
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="var(--brass)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
              {busiestDecade && (
                <p className="chart-annotation">
                  {eraChartMode === 'bar'
                    ? `The ${busiestDecade.decade} produced more titles on this shelf than any other decade — ${busiestDecade.count} in total.`
                    : `By the ${eraChartData[eraChartData.length - 1]?.decade}, the shelf had accumulated ${eraChartData[eraChartData.length - 1]?.cumulative} titles under this heading.`}
                </p>
              )}
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h2>Leading themes on this shelf</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tagChartData} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                  <XAxis type="number" stroke="var(--ivory-dim)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="tag"
                    stroke="var(--ivory-dim)"
                    fontSize={11}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--ink-3)',
                      border: '1px solid var(--line)',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--rust)" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {leadingTag && (
                <p className="chart-annotation">
                  "{leadingTag.tag}" is the most common companion theme here,
                  tagging {leadingTag.count} of the {stats.total} titles —
                  worth trying as a theme filter below.
                </p>
              )}
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
            Showing {filtered.length} of {books.length} volumes — click a
            title for its full record
          </section>

          <section className="book-list">
            {filtered.length === 0 && (
              <div className="empty-state">
                Nothing matches that combination. Loosen a filter to widen
                the search.
              </div>
            )}
            {filtered.map((b) => (
              <Link
                to={`/book/${olidFromKey(b.id)}`}
                state={{ subject }}
                key={b.id}
                className="book-row"
              >
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
                <div className="row-arrow">→</div>
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage
