import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Book } from '../types'

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`${API_BASE}/books`)
                const found = res.data.find((b: Book) => b.id.toString() === id)
                setBook(found || null)
            } catch (error) {
                console.error("Error fetching book details:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id])

    const handleDownload = (book: Book) => {
        let targetUrl = book.download_url

        // If download_url isn't a real external link (like an anchor '#xxx'), fallback to the main source URL
        if (!targetUrl || !targetUrl.startsWith('http')) {
            targetUrl = book.url
        }

        if (!targetUrl || !targetUrl.startsWith('http')) {
            alert('رابط التحميل غير متوفر لهذا الكتاب')
            return
        }

        // Proxy through backend to avoid CORS and handle specific links (like mediafire, raw pdfs)
        const proxyUrl = `${API_BASE}/download?url=${encodeURIComponent(targetUrl)}`
        window.open(proxyUrl, '_blank')
    }

    const handleShare = (title: string) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: window.location.href
            })
        } else {
            alert('خاصية المشاركة غير مدعومة في متصفحك')
        }
    }

    if (loading) return <div className="text-center p-32"><div className="spinner"></div></div>
    if (!book) return (
        <div className="premium-card text-center py-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">الكتاب غير موجود</h2>
            <button className="btn btn-primary" onClick={() => navigate('/books')}>العودة للكتب</button>
        </div>
    )

    return (
        <div className="fade-in max-w-6xl mx-auto px-4">
            <Helmet>
                <title>{book.title} | كتاب في دار الكلمة</title>
                <meta name="description" content={`تحميل وقراءة كتاب ${book.title} من مكتبة دار الكلمة المسيحية. التصنيف: ${book.category}`} />
                <meta property="og:title" content={`${book.title} - دار الكلمة`} />
                <meta property="og:description" content={`اقرأ وحمل كتاب ${book.title} الآن مجاناً.`} />
                <meta property="og:image" content={book.image || '/logo.png'} />
            </Helmet>
            <button
                className="btn btn-back-blue btn-sm mb-16"
                onClick={() => navigate('/books')}
            >
                <i className="fa-solid fa-arrow-right ml-2"></i> العودة للكتب
            </button>

            <div className="premium-card shadow-2xl fade-in overflow-hidden !p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Left: Cover */}
                    <div className="w-full md:w-1/3 lg:w-1/4 p-8 bg-black/10">
                        <div className="relative group">
                            <img
                                src={book.image}
                                alt={book.title}
                                className="w-full rounded-[20px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1e3c72/ffffff?text=Book' }}
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                                <span className="badge-premium !bg-primary !text-white !border-none px-6 py-2.5 shadow-xl text-sm rounded-full">{book.category || 'عام'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-2/3 lg:w-3/4 p-10 md:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="fa-solid fa-circle-check text-primary"></i>
                            <span className="text-xs text-muted uppercase tracking-widest">متاح للتحميل المجاني</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 !leading-tight">{book.title}</h1>

                        <div className="space-y-6 text-lg text-muted mb-10 max-w-2xl">
                            <p>هذا الكتاب القيم متاح الآن للقراءة والتحميل المباشر. نرجو أن يكون هذا العمل سبب بركة لنموك الروحي والمعرفي في الإيمان المستقيم.</p>
                            <p className="text-sm">تمت فهرسة الكتاب في قسم <strong className="text-primary">{book.category || 'الكتب العامة'}</strong> ضمن مكتبة دار الكلمة الرقمية.</p>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <button className="btn btn-primary px-10 py-5 text-lg shadow-xl hover:scale-105 transition-transform" onClick={() => handleDownload(book)}>
                                <i className="fa-solid fa-cloud-arrow-down ml-2"></i> تحميل نسخة PDF
                            </button>
                            <button
                                className="btn glass px-10 py-5 text-lg border-primary/30 text-primary hover:bg-primary/5"
                                onClick={() => handleShare(book.title)}
                            >
                                <i className="fa-solid fa-share-nodes ml-2"></i> مشاركة الرابط
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted uppercase">الناشر</span>
                                <span className="font-bold text-sm">مكتبة المنارة</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted uppercase">سنة النشر</span>
                                <span className="font-bold text-sm">غير محدد</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted uppercase">اللغة</span>
                                <span className="font-bold text-sm">العربية</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDetails
