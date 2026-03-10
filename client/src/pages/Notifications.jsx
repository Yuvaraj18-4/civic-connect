import { useState, useEffect } from 'react';
import api from '../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications'); // Need to implement this endpoint in backend if not exists
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>Notifications</h2>
            {notifications.length === 0 ? <p>No notifications.</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {notifications.map(notif => (
                        <li key={notif.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                            <strong>{notif.type}:</strong> {notif.message}
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
