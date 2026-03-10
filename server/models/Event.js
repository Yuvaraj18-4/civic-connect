const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    venue: {
        type: DataTypes.STRING
    },
    interested_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Event;
