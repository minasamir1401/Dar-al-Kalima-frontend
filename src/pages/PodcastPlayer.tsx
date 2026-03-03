import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
import { API_BASE } from '../constants'

interface Episode {
    id: number;
    episodeTitle: string;
    videoId: string;
    seriesTitle?: string;
}

const PodcastPlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [episode, setEpisode] = useState<Episode | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const res = await axios.get(`${API_BASE}/podcasts`)
                const found = res.data.find((p: Episode) => p.id.toString() === id)
                setEpisode(found || null)
            } catch (error) {
                console.error("Error fetching podcast:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEpisode()
    }, [id])

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>
    if (!episode) return <div className="text-center p-32"><h2>الحلقة غير موجودة</h2><button className="btn btn-primary" onClick={() => navigate('/podcast')}>العودة للبودكاست</button></div>

    return (
        <div className="fade-in max-w-6xl mx-auto px-4">
            <Helmet>
                <title>{episode.episodeTitle} | بودكاست دار الكلمة</title>
                <meta name="description" content={`استمع إلى ${episode.episodeTitle} من سلسلة ${episode.seriesTitle || 'تأملات روحية'}. بودكاست دار الكلمة لبنائك الروحي.`} />
                <meta property="og:title" content={`${episode.episodeTitle} - بودكاست دار الكلمة`} />
                <meta property="og:type" content="music.song" />
            </Helmet>
            <button className="btn btn-back-blue btn-sm mb-16" onClick={() => navigate('/podcast')}>
                <i className="fa-solid fa-arrow-right ml-2"></i> العودة للبودكاست
            </button>



            <div className="video-player-wrapper mb-8">
                <iframe
                    src={`https://www.youtube.com/embed/${episode.videoId}?autoplay=1&rel=0`}
                    title={episode.episodeTitle}
                    allowFullScreen
                ></iframe>
            </div>

            <div className="premium-card">
                <span className="badge-premium mb-3 inline-block">{episode.seriesTitle || 'بودكاست الروح'}</span>
                <h1 className="text-3xl font-bold mb-4">{episode.episodeTitle}</h1>
                <div className="flex gap-4">
                    <button className="btn glass btn-sm"><i className="fa-solid fa-microphone-lines"></i> استماع فقط</button>
                    <button className="btn glass btn-sm"><i className="fa-solid fa-share-nodes"></i> مشاركة</button>
                </div>
            </div>
        </div>
    )
}

export default PodcastPlayer
