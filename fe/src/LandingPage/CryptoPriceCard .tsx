import React, { useEffect, useState, useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import BTC from "../icons/BTC";
import SOLANA from "../icons/SOLANA";

const CryptoPriceCard = () => {
    const [prices, setPrices] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8080");

        socketRef.current.onmessage = (event) => {
            const newPrices = JSON.parse(event.data);
            setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
        };

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);

    // Helper function to format price
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(2);
        }
        if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        if (typeof price === 'object' && price !== null && 'price' in price) {
            return parseFloat(price.price).toFixed(2);
        }
        return '0.00';
    };

    // Helper function to get price change
    const getPriceChange = (data) => {
        if (typeof data === 'object' && data !== null && 'change' in data) {
            return parseFloat(data.change);
        }
        return 0;
    };

    const styles = {
        card: {
            width: '100%',
            maxWidth: '1200px', // Wider to match Binance's layout
            backgroundColor: '#2b3139',
            borderRadius: '28px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            margin: '0 auto',
            color: '#eaecef', // Light gray text
            fontFamily: 'Arial, sans-serif'
        },
        tableContainer: {
            overflowX: 'auto',
            width: '100%'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            padding: '16px 24px',
            textAlign: 'left',
            color: '#848e9c', // Grayish text for headers
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#2b3139' // Slightly lighter gray for header background
        },
        tableHeaderRight: {
            textAlign: 'right',
            padding: '16px 24px',
            color: '#848e9c',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#2b3139'
        },
        tableRow: {
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#2b3139' // Hover effect for rows
            }
        },
        tableCell: {
            padding: '16px 24px',
            color: '#eaecef',

        },
        tableCellRight: {
            padding: '16px 24px',
            color: '#eaecef',
            textAlign: 'right',
        },
        assetContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        assetIcon: {
            width: '24px',
            height: '24px',
            borderRadius: '50%'
        },
        assetName: {
            color: '#eaecef',
            fontWeight: '500'
        },
        priceChangeContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px'
        },
        priceChangePositive: {
            color: '#0ecb81' // Green for positive changes
        },
        priceChangeNegative: {
            color: '#f6465d' // Red for negative changes
        },
        loadingText: {
            textAlign: 'center',
            padding: '32px',
            color: '#848e9c'
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Coin</th>
                            <th style={styles.tableHeaderRight}>Price</th>
                            <th style={styles.tableHeaderRight}>24h Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(prices).length === 0 ? (
                            <tr>
                                <td colSpan={3} style={styles.loadingText}>
                                    Loading prices...
                                </td>
                            </tr>
                        ) : (
                            Object.entries(prices).map(([symbol, data]) => {
                                const priceChange = getPriceChange(data);

                                return (
                                    <tr key={symbol} style={styles.tableRow}>
                                        <td style={styles.tableCell}>
                                            <div style={styles.assetContainer}>
                                                <BTC />

                                                <span style={styles.assetName}>
                                                    {symbol.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={styles.tableCellRight}>
                                            ${formatPrice(data)}
                                        </td>
                                        <td style={styles.tableCellRight}>
                                            <div style={styles.priceChangeContainer}>
                                                {priceChange >= 0 ? (
                                                    <ArrowUp
                                                        size={16}
                                                        style={styles.priceChangePositive}
                                                    />
                                                ) : (
                                                    <ArrowDown
                                                        size={16}
                                                        style={styles.priceChangeNegative}
                                                    />
                                                )}
                                                <span
                                                    style={
                                                        priceChange >= 0
                                                            ? styles.priceChangePositive
                                                            : styles.priceChangeNegative
                                                    }
                                                >
                                                    {Math.abs(priceChange).toFixed(2)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CryptoPriceCard;