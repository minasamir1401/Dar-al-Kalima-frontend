import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'
import { YoutubePreviewer, extractYouTubeId } from './AdminShared'

export const AdminPodcastManager: React.FC<{ podcasts: any[], refresh: () => void }> = ({ podcasts, refresh }) => {
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
                                <input placeholder="أدخل عنوان الحلقة..." className="search-box" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">رابط YouTube</label>
                                <div className="youtube-url-input-wrap">
                                    <i className="fa-brands fa-youtube yt-icon text-red-500"></i>
                                    <input
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="search-box"
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
                                <input placeholder="مثال: تخفيف أحمال" className="search-box" value={seriesTitle} onChange={e => setSeriesTitle(e.target.value)} />
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
