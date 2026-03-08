import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    Image as ImageIcon,
    Search,
    Trash2,
    User,
    LogOut,
    ArrowLeft,
    Phone,
    CheckCheck,
    Loader2,
    MessageSquareDashed,
    PlusCircle,
    X,
    ArrowDown,
} from 'lucide-react'

interface ChatUser {
    name: string;
    phone: string;
    gender: string;
}

interface Message {
    id: number;
    sender_phone: string;
    receiver_phone: string;
    message: string;
    image_url: string | null;
    created_at: string;
}

const BACKEND_URL = API_BASE.replace('/api', '');
const AI_USER: ChatUser = { name: 'ai دار الكلمة', phone: '999', gender: 'AI' };

/* ─────────────────────── Helpers ─────────────────────── */
const avatar = (name: string, gender: string, size = 42) => {
    let bg = gender === 'ذكر' ? 'var(--primary)' : '#ff2d55'
    if (gender === 'AI') bg = '#111827'
    return (
        <div
            className="rounded-2xl flex items-center justify-center text-white font-black uppercase shrink-0 shadow-sm"
            style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
        >
            {gender === 'AI' ? <span className="text-[10px]">AI</span> : name[0]}
        </div>
    )
}

/* ─────────────────────── Component ─────────────────────── */
const Chat: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<ChatUser | null>(null)
    const [regData, setRegData] = useState({ name: '', phone: '', gender: 'ذكر' })
    const [searchPhone, setSearchPhone] = useState('')
    const [activeChat, setActiveChat] = useState<ChatUser | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [recentChats, setRecentChats] = useState<ChatUser[]>([])
    const [globalResults, setGlobalResults] = useState<ChatUser[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [showAddContact, setShowAddContact] = useState(false)
    const [addForm, setAddForm] = useState({ name: '', phone: '' })
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const [isAiTyping, setIsAiTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* Effects */
    useEffect(() => {
        const saved = localStorage.getItem('chat_user')
        if (saved) setCurrentUser(JSON.parse(saved))

        // Check for global AI trigger
        if (sessionStorage.getItem('start_ai_chat') === 'true') {
            setActiveChat(AI_USER)
            sessionStorage.removeItem('start_ai_chat')
        }
    }, [])

    useEffect(() => {
        if (!currentUser) return
        fetchConvs()
        const t = setInterval(fetchConvs, 3000)
        return () => clearInterval(t)
    }, [currentUser])

    useEffect(() => {
        if (!currentUser || !activeChat) return
        fetchMsgs()
        const t = setInterval(fetchMsgs, 3000)
        return () => clearInterval(t)
    }, [currentUser, activeChat])

    const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
        }
    }

    useEffect(() => {
        scrollToBottom();
        const timer = setTimeout(() => scrollToBottom(), 300);
        return () => clearTimeout(timer);
    }, [messages, activeChat])

    useEffect(() => {
        const container = scrollRef.current
        if (!container) return
        const handleScroll = () => {
            const isUp = container.scrollHeight - container.scrollTop > container.clientHeight + 200
            setShowScrollBtn(isUp)
        }
        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [activeChat])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchPhone.trim().length > 1) {
                performGlobalSearch(searchPhone.trim())
            } else {
                setGlobalResults([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchPhone])

    /* API */
    const fetchConvs = async () => {
        if (!currentUser) return
        try { const r = await axios.get(`${API_BASE}/chat/conversations/${currentUser.phone}`); setRecentChats(r.data) } catch { }
    }
    const fetchMsgs = async () => {
        if (!currentUser || !activeChat) return
        try {
            const r = await axios.get(`${API_BASE}/chat/messages/${currentUser.phone}/${activeChat.phone}`);
            setMessages(r.data)
            // Save AI messages locally
            if (activeChat.phone === '999') {
                localStorage.setItem(`local_chat_999_${currentUser.phone}`, JSON.stringify(r.data))
            }
        } catch {
            // Fallback to local storage for AI
            if (activeChat.phone === '999') {
                const saved = localStorage.getItem(`local_chat_999_${currentUser.phone}`)
                if (saved) setMessages(JSON.parse(saved))
            }
        }
    }
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); setError('')
        try {
            const r = await axios.post(`${API_BASE}/chat/register`, regData)
            localStorage.setItem('chat_user', JSON.stringify(r.data)); setCurrentUser(r.data)
        } catch { setError('تعذر التسجيل') }
    }

    const performGlobalSearch = async (query: string) => {
        setLoading(true)
        try {
            const r = await axios.get(`${API_BASE}/chat/search/${query}`)
            setGlobalResults(r.data.filter((u: ChatUser) => u.phone !== currentUser?.phone))
        } catch { }
        finally { setLoading(false) }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault(); setError('')
        if (addForm.phone === currentUser?.phone) { setError('لا يمكنك إضافة نفسك'); return }
        setLoading(true)
        try {
            // First check if user exists
            const r = await axios.get(`${API_BASE}/chat/users/${addForm.phone}`)
            setActiveChat(r.data)
            setShowAddContact(false)
            setAddForm({ name: '', phone: '' })
        } catch {
            // If they don't exist, we can't really "add" them unless the backend allows registering others
            // For now, let's just use the global search results if they appear there
            setError('هذا المستخدم غير مسجل حالياً. يجب أن يسجل أولاً.')
        } finally {
            setLoading(false)
        }
    }
    const sendMsg = async (text: string | null, imgUrl: string | null) => {
        if (!currentUser || !activeChat) return;

        // Optimistic UI: Add user message immediately
        const tempId = Date.now()
        const userMsg: Message = {
            id: tempId,
            sender_phone: currentUser.phone,
            receiver_phone: activeChat.phone,
            message: text || '',
            image_url: imgUrl,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, userMsg])
        setNewMessage('')

        try {
            if (activeChat.phone === '999') {
                setIsAiTyping(true)
                await axios.post(`${API_BASE}/chat/ai`, { senderPhone: currentUser.phone, message: text })
                setIsAiTyping(false)
            } else {
                await axios.post(`${API_BASE}/chat/messages`, { senderPhone: currentUser.phone, receiverPhone: activeChat.phone, message: text, imageUrl: imgUrl })
            }
            fetchMsgs()
        } catch {
            setError('فشل الإرسال')
            setIsAiTyping(false)
        }
    }
    const handleSend = (e: React.FormEvent) => { e.preventDefault(); if (newMessage.trim()) sendMsg(newMessage.trim(), null) }
    const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        const fd = new FormData(); fd.append('image', file)
        setUploading(true); setError('')
        try { const r = await axios.post(`${API_BASE}/chat/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); sendMsg(null, r.data.imageUrl) }
        catch { setError('فشل رفع الصورة') }
        finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
    }
    const handleDelete = async (id: number) => {
        if (!confirm('حذف الرسالة للجميع؟')) return
        try { await axios.delete(`${API_BASE}/chat/messages/${id}`); fetchMsgs() }
        catch { setError('فشل الحذف') }
    }
    const handleClearChat = async () => {
        if (!confirm('هل تريد مسح كل الرسائل في هذه المحادثة؟')) return
        try {
            await axios.delete(`${API_BASE}/chat/conversations/${currentUser?.phone}/${activeChat?.phone}`)
            setMessages([])
            fetchConvs()
        } catch { setError('فشل مسح المحادثة') }
    }

    /* ─── Register screen ─── */
    if (!currentUser) return (
        <div className="chat-p-main flex items-center justify-center p-4 bg-gray-50/50" style={{ direction: 'rtl' }}>
            <Helmet><title>الشات | دار الكلمة</title></Helmet>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="chat-p-card w-full max-w-md relative z-10"
            >
                <div className="p-8 space-y-7 bg-white rounded-b-[32px]">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">الاسم المشترك به</label>
                            <div className="chat-p-input-group">
                                <User size={18} className="chat-p-input-icon" />
                                <input
                                    type="text" placeholder="مثال: مينا"
                                    className="chat-p-input"
                                    value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">رقم الموبايل</label>
                            <div className="chat-p-input-group">
                                <Phone size={18} className="chat-p-input-icon" />
                                <input
                                    type="tel" placeholder="012XXXXXXXX" dir="ltr"
                                    className="chat-p-input text-center font-black tracking-widest"
                                    value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#0066cc] rounded-full" />
                                النوع / التصنيف
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Male Option */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setRegData({ ...regData, gender: 'ذكر' })}
                                    className={`cursor-pointer h-36 rounded-[32px] border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center gap-3 ${regData.gender === 'ذكر'
                                        ? 'border-[#0066cc] bg-blue-50 shadow-xl'
                                        : 'border-gray-100 bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${regData.gender === 'ذكر' ? 'bg-[#0066cc] text-white scale-110' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        <User size={28} />
                                    </div>
                                    <span className={`font-black text-sm tracking-wide ${regData.gender === 'ذكر' ? 'text-[#0066cc]' : ''}`}>ذكر (رجل)</span>
                                    {regData.gender === 'ذكر' && (
                                        <motion.div layoutId="sel-check" className="absolute top-4 left-4 w-6 h-6 bg-[#0066cc] text-white rounded-full flex items-center justify-center">
                                            <div className="w-2 h-1 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Female Option */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setRegData({ ...regData, gender: 'أنثى' })}
                                    className={`cursor-pointer h-36 rounded-[32px] border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center gap-3 ${regData.gender === 'أنثى'
                                        ? 'border-[#0066cc] bg-blue-50 shadow-xl'
                                        : 'border-gray-100 bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${regData.gender === 'أنثى' ? 'bg-[#0066cc] text-white scale-110' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        <User size={28} />
                                    </div>
                                    <span className={`font-black text-sm tracking-wide ${regData.gender === 'أنثى' ? 'text-[#0066cc]' : ''}`}>أنثى (سيدة)</span>
                                    {regData.gender === 'أنثى' && (
                                        <motion.div layoutId="sel-check" className="absolute top-4 left-4 w-6 h-6 bg-[#0066cc] text-white rounded-full flex items-center justify-center">
                                            <div className="w-2 h-1 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit" className="chat-p-btn-primary w-full h-16 text-lg font-black mt-4 shadow-xl"
                        >
                            ابدأ الدردشة الآن
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    )

    /* ─── Main Chat UI ─── */
    return (
        <div className="chat-p-main-view bg-[#fbfbfd]" style={{ direction: 'rtl' }}>
            <Helmet><title>مراسلة فورية | دار الكلمة</title></Helmet>

            <div className="chat-p-container">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className={`chat-p-sidebar ${activeChat ? 'hide-mobile' : ''}`}
                >
                    <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                {avatar(currentUser.name, currentUser.gender, 46)}
                                <div className="min-w-0">
                                    <h4 className="font-black text-gray-800 text-base truncate">{currentUser.name}</h4>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">أنت</span>
                                    </div>
                                </div>
                            </div>
                            <div className="chat-p-actions">
                                <button
                                    onClick={() => setActiveChat(AI_USER)}
                                    className="chat-p-action-btn ai"
                                    title="تحدث مع الذكاء الاصطناعي"
                                >
                                    <span>AI</span>
                                </button>
                                <button
                                    onClick={() => setShowAddContact(true)}
                                    className="chat-p-action-btn add"
                                    title="محادثة جديدة"
                                >
                                    <PlusCircle size={20} />
                                </button>
                                <button
                                    onClick={() => { localStorage.removeItem('chat_user'); window.location.reload() }}
                                    className="chat-p-action-btn logout"
                                    title="خروج"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="tel" placeholder="ابحث بالاسم أو الرقم..."
                                className="chat-p-sidebar-search"
                                value={searchPhone} onChange={e => setSearchPhone(e.target.value)}
                            />
                            {searchPhone && (
                                <button type="button" onClick={() => setSearchPhone('')} className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            )}
                            {loading && <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066cc] animate-spin" size={14} />}
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {globalResults.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[10px] font-black text-[#0066cc] uppercase tracking-widest px-3 mb-2">نتائج البحث</p>
                                {globalResults.map(u => (
                                    <button
                                        key={u.phone}
                                        onClick={() => { setActiveChat(u); setSearchPhone('') }}
                                        className="chat-p-conv-item border border-blue-100/50 bg-blue-50/30 mb-1"
                                    >
                                        {avatar(u.name, u.gender, 42)}
                                        <div className="text-right flex-1 min-w-0">
                                            <p className="font-black text-gray-800 text-sm truncate">{u.name}</p>
                                            <p className="text-[11px] font-bold text-gray-400 truncate">{u.phone === '999' ? 'ai' : u.phone}</p>
                                        </div>
                                        <PlusCircle size={14} className="text-[#0066cc]" />
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-4 mx-2"></div>
                            </div>
                        )}

                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">المحادثات الأخيرة</p>
                        {recentChats.filter(u =>
                            !searchPhone ||
                            u.name.toLowerCase().includes(searchPhone.toLowerCase()) ||
                            u.phone.includes(searchPhone)
                        ).map(u => (
                            <button
                                key={u.phone}
                                onClick={() => setActiveChat(u)}
                                className={`chat-p-conv-item ${activeChat?.phone === u.phone ? 'active' : ''}`}
                            >
                                {avatar(u.name, u.gender, 42)}
                                <div className="text-right flex-1 min-w-0">
                                    <p className="font-black text-gray-800 text-sm truncate">{u.name}</p>
                                    <p className="text-[11px] font-bold text-gray-400 truncate">
                                        {u.phone === '999' ? 'ai' : u.phone}
                                    </p>
                                </div>
                                {activeChat?.phone === u.phone && <div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full" />}
                            </button>
                        ))}
                    </div>
                </motion.aside>

                {/* Main panel */}
                <div className={`chat-p-panel ${!activeChat ? 'hide-mobile' : ''}`}>
                    {activeChat ? (
                        <div className="flex flex-col h-full bg-white relative">
                            {/* Header */}
                            <div className="chat-p-panel-header">
                                <button onClick={() => setActiveChat(null)} className="show-mobile w-10 h-10 flex items-center justify-center text-gray-500">
                                    <ArrowLeft size={20} />
                                </button>
                                {avatar(activeChat.name, activeChat.gender, 44)}
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800">{activeChat.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                                        {activeChat.phone === '999' ? 'ai' : activeChat.phone}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400"><Phone size={18} /></button>
                                    <button
                                        onClick={handleClearChat}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-red-400 hover:text-red-500 transition-colors"
                                        title="مسح المحادثة"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#fbfbfd] custom-scrollbar relative"
                            >
                                {messages.map(msg => {
                                    const me = msg.sender_phone === currentUser.phone
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`flex ${me ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="relative max-w-[85%] md:max-w-[70%] group">
                                                {me && (
                                                    <button
                                                        onClick={() => handleDelete(msg.id)}
                                                        className="absolute -top-2 -left-2 w-7 h-7 bg-white shadow-md border border-gray-100 rounded-xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                                <div className={`chat-p-bubble ${me ? 'me' : 'them'}`}>
                                                    {msg.image_url && (
                                                        <div className="mb-2 rounded-2xl overflow-hidden shadow-inner cursor-pointer" onClick={() => window.open(`${BACKEND_URL}${msg.image_url}`, '_blank')}>
                                                            <img src={`${BACKEND_URL}${msg.image_url}`} alt="" className="w-full object-cover max-h-[350px]" />
                                                        </div>
                                                    )}
                                                    {msg.message && <p className="text-sm md:text-base leading-relaxed font-bold">{msg.message}</p>}
                                                    <div className={`flex items-center gap-1 mt-1.5 opacity-40 ${me ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[9px] font-black">{new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {me && <CheckCheck size={11} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                                {uploading && (
                                    <div className="flex justify-end pr-4">
                                        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                                            <Loader2 size={15} className="animate-spin text-[#0066cc]" />
                                            <span className="text-xs font-black text-gray-500">جاري الإرسال...</span>
                                        </div>
                                    </div>
                                )}

                                {isAiTyping && (
                                    <div className="flex justify-start pl-4">
                                        <div className="bg-gray-100 p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-200">
                                            <div className="flex gap-1">
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-500">ai دار الكلمة يكتب الآن...</span>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {showScrollBtn && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            onClick={() => scrollToBottom('smooth')}
                                            className="fixed bottom-24 right-1/2 translate-x-1/2 md:right-12 md:translate-x-0 w-10 h-10 bg-[#0066cc] text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#0052a3] transition-colors"
                                        >
                                            <ArrowDown size={20} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 md:p-6 bg-white border-t border-gray-100 flex-shrink-0">
                                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-[24px] p-2 flex items-end gap-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0066cc]/10 transition-all">
                                        <button
                                            type="button" onClick={() => fileInputRef.current?.click()}
                                            className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#0066cc] hover:bg-white rounded-2xl transition-all shadow-sm"
                                        >
                                            <ImageIcon size={20} />
                                        </button>
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImg} />
                                        <textarea
                                            rows={1} placeholder="اكتب رسالتك..."
                                            className="chat-p-textarea"
                                            value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
                                        />
                                    </div>
                                    <button
                                        type="submit" disabled={!newMessage.trim() && !uploading}
                                        className="chat-p-send-btn"
                                    >
                                        <Send size={22} className="rotate-180" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#fbfbfd]">
                            <div className="w-24 h-24 bg-white shadow-xl shadow-blue-50 rounded-[35px] flex items-center justify-center text-[#0066cc] mb-8">
                                <MessageSquareDashed size={42} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800">ابدأ الدردشة</h3>
                            <p className="text-gray-400 font-bold max-w-xs mt-2">اختر أحد جهات الاتصال أو ابحث عن رقم جديد للبدء فوراً</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Contact Modal */}
            <AnimatePresence>
                {showAddContact && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddContact(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-black text-gray-800">محادثة جديدة</h3>
                                <button onClick={() => setShowAddContact(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddContact} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">رقم موبايل الشخص</label>
                                    <div className="chat-p-input-group">
                                        <Phone size={16} className="chat-p-input-icon" />
                                        <input
                                            type="tel" placeholder="012XXXXXXXX"
                                            className="chat-p-input !h-12 !text-xs" required
                                            value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-400 font-bold px-2">ملاحظة: يجب أن يكون الشخص مسجلاً في الشات لكي تتمكن من مراسلته.</p>

                                {error && <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                                <button
                                    type="submit" disabled={loading}
                                    className="chat-p-btn-primary w-full h-12 text-sm font-black flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="rotate-180" />}
                                    ابدأ المحادثة
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Chat
