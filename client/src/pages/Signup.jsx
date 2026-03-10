import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>Welcome to Civic Connect</h1>
                <p style={{ color: '#64748b' }}>Create your citizen account</p>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>Create Account</h2>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Join your community today</p>

                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Jane Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="citizen@civic.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Location (Optional)</label>
                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, District" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px' }}>Sign Up & Login</button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/login" style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
