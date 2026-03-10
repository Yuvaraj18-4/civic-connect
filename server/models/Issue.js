const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Issue = sequelize.define('Issue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Road', 'Water', 'Electricity', 'Garbage', 'Public Safety', 'Other'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING // Could be address or lat,long
    },
    status: {
        type: DataTypes.ENUM('New', 'In Progress', 'Resolved'),
        defaultValue: 'New'
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Issue.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Issue, { foreignKey: 'created_by' });

module.exports = Issue;
