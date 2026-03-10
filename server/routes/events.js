const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Event (Admin only - check role in real app, simplified here)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });
        const { title, description, date, venue } = req.body;
        const event = await Event.create({ title, description, date, venue });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
