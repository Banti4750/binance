import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSignin: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const signin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/signin', {
                email,
                password,
            });

            if (response.data.token && response.data.message === "Login successful") {
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful!");

                setTimeout(() => {
                    navigate('/user');
                }, 2000);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        formContainer: {
            width: '100%',
            maxWidth: '22rem',
            padding: '3rem 1.5rem',
            backgroundColor: '#1F2937',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center' as const,
            color: 'white',
            marginBottom: '1.5rem'
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem'
        },
        inputContainer: {
            position: 'relative' as const,
        },
        input: {
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: '#1F2937',
            color: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #374151',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontSize: '0.875rem',
            boxSizing: 'border-box' as const,
            outline: 'none',
            transition: 'all 0.2s'
        },
        button: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4F46E5',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '1rem'
        },
        buttonHover: {
            backgroundColor: '#4338CA'
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed'
        },
        error: {
            color: '#EF4444',
            fontSize: '0.875rem',
            textAlign: 'center' as const,
            marginTop: '0.5rem'
        },
        footer: {
            marginTop: '1.5rem',
            textAlign: 'center' as const,
            fontSize: '0.875rem',
            color: '#9CA3AF'
        },
        link: {
            color: '#818CF8',
            textDecoration: 'none',
            transition: 'color 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Sign In</h2>

                <form onSubmit={signin} style={styles.form}>
                    <div style={styles.inputContainer}>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Enter Email'
                            style={styles.input}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#4F46E5';
                                e.target.style.boxShadow = '0 0 0 1px #4F46E5';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#374151';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            placeholder='Enter Password'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#4F46E5';
                                e.target.style.boxShadow = '0 0 0 1px #4F46E5';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#374151';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#4338CA';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#4F46E5';
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {error && <p style={styles.error}>{error}</p>}
                </form>

                <p style={styles.footer}>
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        style={styles.link}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#818CF8'}
                    >
                        Sign up
                    </a>
                </p>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default UserSignin;