const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./database');
const fs = require('fs');

// Import models to ensure they are registered
require('./models/User');
require('./models/Issue');
require('./models/Topic');
require('./models/Comment');
require('./models/Event');
require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// Sync Database and Start Server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
