import React from 'react';
import { Apple } from 'lucide-react';
import binaceQr from '../assets/binanceQr.png';
import BinanceMobileImg from '../assets/BianceMobileImg.svg';

const Download = () => {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '120px 24px',
            gap: '120px',
            position: 'relative',
            // backgroundColor: '#0B0E11'
        },
        mobileImage: {
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
        },
        mobileImageStyle: {
            width: '304px',
            height: '584px',
            objectFit: 'contain',
            position: 'relative',
            zIndex: '2'
        },
        glowEffect: {
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(11, 129, 240, 0.15) 0%, rgba(16, 90, 165, 0) 90%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1'
        },
        contentSection: {
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px'
        },
        mainTitle: {
            fontSize: '52px',
            fontWeight: '600',
            textAlign: 'left',
            color: 'white',
            lineHeight: '1.2',
            maxWidth: '500px'
        },
        qrSection: {
            display: 'flex',
            gap: '32px',
            marginBottom: '48px'
        },
        qrCode: {
            width: '140px',
            height: '140px',
            objectFit: 'contain',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        qrText: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px'
        },
        qrTitle: {
            fontSize: '20px',
            fontWeight: '500',
            color: 'white'
        },
        qrSubtitle: {
            fontSize: '16px',
            color: '#848E9C'
        },
        desktopSection: {
            display: 'flex',
            gap: '16px'
        },
        desktopOption: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '120px',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
            }
        },
        iconWrapper: {
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F0B90B'
        },
        platformText: {
            fontSize: '14px',
            fontWeight: '500',
            color: 'white'
        },
        storeButtons: {
            display: 'flex',
            gap: '16px',
            marginTop: '24px'
        },
        storeButton: {
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mobileImage}>
                <div style={styles.glowEffect} />
                <img
                    src={BinanceMobileImg}
                    alt="Binance Mobile App"
                    style={styles.mobileImageStyle}
                />
            </div>

            <div style={styles.contentSection}>
                <h1 style={styles.mainTitle}>
                    Trade on the go. Anywhere, anytime.
                </h1>

                <div>
                    <div style={styles.qrSection}>
                        <img
                            src={binaceQr}
                            alt="Download QR Code"
                            style={styles.qrCode}
                        />
                        <div style={styles.qrText}>
                            <h2 style={styles.qrTitle}>Scan to Download</h2>
                            <p style={styles.qrSubtitle}>iOS & Android</p>
                            <div style={styles.storeButtons}>
                                <button style={styles.storeButton}>
                                    <Apple size={20} />
                                    App Store
                                </button>
                                <button style={styles.storeButton}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.523 15.83l-.094-.086-1.385 1.386 5.75 5.75a.97.97 0 001.372-1.372l-5.643-5.678zm-3.012-3.011l-.094-.086-1.385 1.386 5.75 5.75a.97.97 0 001.372-1.372l-5.643-5.678z" />
                                        <path d="M21.5 12.43c0-.82-.67-1.49-1.49-1.49H4.01c-.82 0-1.49.67-1.49 1.49v7.58c0 .82.67 1.49 1.49 1.49h15.99c.82 0 1.49-.67 1.49-1.49v-7.58zm-1.49 7.58H4.01V12.43h15.99v7.58zM21.5 4.01c0-.82-.67-1.49-1.49-1.49H4.01c-.82 0-1.49.67-1.49 1.49v7.58c0 .82.67 1.49 1.49 1.49h15.99c.82 0 1.49-.67 1.49-1.49V4.01zM20.01 11.59H4.01V4.01h15.99v7.58z" />
                                    </svg>
                                    Google Play
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={styles.desktopSection}>
                        <div style={styles.desktopOption}>
                            <div style={styles.iconWrapper}>
                                <Apple size={24} />
                            </div>
                            <span style={styles.platformText}>MacOS</span>
                        </div>

                        <div style={styles.desktopOption}>
                            <div style={styles.iconWrapper}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                                </svg>
                            </div>
                            <span style={styles.platformText}>Windows</span>
                        </div>

                        <div style={styles.desktopOption}>
                            <div style={styles.iconWrapper}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                                </svg>
                            </div>
                            <span style={styles.platformText}>Linux</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Download;