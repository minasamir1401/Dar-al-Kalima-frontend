import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Course } from '../types'

const categoryConfig = [
    { name: 'برمجة', icon: 'fa-code', color: '#1a73e8' },
    { name: 'انجليزي', icon: 'fa-language', color: '#fbbc04' },
    { name: 'تكنولوجيا المعلومات', icon: 'fa-microchip', color: '#34a853' },
    { name: 'جرافيك ديزاين', icon: 'fa-palette', color: '#ea4335' },
    { name: 'الهندسة', icon: 'fa-compass-drafting', color: '#673ab7' },
    { name: 'الادارة و التجارة', icon: 'fa-briefcase', color: '#607d8b' },
    { name: 'الطب', icon: 'fa-stethoscope', color: '#e91e63' },
    { name: 'فنون', icon: 'fa-paintbrush', color: '#ff9800' },
    { name: 'الثانوية العامة', icon: 'fa-school', color: '#795548' },
    { name: 'اللغات', icon: 'fa-comments', color: '#00bcd4' },
    { name: 'تسويق', icon: 'fa-bullhorn', color: '#4caf50' },
    { name: 'أعمال يدوية', icon: 'fa-hands', color: '#9c27b0' }
]

const Courses: React.FC = () => {
    const [allCourses, setAllCourses] = useState<Course[]>([])
    const [displayedCourses, setDisplayedCourses] = useState<Course[]>([])
    const [currentCategory, setCurrentCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [itemsPerPage] = useState(24)
    const [visibleCount, setVisibleCount] = useState(24)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${API_BASE}/courses`)
                setAllCourses(res.data)
            } catch (error) {
                console.error("Error fetching courses:", error)
            }
        }
        fetchCourses()
    }, [])

    useEffect(() => {
        let filtered = allCourses
        if (currentCategory) {
            filtered = allCourses.filter(c => c.category === currentCategory)
        }
        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        setDisplayedCourses(filtered.slice(0, visibleCount))
    }, [allCourses, currentCategory, searchQuery, visibleCount]) // fixed typo in dependency
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + itemsPerPage)
    }

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>كورسات دار الكلمة | {currentCategory || 'جميع الدورات'} - تعليم مجاني</title>
                <meta name="description" content="دورات تعليمية مجانية في مختلف المجالات: لغات، كمبيوتر، جرافيك، والمزيد على منصة دار الكلمة التعليمية." />
                <meta property="og:title" content={`كورسات دار الكلمة | ${currentCategory || 'جميع الدورات'}`} />
            </Helmet>
            <div className="section-header !flex-col !items-start gap-6">
                <div className="section-title">
                    <i className="fa-solid fa-cross spiritual-cross"></i>
                    <h2>{currentCategory || 'جميع الكورسات'} ({allCourses.filter(c => (!currentCategory || c.category === currentCategory) && c.title.toLowerCase().includes(searchQuery.toLowerCase())).length})</h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full">
                    <div className="search-box flex-1 max-w-md">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <input
                            type="text"
                            placeholder="ابحث عن كورس أو مجال..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(itemsPerPage); }}
                        />
                    </div>
                    {currentCategory && (
                        <button
                            className="btn glass btn-sm !border-[#2196f3]/30 !text-[#2196f3]"
                            onClick={() => { setCurrentCategory(null); setVisibleCount(itemsPerPage); }}
                        >
                            <i className="fa-solid fa-xmark"></i> عرض الكل
                        </button>
                    )}
                </div>
            </div>

            {!currentCategory && !searchQuery && (
                <div id="categoriesContainer" className="categories-grid mb-8 fade-in">
                    {categoryConfig.map((cat, idx) => (
                        <div
                            key={idx}
                            className="cat-card glass"
                            onClick={() => { setCurrentCategory(cat.name); setVisibleCount(itemsPerPage); }}
                            style={{ '--accent': cat.color } as React.CSSProperties}
                        >
                            <i className={`fa-solid ${cat.icon} cat-icon`}></i>
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {displayedCourses.map((course) => (
                    <div
                        key={course.id}
                        className="book-card glass fade-in !p-2"
                        onClick={() => navigate(`/course/${course.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="relative aspect-video overflow-hidden rounded-xl mb-2">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute top-2 left-2 badge-premium !bg-black/60 !backdrop-blur-md !border-none text-[9px] !px-2 !py-1 shadow-lg">{course.category}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[11px] font-bold h-8 line-clamp-2 leading-tight">{course.title}</div>
                            <div className="text-[9px] text-muted mt-1">{course.instructor}</div>
                        </div>
                    </div>
                ))}
            </div>

            {displayedCourses.length === 0 && (
                <div className="text-center py-20 opacity-30">
                    <i className="fa-solid fa-graduation-cap text-5xl mb-4"></i>
                    <h2>لم نجد كورسات بهذا الاسم</h2>
                </div>
            )}

            {allCourses.filter(c => (!currentCategory || c.category === currentCategory) && c.title.toLowerCase().includes(searchQuery.toLowerCase())).length > visibleCount && (
                <div className="mt-8 text-center">
                    <button className="btn btn-primary px-10 shadow-lg" onClick={handleLoadMore}>
                        <i className="fa-solid fa-plus ml-1"></i> تحميل المزيد من الكورسات
                    </button>
                </div>
            )}
        </div>
    )
}

export default Courses
