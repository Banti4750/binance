import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import WithdrawEthereum from './WithdrawEthereum';
import FAQ from './FAQ';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeGenerator from './Qrcode';
import { Copy } from 'lucide-react';

//@ts-ignore
const DepositContent = ({
    selectedCrypto,
    setSelectedCrypto,
    selectedNetwork,
    setSelectedNetwork,
    depositAddress,
    isLoading,
    copyPublicKey,
    cryptoOptions,
    networkOptions,
    styles
}) => (
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
);

export default DepositContent;