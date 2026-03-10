const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Topic = sequelize.define('Topic', {
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
    upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

Topic.belongsTo(User, { as: 'author', foreignKey: 'created_by' });
User.hasMany(Topic, { foreignKey: 'created_by' });

module.exports = Topic;
