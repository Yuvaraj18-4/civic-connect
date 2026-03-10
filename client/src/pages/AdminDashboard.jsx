import { useState, useEffect } from 'react';
import api from '../api';
import { FaCheckCircle, FaExclamationCircle, FaUserFriends, FaClipboardList } from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        resolutionRate: 0,
        activeCitizens: 0,
        pendingAction: 0
    });
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [department, setDepartment] = useState('');
    const [chartData, setChartData] = useState({
        status: null,
        category: null
    });

    const departments = ['Public Works', 'Sanitation', 'Health', 'Police', 'Transportation', 'Parks & Recreation', 'Other'];

    useEffect(() => {
        fetchIssues();
        // fetchAnalytics(); // We can derive most stats from issues for now to match the design exactly
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await api.get('/issues');
            const data = res.data;
            setIssues(data);
            calculateStats(data);
            prepareChartData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const resolved = data.filter(i => i.status === 'Resolved').length;
        const pending = data.filter(i => i.status === 'New' || i.status === 'In Progress').length;
        // Mocking active citizens for now as we don't have a user count API readily available in this context
        // In a real app, we'd fetch this from /admin/analytics
        const activeCitizens = 3;

        setStats({
            totalReports: total,
            resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
            activeCitizens: activeCitizens,
            pendingAction: pending
        });
    };

    const prepareChartData = (data) => {
        // Status Data
        const statusCounts = {
            'New': 0,
            'In Progress': 0,
            'Resolved': 0
        };
        data.forEach(issue => {
            if (statusCounts[issue.status] !== undefined) {
                statusCounts[issue.status]++;
            }
        });

        const statusChart = {
            labels: ['New', 'In Progress', 'Resolved'],
            datasets: [{
                label: 'Issues',
                data: [statusCounts['New'], statusCounts['In Progress'], statusCounts['Resolved']],
                backgroundColor: ['#3b82f6', '#eab308', '#22c55e'],
                borderRadius: 5,
                barThickness: 40,
            }]
        };

        // Category Data
        const categoryCounts = {};
        data.forEach(issue => {
            categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
        });

        const categoryChart = {
            labels: Object.keys(categoryCounts),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
                borderWidth: 0,
            }]
        };

        setChartData({
            status: statusChart,
            category: categoryChart
        });
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/admin/issues/${id}/status`, { status: newStatus });
            // Optimistic update
            const updatedIssues = issues.map(issue =>
                issue.id === id ? { ...issue, status: newStatus } : issue
            );
            setIssues(updatedIssues);
            calculateStats(updatedIssues);
            prepareChartData(updatedIssues);

            if (selectedIssue && selectedIssue.id === id) {
                setSelectedIssue({ ...selectedIssue, status: newStatus });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    const handleDepartmentUpdate = async (id) => {
        try {
            await api.put(`/admin/issues/${id}/department`, { department });
            const updatedIssues = issues.map(issue =>
                issue.id === id ? { ...issue, department } : issue
            );
            setIssues(updatedIssues);

            if (selectedIssue) {
                setSelectedIssue({ ...selectedIssue, department });
            }
            alert('Department assigned successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to assign department');
        }
    };

    const openModal = (issue) => {
        setSelectedIssue(issue);
        setDepartment(issue.department || '');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return '#3b82f6'; // Blue
            case 'In Progress': return '#eab308'; // Yellow
            case 'Resolved': return '#22c55e'; // Green
            default: return '#64748b';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'New': return '#dbeafe';
            case 'In Progress': return '#fef9c3';
            case 'Resolved': return '#dcfce7';
            default: return '#f1f5f9';
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                    color: '#f1f5f9'
                },
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20
                }
            }
        },
        cutout: '70%'
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Government Portal</h2>
                <p style={{ color: '#64748b' }}>Real-time city management dashboard.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {/* Total Reports */}
                <div className="card" style={{ background: '#3b82f6', color: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Reports</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalReports}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>+12% from last month</div>
                </div>

                {/* Resolution Rate */}
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Resolution Rate</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#22c55e', margin: '10px 0' }}>{stats.resolutionRate}%</div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${stats.resolutionRate}%`, height: '100%', background: '#22c55e' }}></div>
                    </div>
                </div>

                {/* Active Citizens */}
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Active Citizens</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>{stats.activeCitizens}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Registered users</div>
                </div>

                {/* Pending Action */}
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Pending Action</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316', margin: '10px 0' }}>{stats.pendingAction}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Requires attention</div>
                </div>
            </div>

            {/* Issue Management Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', marginBottom: '40px' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Issue Management</h3>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>Review and update citizen reports</p>
                    </div>
                    <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                        View All Reports →
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '16px', fontWeight: '600' }}>ID</th>
                                <th style={{ padding: '16px', fontWeight: '600' }}>Issue Details</th>
                                <th style={{ padding: '16px', fontWeight: '600' }}>Location</th>
                                <th style={{ padding: '16px', fontWeight: '600' }}>Category</th>
                                <th style={{ padding: '16px', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '16px', fontWeight: '600' }}>Status Action</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '14px', color: '#334155' }}>
                            {issues.map((issue, index) => (
                                <tr key={issue.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px', color: '#64748b' }}>#{index + 1}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{issue.title}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {issue.description}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{issue.location || 'Unknown'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#10b981', color: 'white', fontSize: '12px', fontWeight: '500' }}>
                                            {issue.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px' }}>
                                        <select
                                            value={issue.status}
                                            onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: getStatusBg(issue.status),
                                                color: getStatusColor(issue.status),
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="New">New</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Status Overview */}
                <div className="card" style={{ flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>Status Overview</h3>
                    <div style={{ height: '300px' }}>
                        {chartData.status && <Bar data={chartData.status} options={chartOptions} />}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="card" style={{ flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>Category Breakdown</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        {chartData.category && <Doughnut data={chartData.category} options={doughnutOptions} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
