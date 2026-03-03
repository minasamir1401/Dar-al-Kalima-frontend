import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Course } from '../types'

const CoursePlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [course, setCourse] = useState<Course | null>(null)
    const [activeLesson, setActiveLesson] = useState<{ title: string, videoId: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusText, setStatusText] = useState('جاري تحضير محتوى الكورس...')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${API_BASE}/courses/${id}`)
                const data: Course = res.data

                if (!data.lessons_data) {
                    setStatusText('بدء استخراج الدروس لأول مرة... قد يستغرق هذا دقيقة واحدة.')
                    await axios.get(`${API_BASE}/courses/${id}/scrape`)
                    const retryRes = await axios.get(`${API_BASE}/courses/${id}`)
                    const updatedData: Course = retryRes.data
                    setCourse(updatedData)
                    if (updatedData.lessons_data?.length) {
                        setActiveLesson(updatedData.lessons_data[0])
                    }
                } else {
                    setCourse(data)
                    if (data.lessons_data.length) {
                        setActiveLesson(data.lessons_data[0])
                    }
                }
            } catch (error) {
                console.error("Error fetching course data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourseData()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center fade-in">
                <div className="spinner mb-6"></div>
                <h2 className="text-2xl font-bold mb-2">{statusText}</h2>
                <p className="text-muted">نحن نجهز لك قائمة الفيديوهات من المصدر</p>
            </div>
        )
    }

    if (!course || !course.lessons_data?.length) {
        return (
            <div className="premium-card text-center py-20">
                <i className="fa-solid fa-triangle-exclamation text-5xl text-accent-red mb-6 opacity-20"></i>
                <h2 className="text-2xl font-bold mb-4">لا توجد دروس متاحة حالياً لهذا الكورس</h2>
                <button className="btn btn-primary" onClick={() => navigate('/courses')}>العودة بالكورسات</button>
            </div>
        )
    }

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>{course.title} | {activeLesson?.title || 'مشاهدة الكورس'} - دار الكلمة</title>
                <meta name="description" content={`شاهد كورس ${course.title}${course.instructor ? ` مع ${course.instructor}` : ''} مجاناً على دار الكلمة. ${activeLesson ? `الدرس الحالي: ${activeLesson.title}` : ''}`} />
                <meta property="og:title" content={`${course.title} - منصة دار الكلمة التعليمية`} />
                <meta property="og:description" content={`تعلم ${course.title} مجاناً وبجودة عالية.`} />
                <meta property="og:image" content={course.image || '/logo.png'} />
            </Helmet>
            <button className="btn btn-back-blue btn-sm mb-16" onClick={() => navigate('/courses')}>
                <i className="fa-solid fa-arrow-right ml-2"></i> العودة للكورسات
            </button>

            <div className="flex flex-col gap-2 mb-10 border-r-4 border-primary pr-6">
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted">
                    <i className="fa-solid fa-user-tie text-primary mr-2"></i> {course.instructor} • <i className="fa-solid fa-play text-primary mr-2"></i> {course.lessons_data.length} درس تعليمي
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
                {/* Main Player Area */}
                <div className="lg:col-span-8">
                    <div className="video-player-wrapper shadow-2xl mb-8">
                        {activeLesson && (
                            <iframe
                                src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=1&rel=0`}
                                title={activeLesson.title}
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                    <div className="premium-card !p-8">
                        <div className="flex justify-between items-center mb-6">
                            <span className="badge-premium">الدرس الحالي</span>
                            <span className="text-xs text-muted">جودة عالية HD</span>
                        </div>
                        <h2 className="text-2xl font-bold">{activeLesson?.title}</h2>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <div className="lg:col-span-4">
                    <div className="curriculum-sidebar sticky top-24">
                        <div className="curriculum-header justify-between">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-layer-group text-primary"></i>
                                <span>محتوى الدورة</span>
                            </div>
                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md">مكتمل</span>
                        </div>
                        <div className="curriculum-list custom-scrollbar">
                            {course.lessons_data.map((lesson, idx) => (
                                <div
                                    key={idx}
                                    className={`lesson-item ${activeLesson?.videoId === lesson.videoId ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveLesson(lesson);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="lesson-num">{idx + 1}</div>
                                    <div className="lesson-main">
                                        <div className="lesson-title">{lesson.title}</div>
                                        <div className="lesson-meta"><i className="fa-solid fa-clock opacity-50"></i> {lesson.duration || '00:00'}</div>
                                    </div>
                                    {activeLesson?.videoId === lesson.videoId && (
                                        <div className="text-primary flex items-center gap-1">
                                            <span className="w-1 h-3 bg-primary rounded-full animate-bounce"></span>
                                            <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePlayer
