import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            // backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            padding: '20px',
            textAlign: 'center',
            borderTop: '1px solid #333',
            marginTop: '50px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ marginBottom: '15px' }}>
                <a href="/about" style={{ color: '#FFFFFF', margin: '0 10px', textDecoration: 'none' }}>About Us</a>
                <a href="/terms" style={{ color: '#FFFFFF', margin: '0 10px', textDecoration: 'none' }}>Terms of Service</a>
                <a href="/privacy" style={{ color: '#FFFFFF', margin: '0 10px', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="/contact" style={{ color: '#FFFFFF', margin: '0 10px', textDecoration: 'none' }}>Contact</a>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <a href="https://twitter.com/binance" style={{ margin: '0 10px' }}>
                    <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="Twitter" style={{ width: '24px', height: '24px' }} />
                </a>
                <a href="https://facebook.com/binance" style={{ margin: '0 10px' }}>
                    <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                </a>
                <a href="https://instagram.com/binance" style={{ margin: '0 10px' }}>
                    <img src="https://img.icons8.com/color/48/000000/instagram-new--v1.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                </a>
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
                &copy; {new Date().getFullYear()} Binance. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;