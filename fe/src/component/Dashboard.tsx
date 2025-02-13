import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import FAQ from "./FAQ";
import QRCodeGenerator from "./Qrcode";
import Copy from "../icons/Copy";
import 'react-toastify/dist/ReactToastify.css';
import WithdrawEthereum from "./WithdrawEthereum";

const DepositDashboard = () => {

    const [selectedCrypto, setSelectedCrypto] = useState("BTC");
    const [selectedNetwork, setSelectedNetwork] = useState("Bitcoin");
    const [depositAddress, setDepositAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("deposit-crypto");
    const navigate = useNavigate();

    const cryptoOptions = {
        BTC: { name: "Bitcoin", icon: "₿" },
        ETH: { name: "Ethereum", icon: "Ξ" },
        BNB: { name: "Binance Coin", icon: "BNB" },
        USDT: { name: "Tether", icon: "₮" },
        USDC: { name: "USD Coin", icon: "USDC" },
        SOL: { name: "Solana", icon: "SOL" },
    };

    const networkOptions = {
        BTC: ["Bitcoin"],
        ETH: ["Ethereum (ERC20)", "Arbitrum One", "Optimism"],
        BNB: ["BNB Chain (BEP20)", "BNB Beacon Chain"],
        USDT: ["Ethereum (ERC20)", "Tron (TRC20)", "BNB Chain (BEP20)"],
        USDC: ["Ethereum (ERC20)", "Solana", "BNB Chain (BEP20)"],
        SOL: ["Solana"],
    };

    const sidebarItems = [
        { id: 'deposit-crypto', label: 'Deposit Crypto', icon: '↓', route: '/deposit' },
        { id: 'withdraw-crypto', label: 'Withdraw Crypto', icon: '↑', route: '/withdraw' },
        { id: 'deposit-fiat', label: 'Deposit Fiat', icon: '$', route: '/deposit-fiat' },
        { id: 'withdraw-fiat', label: 'Withdraw Fiat', icon: '€', route: '/withdraw-fiat' }
    ];

    //@ts-ignore
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    useEffect(() => {
        if (activeTab === "deposit-crypto") {
            fetchDepositAddress();
        }
    }, [selectedCrypto, selectedNetwork, activeTab]);

    const fetchDepositAddress = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to view deposit address");
                return;
            }

            const response = await axios.get("http://localhost:3000/getdepositeaddress", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDepositAddress(response.data.publicKey);
        } catch (error: any) {
            console.error("Error fetching address:", error);
            toast.error(error.response?.data?.message || "Failed to fetch deposit address");
            setDepositAddress("");
        } finally {
            setIsLoading(false);
        }
    };

    function copyPublicKey(publicKey: string) {
        navigator.clipboard.writeText(publicKey).then(() => {
            console.log("Public key copied to clipboard!");
            toast.success("Public key copied to clipboard!")
        }).catch(err => {
            console.error("Failed to copy public key:", err);
        });
    }

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            color: '#fff',
        },
        content: {
            display: 'flex',
            gap: '30px',
            minHeight: '600px',
        },
        sidebar: {
            width: '250px',
            backgroundColor: '#1E2329',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '10px',
        },
        sidebarItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '15px',
        },
        sidebarItemActive: {
            backgroundColor: '#2B3139',
            color: '#F0B90B',
        },
        mainContent: {
            flex: 1,
            backgroundColor: '#1E2329',
            borderRadius: '12px',
            padding: '24px',
        },
        formGroup: {
            marginBottom: '24px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#B7BDC6',
            fontSize: '14px',
        },
        select: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#2B3139',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            transition: 'all 0.2s ease',
        },
        addressContainer: {
            marginTop: '24px',
            padding: '20px',
            backgroundColor: '#2B3139',
            borderRadius: '8px',
            border: '1px solid #374151',
        },
        addressHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
        },
        addressContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
        },
        address: {
            fontSize: '14px',
            wordBreak: 'break-all',
            color: '#F0B90B',
            flex: 1,
        },
        copyButton: {
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            color: '#B7BDC6',
        },
        warning: {
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'rgba(240, 185, 11, 0.1)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#F0B90B',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.sidebar}>

                    {sidebarItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                ...styles.sidebarItem,
                                ...(activeTab === item.id ? styles.sidebarItemActive : {})
                            }}
                            onClick={() => handleTabClick(item.id)}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>
                {activeTab === "deposit-crypto" && (
                    <div style={styles.mainContent}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Cryptocurrency</label>
                            <select
                                style={styles.select}
                                value={selectedCrypto}
                                onChange={(e) => setSelectedCrypto(e.target.value)}
                            >
                                {Object.entries(cryptoOptions).map(([value, { name, icon }]) => (
                                    <option key={value} value={value}>
                                        {icon} {name} ({value})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Network</label>
                            <select
                                style={styles.select}
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value)}
                            >
                                {networkOptions[selectedCrypto].map((network) => (
                                    <option key={network} value={network}>{network}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.addressContainer}>
                            <div style={styles.addressHeader}>
                                <span style={styles.label}>Deposit Address</span>
                                {isLoading && <span>Loading...</span>}
                            </div>

                            {depositAddress && (
                                <div style={styles.addressContent}>
                                    <div style={styles.address}>
                                        {depositAddress}
                                    </div>
                                    <div style={{
                                        width: '25px',
                                        cursor: "pointer",
                                    }}
                                        onClick={() => copyPublicKey(depositAddress)}>
                                        <Copy />
                                    </div>



                                    <QRCodeGenerator qrData={depositAddress} />
                                </div>
                            )}

                            <div style={styles.warning}>
                                ⚠️ Please make sure you're sending {selectedCrypto} on the {selectedNetwork} network only.
                                Sending assets on the wrong network may result in permanent loss.
                            </div>

                        </div>

                    </div>
                )}

                {/* Withdrawal Section */}
                {activeTab === "withdraw-crypto" && <WithdrawEthereum />}

                <FAQ />
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>

    );
};

export default DepositDashboard;