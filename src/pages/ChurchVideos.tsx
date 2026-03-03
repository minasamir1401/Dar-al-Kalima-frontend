import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

interface Video {
    id: number;
    title: string;
    videoId: string;
    collection?: string;
}

const ChurchVideos: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_BASE}/church-videos`)
                setVideos(res.data)
            } catch (error) {
                console.error("Error fetching church videos:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [])

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.collection && v.collection.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Grouping by collection
    const groups = filteredVideos.reduce((acc: any, video) => {
        const collection = video.collection || 'عام'
        if (!acc[collection]) acc[collection] = []
        acc[collection].push(video)
        return acc
    }, {})

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>ميديا كنيستي | فيديوهات روحية وتعليمية - دار الكلمة</title>
                <meta name="description" content="شاهد مكتبة ميديا دار الكلمة. فيديوهات تعليمية، ترانيم، أفلام مسيحية وتأملات روحية." />
                <meta property="og:title" content="ميديا كنيستي - مكتبة الفيديو" />
            </Helmet>
            <div className="section-header !flex-col !items-start gap-6 mb-12">
                <div className="section-title">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-2">
                        <i className="fa-solid fa-clapperboard text-2xl"></i>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">ميديا كنيستي</h1>
                        <p className="text-muted text-sm">مكتبة الفيديو التعليمية والروحية</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-box w-full max-w-md">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="ابحث في الفيديوهات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-16 mb-20">
                {Object.keys(groups).length > 0 ? (
                    Object.keys(groups).map((collection, idx) => (
                        <div key={idx} className="fade-in">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-2">
                                <div className="w-2 h-8 bg-primary rounded-full"></div>
                                <h2 className="text-2xl font-bold">{collection}</h2>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {groups[collection].map((video: Video) => (
                                    <div
                                        key={video.id}
                                        className="media-item-card group cursor-pointer glass"
                                        onClick={() => navigate(`/church-video/${video.id}`)}
                                    >
                                        <div className="relative aspect-video overflow-hidden rounded-xl">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="play-overlay-mini">
                                                <i className="fa-solid fa-play text-white text-3xl"></i>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-[11px] font-bold line-clamp-2 h-8 leading-tight">{video.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-30">
                        <i className="fa-solid fa-video-slash text-5xl mb-4"></i>
                        <h2>لم نجد نتائج للبحث</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChurchVideos
