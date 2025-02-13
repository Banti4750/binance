import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BinanceFAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 24px',
            // backgroundColor: '#0B0E11',
            color: 'white'
        },
        header: {
            marginBottom: '48px',
            textAlign: 'center'
        },
        title: {
            fontSize: '40px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'white'
        },
        subtitle: {
            fontSize: '16px',
            color: '#848E9C',
            maxWidth: '600px',
            margin: '0 auto'
        },
        faqList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
        },
        faqItem: {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
        },
        question: {
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
        },
        questionText: {
            fontSize: '16px',
            fontWeight: '500',
            color: 'white'
        },
        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.3s ease'
        },
        answer: {
            padding: '0 24px',
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
        },
        answerText: {
            color: '#848E9C',
            fontSize: '14px',
            lineHeight: '1.6',
            paddingBottom: '24px'
        },
        expanded: {
            maxHeight: '500px' // Adjust based on content
        },
        rotatedIcon: {
            transform: 'rotate(180deg)'
        }
    };

    const faqs = [
        {
            question: "What is Binance?",
            answer: "Binance is the world's leading blockchain ecosystem and cryptocurrency infrastructure provider with a financial product suite that includes the largest digital asset exchange by volume."
        },
        {
            question: "How do I create a Binance account?",
            answer: "Creating a Binance account is simple. Visit the Binance registration page, enter your email and create a secure password. Complete the verification process by providing required documents to start trading."
        },
        {
            question: "Is Binance available in my country?",
            answer: "Binance services are available in most countries worldwide. However, availability may vary based on your location due to local regulations. Check Binance's Terms of Service for specific details about your region."
        },
        {
            question: "What are the trading fees on Binance?",
            answer: "Binance offers competitive trading fees starting from 0.1%. You can reduce your trading fees by using BNB for fees and increasing your trading volume. VIP levels offer additional fee discounts."
        },
        {
            question: "How secure is Binance?",
            answer: "Binance employs state-of-the-art security measures including 2FA, cold storage for majority of assets, anti-phishing codes, and the Secure Asset Fund for Users (SAFU) to protect user funds."
        }
    ];

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Frequently Asked Questions</h2>
                <p style={styles.subtitle}>
                    Have questions? We're here to help. Find answers to commonly asked questions about Binance.
                </p>
            </div>

            <div style={styles.faqList}>
                {faqs.map((faq, index) => (
                    <div key={index} style={styles.faqItem}>
                        <div
                            style={styles.question}
                            onClick={() => toggleFaq(index)}
                        >
                            <span style={styles.questionText}>{faq.question}</span>
                            <div style={{
                                ...styles.iconWrapper,
                                ...(activeIndex === index ? styles.rotatedIcon : {})
                            }}>
                                <ChevronDown
                                    size={24}
                                    color="#848E9C"
                                />
                            </div>
                        </div>
                        <div style={{
                            ...styles.answer,
                            ...(activeIndex === index ? styles.expanded : {})
                        }}>
                            <p style={styles.answerText}>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BinanceFAQ;