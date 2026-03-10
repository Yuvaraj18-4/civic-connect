import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Civic Connect</Link>
            <div className="nav-links">
                <Link to="/issues">Issues</Link>
                <Link to="/forum">Forum</Link>
                <Link to="/events">Events</Link>
                {user ? (
                    <>
                        {user.role === 'Admin' && <Link to="/admin">Admin</Link>}
                        {user.role !== 'Admin' && <Link to="/report-issue">Report Issue</Link>}
                        <Link to="/notifications"><FaBell /></Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '5px 10px' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
