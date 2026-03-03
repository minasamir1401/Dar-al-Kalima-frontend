import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
import { API_BASE } from '../constants'

interface Video {
    id: number;
    title: string;
    videoId: string;
    collection?: string;
}

const ChurchVideoPlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [video, setVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get(`${API_BASE}/church-videos`)
                const found = res.data.find((v: Video) => v.id.toString() === id)
                setVideo(found || null)
            } catch (error) {
                console.error("Error fetching video:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [id])

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>
    if (!video) return <div className="text-center p-32"><h2>الفيديو غير موجود</h2><button className="btn btn-primary" onClick={() => navigate('/church-videos')}>العودة للميديا</button></div>

    return (
        <div className="fade-in max-w-6xl mx-auto px-4">
            <Helmet>
                <title>{video.title} | ميديا كنيستي - دار الكلمة</title>
                <meta name="description" content={`شاهد ${video.title} من مجموعة ${video.collection || 'ميديا كنيستي'}. محتوى روحي وتعليمي متميز.`} />
                <meta property="og:title" content={`${video.title} - دار الكلمة`} />
                <meta property="og:type" content="video.other" />
            </Helmet>
            <button className="btn btn-back-blue btn-sm mb-16" onClick={() => navigate('/church-videos')}>
                <i className="fa-solid fa-arrow-right ml-2"></i> العودة للميديا
            </button>

            <div className="video-player-wrapper mb-8">
                <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                    title={video.title}
                    allowFullScreen
                ></iframe>
            </div>

            <div className="premium-card">
                <span className="badge-premium mb-3 inline-block">{video.collection || 'ميديا كنسية'}</span>
                <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
                <div className="flex gap-4">
                    <button className="btn glass btn-sm"><i className="fa-solid fa-share-nodes"></i> مشاركة</button>
                    <button className="btn glass btn-sm"><i className="fa-solid fa-heart"></i> حفظ</button>
                </div>
            </div>
        </div>
    )
}

export default ChurchVideoPlayer
