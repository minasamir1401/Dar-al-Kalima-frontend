import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

const ADMIN_PASSWORD = 'admin2024'

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState({ books: 0, courses: 0, videos: 0, podcasts: 0, kids: 0 })
    const [loading, setLoading] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    // Data states
    const [books, setBooks] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [podcasts, setPodcasts] = useState<any[]>([])
    const [kidsVideos, setKidsVideos] = useState<any[]>([])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            fetchStats()
        } else {
            setError('كلمة المرور غير صحيحة')
            setPassword('')
        }
    }

    useEffect(() => {
        // Strict requirement: login every time the page is visited/refreshed
        setIsAuthenticated(false)
    }, [])

    const fetchStats = async () => {
        setLoading(true)
        try {
            const [b, c, v, p, k] = await Promise.all([
                axios.get(`${API_BASE}/books`),
                axios.get(`${API_BASE}/courses`),
                axios.get(`${API_BASE}/church-videos`),
                axios.get(`${API_BASE}/podcasts`),
                axios.get(`${API_BASE}/kids-videos`)
            ])
            setBooks(b.data)
            setCourses(c.data)
            setVideos(v.data)
            setPodcasts(p.data)
            setKidsVideos(k.data)
            setStats({
                books: b.data.length,
                courses: c.data.length,
                videos: v.data.length,
                podcasts: p.data.length,
                kids: k.data.length
            })
        } catch (err) {
            console.error("Error fetching admin data:", err)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        setPassword('')
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[90vh] fade-in px-4">
                <div className="glass p-8 md:p-12 rounded-[40px] w-full max-w-md text-center shadow-2xl relative overflow-hidden border border-white/10">
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-gold/10 blur-[60px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10">
                            <i className="fa-solid fa-user-shield text-5xl text-primary animate-pulse-slow"></i>
                        </div>

                        <h2 className="text-3xl font-black mb-3 text-white tracking-tight">نظام الإدارة</h2>
                        <p className="text-muted mb-10 text-sm font-medium">نظام الإدارة - يرجى تسجيل الدخول للمتابعة</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="search-box w-full text-center tracking-[0.5em] text-xl !pr-10 !pl-10 !bg-primary/5 focus:!bg-white/10 transition-all placeholder:tracking-normal placeholder:text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 justify-center text-accent-red text-xs font-bold bg-accent-red/10 py-3 px-4 rounded-2xl border border-accent-red/20 shake">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        {error}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-full py-5 text-lg font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
                                <span>دخول النظام</span>
                                <i className="fa-solid fa-arrow-right-to-bracket text-sm"></i>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">الموقع مؤمن بالكامل <i className="fa-solid fa-circle-check text-emerald-400 ml-1"></i></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setMobileSidebarOpen(false)
    }

    return (
        <div className="admin-layout flex flex-col md:flex-row gap-8 py-4 md:py-8 fade-in relative min-h-screen max-w-[1600px] mx-auto">
            <Helmet>
                <title>لوحة التحكم | {activeTab === 'dashboard' ? 'النظام' : activeTab} - دار الكلمة</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 mb-2 sticky top-2 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 w-9 h-9 rounded-xl flex items-center justify-center text-primary">
                        <i className="fa-solid fa-crown text-sm"></i>
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
                        </div>
                    </div>
                </div>
                <button onClick={() => setMobileSidebarOpen(true)} className="btn glass !p-2.5 !rounded-xl">
                    <i className="fa-solid fa-bars text-lg"></i>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[999] flex" onClick={() => setMobileSidebarOpen(false)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    {/* Sidebar Panel */}
                    <div className="admin-mobile-sidebar-panel relative z-10 w-[90%] max-w-[350px] mr-auto h-full bg-[#0d1117] border-l border-white/10 p-6 flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                            <button onClick={() => setMobileSidebarOpen(false)} className="btn glass !p-2 !rounded-xl text-muted hover:text-white">
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

            {/* Desktop Sidebar */}
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

                        <div className="mt-10 px-2">
                            <button onClick={logout} className="btn glass !bg-accent-red/5 hover:!bg-accent-red/10 !text-accent-red !border-accent-red/20 w-full justify-between">
                                <span>تسجيل الخروج</span>
                                <i className="fa-solid fa-power-off"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 min-w-0 !p-0">
                <div className="fade-in h-full">
                    {activeTab === 'dashboard' && <AdminDashboard stats={stats} loading={loading} />}
                    {activeTab === 'books' && <AdminBooksManager books={books} refresh={fetchStats} />}
                    {activeTab === 'courses' && <AdminCoursesManager courses={courses} refresh={fetchStats} />}
                    {activeTab === 'media' && <AdminMediaManager videos={videos} refresh={fetchStats} />}
                    {activeTab === 'podcast' && <AdminPodcastManager podcasts={podcasts} refresh={fetchStats} />}
                    {activeTab === 'kids' && <AdminKidsManager kidsVideos={kidsVideos} refresh={fetchStats} />}
                </div>
            </main>
        </div>
    )
}

const AdminNavItem: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`admin-nav-item ${active ? 'active' : ''}`}
    >
        <i className={`fa-solid ${icon}`}></i>
        <span className="font-bold">{label}</span>
    </button>
)

