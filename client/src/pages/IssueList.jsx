import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaFilter } from 'react-icons/fa';

const IssueList = () => {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState({ category: '', status: '' });

    useEffect(() => {
        fetchIssues();
    }, [filter]);

    const fetchIssues = async () => {
        const params = {};
        if (filter.category) params.category = filter.category;
        if (filter.status) params.status = filter.status;

        try {
            const res = await api.get('/issues', { params });
            setIssues(res.data);
        } catch (error) {
            console.error(error);
        }
    };

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
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Community Issues</h2>
                <div className="flex gap-4">
                    <select
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">All Categories</option>
                        <option value="Road">Road</option>
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {issues.map(issue => (
                    <div key={issue.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '200px', background: '#eee', position: 'relative' }}>
                            {issue.image ? (
                                <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
                            )}
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <span className={getStatusBadge(issue.status)}>{issue.status}</span>
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>{issue.category}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>{issue.title}</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {issue.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaMapMarkerAlt /> {issue.location || 'Unknown'}
                                </div>
                                <Link to={`/issues/${issue.id}`} className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IssueList;
