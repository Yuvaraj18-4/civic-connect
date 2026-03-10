const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get User Notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark as Read (Optional)
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOne({ where: { id: req.params.id, user_id: req.user.id } });
        if (!notification) return res.status(404).json({ error: 'Notification not found' });

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
