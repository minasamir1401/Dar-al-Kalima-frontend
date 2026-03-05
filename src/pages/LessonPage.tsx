import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Subject } from '../types'
import './LessonPage.css'

/* ── helper ── */
function ytThumb(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

const LessonPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [lesson, setLesson] = useState<Subject | null>(null)
    const [playlist, setPlaylist] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${API_BASE}/subjects`)
                const all: Subject[] = res.data
                const current = all.find(s => String(s.id) === id)

                if (!current) { navigate('/subjects'); return }

                setLesson(current)

                if (!current.lessons_data?.length) {
                    const related = all.filter(s =>
                        s.id !== current.id &&
                        s.subject_name === current.subject_name &&
                        s.grade === current.grade
                    )
                    setPlaylist(related)
                }

                setSelectedIndex(0)
            } catch {
                navigate('/subjects')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, navigate])

    if (loading) return (
        <div className="lp-load-wrap">
            <div className="lp-spinner" />
        </div>
    )

    if (!lesson) return null

    const hasPlaylistData = Array.isArray(lesson.lessons_data) && lesson.lessons_data.length > 0

    const currentVideoId = hasPlaylistData ? lesson.lessons_data![selectedIndex]?.videoId : lesson.video_id
    const currentDownloadUrl = hasPlaylistData ? lesson.lessons_data![selectedIndex]?.downloadUrl : lesson.download_url
    const titleToUse = hasPlaylistData ? lesson.lessons_data![selectedIndex]?.title : lesson.title
    const currentSourceUrl = hasPlaylistData ? lesson.lessons_data![selectedIndex]?.url : lesson.source_url

    const totalItems = hasPlaylistData ? lesson.lessons_data!.length : playlist.length

    const goNext = () => {
        if (hasPlaylistData && selectedIndex < lesson.lessons_data!.length - 1)
            setSelectedIndex(i => i + 1)
    }

    return (
        <div className="lp-page">
            <Helmet>
                <title>{titleToUse} | دار الكلمة</title>
            </Helmet>

            {/* ── Top Bar ── */}
            <div className="lp-topbar">
                <button className="lp-back-btn" onClick={() => navigate(-1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                    العودة
                </button>
                <div className="lp-breadcrumb">
                    <span className="lp-breadcrumb-grade">{lesson.grade}</span>
                    <span className="lp-breadcrumb-sep">›</span>
                    <span className="lp-breadcrumb-subject">{lesson.subject_name}</span>
                </div>
            </div>

            {/* ── Main Grid: video | sidebar ── */}
            <div className="lp-grid">

                {/* ══ Player Column ══ */}
                <div className="lp-player-col">

                    {/* Video / Link / Empty */}
                    {currentVideoId ? (
                        <div className="lp-video-wrap">
                            <iframe
                                className="lp-iframe"
                                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`}
                                title={titleToUse}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : currentSourceUrl ? (
                        <div className="lp-link-card">
                            <div className="lp-link-icon">🔗</div>
                            <h3 className="lp-link-title">رابط خارجي للدرس</h3>
                            <p className="lp-link-desc">هذا الدرس متوفر عبر منصة أخرى، اضغط للانتقال إليه.</p>
                            <a href={currentSourceUrl} target="_blank" rel="noopener noreferrer" className="lp-link-open-btn">
                                فتح الدرس
                            </a>
                        </div>
                    ) : (
                        <div className="lp-no-video">
                            <span style={{ fontSize: 44 }}>🎬</span>
                            <p>المحتوى غير متوفر</p>
                        </div>
                    )}

                    {/* Info Bar */}
                    <div className="lp-info-bar">
                        <div className="lp-info-left">
                            {hasPlaylistData && (
                                <span className="lp-ep-badge">{selectedIndex + 1} / {totalItems}</span>
                            )}
                            <h1 className="lp-ep-title">{titleToUse}</h1>
                        </div>
                        {currentDownloadUrl && (
                            <a href={currentDownloadUrl} target="_blank" rel="noopener noreferrer" className="lp-dl-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                تحميل
                            </a>
                        )}
                    </div>
                </div>

                {/* ══ Sidebar ══ */}
                <div className="lp-sidebar">
                    <div className="lp-side-header">
                        <h2 className="lp-side-title">قائمة الحلقات</h2>
                        <span className="lp-side-count">{totalItems} درس</span>
                    </div>

                    <div className="lp-list">
                        {!hasPlaylistData && playlist.length === 0 ? (
                            <div className="lp-empty">
                                <span style={{ fontSize: 32 }}>📭</span>
                                <p>لا توجد دروس أخرى</p>
                            </div>
                        ) : hasPlaylistData ? (
                            lesson.lessons_data!.map((ep, idx) => {
                                const active = idx === selectedIndex
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedIndex(idx)}
                                        className={`lp-ep-row${active ? ' active' : ''}`}
                                    >
                                        <div className="lp-thumb-wrap">
                                            {ep.videoId
                                                ? <img src={ytThumb(ep.videoId)} alt={ep.title} className="lp-thumb" loading="lazy" />
                                                : <div className="lp-thumb-placeholder">▶</div>
                                            }
                                            {active && <div className="lp-play-overlay">▶</div>}
                                        </div>
                                        <div className="lp-ep-info">
                                            <span className={`lp-ep-text${active ? ' active' : ''}`}>{ep.title}</span>
                                            {active && <span className="lp-now-playing">▶ يُشغَّل الآن</span>}
                                        </div>
                                        {active && <div className="lp-active-bar" />}
                                    </button>
                                )
                            })
                        ) : (
                            playlist.map((ep) => {
                                const active = ep.id === lesson.id
                                return (
                                    <Link
                                        key={ep.id}
                                        to={`/lesson/${ep.id}`}
                                        className={`lp-ep-row${active ? ' active' : ''}`}
                                    >
                                        <div className="lp-thumb-wrap">
                                            {ep.video_id
                                                ? <img src={ytThumb(ep.video_id)} alt={ep.title} className="lp-thumb" loading="lazy" />
                                                : <div className="lp-thumb-placeholder">▶</div>
                                            }
                                            {active && <div className="lp-play-overlay">▶</div>}
                                        </div>
                                        <div className="lp-ep-info">
                                            <span className={`lp-ep-text${active ? ' active' : ''}`}>{ep.title}</span>
                                            {active && <span className="lp-now-playing">▶ يُشغَّل الآن</span>}
                                        </div>
                                        {active && <div className="lp-active-bar" />}
                                    </Link>
                                )
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {hasPlaylistData && (
                        <div className="lp-side-footer">
                            <button
                                onClick={goNext}
                                disabled={selectedIndex >= lesson.lessons_data!.length - 1}
                                className="lp-next-btn"
                            >
                                التالي
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            {currentDownloadUrl && (
                                <a href={currentDownloadUrl} target="_blank" rel="noopener noreferrer" className="lp-sub-btn">
                                    ملحقات
                                </a>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default LessonPage
