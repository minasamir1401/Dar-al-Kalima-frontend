import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'
import { YoutubePreviewer, extractYouTubeId } from './AdminShared'

export const AdminSubjectsManager: React.FC<{ subjects: any[], refresh: () => void }> = ({ subjects, refresh }) => {
    const [title, setTitle] = useState('')
    const [grade, setGrade] = useState('')
    const [image, setImage] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [category, setCategory] = useState('')
    const videoId = extractYouTubeId(youtubeUrl)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_BASE}/subjects`, { title, grade, image, download_url: downloadUrl, video_id: videoId, category })
            setTitle(''); setGrade(''); setImage(''); setDownloadUrl(''); setYoutubeUrl(''); setCategory('')
            refresh()
            alert('تمت إضافة المادة بنجاح')
        } catch (err) {
            alert('خطأ أثناء إضافة المادة')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return
        try {
            await axios.delete(`${API_BASE}/subjects/${id}`)
            refresh()
        } catch (err) {
            alert('خطأ أثناء الحذف')
        }
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <div className="section-header">
                    <div className="p-3 bg-violet-500/15 rounded-2xl text-violet-400 text-xl"><i className="fa-solid fa-book-open-reader"></i></div>
                    <div>
                        <h2 className="text-2xl font-bold">إضافة مادة دراسية</h2>
                        <p className="text-muted text-sm">أضف كتب أو فيديوهات شرح للمواد الدراسية</p>
                    </div>
                </div>
                <form onSubmit={handleAdd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">عنوان المادة</label>
                                    <input className="search-box" value={title} onChange={e => setTitle(e.target.value)} required placeholder="مثال: لغة عربية" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">السنة الدراسية</label>
                                    <input className="search-box" value={grade} onChange={e => setGrade(e.target.value)} placeholder="مثال: الصف الأول" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">التصنيف</label>
                                    <input className="search-box" value={category} onChange={e => setCategory(e.target.value)} placeholder="ابتدائي / ثانوي" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">رابط الصورة</label>
                                    <input className="search-box" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">رابط YouTube للشرح</label>
                                <div className="youtube-url-input-wrap">
                                    <i className="fa-brands fa-youtube yt-icon text-red-500"></i>
                                    <input className="search-box" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="رابط شرح المادة..." dir="ltr" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted px-1 uppercase tracking-wider">رابط تحميل الكتاب (PDF)</label>
                                <input className="search-box" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="رابط التحميل المباشر..." />
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                                <i className="fa-solid fa-cloud-arrow-up"></i> حفظ المادة
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">معاينة فيديو الشرح</label>
                            <YoutubePreviewer videoId={videoId} />
                        </div>
                    </div>
                </form>
            </div>

            <div className="admin-table-container">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg">قائمة المواد الدراسية</h3>
                    <span className="text-xs text-muted font-bold bg-white/5 px-3 py-1.5 rounded-full">إجمالي: {subjects.length}</span>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>المادة</th>
                                <th>المرحلة</th>
                                <th>التصنيف</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(s => (
                                <tr key={s.id}>
                                    <td className="flex items-center gap-4 py-3">
                                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                            <img src={s.image || '/logo.png'} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{s.title}</span>
                                            {s.video_id && <span className="text-[10px] text-red-400 font-bold"><i className="fa-brands fa-youtube"></i> فيديو شرح</span>}
                                        </div>
                                    </td>
                                    <td className="text-sm font-medium text-muted">{s.grade || 'عام'}</td>
                                    <td><span className="text-[11px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full">{s.category || 'غير مصنف'}</span></td>
                                    <td>
                                        <button onClick={() => handleDelete(s.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20 hover:!scale-110">
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
