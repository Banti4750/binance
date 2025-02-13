import React from 'react';
import CryptoPriceCard from "./CryptoPriceCard "

const HeroSection = () => {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '60px 80px',
            // backgroundColor: '#0B0E11',
            minHeight: '600px',
            gap: '40px'
        },
        leftPart: {
            flex: '1',
            maxWidth: '600px'
        },
        rightPart: {
            flex: '1',
            display: 'flex',
            justifyContent: 'center'
        },
        headingContainer: {
            textAlign: 'start',
            marginBottom: '40px'
        },
        numberHeading: {
            fontSize: '72px',
            color: '#F0B90B',
            fontWeight: 'bold',
            margin: '0',
            lineHeight: '1.1'
        },
        textHeading: {
            fontSize: '72px',
            color: '#ffffff',
            fontWeight: 'bold',
            margin: '0',
            lineHeight: '1.1',
            marginBottom: '24px'
        },
        inputContainer: {
            display: 'flex',
            gap: '16px',
            maxWidth: '480px'
        },
        input: {
            flex: '1',
            padding: '16px 24px',
            fontSize: '16px',
            backgroundColor: '#1E2329',
            border: '1px solid #2D3337',
            borderRadius: '4px',
            color: '#ffffff',
            outline: 'none',
            transition: 'all 0.2s ease'
        },
        button: {
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#F0B90B',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        description: {
            color: '#848E9C',
            fontSize: '16px',
            marginTop: '24px',
            lineHeight: '1.5'
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Part */}
            <div style={styles.leftPart}>
                <div style={styles.headingContainer}>
                    <h1 style={styles.numberHeading}>258,331,080</h1>
                    <h1 style={styles.textHeading}>
                        USERS <br />
                        TRUST US
                    </h1>
                    <p style={styles.description}>
                        Join the world's largest crypto exchange. Experience fast trading, secure wallets,
                        and industry-leading features.
                    </p>
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="email"
                        placeholder="Email/Phone Number"
                        style={styles.input}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#F0B90B';
                            e.target.style.backgroundColor = '#2B3139';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#2D3337';
                            e.target.style.backgroundColor = '#1E2329';
                        }}
                    />
                    <button
                        style={styles.button}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DBA50B';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0B90B';
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Right Part */}
            <div style={styles.rightPart}>
                <CryptoPriceCard />
            </div>
        </div>
    );
};

export default HeroSection;