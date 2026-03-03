import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Book } from '../types'

const Books: React.FC = () => {
    const [allBooks, setAllBooks] = useState<Book[]>([])
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [currentCategory, setCurrentCategory] = useState<string | null>(null)
    const [itemsPerPage] = useState(24)
    const [visibleCount, setVisibleCount] = useState(24)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${API_BASE}/books`)
                setAllBooks(res.data)
                const cats = [...new Set(res.data.map((b: Book) => b.category))].filter(Boolean) as string[]
                setCategories(cats)
            } catch (error) {
                console.error("Error fetching books:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    useEffect(() => {
        let filtered = allBooks
        if (currentCategory) {
            filtered = allBooks.filter(b => b.category === currentCategory)
        }
        if (searchQuery) {
            filtered = filtered.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        setDisplayedBooks(filtered.slice(0, visibleCount))
    }, [allBooks, currentCategory, visibleCount, searchQuery])

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + itemsPerPage)
    }

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>

    return (
        <div className="fade-in max-w-7xl mx-auto px-4">
            <Helmet>
                <title>مكتبة دار الكلمة | {currentCategory || 'جميع الكتب'} - تحميل كتب مسيحية مجانية</title>
                <meta name="description" content="مكتبة رقمية تضم آلاف الكتب المسيحية اللاهوتية، الروحية، والنسكية المتاحة للتحميل مجاناً بدار الكلمة." />
                <meta property="og:title" content={`مكتبة دار الكلمة | ${currentCategory || 'جميع الكتب'}`} />
            </Helmet>
            <div className="section-header !flex-col !items-start gap-6 mb-12">
                <div className="section-title">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-2">
                        <i className="fa-solid fa-book-open text-2xl"></i>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{currentCategory || 'مكتبة دار الكلمة'}</h1>
                        <p className="text-muted text-sm mt-1">تصفح وجمل آلاف الكتب الروحية واللاهوتية مجاناً ({allBooks.length})</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="search-box w-full md:min-w-[400px]">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="ابحث عن اسم الكتاب..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(24); }}
                        />
                    </div>
                </div>
            </div>

            <div className="book-categories-scroll mb-10 pb-4">
                <button
                    className={`btn-cat ${!currentCategory ? 'active' : ''}`}
                    onClick={() => { setCurrentCategory(null); setVisibleCount(itemsPerPage); }}
                >
                    📚 الكل
                </button>
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        className={`btn-cat ${currentCategory === cat ? 'active' : ''}`}
                        onClick={() => { setCurrentCategory(cat); setVisibleCount(itemsPerPage); }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {displayedBooks.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {displayedBooks.map((book, idx) => (
                        <div
                            key={idx}
                            className="book-card glass group fade-in !p-2"
                            onClick={() => navigate(`/book/${book.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-2">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1e3c72/ffffff?text=Book' }}
                                />
                                <div className="absolute top-2 left-2 badge-premium !bg-black/60 !backdrop-blur-md !border-none text-[9px] !px-2 !py-1 shadow-lg">
                                    {book.category || 'عام'}
                                </div>
                            </div>
                            <div className="text-center px-1">
                                <div className="text-[11px] font-bold line-clamp-2 h-8 overflow-hidden leading-tight" title={book.title}>{book.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="premium-card text-center py-20">
                    <i className="fa-solid fa-face-frown text-5xl text-muted mb-4 opacity-20"></i>
                    <h2 className="text-xl">عذراً، لم نجد نتائج لما بحثت عنه</h2>
                </div>
            )}

            {allBooks.filter(b => (!currentCategory || b.category === currentCategory) && (!searchQuery || b.title.includes(searchQuery))).length > visibleCount && (
                <div className="mt-16 text-center">
                    <button className="btn btn-primary px-12 shadow-xl" onClick={handleLoadMore}>
                        <i className="fa-solid fa-plus-circle ml-2"></i> تحميل المزيد من الكتب
                    </button>
                </div>
            )}
        </div>
    )
}

export default Books
