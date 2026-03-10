const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Citizen', 'Admin'),
        defaultValue: 'Citizen'
    },
    location: {
        type: DataTypes.STRING
    },
    interests: {
        type: DataTypes.STRING // Stored as JSON string or comma-separated
    },
    profilePicture: {
        type: DataTypes.STRING
    },
    resetPasswordToken: {
        type: DataTypes.STRING
    },
    resetPasswordExpires: {
        type: DataTypes.DATE
    }
});

module.exports = User;
