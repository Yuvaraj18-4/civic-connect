import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await resetPassword(token, password);
            setMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>Reset Password</h2>

                {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{message}</div>}
                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
