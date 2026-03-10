import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaExclamationCircle, FaComments, FaCalendarAlt, FaUser, FaSignOutAlt, FaBell, FaLayerGroup } from 'react-icons/fa';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: <FaHome />, label: 'Home' },
        { path: '/issues', icon: <FaExclamationCircle />, label: 'Issues' },
        { path: '/forum', icon: <FaComments />, label: 'Forum' },
        { path: '/events', icon: <FaCalendarAlt />, label: 'Events' },
    ];

    if (user?.role === 'Admin') {
        navItems.push({ path: '/admin', icon: <FaLayerGroup />, label: 'Admin' });
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <FaLayerGroup />
                </div>
                <span className="sidebar-title">Civic Connect</span>
                {/* Mobile Logout (Visible only on mobile via CSS if needed, or we can add a small button) */}
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{ marginLeft: 'auto', padding: '5px', display: 'none' }} // Hidden by default, show in media query if needed
                >
                    <FaSignOutAlt />
                </button>
            </div>

            <div className="nav-menu">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="sidebar-footer">
                <Link
                    to="/notifications"
                    className="nav-item"
                    style={{ marginBottom: '10px' }}
                >
                    <FaBell />
                    <span>Notifications</span>
                </Link>
                <div className="user-profile">
                    <div className="user-avatar">
                        <FaUser size={14} color="#64748b" />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.role || 'Citizen'}</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
