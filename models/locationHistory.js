const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const LocationHistory = sequelize.define('LocationHistory', {
    locationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // Add userId as a foreign key
    userId: {
        type: DataTypes.INTEGER, // Assuming userId is an integer
        allowNull: false,
        references: {
            model: 'Users', // Assuming the User model is named 'User'
            key: 'userId', // Assuming the primary key of the User model is 'userId'
        },
    },
});

// Define the association
LocationHistory.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId', onDelete: 'CASCADE' });

module.exports = LocationHistory;
