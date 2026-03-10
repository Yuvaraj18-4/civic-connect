import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>My Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p className="badge" style={{ background: user.role === 'Admin' ? 'var(--primary-color)' : 'var(--secondary-color)', color: 'white', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                        {user.role}
                    </p>
                </div>
            </div>

            <div className="form-group">
                <label>Location</label>
                <p>{user.location || 'Not specified'}</p>
            </div>

            {/* Could add list of user's reported issues here */}
        </div>
    );
};

export default Profile;
