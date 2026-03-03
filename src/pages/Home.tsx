import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Book, Course } from '../types'

const SectionDivider: React.FC = () => (
    <div className="section-divider">
        <div className="spiritual-divider">
            <i className="fa-solid fa-cross"></i>
        </div>
    </div>
)

const Home: React.FC = () => {
    const [latestBooks, setLatestBooks] = useState<Book[]>([])
    const [latestCourses, setLatestCourses] = useState<Course[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, coursesRes] = await Promise.all([
                    axios.get(`${API_BASE}/books`),
                    axios.get(`${API_BASE}/courses`)
                ])
                setLatestBooks(booksRes.data.slice(0, 4))
                setLatestCourses(coursesRes.data.slice(0, 4))
            } catch (error) {
                console.error("Error fetching homepage data:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>دار الكلمة | الرئيسية - المكتبة المسيحية الشاملة</title>
                <meta name="description" content="البوابة الرقمية لدار الكلمة. كتب مسيحية، دورات تعليمية، فيديوهات كنسية، وبودكاست روحي." />
                <meta property="og:title" content="دار الكلمة | الرئيسية - المكتبة المسيحية الشاملة" />
                <meta property="og:description" content="اكتشف آلاف الكتب والدورات التعليمية المسيحية مجاناً على منصة دار الكلمة." />
                <meta property="og:type" content="website" />
            </Helmet>
            {/* Modern Hero Section */}
            <div className="premium-card mb-16 !p-12 md:!p-24 relative overflow-hidden text-center modern-hero-gradient border-white/5">
                {/* Spiritual Ornaments */}
                <i className="fa-solid fa-cross spiritual-bg-ornament top-[-20px] right-[-20px] rotate-12"></i>
                <i className="fa-solid fa-cross spiritual-bg-ornament bottom-[-30px] left-[-20px] -rotate-12" style={{ animationDelay: '2s', fontSize: '12rem' }}></i>

                <div className="relative z-10">
                    <div className="badge-premium mb-6 !bg-primary/10 !text-primary !border-primary/20 !px-4 !py-1.5 rounded-full inline-flex items-center gap-2">
                        <i className="fa-solid fa-star-of-david animate-pulse"></i>
                        <span>منصة دار الكلمة الرقمية</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                        نغرف من <span className="text-primary glow-text">الحكمة</span> <br />
                        ونبني <span className="bg-gradient-to-r from-accent-gold to-secondary bg-clip-text text-transparent">الإيمان</span>
                    </h1>

                    <p className="text-base md:text-xl text-muted/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                        أكبر مكتبة قبطية رقمية تجمع الكتب، الكورسات، والبودكاست في مكان واحد لنمو روحي متكامل.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/books" className="btn btn-primary px-10 py-4 shadow-2xl scale-110 hover:scale-115 transition-transform">
                            <i className="fa-solid fa-book-open ml-2"></i> تصفح المكتبة
                        </Link>
                        <Link to="/kids" className="btn glass px-10 py-4 !bg-white/5 hover:!bg-white/10 border-white/10">
                            <i className="fa-solid fa-child ml-2 text-accent-gold"></i> ركن الأطفال 🎈
                        </Link>
                    </div>
                </div>
            </div>

            {/* Redesigned Quick Access Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                <QuickLink to="/courses" icon="fa-graduation-cap" title="الكورسات" subtitle="تعلم ونمو" color="#3b82f6" />
                <QuickLink to="/church-videos" icon="fa-clapperboard" title="الميديا" subtitle="شاهد وتأمل" color="#ef4444" />
                <QuickLink to="/podcast" icon="fa-microphone-lines" title="بودكاست" subtitle="استمع وتغير" color="#f59e0b" />
                <QuickLink to="/kids" icon="fa-gamepad" title="الألعاب" subtitle="العب وامرح" color="#10b981" />
            </div>

            <SectionDivider />

            {/* Latest Books - 2 on Mobile, 4 on PC */}
            <SectionHeader title="أحدث الكتب المضافة" to="/books" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16 px-1">
                {latestBooks.map((book, idx) => (
                    <div key={idx} className="book-card glass group cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-2">
                            <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" loading="lazy" />
                            <div className="absolute top-2 left-2 badge-premium !bg-black/60 !backdrop-blur-md !border-none text-[9px] !px-2 !py-1 shadow-lg">
                                {book.category || 'عام'}
                            </div>
                        </div>
                        <div className="text-[11px] font-bold line-clamp-2 h-8 text-center px-1">{book.title}</div>
                    </div>
                ))}
            </div>

            <SectionDivider />

            {/* Featured Courses - 2 on Mobile, 4 on PC */}
            <SectionHeader title="كورسات تعليمية" to="/courses" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16 px-1">
                {latestCourses.map((course) => (
                    <div key={course.id} className="book-card glass group !p-2 cursor-pointer" onClick={() => navigate(`/course/${course.id}`)}>
                        <div className="relative aspect-video overflow-hidden rounded-xl mb-2">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" loading="lazy" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <i className="fa-solid fa-play text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                        </div>
                        <div className="text-[11px] font-bold line-clamp-2 h-8 text-center px-1">{course.title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const QuickLink: React.FC<{ to: string, icon: string, title: string, subtitle: string, color: string }> = ({ to, icon, title, subtitle, color }) => (
    <Link to={to} className="premium-card !p-4 flex items-center gap-4 hover:scale-[1.05] transition-all group overflow-hidden relative" style={{ borderColor: color + '22' }}>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className={`fa-solid ${icon} text-6xl`}></i>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 group-hover:rotate-6 transition-transform" style={{ backgroundColor: color }}>
            <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-bold group-hover:text-primary transition-colors">{title}</span>
            <span className="text-[10px] text-muted font-medium">{subtitle}</span>
        </div>
    </Link>
)

const SectionHeader: React.FC<{ title: string, to: string }> = ({ title, to }) => (
    <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl font-bold border-r-4 border-primary pr-3">{title}</h2>
        <Link to={to} className="text-xs text-primary font-bold hover:underline">عرض الكل <i className="fa-solid fa-arrow-left mr-1"></i></Link>
    </div>
)

export default Home
