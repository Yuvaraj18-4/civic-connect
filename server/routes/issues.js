const express = require('express');
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Image Upload Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create Issue
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, category, description, location } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        // Automatic Department Assignment
        const departmentMapping = {
            'Road': 'Transportation',
            'Water': 'Public Works',
            'Electricity': 'Public Works',
            'Garbage': 'Sanitation',
            'Public Safety': 'Police',
            'Other': 'Other'
        };
        const department = departmentMapping[category] || 'Other';

        const issue = await Issue.create({
            title, category, description, image, location,
            department,
            created_by: req.user.id
        });
        res.status(201).json(issue);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Issues
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;

        const issues = await Issue.findAll({ where, include: { model: User, as: 'creator', attributes: ['name'] } });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Issue Details
router.get('/:id', async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id, { include: { model: User, as: 'creator', attributes: ['name'] } });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