// Helper: extract YouTube video ID from any URL format
const extractYouTubeId = (input: string): string => {
    if (!input) return ''
    // Already just an ID (no slashes or dots)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim()
    try {
        const url = new URL(input)
        if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).split('?')[0]
        if (url.hostname.includes('youtube.com')) {
            if (url.pathname.includes('/shorts/')) return url.pathname.split('/shorts/')[1].split('?')[0]
            if (url.pathname.includes('/embed/')) return url.pathname.split('/embed/')[1].split('?')[0]
            return url.searchParams.get('v') || ''
        }
    } catch { }
    // fallback regex
    const m = input.match(/(?:v=|be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : input.trim()
}

// Live YouTube Previewer component
const YoutubePreviewer: React.FC<{ videoId: string }> = ({ videoId }) => {
    if (!videoId) return (
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 text-muted">
            <i className="fa-brands fa-youtube text-4xl opacity-30"></i>
            <span className="text-xs font-bold opacity-60">أدخل رابط الفيديو لمعاينته</span>
        </div>
    )
    return (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50 group">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="YouTube Preview"
            />
            <div className="absolute top-2 right-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <i className="fa-brands fa-youtube"></i> مباشر
                </span>
            </div>
        </div>
    )
}

const AdminDashboard: React.FC<{ stats: any, loading: boolean }> = ({ stats, loading }) => (
    <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div>
                <h1 className="text-xl md:text-3xl font-bold mb-1">الرئيسية</h1>
                <p className="text-muted text-xs md:text-sm">مرحباً بك في لوحة تحكم دار الكلمة</p>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="search-box w-full">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input placeholder="بحث في الاحصائيات والبيانات..." className="search-box w-full !bg-primary/5 !pr-10" />
                </div>
                <div className="hidden md:flex gap-4 shrink-0">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-primary">النظام متصل</span>
                    </div>
                </div>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20"><div className="spinner mx-auto"></div></div>
        ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <StatCard label="الكتب" value={stats.books} icon="fa-book" color="#3b82f6" />
                <StatCard label="الكورسات" value={stats.courses} icon="fa-graduation-cap" color="#fbbf24" />
                <StatCard label="الفيديوهات" value={stats.videos} icon="fa-clapperboard" color="#10b981" />
                <StatCard label="البودكاست" value={stats.podcasts} icon="fa-microphone" color="#ec4899" />
                <StatCard label="الأطفال" value={stats.kids} icon="fa-child" color="#f97316" />
            </div>
        )}
    </div>
)

