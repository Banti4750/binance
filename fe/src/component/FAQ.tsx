import React, { useState } from "react";

const FAQ = () => {
    const [isOpen, setIsOpen] = useState(false);

    const styles = {
        container: {
            maxWidth: "800px",
            height: "400px",
            // margin: "50px auto",
            padding: "20px",
            // backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            fontFamily: "Arial, sans-serif",
        },
        heading: {
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "20px",
            // color: "#333",
            textAlign: "center",
        },
        faqItem: {
            padding: "15px",
            marginBottom: "15px",
            // backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            transition: "all 0.3s ease",
        },
        questionContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: '350px'
        },
        question: {
            fontSize: "18px",
            fontWeight: "600",
            color: "white",
        },
        time: {
            fontSize: "14px",
            color: "white",
        },
        answer: {
            marginTop: "10px",
            fontSize: "16px",
            color: "white",
            maxHeight: isOpen ? "200px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease-in-out",
            textAlign: "start",
        },
        icon: {
            fontSize: "20px",
            color: "#777",
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>FAQ</h1>
            <div
                style={styles.faqItem}
                onClick={() => setIsOpen(!isOpen)} // Toggle open/close
            >
                <div style={styles.questionContainer}>
                    <p style={styles.question}>How to deposit crypto?</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* <p style={styles.time}>4:10</p> */}
                        <span style={styles.icon}>▼</span> {/* Icon for expand/collapse */}
                    </div>
                </div>
                <p style={styles.answer}>
                    How to Deposit Crypto Step-by-step Guide: <br /><br />

                    1. Select "Deposit" and choose your cryptocurrency. <br /><br />
                    2. Copy the deposit address and use it to transfer funds.
                </p>
            </div>
            {/* Add more FAQ items here */}
        </div>
    );
};

export default FAQ;