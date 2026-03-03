import React, { useState, useEffect } from 'react'
import { VERSES } from '../constants'

const Loader: React.FC = () => {
    const [verseIndex, setVerseIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setVerseIndex((prev) => (prev + 1) % VERSES.length)
                setIsVisible(true)
            }, 600)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div id="site-loader">
            <div className="loader-rays"></div>
            <div className="loader-cross-wrapper">
                <div className="loader-halo"></div>
                <svg className="coptic-loader-icon" viewBox="0 0 100 100">
                    <path d="M50 5 L50 95 M5 50 L95 50 M35 20 L65 20 M35 80 L65 80 M20 35 L20 65 M80 35 L80 65"
                        strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="var(--accent-gold)" />
                </svg>
            </div>
            <div className="loader-verse-container">
                <div className="premium-loader-card card-anim-in">
                    <div
                        className="loader-verse-text"
                        style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? 0 : '-10px'})`, transition: 'all 0.6s' }}
                    >
                        "{VERSES[verseIndex].text}"
                    </div>
                    <div
                        className="loader-verse-ref"
                        style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.6s' }}
                    >
                        {VERSES[verseIndex].reference}
                    </div>
                </div>
            </div>
            <div className="loader-text" style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.7 }}>
                بِاسْمِ الآبِ وَالابْنِ وَالرُّوحِ القُدُسِ
            </div>
        </div>
    )
}

export default Loader
