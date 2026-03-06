import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'
import { YoutubePreviewer, extractYouTubeId } from './AdminShared'

export const AdminKidsManager: React.FC<{ kidsVideos: any[], refresh: () => void }> = ({ kidsVideos, refresh }) => {
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
                                <input placeholder="أدخل عنوان الفيديو..." className="search-box" value={title} onChange={e => setTitle(e.target.value)} required />
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">القسم</label>
                                    <input placeholder="ألعاب / فيديوهات" className="search-box" value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">أيقونة</label>
                                    <input placeholder="fa-star" className="search-box" value={icon} onChange={e => setIcon(e.target.value)} />
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
