import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Citizen'); // Citizen or Government
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>Welcome to Civic Connect</h1>
                <p style={{ color: '#64748b' }}>Sign in to your account to continue</p>
            </div>

            {/* Role Toggle */}
            <div style={{ background: 'white', padding: '5px', borderRadius: '8px', display: 'flex', marginBottom: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <button
                    onClick={() => setRole('Citizen')}
                    style={{
                        padding: '10px 40px',
                        border: 'none',
                        borderRadius: '6px',
                        background: role === 'Citizen' ? 'white' : 'transparent',
                        boxShadow: role === 'Citizen' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'Citizen' ? '#1e293b' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FaUser size={14} /> Citizen
                </button>
                <button
                    onClick={() => setRole('Government')}
                    style={{
                        padding: '10px 40px',
                        border: 'none',
                        borderRadius: '6px',
                        background: role === 'Government' ? 'white' : 'transparent',
                        boxShadow: role === 'Government' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'Government' ? '#1e293b' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FaShieldAlt size={14} /> Government
                </button>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                {role === 'Citizen' ? (
                    <>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>Citizen Login</h2>
                        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Report issues and join discussions</p>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '5px', color: '#2563eb' }}>Official Portal</h2>
                        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Secure access for city officials</p>
                    </>
                )}

                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{role === 'Citizen' ? 'Email' : 'Official Email'}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === 'Citizen' ? "citizen@civic.com" : "admin@civic.com"}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{role === 'Citizen' ? 'Password' : 'Secure Password'}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                        {role === 'Citizen' ? 'Sign In' : 'Access Dashboard'}
                    </button>
                </form>

                {role === 'Citizen' && (
                    <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                        <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '0.9rem' }}>Forgot Password?</Link>
                    </div>
                )}

                {role === 'Citizen' && (
                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Don't have an account? </span>
                        <Link to="/signup" style={{ color: '#2563eb', fontWeight: '600' }}>Create Account →</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
