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
import Subjects from './pages/Subjects'
import LessonPage from './pages/LessonPage'
import Admin from './pages/Admin'
import Donation from './pages/Donation'
import Chat from './pages/Chat'
import Loader from './components/Loader'
import axios from 'axios'
import { API_BASE } from './constants'

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
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/lesson/:id" element={<LessonPage />} />
                    <Route path="/donation" element={<Donation />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Layout>
        </Router>
    )
}

const GlobalNotifications: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const welcomeTimer = setTimeout(() => setShowWelcome(true), 5000);
        // PWA Install Prompt
        const handleBeforeInstall = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        // 20 Minute Reminder (every 20 minutes)
        const reminderInterval = setInterval(() => {
            setShowReminder(true);
            setTimeout(() => setShowReminder(false), 10000); // Auto close after 10s
        }, 20 * 60 * 1000);

        return () => {
            clearTimeout(welcomeTimer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            clearInterval(reminderInterval);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted install');
            }
            setDeferredPrompt(null);
            setShowInstall(false);
        }
    };

    return (
        <div className="notification-container">
            {/* Immediate Welcome / Install Hint */}
            {showWelcome && !showInstall && (
                <div className="notification-card">
                    <div className="notification-icon" style={{ background: 'var(--accent-gold)' }}>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="notification-content">
                        <h4>أهلاً بك في دار الكلمة</h4>
                        <p>يمكنك تثبيت الموقع كتطبيق على موبايلك لتجربة أفضل!</p>
                    </div>
                    <button className="notification-close" onClick={() => setShowWelcome(false)}>×</button>
                </div>
            )}

            {/* PWA Prompt (Official) */}
            {showInstall && (
                <div className="notification-card">
                    <div className="notification-icon">
                        <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <div className="notification-content">
                        <h4>تطبيق دار الكلمة</h4>
                        <p>حمل تطبيقنا على جهازك لتصفح أسرع وبدون إنترنت!</p>
                    </div>
                    <button className="notification-btn" onClick={handleInstallClick}>تثبيت</button>
                    <button className="notification-close" onClick={() => setShowInstall(false)}>×</button>
                </div>
            )}

            {/* Timed Reminder */}
            {showReminder && (
                <div className="notification-card">
                    <div className="notification-icon" style={{ background: 'var(--accent-gold)' }}>
                        <i className="fa-solid fa-bell"></i>
                    </div>
                    <div className="notification-content">
                        <h4>تذكير روحي</h4>
                        <p>قال الرب: "اَلَّذِي عِنْدَهُ وَصَايَايَ وَيَحْفَظُهَا فَهُوَ الَّذِي يُحِبُّنِي"</p>
                    </div>
                    <button className="notification-close" onClick={() => setShowReminder(false)}>×</button>
                </div>
            )}
        </div>
    );
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const [donationVisible, setDonationVisible] = useState(false)

    useEffect(() => {
        axios.get(`${API_BASE}/settings/donation_page`)
            .then(res => {
                if (res.data && res.data.isVisible) {
                    setDonationVisible(true)
                }
            })
            .catch(err => console.error("Could not fetch donation settings", err))
    }, [])

    return (
        <div className="app-container">
            <GlobalNotifications />
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
                    <Link to="/" className="logo-container cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="شعار دار الكلمة - Dar Al-Kalima" className="logo-img" style={{ height: '45px', width: 'auto', borderRadius: '8px' }} />
                        <span className="logo-text">دار الكلمة</span>
                    </Link>

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
                                <Link to="/subjects" className={location.pathname === '/subjects' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-book-open-reader"></i> المواد الدراسية
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa-solid fa-comments spiritual-cross"></i> المراسلة
                                </Link>
                            </li>
                            {donationVisible && (
                                <li>
                                    <Link to="/donation" className={location.pathname === '/donation' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                                        <i className="fa-solid fa-hand-holding-dollar"></i> ادعم الخدمة
                                    </Link>
                                </li>
                            )}

                        </ul>
                    </nav>
                </div>
            </header>

            <main id="main-content" role="main">
                {children}
            </main>

            {location.pathname !== '/chat' && (
                <Link
                    to="/chat"
                    className="global-ai-btn"
                    onClick={() => sessionStorage.setItem('start_ai_chat', 'true')}
                >
                    <div className="pulse"></div>
                    <span>AI</span>
                </Link>
            )}

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
