import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', venue: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', newEvent);
            setNewEvent({ title: '', description: '', date: '', venue: '' });
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('Failed to create event');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Community Events</h2>
                {user && user.role === 'Admin' && (
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        <FaPlus style={{ marginRight: '5px' }} /> {showForm ? 'Cancel' : 'Add Event'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card">
                    <h3>Add New Event</h3>
                    <form onSubmit={handleCreateEvent}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} required rows="3"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="datetime-local" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Venue</label>
                            <input type="text" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Event</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {events.map(event => (
                    <div key={event.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ background: 'var(--primary-color)', padding: '20px', color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{new Date(event.date).getDate()}</div>
                            <div style={{ textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.9 }}>{new Date(event.date).toLocaleString('default', { month: 'long' })}</div>
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>{event.title}</h3>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaCalendarAlt /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaMapMarkerAlt /> {event.venue}
                            </div>
                            <p style={{ fontSize: '0.95rem', marginBottom: '20px', flex: 1 }}>{event.description}</p>
                            <button className="btn btn-secondary btn-block">Interested</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsList;
