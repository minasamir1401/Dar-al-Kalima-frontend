import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

interface Episode {
    id: number;
    episodeTitle: string;
    videoId: string;
    seriesTitle?: string;
}

const Podcast: React.FC = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const res = await axios.get(`${API_BASE}/podcasts`)
                setEpisodes(res.data)
            } catch (error) {
                console.error("Error fetching podcasts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEpisodes()
    }, [])

    const filteredEpisodes = episodes.filter(ep =>
        ep.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ep.seriesTitle && ep.seriesTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Grouping by series
    const groups = filteredEpisodes.reduce((acc: any, ep) => {
        const series = ep.seriesTitle || 'حلقات متنوعة'
        if (!acc[series]) acc[series] = []
        acc[series].push(ep)
        return acc
    }, {})

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>بودكاست دار الكلمة | حلقات روحية وتأملات مسموعة</title>
                <meta name="description" content="استمع إلى أحدث حلقات بودكاست دار الكلمة. تأملات روحية، دراسات كتابية، وموضوعات تهم حياتك اليومية." />
                <meta property="og:title" content="بودكاست دار الكلمة - تأملات روحية" />
                <meta property="og:description" content="استمع الآن إلى مكتبة دار الكلمة الصوتية." />
            </Helmet>
            <div className="section-header !flex-col !items-start gap-6 mb-12">
                <div className="podcast-hero !mb-0 !p-8 w-full">
                    <div className="podcast-hero-icon">
                        <i className="fa-solid fa-microphone-lines text-white"></i>
                    </div>
                    <div className="podcast-hero-text">
                        <h1 className="text-4xl font-bold">بودكاست الروح</h1>
                        <p className="text-muted">رحلة في أعماق الإيمان والحياة</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-box w-full max-w-md">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="ابحث في الحلقات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-16 mb-20">
                {Object.keys(groups).length > 0 ? (
                    Object.keys(groups).map((series, idx) => (
                        <div key={idx} className="fade-in">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-2">
                                <div className="w-2 h-8 bg-accent-gold rounded-full"></div>
                                <h2 className="text-2xl font-bold">{series}</h2>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {groups[series].map((ep: Episode) => (
                                    <div
                                        key={ep.id}
                                        className="media-item-card group cursor-pointer glass"
                                        onClick={() => navigate(`/podcast/${ep.id}`)}
                                    >
                                        <div className="relative aspect-video overflow-hidden rounded-xl">
                                            <img
                                                src={`https://img.youtube.com/vi/${ep.videoId}/mqdefault.jpg`}
                                                alt={ep.episodeTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="play-overlay-mini">
                                                <i className="fa-solid fa-microphone text-white text-3xl"></i>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-[11px] font-bold line-clamp-2 h-8 leading-tight">{ep.episodeTitle}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-30">
                        <i className="fa-solid fa-microphone-slash text-5xl mb-4"></i>
                        <h2>لم نجد نتائج للبحث</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Podcast
