

import axios from "axios";
import CryptoPriceCard from "../LandingPage/CryptoPriceCard "
import { useState } from "react";

const UserHero = () => {
    const [balance, setbalance] = useState("")

    async function getBalance() {
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage.");
                return;
            }

            const response = await axios.get("http://localhost:3000/getuserbalance", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("User Balance:", response.data.balance);
            setbalance(response.data.balance); // Return balance data if needed

        } catch (error) {
            //@ts-ignore
            console.error("Error fetching balance:", error.response?.data || error.message);
        }
    }
    getBalance();



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
            width: '600px'
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
            fontSize: '62px',
            color: '#F0B90B',
            fontWeight: 'bold',
            margin: '0',
            lineHeight: '1.1'
        },
        textHeading: {
            fontSize: '62px',
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
        buttonn: {
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            // backgroundColor: '#F0B90B',
            // color: '#000000',
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
                    <h1 style={styles.numberHeading}>Get Verified and</h1>
                    <h1 style={styles.textHeading}>
                        Start Your Crypto <br />
                        Journey
                    </h1>
                    <p style={styles.description}>
                        Join the world's largest crypto exchange. Experience fast trading, secure wallets,
                        and industry-leading features.
                    </p>
                </div>

                <div style={{
                    textAlign: 'start'
                }}>
                    <div>Your Estimated Balance</div>
                    <h1>{balance} <span style={{
                        fontSize: '16px'
                    }}>ETH = </span>  <span style={{
                        fontSize: '16px',
                        color: 'green'
                    }}>${(Number(balance)) * 2658}</span></h1>
                </div>
                <div style={styles.inputContainer}>

                    <button
                        style={styles.button}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DBA50B';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0B90B';
                        }}
                    >
                        Verify Now
                    </button>

                    <button
                        style={styles.buttonn}
                    >
                        Read Tutorial
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

export default UserHero;