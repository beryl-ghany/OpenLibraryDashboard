import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { keyFromOlid } from './lib'

function extractDescription(desc) {
  if (!desc) return null
  if (typeof desc === 'string') return desc
  if (typeof desc === 'object' && desc.value) return desc.value
  return null
}

function DetailPage() {
  const { olid } = useParams()
  const location = useLocation()
  const backSubject = location.state?.subject

  const [work, setWork] = useState(null)
  const [editionInfo, setEditionInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setWork(null)
    setEditionInfo(null)

    async function fetchDetail() {
      try {
        const workKey = keyFromOlid(olid)

        const [workRes, editionsRes] = await Promise.all([
          fetch(`https://openlibrary.org${workKey}.json`),
          fetch(`https://openlibrary.org${workKey}/editions.json?limit=50`),
        ])

        if (!workRes.ok) throw new Error(`Request failed: ${workRes.status}`)
        const workData = await workRes.json()
        const editionsData = editionsRes.ok
          ? await editionsRes.json()
          : { entries: [] }

        if (cancelled) return

        const entries = editionsData.entries || []
        const publishers = new Set()
        const languages = new Set()
        let earliestYear = null

        entries.forEach((e) => {
          ;(e.publishers || []).forEach((p) => publishers.add(p))
          ;(e.languages || []).forEach((l) => {
            const code = l.key?.replace('/languages/', '')
            if (code) languages.add(code)
          })
          const y = parseInt(e.publish_date, 10)
          if (!isNaN(y) && (!earliestYear || y < earliestYear)) {
            earliestYear = y
          }
        })

        setWork(workData)
        setEditionInfo({
          editionCount: entries.length,
          publishers: Array.from(publishers).slice(0, 6),
          languages: Array.from(languages).slice(0, 6),
          earliestYear,
        })
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetail()
    return () => {
      cancelled = true
    }
  }, [olid])

  const backHref = backSubject ? '/' : '/'
  const description = work ? extractDescription(work.description) : null
  const coverId = work?.covers?.find((c) => c > 0)

  return (
    <div className="page detail-page">
      <Link to={backHref} className="back-link">
        ← Back to shelf
      </Link>

      {loading && <div className="loading-block">Pulling the full record…</div>}

      {error && (
        <div className="banner-error">
          The archive didn't answer: {error}.
        </div>
      )}

      {work && !loading && (
        <article className="detail-record">
          <div className="detail-cover">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                alt={work.title}
              />
            ) : (
              <div className="cover-placeholder large">No plate on file</div>
            )}
          </div>

          <div className="detail-body">
            <span className="eyebrow">Full record</span>
            <h1>{work.title}</h1>
            {work.subtitle && <p className="detail-subtitle">{work.subtitle}</p>}

            {description && <p className="detail-description">{description}</p>}

            <div className="detail-grid">
              <div className="detail-fact">
                <span className="stat-label">Editions on file</span>
                <span className="stat-value small">
                  {editionInfo?.editionCount ?? '—'}
                </span>
              </div>
              <div className="detail-fact">
                <span className="stat-label">Earliest edition found</span>
                <span className="stat-value small">
                  {editionInfo?.earliestYear ?? '—'}
                </span>
              </div>
              <div className="detail-fact">
                <span className="stat-label">Languages printed in</span>
                <span className="stat-value small">
                  {editionInfo?.languages?.length ?? 0}
                </span>
              </div>
            </div>

            {editionInfo?.publishers?.length > 0 && (
              <div className="detail-section">
                <h3>Publishers on record</h3>
                <div className="tag-row">
                  {editionInfo.publishers.map((p) => (
                    <span key={p} className="tag-chip">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {editionInfo?.languages?.length > 0 && (
              <div className="detail-section">
                <h3>Languages on record</h3>
                <div className="tag-row">
                  {editionInfo.languages.map((l) => (
                    <span key={l} className="tag-chip">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {work.subjects?.length > 0 && (
              <div className="detail-section">
                <h3>All catalogued themes</h3>
                <div className="tag-row">
                  {work.subjects.slice(0, 20).map((s) => (
                    <span key={s} className="tag-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              className="external-link"
              href={`https://openlibrary.org${work.key}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Open Library ↗
            </a>
          </div>
        </article>
      )}
    </div>
  )
}

export default DetailPage
