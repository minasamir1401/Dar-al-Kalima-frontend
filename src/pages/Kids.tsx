import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

interface KidVideo {
    id: number;
    title: string;
    videoId: string;
    sectionTitle: string;
    icon: string;
    color: string;
}

const SectionDivider: React.FC = () => (
    <div className="section-divider">
        <div className="spiritual-divider">
            <i className="fa-solid fa-star"></i>
        </div>
    </div>
)

const Kids: React.FC = () => {
    const [videos, setVideos] = useState<KidVideo[]>([])
    const [activeVideo, setActiveVideo] = useState<KidVideo | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'videos' | 'games'>('videos')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_BASE}/kids-videos`)
                setVideos(res.data)
            } catch (err) {
                console.error("Error fetching kids videos:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [])

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.sectionTitle && v.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const sections = filteredVideos.reduce((acc: any, video) => {
        const section = video.sectionTitle || 'منوعات إيمانية'
        if (!acc[section]) acc[section] = { title: section, icon: video.icon || 'fa-star', color: video.color || '#ff9800', videos: [] }
        acc[section].videos.push(video)
        return acc
    }, {})

    // Mock games
    const games = [
        { title: 'لعبة ترتيب الصور الكتابية', icon: 'fa-puzzle-piece', color: '#4caf50', link: 'https://www.biblegamescentral.com/' },
        { title: 'تلوين الشخصيات المقدسة', icon: 'fa-palette', color: '#e91e63', link: 'https://www.supercoloring.com/coloring-pages/christianity-bible' },
        { title: 'متاهة العبور مع موسى', icon: 'fa-map-signs', color: '#2196f3', link: 'https://www.dltk-bible.com/mazes/' },
        { title: 'بنك الأسئلة الدينية', icon: 'fa-brain', color: '#ff9800', link: 'https://www.biblepathwayadventures.com/activities/' }
    ]

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>ركن الأطفال | دار الكلمة - قصص مسيحية وألعاب تعليمية</title>
                <meta name="description" content="مساحة مخصصة للأطفال على دار الكلمة. فيديوهات تعليمية، قصص مسيحية، وألعاب تفاعلية آمنة ومفيدة لنشر قيم الإيمان." />
                <meta property="og:title" content="ركن الأطفال - دار الكلمة" />
                <meta property="og:image" content="/kids_banner.png" />
            </Helmet>
            <div className="hero premium-card mb-8 text-center !p-12" style={{ background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(30, 136, 229, 0.15))', borderBottom: '4px solid #2196f3' }}>
                <h1 className="text-4xl font-bold mb-4 text-[#2196f3]">ركن الأطفال السعيد 🎈</h1>

                <div className="flex flex-col items-center gap-6 mt-8">
                    <div className="flex justify-center gap-4">
                        <button
                            className={`btn ${activeTab === 'videos' ? 'btn-kids-blue btn-kids-active' : 'glass opacity-60'}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            <i className="fa-solid fa-film ml-2"></i> فيديوهات
                        </button>
                        <button
                            className={`btn ${activeTab === 'games' ? 'btn-kids-blue btn-kids-active' : 'glass opacity-60'}`}
                            onClick={() => setActiveTab('games')}
                        >
                            <i className="fa-solid fa-gamepad ml-2"></i> ألعاب تعليمية
                        </button>
                    </div>

                    {/* Search Bar for Kids */}
                    {activeTab === 'videos' && (
                        <div className="search-box search-box-kids w-full max-w-md">
                            <i className="fa-solid fa-face-smile"></i>
                            <input
                                type="text"
                                className="!pr-12 !rounded-full"
                                placeholder="ابحث عن كارتون أو فيديو..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {activeVideo && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl fade-in" onClick={() => setActiveVideo(null)}>
                    <div className="w-full max-w-4xl glass p-2 relative rounded-[32px] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="video-player-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                                title={activeVideo.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="text-white text-xl font-bold">{activeVideo.title}</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'videos' ? (
                <div className="space-y-12 mb-20">
                    {Object.values(sections).map((section: any, idx: number) => (
                        <div key={idx}>
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-2">
                                <i className={`fa-solid ${section.icon} text-xl`} style={{ color: section.color }}></i>
                                <h2 className="text-2xl font-bold">{section.title}</h2>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {section.videos.map((vid: KidVideo, vIdx: number) => (
                                    <div
                                        key={vIdx}
                                        className="media-item-card group cursor-pointer glass"
                                        onClick={() => setActiveVideo(vid)}
                                    >
                                        <div className="relative aspect-video overflow-hidden rounded-xl">
                                            <img
                                                src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                                                alt={vid.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="play-overlay-mini">
                                                <i className="fa-solid fa-play text-white text-2xl"></i>
                                            </div>
                                        </div>
                                        <div className="p-3 text-center">
                                            <div className="text-[11px] font-bold line-clamp-2 leading-tight h-8">{vid.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <SectionDivider />
                        </div>
                    ))}
                    {Object.keys(sections).length === 0 && (
                        <div className="text-center py-20 opacity-30">
                            <i className="fa-solid fa-face-sad-tear text-5xl mb-4"></i>
                            <h2>مفيش فيديوهات بالاسم ده يا بطل</h2>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-slide-up">
                    {games.map((game, idx) => (
                        <a
                            key={idx}
                            href={game.link}
                            target="_blank"
                            rel="noreferrer"
                            className="premium-card text-center hover:scale-105 transition-all !p-8 flex flex-col items-center gap-4"
                            style={{ borderColor: game.color + '44' }}
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white shadow-lg" style={{ backgroundColor: game.color }}>
                                <i className={`fa-solid ${game.icon}`}></i>
                            </div>
                            <h3 className="text-sm font-bold">{game.title}</h3>
                            <div className="text-[10px] text-muted">اضغط للعب الآن</div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Kids
