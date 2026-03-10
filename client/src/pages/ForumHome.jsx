import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const ForumHome = () => {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({ title: '', description: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await api.get('/forum/topics');
            setTopics(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forum/topics', newTopic);
            setNewTopic({ title: '', description: '' });
            setShowForm(false);
            fetchTopics();
        } catch (error) {
            console.error(error);
            alert('Failed to create topic');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Community Forum</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : 'Start New Topic'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3>Create New Topic</h3>
                    <form onSubmit={handleCreateTopic}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={newTopic.description} onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })} required rows="3"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Post Topic</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {topics.map(topic => (
                    <div key={topic.id} className="card">
                        <h3><Link to={`/forum/${topic.id}`} style={{ color: 'var(--primary-color)' }}>{topic.title}</Link></h3>
                        <p>{topic.description.substring(0, 150)}...</p>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            Posted by {topic.author?.name} | {new Date(topic.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumHome;
