// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../auth/auth').verifyToken;
const LocationController = require('../controllers/locationController');
const getUserById = require('../controllers/userController').getUserById;
// Add user location
router.post('/add/:userId', verifyToken, async (req, res) => {
    try {
        // Extract userId from the decoded JWT token
        const userId = req.params.userId;
        console.log(userId);
       //check if the userId exists
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Can not add location for non-existing user"
             });
        }



        // Extract location data from the request body
        const { latitude, longitude, timestamp } = req.body;

        // Add userId to the location data
        const locationData = {
            latitude,
            longitude,
            timestamp,
            userId // Associate userId with the location
        };

        // Add location with associated userId
        const location = await LocationController.addLocation(locationData);
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user location history
router.get('/history/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    
    try {
        const history = await LocationController.getUserLocationHistory(userId);
        
        if (history.length === 0) {
            return res.status(404).json({ error: 'Location history not found with the specified userId' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get current user location
router.get('/current/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const currentLocation = await LocationController.getCurrentUserLocation(userId);
        if (!currentLocation) {
            return res.status(404).json({ error: 'Location not found with the specified userId' });
        }
        return res.status(200).json(currentLocation);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
