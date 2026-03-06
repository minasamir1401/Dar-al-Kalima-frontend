import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'

export const AdminCoursesManager: React.FC<{ courses: any[], refresh: () => void }> = ({ courses, refresh }) => {
    const [title, setTitle] = useState('')
    const [instructor, setInstructor] = useState('')
    const [lessons, setLessons] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_BASE}/courses`, { title, instructor, lessons, category, image, url })
            setTitle(''); setInstructor(''); setLessons(''); setCategory(''); setImage(''); setUrl('')
            refresh()
            alert('تم إضافة الكورس')
        } catch (err) { alert('خطأ') }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('حذف؟')) return
        await axios.delete(`${API_BASE}/courses/${id}`)
        refresh()
    }

    return (
        <div className="space-y-10">
            <div className="form-group-premium">
                <h2 className="text-2xl font-bold mb-8">إضافة كورس تعليمي</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="اسم الكورس" className="search-box" value={title} onChange={e => setTitle(e.target.value)} required />
                    <input placeholder="المدرب" className="search-box" value={instructor} onChange={e => setInstructor(e.target.value)} />
                    <input placeholder="عدد الدروس" className="search-box" value={lessons} onChange={e => setLessons(e.target.value)} />
                    <input placeholder="التصنيف" className="search-box" value={category} onChange={e => setCategory(e.target.value)} />
                    <input placeholder="رابط الصورة" className="search-box w-full !bg-primary/5 !pr-4 md:col-span-2" value={image} onChange={e => setImage(e.target.value)} />
                    <input placeholder="رابط الكورس (Video ID / URL)" className="search-box w-full !bg-primary/5 !pr-4 md:col-span-2" value={url} onChange={e => setUrl(e.target.value)} />
                    <button type="submit" className="btn btn-primary lg:w-max px-12 py-4">حفظ الكورس</button>
                </form>
            </div>
            <div className="admin-table-container">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>اسم الكورس</th>
                                <th>المدرب</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(c => (
                                <tr key={c.id}>
                                    <td className="font-bold text-sm truncate max-w-[250px]">{c.title}</td>
                                    <td className="text-muted text-sm">{c.instructor || 'غير محدد'}</td>
                                    <td>
                                        <button onClick={() => handleDelete(c.id)} className="btn glass btn-sm !text-accent-red !border-accent-red/20">
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
