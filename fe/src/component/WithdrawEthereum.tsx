import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WithdrawEthereum = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to withdraw');
                return;
            }

            // Validate address and amount
            if (!address.startsWith('0x') || address.length !== 42) {
                toast.error('Invalid Ethereum address');
                return;
            }

            if (parseFloat(amount) <= 0) {
                toast.error('Amount must be greater than 0');
                return;
            }

            const response = await axios.post('http://localhost:3000/withdraw', {
                address,
                amount,

            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Withdrawal request submitted successfully');
            setAddress('');
            setAmount('');
        } catch (error) {
            console.error('Withdrawal error:', error);
            //@ts-ignore
            toast.error(error.response?.data?.message || 'Failed to process withdrawal');
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            color: '#fff',
        },
        title: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#F0B90B',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#B7BDC6',
            fontSize: '14px',
        },
        input: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#2B3139',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            transition: 'all 0.2s ease',
        },
        button: {
            padding: '14px 24px',
            backgroundColor: '#F0B90B',
            color: '#1E2329',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            opacity: (isLoading ? 0.7 : 1),
        },
        warning: {
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'rgba(240, 185, 11, 0.1)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#F0B90B',
        },
        info: {
            marginTop: '16px',
            fontSize: '14px',
            color: '#B7BDC6',
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Withdraw Ethereum</h2>

            <form onSubmit={handleWithdraw} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Recipient ETH Address</label>
                    <input
                        type="text"
                        style={styles.input}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="0x..."
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Amount (ETH)</label>
                    <input
                        type="number"
                        style={styles.input}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.001"
                        // min="0.01"
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Withdraw ETH'}
                </button>
            </form>

            <div style={styles.warning}>
                ⚠️ Please double-check the recipient address before confirming.
                Transactions cannot be reversed once processed.
            </div>

            <div style={styles.info}>
                • Network: Ethereum (ERC20)
                <br />
                • Estimated processing time: 10-30 minutes
                <br />
                • Gas fees will be deducted from the withdrawal amount
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default WithdrawEthereum;