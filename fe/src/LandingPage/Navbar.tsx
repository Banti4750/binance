import React, { useState } from 'react';

interface NavLinkProps {
    text: string;
    href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ text, href }) => (
    <a
        href={href}
        style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#F0B90B'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
    >
        {text}
    </a>
);

const Navbar = () => {

    const navLinks = [
        { text: 'Buy Crypto', href: '#' },
        { text: 'Markets', href: '#' },
        { text: 'Trade', href: '#' },
        { text: 'Derivatives', href: '#' },
        { text: 'Earn', href: '#' }
    ];

    const navStyles = {
        nav: {
            backgroundColor: '#1E2329',
            padding: '16px 24px',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        mainWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        leftSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
        },
        logo: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#F0B90B',
        },
        desktopMenu: {
            display: 'flex',
            gap: '24px',
            '@media (max-width: 768px)': {
                display: 'none',
            },
        },
        rightSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            '@media (max-width: 768px)': {
                display: 'none',
            },
        },
        authButtons: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        registerButton: {
            backgroundColor: '#F0B90B',
            color: 'black',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
        },
        iconButtons: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        iconButton: {
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
        },
        mobileMenuButton: {
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            '@media (max-width: 768px)': {
                display: 'block',
            },
        },
        mobileMenu: {
            display: 'none',
            '@media (max-width: 768px)': {
                display: 'block',
                marginTop: '16px',
            },
        },
        mobileMenuItem: {
            padding: '12px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
    };

    return (
        <nav style={navStyles.nav}>
            <div style={navStyles.container}>
                <div style={navStyles.mainWrapper}>
                    {/* Logo and Left Menu */}
                    <div style={navStyles.leftSection}>
                        <div style={navStyles.logo}>BINANCE</div>

                        {/* Desktop Menu */}
                        <div style={navStyles.desktopMenu}>
                            {navLinks.map((link) => (
                                <NavLink key={link.text} {...link} />
                            ))}
                        </div>
                    </div>

                    {/* Right Menu */}
                    <div style={navStyles.rightSection}>
                        <div style={navStyles.authButtons}>
                            <NavLink text="Login" href="/signin" />
                            <a
                                href="/signup"
                                style={navStyles.registerButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4a408'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0B90B'}
                            >
                                Register
                            </a>
                        </div>

                        <div style={navStyles.iconButtons}>
                            <button style={navStyles.iconButton}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </button>
                            <button style={navStyles.iconButton}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;