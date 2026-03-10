import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(''); // For demo purposes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setToken('');

        try {
            const response = await forgotPassword(email);
            setMessage('Password reset link has been sent to your email.');
            // In a real app, the token is in the email link. Here we show it for demo.
            if (response.data.token) {
                setToken(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request password reset');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>Forgot Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#64748b' }}>Enter your email to reset your password</p>

                {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{message}</div>}
                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
                </form>

                {token && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f1f5f9', borderRadius: '6px', wordBreak: 'break-all' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Demo Reset Link:</p>
                        <Link to={`/reset-password/${token}`} style={{ color: '#2563eb' }}>
                            /reset-password/{token}
                        </Link>
                    </div>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#64748b' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
