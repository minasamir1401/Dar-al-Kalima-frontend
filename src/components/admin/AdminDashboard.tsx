import React from 'react'

export const AdminDashboard: React.FC<{ stats: any, loading: boolean }> = ({ stats, loading }) => (
    <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div>
                <h1 className="text-xl md:text-3xl font-bold mb-1">الرئيسية</h1>
                <p className="text-muted text-xs md:text-sm">مرحباً بك في لوحة تحكم دار الكلمة</p>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="search-box w-full">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input placeholder="بحث في الاحصائيات والبيانات..." className="search-box" />
                </div>
                <div className="hidden md:flex gap-4 shrink-0">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-primary">النظام متصل</span>
                    </div>
                </div>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20"><div className="spinner mx-auto"></div></div>
        ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <StatCard label="الكتب" value={stats.books} icon="fa-book" color="#3b82f6" />
                <StatCard label="الكورسات" value={stats.courses} icon="fa-graduation-cap" color="#fbbf24" />
                <StatCard label="الفيديوهات" value={stats.videos} icon="fa-clapperboard" color="#10b981" />
                <StatCard label="البودكاست" value={stats.podcasts} icon="fa-microphone" color="#ec4899" />
                <StatCard label="الأطفال" value={stats.kids} icon="fa-child" color="#f97316" />
                <StatCard label="المواد" value={stats.subjects} icon="fa-book-open-reader" color="#8b5cf6" />
            </div>
        )}
    </div>
)

const StatCard: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="stat-card-premium" style={{ borderColor: color + '33' }}>
        <i className={`fa-solid ${icon} bg-icon`} style={{ color }}></i>
        <div className="flex items-center justify-between mb-3 md:mb-8">
            <div className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}44` }}>
                <i className={`fa-solid ${icon} text-sm md:text-xl`}></i>
            </div>
            <div className="text-right">
                <div className="text-xl md:text-3xl font-bold mb-0.5">{value}</div>
                <div className="text-muted text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{label}</div>
            </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ backgroundColor: color, width: '65%' }}></div>
        </div>
    </div>
)
