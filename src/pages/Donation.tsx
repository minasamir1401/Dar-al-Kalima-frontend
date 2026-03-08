import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { API_BASE } from '../constants'

const Donation: React.FC = () => {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE}/settings/donation_page`)
                setSettings(res.data)
            } catch (err) {
                console.error("Error fetching donation settings:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    if (loading) return <div className="text-center py-20"><div className="spinner mx-auto"></div></div>

    if (!settings || !settings.isVisible) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">الصفحة غير متاحة حالياً</h2>
                <p className="text-muted">نشكر محبتكم ودعمكم المستمر</p>
            </div>
        )
    }

    return (
        <div className="fade-in px-4 py-8 md:py-12 max-w-4xl mx-auto min-h-[70vh]">
            <Helmet>
                <title>{settings.title} | الدعم والتبرعات</title>
            </Helmet>

            <div className="glass p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden text-center border border-white/10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-gold/10 blur-[60px] rounded-full"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10">
                        <i className="fa-solid fa-hand-holding-dollar text-5xl text-primary animate-pulse-slow"></i>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-6 text-main tracking-tight">
                        {settings.title}
                    </h1>

                    <p className="text-lg md:text-xl text-muted mb-12 whitespace-pre-wrap leading-relaxed max-w-2xl mx-auto">
                        {settings.content}
                    </p>

                    {settings.imageUrl && (
                        <div className="mb-12">
                            <img src={settings.imageUrl} alt="دعم الخدمة" className="max-w-full md:max-w-md mx-auto rounded-3xl shadow-lg border border-white/5" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-right">
                        {settings.bankAccount && (
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                <i className="fa-solid fa-building-columns text-3xl text-primary mb-4 block"></i>
                                <h3 className="font-bold text-lg mb-2">الحساب البنكي</h3>
                                <p className="text-xl font-mono text-main select-all" dir="ltr">{settings.bankAccount}</p>
                            </div>
                        )}

                        {(settings.mobileWallets || settings.vodafoneCash) && (
                            <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                                <i className="fa-solid fa-mobile-screen-button text-3xl text-red-500 mb-4 block"></i>
                                <h3 className="font-bold text-lg mb-4 text-red-500">المحافظ الإلكترونية</h3>
                                <div className="space-y-4">
                                    {settings.mobileWallets ? (
                                        settings.mobileWallets.map((wallet: any, idx: number) => (
                                            wallet.number && (
                                                <div key={idx} className="bg-black/20 p-3 rounded-2xl">
                                                    <div className="text-[10px] text-red-400 font-bold mb-1 uppercase">{wallet.name || 'محفظة إلكترونية'}</div>
                                                    <p className="text-xl font-mono text-main select-all" dir="ltr">{wallet.number}</p>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <p className="text-xl font-mono text-main select-all" dir="ltr">{settings.vodafoneCash}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {settings.instapay && (
                            <div className="bg-purple-500/5 p-6 rounded-3xl border border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                                <i className="fa-solid fa-bolt text-3xl text-purple-500 mb-4 block"></i>
                                <h3 className="font-bold text-lg mb-2 text-purple-500">انستا بي (InstaPay)</h3>
                                <p className="text-xl font-mono text-main select-all" dir="ltr">{settings.instapay}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10">
                        <p className="text-sm font-bold text-primary italic">
                            "كُلُّ وَاحِدٍ كَمَا يَنْوِي بِقَلْبِهِ، لَيْسَ عَنْ حُزْنٍ أَوِ اضْطِرَارٍ. لأَنَّ الْمُعْطِيَ الْمَسْرُورَ يُحِبُّهُ اللهُ." (2 كو 9: 7)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Donation
