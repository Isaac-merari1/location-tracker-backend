// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');

// Add user location
router.post('/add', async (req, res) => {
    try {
        const location = await LocationController.addLocation(req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get user location history
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const history = await LocationController.getUserLocationHistory(userId);
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
        res.json(currentLocation);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
