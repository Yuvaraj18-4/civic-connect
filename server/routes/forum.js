const express = require('express');
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get All Topics
router.get('/topics', async (req, res) => {
    try {
        const topics = await Topic.findAll({ include: { model: User, as: 'author', attributes: ['name'] } });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Topic
router.post('/topics', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const topic = await Topic.create({ title, description, created_by: req.user.id });
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Topic Details with Comments
router.get('/topics/:id', async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.id, {
            include: [
                { model: User, as: 'author', attributes: ['name'] },
                { model: Comment, include: { model: User, as: 'author', attributes: ['name'] } }
            ]
        });
        if (!topic) return res.status(404).json({ error: 'Topic not found' });
        res.json(topic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Comment to Topic
router.post('/topics/:id/comments', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.create({
            content,
            topic_id: req.params.id,
            created_by: req.user.id
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
