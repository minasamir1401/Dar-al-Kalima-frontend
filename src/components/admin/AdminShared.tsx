import React from 'react'
import axios from 'axios'

export const AdminNavItem: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`admin-nav-item ${active ? 'active' : ''}`}
    >
        <i className={`fa-solid ${icon}`}></i>
        <span className="font-bold">{label}</span>
    </button>
)

export const extractYouTubeId = (input: string): string => {
    if (!input) return ''
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
    const m = input.match(/(?:v=|be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : input.trim()
}

export const YoutubePreviewer: React.FC<{ videoId: string }> = ({ videoId }) => {
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
