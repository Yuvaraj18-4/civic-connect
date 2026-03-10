const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Topic = require('./Topic');
const Issue = require('./Issue');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Comment.belongsTo(User, { as: 'author', foreignKey: 'created_by' });
User.hasMany(Comment, { foreignKey: 'created_by' });

// Comments can belong to Topics or Issues (polymorphic-ish or just separate FKs)
// For simplicity, let's add FKs for both, nullable.
Comment.belongsTo(Topic, { foreignKey: 'topic_id', constraints: false });
Topic.hasMany(Comment, { foreignKey: 'topic_id', constraints: false });

Comment.belongsTo(Issue, { foreignKey: 'issue_id', constraints: false });
Issue.hasMany(Comment, { foreignKey: 'issue_id', constraints: false });

module.exports = Comment;