const StatCard: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="stat-card-premium" style={{ borderColor: color + '33' }}>
        <i className={`fa-solid ${icon} bg-icon`} style={{ color }}></i>
        <div className="flex items-center justify-between mb-3 md:mb-8">
            <div className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}44` }}>
                <i className={`fa-solid ${icon} text-sm md:text-xl`}></i>
            </div>
            <div className="text-right">
                <div className="text-xl md:text-3xl font-bold mb-0.5">{value}</div>
                <div className="text-muted text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{label}</div>
            </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ backgroundColor: color, width: '65%' }}></div>
        </div>
    </div>
)

const AdminBooksManager: React.FC<{ books: any[], refresh: () => void }> = ({ books, refresh }) => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_BASE}/books`, { title, category, image, url, download_url: downloadUrl })
            setTitle(''); setCategory(''); setImage(''); setUrl(''); setDownloadUrl('')
            refresh()
            alert('تمت إضافة الكتاب بنجاح')
        } catch (err) {
            alert('خطأ أثناء الإضافة')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return
        try {
            await axios.delete(`${API_BASE}/books/${id}`)
            refresh()
        } catch (err) {
            alert('خطأ أثناء الحذف')
        }
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><i className="fa-solid fa-plus-circle"></i></div>
                    إضافة كتاب جديد
                </h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">عنوان الكتاب</label>
                        <input className="search-box w-full !pr-4 !bg-primary/5" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">التصنيف</label>
                        <input className="search-box w-full !pr-4 !bg-primary/5" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط الصورة</label>
                        <input className="search-box w-full !pr-4 !bg-primary/5" value={image} onChange={(e) => setImage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط المعاينة</label>
                        <input className="search-box w-full !pr-4 !bg-primary/5" value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط التحميل المباشر</label>
                        <input className="search-box w-full !pr-4 !bg-primary/5" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary lg:w-max px-12 py-4 shadow-primary/30">حفظ الكتاب</button>
                </form>
            </div>

            <div className="admin-table-container">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold">قائمة الكتب المتاحة</h3>
                    <span className="text-xs text-muted font-bold truncate">إجمالي: {books.length}</span>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>الكتاب</th>
                                <th>التصنيف</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="flex items-center gap-4">
                                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 shadow-lg">
                                            <img src={book.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="font-bold text-sm leading-relaxed">{book.title}</span>
                                    </td>
                                    <td>
                                        <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm">{book.category || 'عام'}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(book.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20 hover:!bg-accent-red/10 hover:!scale-110 transition-all">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const AdminCoursesManager: React.FC<{ courses: any[], refresh: () => void }> = ({ courses, refresh }) => {
    const [title, setTitle] = useState('')
    const [instructor, setInstructor] = useState('')
    const [lessons, setLessons] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_BASE}/courses`, { title, instructor, lessons, category, image, url })
            setTitle(''); setInstructor(''); setLessons(''); setCategory(''); setImage(''); setUrl('')
            refresh()
            alert('تم إضافة الكورس')
        } catch (err) { alert('خطأ') }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('حذف؟')) return
        await axios.delete(`${API_BASE}/courses/${id}`)
        refresh()
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <h2 className="text-2xl font-bold mb-8">إضافة كورس تعليمي</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="اسم الكورس" className="search-box w-full !bg-primary/5 !pr-4" value={title} onChange={e => setTitle(e.target.value)} required />
                    <input placeholder="المدرب" className="search-box w-full !bg-primary/5 !pr-4" value={instructor} onChange={e => setInstructor(e.target.value)} />
                    <input placeholder="عدد الدروس" className="search-box w-full !bg-primary/5 !pr-4" value={lessons} onChange={e => setLessons(e.target.value)} />
                    <input placeholder="التصنيف" className="search-box w-full !bg-primary/5 !pr-4" value={category} onChange={e => setCategory(e.target.value)} />
                    <input placeholder="رابط الصورة" className="search-box w-full !bg-primary/5 !pr-4 md:col-span-2" value={image} onChange={e => setImage(e.target.value)} />
                    <input placeholder="رابط الكورس (Video ID / URL)" className="search-box w-full !bg-primary/5 !pr-4 md:col-span-2" value={url} onChange={e => setUrl(e.target.value)} />
                    <button type="submit" className="btn btn-primary lg:w-max px-12 py-4">حفظ الكورس</button>
                </form>
            </div>
            <div className="admin-table-container">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>اسم الكورس</th>
                                <th>المدرب</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(c => (
                                <tr key={c.id}>
                                    <td className="font-bold text-sm truncate max-w-[250px]">{c.title}</td>
                                    <td className="text-muted text-sm">{c.instructor || 'غير محدد'}</td>
                                    <td>
                                        <button onClick={() => handleDelete(c.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const AdminMediaManager: React.FC<{ videos: any[], refresh: () => void }> = ({ videos, refresh }) => {
    const [title, setTitle] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [collection, setCollection] = useState('')
    const videoId = extractYouTubeId(youtubeUrl)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!videoId) { alert('رابط الفيديو غير صحيح'); return }
        await axios.post(`${API_BASE}/church-videos`, { title, videoId, collection })
        setTitle(''); setYoutubeUrl(''); setCollection('')
        refresh()
    }

    const handleDelete = async (id: number) => {
        if (!confirm('حذف؟')) return
        await axios.delete(`${API_BASE}/church-videos/${id}`)
        refresh()
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <div className="section-header">
                    <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400 text-xl"><i className="fa-solid fa-clapperboard"></i></div>
                    <div>
                        <h2 className="text-2xl font-bold">إضافة فيديو كنسي</h2>
                        <p className="text-muted text-sm">أدخل رابط الفيديو من YouTube</p>
                    </div>
                </div>
                <form onSubmit={handleAdd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">عنوان الفيديو</label>
                                <input placeholder="أدخل عنوان الفيديو..." className="search-box w-full !bg-primary/5 !pr-4" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">رابط YouTube</label>
                                <div className="youtube-url-input-wrap">
                                    <i className="fa-brands fa-youtube yt-icon text-red-500"></i>
                                    <input
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="search-box w-full !bg-primary/5"
                                        value={youtubeUrl}
                                        onChange={e => setYoutubeUrl(e.target.value)}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                {videoId && <p className="text-xs text-emerald-400 px-1">✓ تم استخراج ID: <span className="font-mono font-bold">{videoId}</span></p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">المجموعة / التصنيف</label>
                                <input placeholder="مثال: عظات، لاهوت، ترانيم" className="search-box w-full !bg-primary/5 !pr-4" value={collection} onChange={e => setCollection(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                                <i className="fa-solid fa-cloud-arrow-up"></i> حفظ الفيديو
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">معاينة مباشرة</label>
                            <YoutubePreviewer videoId={videoId} />
                        </div>
                    </div>
                </form>
            </div>
            <div className="admin-table-container">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg">الفيديوهات المضافة</h3>
                    <span className="text-xs text-muted font-bold bg-white/5 px-3 py-1.5 rounded-full">إجمالي: {videos.length}</span>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>عنوان الفيديو</th>
                                <th>المجموعة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map(v => (
                                <tr key={v.id}>
                                    <td className="flex items-center gap-4 py-4">
                                        <div className="w-24 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0 shadow-md">
                                            <img src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="font-bold text-sm leading-relaxed">{v.title}</span>
                                    </td>
                                    <td><span className="text-[11px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">{v.collection || 'عام'}</span></td>
                                    <td>
                                        <button onClick={() => handleDelete(v.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20 hover:!scale-110 transition-all">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const AdminPodcastManager: React.FC<{ podcasts: any[], refresh: () => void }> = ({ podcasts, refresh }) => {
    const [title, setTitle] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [seriesTitle, setSeriesTitle] = useState('')
    const videoId = extractYouTubeId(youtubeUrl)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!videoId) { alert('رابط الفيديو غير صحيح'); return }
        await axios.post(`${API_BASE}/podcasts`, { episodeTitle: title, videoId, seriesTitle })
        setTitle(''); setYoutubeUrl(''); setSeriesTitle('')
        refresh()
    }

    const handleDelete = async (id: number) => {
        if (!confirm('حذف؟')) return
        await axios.delete(`${API_BASE}/podcasts/${id}`)
        refresh()
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <div className="section-header">
                    <div className="p-3 bg-purple-500/15 rounded-2xl text-purple-400 text-xl"><i className="fa-solid fa-microphone-lines"></i></div>
                    <div>
                        <h2 className="text-2xl font-bold">إضافة حلقة بودكاست</h2>
                        <p className="text-muted text-sm">أدخل رابط الحلقة من YouTube</p>
                    </div>
                </div>
                <form onSubmit={handleAdd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">عنوان الحلقة</label>
                                <input placeholder="أدخل عنوان الحلقة..." className="search-box w-full !bg-primary/5 !pr-4" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">رابط YouTube</label>
                                <div className="youtube-url-input-wrap">
                                    <i className="fa-brands fa-youtube yt-icon text-red-500"></i>
                                    <input
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="search-box w-full !bg-primary/5"
                                        value={youtubeUrl}
                                        onChange={e => setYoutubeUrl(e.target.value)}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                {videoId && <p className="text-xs text-emerald-400 px-1">✓ تم استخراج ID: <span className="font-mono font-bold">{videoId}</span></p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">اسم السلسلة</label>
                                <input placeholder="مثال: تخفيف أحمال" className="search-box w-full !bg-primary/5 !pr-4" value={seriesTitle} onChange={e => setSeriesTitle(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                                <i className="fa-solid fa-cloud-arrow-up"></i> حفظ الحلقة
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">معاينة مباشرة</label>
                            <YoutubePreviewer videoId={videoId} />
                        </div>
                    </div>
                </form>
            </div>
            <div className="admin-table-container">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg">حلقات البودكاست</h3>
                    <span className="text-xs text-muted font-bold bg-white/5 px-3 py-1.5 rounded-full">إجمالي: {podcasts.length}</span>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>عنوان الحلقة</th>
                                <th>السلسلة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {podcasts.map(p => (
                                <tr key={p.id}>
                                    <td className="flex items-center gap-4 py-4">
                                        <div className="w-24 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0 shadow-md">
                                            <img src={`https://img.youtube.com/vi/${p.videoId}/mqdefault.jpg`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="font-bold text-sm leading-relaxed">{p.episodeTitle}</span>
                                    </td>
                                    <td><span className="text-[11px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">{p.seriesTitle || 'عام'}</span></td>
                                    <td>
                                        <button onClick={() => handleDelete(p.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20 hover:!scale-110 transition-all">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const AdminKidsManager: React.FC<{ kidsVideos: any[], refresh: () => void }> = ({ kidsVideos, refresh }) => {
    const [title, setTitle] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [sectionTitle, setSectionTitle] = useState('')
    const [icon, setIcon] = useState('fa-star')
    const [color, setColor] = useState('#4caf50')
    const videoId = extractYouTubeId(youtubeUrl)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!videoId) { alert('رابط الفيديو غير صحيح'); return }
        await axios.post(`${API_BASE}/kids-videos`, { title, videoId, sectionTitle, icon, color })
        setTitle(''); setYoutubeUrl(''); setSectionTitle('')
        refresh()
    }

    const handleDelete = async (id: number) => {
        if (!confirm('حذف؟')) return
        await axios.delete(`${API_BASE}/kids-videos/${id}`)
        refresh()
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <div className="section-header">
                    <div className="p-3 bg-orange-500/15 rounded-2xl text-orange-400 text-xl"><i className="fa-solid fa-palette"></i></div>
                    <div>
                        <h2 className="text-2xl font-bold">إضافة محتوى للأطفال</h2>
                        <p className="text-muted text-sm">أضف فيديوهات تعليمية وترفيهية للأطفال</p>
                    </div>
                </div>
                <form onSubmit={handleAdd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">عنوان المحتوى</label>
                                <input placeholder="أدخل عنوان الفيديو..." className="search-box w-full !bg-primary/5 !pr-4" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">رابط YouTube</label>
                                <div className="youtube-url-input-wrap">
                                    <i className="fa-brands fa-youtube yt-icon text-red-500"></i>
                                    <input
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="search-box w-full !bg-primary/5"
                                        value={youtubeUrl}
                                        onChange={e => setYoutubeUrl(e.target.value)}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                {videoId && <p className="text-xs text-emerald-400 px-1">✓ تم استخراج ID: <span className="font-mono font-bold">{videoId}</span></p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">القسم</label>
                                    <input placeholder="ألعاب / فيديوهات" className="search-box w-full !bg-primary/5 !pr-4" value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">أيقونة</label>
                                    <input placeholder="fa-star" className="search-box w-full !bg-primary/5 !pr-4" value={icon} onChange={e => setIcon(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">لون التمييز</label>
                                <div className="flex items-center gap-4">
                                    <input type="color" className="w-16 h-12 rounded-2xl bg-transparent border-none cursor-pointer" value={color} onChange={e => setColor(e.target.value)} />
                                    <span className="text-sm font-mono text-muted">{color}</span>
                                    <div className="flex gap-2">
                                        {['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'].map(c => (
                                            <button key={c} type="button" onClick={() => setColor(c)} className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110" style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                                <i className="fa-solid fa-cloud-arrow-up"></i> حفظ المحتوى
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">معاينة مباشرة</label>
                            <YoutubePreviewer videoId={videoId} />
                        </div>
                    </div>
                </form>
            </div>
            <div className="admin-table-container">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg">محتوى ركن الأطفال</h3>
                    <span className="text-xs text-muted font-bold bg-white/5 px-3 py-1.5 rounded-full">إجمالي: {kidsVideos.length}</span>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>القسم</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kidsVideos.map(k => (
                                <tr key={k.id}>
                                    <td className="flex items-center gap-4 py-4">
                                        <div className="w-24 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0 shadow-md">
                                            <img src={`https://img.youtube.com/vi/${k.videoId}/mqdefault.jpg`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="font-bold text-sm leading-relaxed">{k.title}</span>
                                    </td>
                                    <td><span className="text-[11px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm" style={{ color: k.color }}>{k.sectionTitle || 'عام'}</span></td>
                                    <td>
                                        <button onClick={() => handleDelete(k.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20 hover:!scale-110 transition-all">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Admin
