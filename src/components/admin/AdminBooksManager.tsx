import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'

export const AdminBooksManager: React.FC<{ books: any[], refresh: () => void }> = ({ books, refresh }) => {
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
                        <input className="search-box" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">التصنيف</label>
                        <input className="search-box" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط الصورة</label>
                        <input className="search-box" value={image} onChange={(e) => setImage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط المعاينة</label>
                        <input className="search-box" value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-muted px-2 uppercase tracking-wider">رابط التحميل المباشر</label>
                        <input className="search-box" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
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
