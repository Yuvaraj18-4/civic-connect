import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { FaMapMarkerAlt, FaChartLine, FaCalendarCheck, FaPlus, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const { user } = useAuth();
    const [recentIssues, setRecentIssues] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const issuesRes = await api.get('/issues?limit=3'); // Assuming backend supports limit or just slice it
                const eventsRes = await api.get('/events?limit=3');
                setRecentIssues(issuesRes.data.slice(0, 3));
                setUpcomingEvents(eventsRes.data.slice(0, 3));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'badge badge-new';
            case 'In Progress': return 'badge badge-progress';
            case 'Resolved': return 'badge badge-resolved';
            default: return 'badge';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Welcome back, {user?.name}</h1>
                    <p>Here's what's happening in your community today.</p>
                </div>
                <Link to="/report-issue" className="btn btn-primary">
                    Report New Issue
                </Link>
            </div>

            {/* Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <Link to="/report-issue" className="card card-hover" style={{ padding: '30px', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '50px', height: '50px', background: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#2563eb' }}>
                        <FaMapMarkerAlt size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Report Issue</h3>
                    <p>Spot a pothole or broken streetlight? Report it instantly.</p>
                </Link>
                <Link to="/issues" className="card card-hover" style={{ padding: '30px', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '50px', height: '50px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#166534' }}>
                        <FaChartLine size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Track Progress</h3>
                    <p>See real-time updates on reported issues in your area.</p>
                </Link>
                <Link to="/events" className="card card-hover" style={{ padding: '30px', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '50px', height: '50px', background: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#9333ea' }}>
                        <FaCalendarCheck size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Join Events</h3>
                    <p>Participate in town halls and community drives.</p>
                </Link>
            </div>

            {/* Recent Issues & Upcoming Events */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Recent Issues */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Recent Issues</h2>
                        <Link to="/issues" style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {recentIssues.map(issue => (
                            <div key={issue.id} className="card" style={{ display: 'flex', gap: '15px', padding: '15px', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                                    {issue.image ? (
                                        <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Img</div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex justify-between items-start">
                                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px' }}>{issue.title}</h3>
                                        <span className={getStatusBadge(issue.status)}>{issue.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{issue.description}</p>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaMapMarkerAlt size={10} /> {issue.location || 'Unknown Location'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div style={{ flex: 1.5, minWidth: '300px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Upcoming Events</h2>
                        <Link to="/events" style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{
                                        background: '#eff6ff',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '60px',
                                        height: '60px',
                                        color: 'var(--primary-color)'
                                    }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(event.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px' }}>{event.title}</h3>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.venue}</p>
                                        <button className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Interested</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
