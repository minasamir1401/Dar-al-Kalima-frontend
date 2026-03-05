import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import type { Subject } from '../types'

// ===== CONFIG =====
const categoryConfig = [
    { name: 'المرحلة الابتدائية', icon: 'fa-child-reaching', color: '#4caf50' },
    { name: 'المرحلة الإعدادية', icon: 'fa-person-walking-luggage', color: '#ff9800' },
    { name: 'المرحلة الثانوية', icon: 'fa-graduation-cap', color: '#f44336' },
]

const PAGE_SIZE = 24

// Normalize Arabic to fix ة/ه and أ/إ/ا differences
const normalize = (t?: string | null) =>
    (t || '').replace(/[أإآا]/g, 'ا').replace(/[ةه]/g, 'ه').trim()

const Subjects: React.FC = () => {
    const navigate = useNavigate()
    const [all, setAll] = useState<Subject[]>([])
    const [category, setCategory] = useState<string | null>(null)
    const [grade, setGrade] = useState<string | null>(null)
    const [subj, setSubj] = useState<string | null>(null)
    const [term, setTerm] = useState<string | null>(null)   // 'ترم أول' | 'ترم ثاني' | null
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    // Detect term from title
    const detectTerm = (title: string): 'ترم أول' | 'ترم ثاني' | null => {
        const t = normalize(title)
        const isFirst = t.includes('ترم اول') || t.includes('ترم 1') || t.includes('الفصل الاول') ||
            t.includes('الترم الاول') || t.includes('term 1') || t.includes('first term')
        const isSecond = t.includes('ترم ثاني') || t.includes('ترم 2') || t.includes('الفصل الثاني') ||
            t.includes('الترم الثاني') || t.includes('term 2') || t.includes('second term')
        if (isFirst) return 'ترم أول'
        if (isSecond) return 'ترم ثاني'
        return null
    }

    // ===== FETCH =====
    useEffect(() => {
        setLoading(true)
        axios.get(`${API_BASE}/subjects`)
            .then(r => { setAll(r.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    // ===== FILTER =====
    const filtered = all.filter(s => {
        if (category && normalize(s.category) !== normalize(category)) return false
        if (grade && normalize(s.grade) !== normalize(grade)) return false
        if (subj && normalize((s as any).subject_name) !== normalize(subj)) return false
        if (term && detectTerm(s.title) !== term) return false
        if (search) {
            const q = normalize(search)
            return normalize(s.title).includes(q) || normalize(s.grade).includes(q)
        }
        return true
    })

    // Check which terms exist for current subject selection
    const subjectItems = subj
        ? all.filter(s =>
            normalize(s.category) === normalize(category ?? '') &&
            normalize(s.grade) === normalize(grade ?? '') &&
            normalize((s as any).subject_name) === normalize(subj)
        )
        : []
    const hasTermOne = subjectItems.some(s => detectTerm(s.title) === 'ترم أول')
    const hasTermTwo = subjectItems.some(s => detectTerm(s.title) === 'ترم ثاني')
    const showTermFilter = subj && (hasTermOne || hasTermTwo)

    const displayed = filtered.slice(0, page * PAGE_SIZE)
    const hasMore = filtered.length > displayed.length

    // ===== DERIVED LISTS =====
    const inCategory = (cat: string) => all.filter(s => normalize(s.category) === normalize(cat))
    const gradesFor = (cat: string) => [...new Set(inCategory(cat).map(s => s.grade).filter(Boolean))].sort()
    const subjsFor = (cat: string, gr: string) =>
        [...new Set(all.filter(s => normalize(s.category) === normalize(cat) && normalize(s.grade) === normalize(gr))
            .map(s => (s as any).subject_name).filter(Boolean))].sort()

    // ===== RESET HELPERS =====
    const pickCategory = (c: string) => { setCategory(c); setGrade(null); setSubj(null); setTerm(null); setPage(1) }
    const pickGrade = (g: string) => { setGrade(g); setSubj(null); setTerm(null); setPage(1) }
    const pickSubj = (s: string) => { setSubj(s); setTerm(null); setPage(1) }
    const pickTerm = (t: string | null) => { setTerm(t); setPage(1) }
    const reset = () => { setCategory(null); setGrade(null); setSubj(null); setTerm(null); setSearch(''); setPage(1) }

    // ===== BREADCRUMB =====
    const crumbs = [
        { label: 'الكل', action: reset },
        category && { label: category, action: () => { setGrade(null); setSubj(null); setTerm(null); setPage(1) } },
        grade && { label: grade, action: () => { setSubj(null); setTerm(null); setPage(1) } },
        subj && { label: subj, action: () => { setTerm(null) } },
        term && { label: term, action: () => { } },
    ].filter(Boolean) as { label: string; action: () => void }[]

    return (
        <div className="fade-in max-w-7xl mx-auto px-4 pb-24">
            <Helmet>
                <title>المواد الدراسية | دار الكلمة</title>
                <meta name="description" content="مواد دراسية لجميع المراحل الدراسية" />
            </Helmet>

            {/* ===== HEADER ===== */}
            <div className="section-header !flex-col !items-start gap-4">
                <div className="section-title">
                    <i className="fa-solid fa-book-open-reader spiritual-cross"></i>
                    <h2>
                        {subj || grade || category || 'المواد الدراسية'}
                        {!loading && <span className="text-sm opacity-40 mr-3">({filtered.length} درس)</span>}
                    </h2>
                </div>

                {/* Search */}
                <div className="search-box w-full max-w-md">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="ابحث عن درس..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>

                {/* Breadcrumb */}
                {category && (
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                        {crumbs.map((c, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <i className="fa-solid fa-chevron-left text-xs opacity-30"></i>}
                                <button
                                    className={`px-3 py-1 rounded-full transition-all ${i === crumbs.length - 1 ? 'bg-primary/20 text-primary' : 'opacity-50 hover:opacity-100'}`}
                                    onClick={c.action}
                                >
                                    {c.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== LEVEL 1: CATEGORY CARDS ===== */}
            {!category && !search && (
                <div className="categories-grid mb-8 fade-in">
                    {categoryConfig.map((cat, idx) => {
                        const count = inCategory(cat.name).length
                        return (
                            <div
                                key={idx}
                                className="cat-card glass"
                                onClick={() => pickCategory(cat.name)}
                                style={{ '--accent': cat.color } as React.CSSProperties}
                            >
                                <i className={`fa-solid ${cat.icon} cat-icon`}></i>
                                <span>{cat.name}</span>
                                <div className="text-xs mt-2 opacity-50">{count} درس</div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ===== LEVEL 2: GRADE BUTTONS ===== */}
            {category && !grade && !search && (
                <div className="flex flex-wrap gap-2 mb-8 fade-in p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="w-full text-sm opacity-50 mb-1">اختر الصف الدراسي:</p>
                    {gradesFor(category).map(g => (
                        <button
                            key={g}
                            className="btn btn-primary btn-sm"
                            onClick={() => pickGrade(g)}
                        >
                            {g}
                            <span className="opacity-40 mr-1 text-xs">
                                ({inCategory(category).filter(s => normalize(s.grade) === normalize(g)).length})
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* ===== LEVEL 3: SUBJECT BUTTONS ===== */}
            {category && grade && !subj && !search && (
                <div className="flex flex-wrap gap-2 mb-8 fade-in p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="w-full text-sm opacity-50 mb-1">اختر المادة:</p>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => { setSubj(null); setPage(1) }}
                    >
                        كل المواد ({all.filter(s => normalize(s.category) === normalize(category) && normalize(s.grade) === normalize(grade)).length})
                    </button>
                    {subjsFor(category, grade).map(sn => {
                        const count = all.filter(s =>
                            normalize(s.category) === normalize(category) &&
                            normalize(s.grade) === normalize(grade) &&
                            normalize((s as any).subject_name) === normalize(sn)
                        ).length
                        return (
                            <button
                                key={sn}
                                className="btn btn-primary btn-sm"
                                onClick={() => pickSubj(sn)}
                            >
                                {sn} <span className="opacity-40 mr-1 text-xs">({count})</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* ===== LEVEL 4: TERM FILTER ===== */}
            {showTermFilter && (
                <div className="flex items-center gap-3 mb-6 fade-in p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm opacity-50 ml-2 whitespace-nowrap">الترم:</p>
                    {/* All */}
                    <button
                        onClick={() => pickTerm(null)}
                        className={`btn btn-sm transition-all !text-black ${term === null
                            ? 'bg-[#2ea8ff] border-[#2ea8ff]'
                            : 'bg-[#2ea8ff]/20 border-[#2ea8ff]/40 hover:bg-[#2ea8ff]/40'
                            }`}
                    >
                        الكل
                        <span className="opacity-60 mr-1 text-xs">
                            ({subjectItems.length})
                        </span>
                    </button>
                    {/* Term 1 */}
                    {hasTermOne && (
                        <button
                            onClick={() => pickTerm('ترم أول')}
                            className={`btn btn-sm transition-all !text-black ${term === 'ترم أول'
                                ? 'bg-[#2ea8ff] border-[#2ea8ff]'
                                : 'bg-[#2ea8ff]/20 border-[#2ea8ff]/40 hover:bg-[#2ea8ff]/40'
                                }`}
                        >
                            📘 الترم الأول
                            <span className="opacity-60 mr-1 text-xs">
                                ({subjectItems.filter(s => detectTerm(s.title) === 'ترم أول').length})
                            </span>
                        </button>
                    )}
                    {/* Term 2 */}
                    {hasTermTwo && (
                        <button
                            onClick={() => pickTerm('ترم ثاني')}
                            className={`btn btn-sm transition-all !text-black ${term === 'ترم ثاني'
                                ? 'bg-[#2ea8ff] border-[#2ea8ff]'
                                : 'bg-[#2ea8ff]/20 border-[#2ea8ff]/40 hover:bg-[#2ea8ff]/40'
                                }`}
                        >
                            📘 الترم الثاني
                            <span className="opacity-60 mr-1 text-xs">
                                ({subjectItems.filter(s => detectTerm(s.title) === 'ترم ثاني').length})
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* ===== LESSONS GRID ===== */}
            {(subj || search || (category && grade)) && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 fade-in">
                    {displayed.map(subject => {
                        const lessonUrl = `/lesson/${subject.id}`
                        return (
                            <div
                                key={subject.id}
                                className="book-card glass !p-3 group cursor-pointer"
                                onClick={() => navigate(lessonUrl)}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3 bg-black/20">
                                    <img
                                        src={subject.image || '/logo.png'}
                                        alt={subject.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                        onError={e => { (e.target as HTMLImageElement).src = '/logo.png' }}
                                    />
                                    {/* Play button overlay */}
                                    {lessonUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                                                <i className="fa-solid fa-play text-white text-xl mr-[-3px]"></i>
                                            </div>
                                        </div>
                                    )}
                                    {/* Bottom action buttons */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        {subject.video_id && (
                                            <a href={`https://youtube.com/watch?v=${subject.video_id}`} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="btn glass btn-sm flex-1 text-white text-[10px]">
                                                <i className="fa-brands fa-youtube text-red-500"></i> يوتيوب
                                            </a>
                                        )}
                                        {subject.download_url && (
                                            <a href={subject.download_url} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="btn btn-primary btn-sm flex-1 text-[10px]">
                                                <i className="fa-solid fa-download"></i> تحميل
                                            </a>
                                        )}
                                    </div>
                                    {/* Badge */}
                                    <div className="absolute top-2 right-2 badge-premium !bg-black/60 !backdrop-blur-md !border-none text-[10px] !px-2 !py-1">
                                        {subject.subject_name || subject.category?.replace('المرحلة ', '')}
                                    </div>
                                    {/* No video indicator */}
                                    {!lessonUrl && (
                                        <div className="absolute bottom-2 left-2 text-[9px] bg-black/50 text-white/50 px-2 py-1 rounded-full">
                                            لا يوجد فيديو
                                        </div>
                                    )}
                                </div>
                                <div className="text-center px-1">
                                    <h3 className="text-xs font-bold line-clamp-2 min-h-[2.5rem] leading-snug">{subject.title}</h3>
                                    <div className="text-[10px] text-muted flex items-center justify-center gap-1 mt-1 opacity-60">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                        {subject.grade}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Empty State */}
            {(subj || search || (category && grade)) && displayed.length === 0 && !loading && (
                <div className="text-center py-32 opacity-30">
                    <i className="fa-solid fa-book-open-reader text-7xl mb-4"></i>
                    <h2 className="text-xl">لا يوجد محتوى لهذا القسم حالياً</h2>
                </div>
            )}

            {/* Load More */}
            {hasMore && (
                <div className="mt-10 text-center">
                    <button className="btn btn-primary px-12 py-3" onClick={() => setPage(p => p + 1)}>
                        <i className="fa-solid fa-plus ml-2"></i> عرض المزيد
                    </button>
                </div>
            )}
        </div>
    )
}

export default Subjects
