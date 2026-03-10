const express = require('express');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const sequelize = require('../database');
const router = express.Router();

// Middleware to check Admin role
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Access denied. Admins only.' });
    next();
};

// Update Issue Status
router.put('/issues/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });

        issue.status = status;
        await issue.save();

        // Create Notification
        await Notification.create({
            message: `Your issue "${issue.title}" status has been updated to ${status}`,
            type: 'StatusUpdate',
            user_id: issue.created_by
        });

        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Issue Department
router.put('/issues/:id/department', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { department } = req.body;
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });

        issue.department = department;
        await issue.save();

        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Analytics
router.get('/analytics', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalIssues = await Issue.count();
        const issuesByStatus = await Issue.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });
        const issuesByCategory = await Issue.findAll({
            attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
            group: ['category']
        });

        res.json({ totalIssues, issuesByStatus, issuesByCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
