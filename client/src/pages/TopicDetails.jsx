import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const TopicDetails = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchTopic();
    }, [id]);

    const fetchTopic = async () => {
        try {
            const res = await api.get(`/forum/topics/${id}`);
            setTopic(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/forum/topics/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchTopic();
        } catch (error) {
            console.error(error);
            alert('Failed to post comment');
        }
    };

    if (!topic) return <div>Loading...</div>;

    return (
        <div>
            <div className="card">
                <h2>{topic.title}</h2>
                <p style={{ fontSize: '1.1rem' }}>{topic.description}</p>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                    Posted by {topic.author?.name} on {new Date(topic.createdAt).toLocaleDateString()}
                </div>
            </div>

            <h3>Comments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                {topic.Comments?.map(comment => (
                    <div key={comment.id} className="card" style={{ padding: '15px', marginBottom: '0' }}>
                        <p>{comment.content}</p>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                            - {comment.author?.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Add a Comment</h3>
                <form onSubmit={handleComment}>
                    <div className="form-group">
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} required rows="3" placeholder="Join the discussion..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Post Comment</button>
                </form>
            </div>
        </div>
    );
};

export default TopicDetails;
