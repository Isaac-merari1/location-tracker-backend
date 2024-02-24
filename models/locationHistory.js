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
});

LocationHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = LocationHistory;
