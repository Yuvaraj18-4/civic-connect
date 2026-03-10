const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('StatusUpdate', 'NewEvent', 'Announcement'),
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

module.exports = Notification;
