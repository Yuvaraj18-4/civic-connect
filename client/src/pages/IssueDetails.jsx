import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const IssueDetails = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const res = await api.get(`/issues/${id}`);
                setIssue(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIssue();
    }, [id]);

    if (!issue) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2>{issue.title}</h2>
            <p><strong>Reported by:</strong> {issue.creator?.name}</p>
            <p><strong>Date:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Location:</strong> {issue.location}</p>
            {issue.image && <img src={issue.image} alt={issue.title} style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '10px' }} />}
            <div style={{ marginTop: '20px' }}>
                <h3>Description</h3>
                <p>{issue.description}</p>
            </div>
            {/* Comments section could go here */}
        </div>
    );
};

export default IssueDetails;
