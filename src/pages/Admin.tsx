import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

import { AdminNavItem } from '../components/admin/AdminShared'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { AdminBooksManager } from '../components/admin/AdminBooksManager'
import { AdminCoursesManager } from '../components/admin/AdminCoursesManager'
import { AdminMediaManager } from '../components/admin/AdminMediaManager'
import { AdminPodcastManager } from '../components/admin/AdminPodcastManager'
import { AdminKidsManager } from '../components/admin/AdminKidsManager'
import { AdminSubjectsManager } from '../components/admin/AdminSubjectsManager'

const ADMIN_PASSWORD = 'admin2024'

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState({ books: 0, courses: 0, videos: 0, podcasts: 0, kids: 0, subjects: 0 })
    const [loading, setLoading] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    // Data states
    const [books, setBooks] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [podcasts, setPodcasts] = useState<any[]>([])
    const [kidsVideos, setKidsVideos] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            axios.defaults.headers.common['Admin-Secret'] = ADMIN_PASSWORD
            setIsAuthenticated(true)
            fetchStats()
        } else {
            setError('كلمة المرور غير صحيحة')
            setPassword('')
        }
    }

    useEffect(() => {
        setIsAuthenticated(false)
    }, [])

    const fetchStats = async () => {
        setLoading(true)
        try {
            const [b, c, v, p, k, s] = await Promise.all([
                axios.get(`${API_BASE}/books`),
                axios.get(`${API_BASE}/courses`),
                axios.get(`${API_BASE}/church-videos`),
                axios.get(`${API_BASE}/podcasts`),
                axios.get(`${API_BASE}/kids-videos`),
                axios.get(`${API_BASE}/subjects`)
            ])
            setBooks(b.data)
            setCourses(c.data)
            setVideos(v.data)
            setPodcasts(p.data)
            setKidsVideos(k.data)
            setSubjects(s.data)
            setStats({
                books: b.data.length,
                courses: c.data.length,
                videos: v.data.length,
                podcasts: p.data.length,
                kids: k.data.length,
                subjects: s.data.length
            })
        } catch (err) {
            console.error("Error fetching admin data:", err)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        delete axios.defaults.headers.common['Admin-Secret']
        setIsAuthenticated(false)
        setPassword('')
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setMobileSidebarOpen(false)
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[90vh] fade-in px-4">
                <div className="glass p-8 md:p-12 rounded-[40px] w-full max-w-md text-center shadow-2xl relative overflow-hidden border border-white/10">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-gold/10 blur-[60px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10">
                            <i className="fa-solid fa-user-shield text-5xl text-primary animate-pulse-slow"></i>
                        </div>

                        <h2 className="text-3xl font-black mb-3 text-main tracking-tight">نظام الإدارة</h2>
                        <p className="text-muted mb-10 text-sm font-medium">نظام الإدارة - يرجى تسجيل الدخول للمتابعة</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="كلمة المرور"
                                        className="search-box w-full !pr-12 py-4 rounded-2xl border-none ring-0 focus:ring-2 focus:ring-primary/20 bg-black/5"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-accent-red text-xs font-bold mt-2 animate-bounce">{error}</p>}
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                دخول لوحة التحكم
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-layout flex flex-col md:flex-row gap-6 md:gap-10 fade-in px-4 py-6 md:py-10 max-w-[1600px] mx-auto min-h-screen">
            <Helmet>
                <title>لوحة التحكم | دار الكلمة</title>
            </Helmet>

            <div className="md:hidden admin-mobile-bar glass sticky top-0 z-[100] p-4 flex items-center justify-between rounded-2xl mb-4 border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                        <i className="fa-solid fa-crown"></i>
                    </div>
                    <div>
                        <div className="font-bold text-sm">لوحة التحكم</div>
                        <div className="text-[9px] text-muted uppercase tracking-wider">
                            {activeTab === 'dashboard' && 'نظرة عامة'}
                            {activeTab === 'books' && 'المكتبة'}
                            {activeTab === 'courses' && 'الكورسات'}
                            {activeTab === 'media' && 'الميديا'}
                            {activeTab === 'podcast' && 'البودكاست'}
                            {activeTab === 'kids' && 'ركن الأطفال'}
                            {activeTab === 'subjects' && 'المواد الدراسية'}
                        </div>
                    </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(true)} className="btn !p-2.5 !rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all">
                    <i className="fa-solid fa-bars text-lg"></i>
                </button>
            </div>

            {mobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[999] flex" onClick={() => setMobileSidebarOpen(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="admin-mobile-sidebar-panel relative z-10 w-[90%] max-w-[350px] mr-auto h-full bg-white border-l border-black/5 p-6 flex flex-col overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 w-11 h-11 rounded-2xl flex items-center justify-center text-primary">
                                    <i className="fa-solid fa-crown text-lg"></i>
                                </div>
                                <div>
                                    <div className="font-bold">المدير</div>
                                    <div className="text-[9px] text-muted uppercase tracking-wider">لوحة القيادة</div>
                                </div>
                            </div>
                            <button onClick={() => setMobileSidebarOpen(false)} className="btn glass !p-2 !rounded-xl text-muted hover:text-main">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-1 flex-1">
                            <AdminNavItem active={activeTab === 'dashboard'} icon="fa-house-chimney" label="نظرة عامة" onClick={() => handleTabChange('dashboard')} />
                            <AdminNavItem active={activeTab === 'books'} icon="fa-book" label="المكتبة" onClick={() => handleTabChange('books')} />
                            <AdminNavItem active={activeTab === 'courses'} icon="fa-graduation-cap" label="الكورسات" onClick={() => handleTabChange('courses')} />
                            <AdminNavItem active={activeTab === 'media'} icon="fa-clapperboard" label="الميديا" onClick={() => handleTabChange('media')} />
                            <AdminNavItem active={activeTab === 'podcast'} icon="fa-microphone-lines" label="البودكاست" onClick={() => handleTabChange('podcast')} />
                            <AdminNavItem active={activeTab === 'kids'} icon="fa-palette" label="ركن الأطفال" onClick={() => handleTabChange('kids')} />
                            <AdminNavItem active={activeTab === 'subjects'} icon="fa-book-open-reader" label="المواد الدراسية" onClick={() => handleTabChange('subjects')} />
                            <div className="mt-auto pt-8">
                                <button onClick={logout} className="btn glass !bg-accent-red/5 hover:!bg-accent-red/10 !text-accent-red !border-accent-red/20 w-full justify-between">
                                    <span>تسجيل الخروج</span>
                                    <i className="fa-solid fa-power-off"></i>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            <aside className="hidden md:block md:w-[320px] lg:w-[350px] shrink-0">
                <div className="admin-sidebar sticky top-24">
                    <div className="flex items-center gap-4 mb-10 px-2 pb-6 border-b border-white/5">
                        <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                            <i className="fa-solid fa-crown text-xl"></i>
                        </div>
                        <div>
                            <div className="font-bold text-lg">المدير</div>
                            <div className="text-[10px] text-muted uppercase tracking-wider">لوحة القيادة</div>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1">
                        <AdminNavItem active={activeTab === 'dashboard'} icon="fa-house-chimney" label="نظرة عامة" onClick={() => setActiveTab('dashboard')} />
                        <AdminNavItem active={activeTab === 'books'} icon="fa-book" label="المكتبة" onClick={() => setActiveTab('books')} />
                        <AdminNavItem active={activeTab === 'courses'} icon="fa-graduation-cap" label="الكورسات" onClick={() => setActiveTab('courses')} />
                        <AdminNavItem active={activeTab === 'media'} icon="fa-clapperboard" label="الميديا" onClick={() => setActiveTab('media')} />
                        <AdminNavItem active={activeTab === 'podcast'} icon="fa-microphone-lines" label="البودكاست" onClick={() => setActiveTab('podcast')} />
                        <AdminNavItem active={activeTab === 'kids'} icon="fa-palette" label="ركن الأطفال" onClick={() => setActiveTab('kids')} />
                        <AdminNavItem active={activeTab === 'subjects'} icon="fa-book-open-reader" label="المواد الدراسية" onClick={() => setActiveTab('subjects')} />

                        <div className="mt-10 px-2">
                            <button onClick={logout} className="btn glass !bg-accent-red/5 hover:!bg-accent-red/10 !text-accent-red !border-accent-red/20 w-full justify-between">
                                <span>تسجيل الخروج</span>
                                <i className="fa-solid fa-power-off"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 min-w-0 !p-0">
                <div className="fade-in h-full">
                    {activeTab === 'dashboard' && <AdminDashboard stats={stats} loading={loading} />}
                    {activeTab === 'books' && <AdminBooksManager books={books} refresh={fetchStats} />}
                    {activeTab === 'courses' && <AdminCoursesManager courses={courses} refresh={fetchStats} />}
                    {activeTab === 'media' && <AdminMediaManager videos={videos} refresh={fetchStats} />}
                    {activeTab === 'podcast' && <AdminPodcastManager podcasts={podcasts} refresh={fetchStats} />}
                    {activeTab === 'kids' && <AdminKidsManager kidsVideos={kidsVideos} refresh={fetchStats} />}
                    {activeTab === 'subjects' && <AdminSubjectsManager subjects={subjects} refresh={fetchStats} />}
                </div>
            </main>
        </div>
    )
}

export default Admin
