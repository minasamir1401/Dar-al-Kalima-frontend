import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../../constants'

export const AdminDonationManager: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })

    const [settings, setSettings] = useState({
        isVisible: true,
        title: 'ادعم خدمتنا',
        content: 'يمكنك دعم الخدمة من خلال طرق الدفع التالية لتطوير وإضافة المزيد من المحتوى الروحي والتعليمي.',
        bankAccount: '',
        mobileWallets: [{ name: 'فودافون كاش', number: '' }],
        instapay: '',
        imageUrl: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_BASE}/settings/donation_page`)
            const data = res.data
            // Migration check: if old data exists, convert to new format
            if (data.vodafoneCash && (!data.mobileWallets || data.mobileWallets.length === 0)) {
                data.mobileWallets = [{ name: 'فودافون كاش', number: data.vodafoneCash }]
                delete data.vodafoneCash
            }
            if (!data.mobileWallets) data.mobileWallets = [{ name: 'فودافون كاش', number: '' }]

            setSettings(data)
        } catch (err) {
            console.error('Error fetching donation settings', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ text: '', type: '' })
        try {
            await axios.put(`${API_BASE}/settings/donation_page`, { setting_value: settings })
            setMessage({ text: 'تم حفظ الإعدادات بنجاح', type: 'success' })
            setTimeout(() => setMessage({ text: '', type: '' }), 3000)
        } catch (err) {
            setMessage({ text: 'فشل حفظ الإعدادات', type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    const addWallet = () => {
        setSettings({
            ...settings,
            mobileWallets: [...settings.mobileWallets, { name: 'فودافون كاش', number: '' }]
        })
    }

    const removeWallet = (index: number) => {
        const newWallets = settings.mobileWallets.filter((_, i) => i !== index)
        setSettings({ ...settings, mobileWallets: newWallets })
    }

    const updateWallet = (index: number, key: string, value: string) => {
        const newWallets = [...settings.mobileWallets]
        newWallets[index] = { ...newWallets[index], [key]: value }
        setSettings({ ...settings, mobileWallets: newWallets })
    }

    if (loading) return <div className="text-center py-20"><div className="spinner mx-auto"></div></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">إعدادات صفحة التبرعات (الدعم)</h2>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="glass p-6 md:p-8 rounded-2xl max-w-3xl space-y-6">
                <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <input
                        type="checkbox"
                        id="isVisible"
                        checked={settings.isVisible}
                        onChange={(e) => setSettings({ ...settings, isVisible: e.target.checked })}
                        className="w-6 h-6 rounded text-primary focus:ring-primary border-white/20"
                    />
                    <label htmlFor="isVisible" className="font-bold text-lg cursor-pointer select-none">
                        إظهار صفحة الدعم والتبرعات للزوار
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-muted mb-2">عنوان الصفحة</label>
                        <input
                            type="text"
                            className="search-box w-full"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted mb-2">رسالة الصفحة (نص الدعم)</label>
                        <textarea
                            className="search-box w-full min-h-[100px] resize-y"
                            value={settings.content}
                            onChange={(e) => setSettings({ ...settings, content: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted mb-2">رقم الحساب البنكي (اختياري)</label>
                        <input
                            type="text"
                            className="search-box w-full"
                            value={settings.bankAccount}
                            onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-muted">المحافظ الإلكترونية (فودافون، اتصالات، أورانج...)</label>
                            <button type="button" onClick={addWallet} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors font-bold">
                                <i className="fa-solid fa-plus ml-1"></i> إضافة محفظة أخرى
                            </button>
                        </div>

                        {settings.mobileWallets.map((wallet: any, index: number) => (
                            <div key={index} className="flex gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/10 relative group">
                                <div className="flex-1">
                                    <label className="block text-[10px] uppercase font-bold text-red-500/60 mb-1">اسم المحفظة (مثال: أورانج كاش)</label>
                                    <input
                                        type="text"
                                        className="search-box w-full !text-sm"
                                        placeholder="اسم المحفظة"
                                        value={wallet.name}
                                        onChange={(e) => updateWallet(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] uppercase font-bold text-red-500/60 mb-1">رقم المحفظة</label>
                                    <input
                                        type="text"
                                        className="search-box w-full !text-sm"
                                        placeholder="01xxxxxxxxx"
                                        value={wallet.number}
                                        onChange={(e) => updateWallet(index, 'number', e.target.value)}
                                    />
                                </div>
                                {settings.mobileWallets.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeWallet(index)}
                                        className="self-end mb-1 p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="حذف"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted mb-2">حساب Instapay (اختياري)</label>
                        <input
                            type="text"
                            className="search-box w-full"
                            value={settings.instapay}
                            onChange={(e) => setSettings({ ...settings, instapay: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted mb-2">رابط صورة/بنر (اختياري)</label>
                        <input
                            type="url"
                            className="search-box w-full"
                            value={settings.imageUrl}
                            onChange={(e) => setSettings({ ...settings, imageUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button type="submit" disabled={saving} className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2">
                        {saving ? <div className="spinner !w-5 !h-5 !border-2 border-white border-t-transparent"></div> : <i className="fa-solid fa-save"></i>}
                        <span className="font-bold">{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
