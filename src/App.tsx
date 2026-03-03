import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Courses from './pages/Courses'
import CoursePlayer from './pages/CoursePlayer'
import ChurchVideos from './pages/ChurchVideos'
import ChurchVideoPlayer from './pages/ChurchVideoPlayer'
import Podcast from './pages/Podcast'
import PodcastPlayer from './pages/PodcastPlayer'
import Kids from './pages/Kids'
import Admin from './pages/Admin'
import Loader from './components/Loader'

const App: React.FC = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Initial data fetch could happen here if needed globally
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500) // Reduced loader time slightly for better UX
        return () => clearTimeout(timer)
    }, [])

    if (loading) return <Loader />

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/book/:id" element={<BookDetails />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:id" element={<CoursePlayer />} />
                    <Route path="/church-videos" element={<ChurchVideos />} />
                    <Route path="/church-video/:id" element={<ChurchVideoPlayer />} />
                    <Route path="/podcast" element={<Podcast />} />
                    <Route path="/podcast/:id" element={<PodcastPlayer />} />
                    <Route path="/kids" element={<Kids />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Layout>
        </Router>
    )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    return (
        <div className="app-container">
            <Helmet>
                <html lang="ar" dir="rtl" />
                <title>دار الكلمة | منصة مسيحية رقمية شاملة</title>
                <meta name="description" content="منصة دار الكلمة الرقمية - مكتبة مسيحية، كورسات، ميديا، وبودكاست." />
                <meta property="og:site_name" content="دار الكلمة" />
                <meta property="og:locale" content="ar_EG" />
            </Helmet>
            <div className="spiritual-bg-pattern"></div>
            <div className="bg-blobs">
                <div className="blob" style={{ top: '-10%', left: '-10%' }}></div>
                <div className="blob" style={{ bottom: '0%', right: '0%', opacity: 0.1 }}></div>
            </div>

            <header className="glass top-nav fade-in" role="banner">
                <div className="nav-content">
                    <div className="logo-container">
                        <img src="/logo.png" alt="شعار دار الكلمة - Dar Al-Kalima" className="logo-img" style={{ height: '45px', width: 'auto', borderRadius: '8px' }} />
                        <span className="logo-text">دار الكلمة | Dar Al-Kalima</span>
                    </div>

                    <button
                        id="menu-toggle"
                        className="glass menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="فتح القائمة"
                    >
                        <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>

                    <nav className={`top-menu ${isMenuOpen ? 'open' : ''}`} role="navigation">
                        <ul role="list">
                            <li>
                                <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-house"></i> الرئيسية
                                </Link>
                            </li>
                            <li>
                                <Link to="/books" className={location.pathname === '/books' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-cross spiritual-cross"></i> جميع الكتب
                                </Link>
                            </li>
                            <li>
                                <Link to="/church-videos" className={location.pathname === '/church-videos' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-dove spiritual-cross"></i> ميديا كنيستي
                                </Link>
                            </li>
                            <li>
                                <Link to="/podcast" className={location.pathname === '/podcast' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-microphone-lines spiritual-cross"></i> بودكاست
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-graduation-cap"></i> الكورسات
                                </Link>
                            </li>
                            <li>
                                <Link to="/kids" className={location.pathname === '/kids' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-child"></i> ركن الأطفال
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </header>

            <main id="main-content" role="main">
                {children}
            </main>

            <footer className="glass mt-12 p-8 text-center" style={{ borderRadius: '32px 32px 0 0', borderTop: '1px solid var(--accent-gold)' }}>
                <div className="flex flex-col items-center gap-4">
                    <i className="fa-solid fa-cross spiritual-cross" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted italic">"الرَّبُّ نُورِي وَخَلاَصِي، مِمَّنْ أَخَافُ؟"</p>
                    <p className="text-xs text-muted mt-4">© 2026 دار الكلمة | Dar Al-Kalima - جميع الحقوق محفوظة لخدمة الكلمة | All Rights Reserved</p>

                </div>
            </footer>
        </div>
    )
}

export default App
