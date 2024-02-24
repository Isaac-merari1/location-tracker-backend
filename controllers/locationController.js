const LocationHistory = require('../models/locationHistory');

const LocationController = {

    addLocation: async (locationData) => {
        return await LocationHistory.create(locationData);
    },

    getUserLocationHistory: async (userId) => {
        return await LocationHistory.findAll({ where: { userId }, order: [['timestamp', 'DESC']] });
    },

    getCurrentUserLocation: async (userId) => {
        return await LocationHistory.findOne({ where: { userId }, order: [['timestamp', 'DESC']] });
    },

};

module.exports = LocationController;
