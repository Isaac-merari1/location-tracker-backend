// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Create a user
router.post('/add', async (req, res) => {
    try {
        const user = await UserController.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get all users
router.get('/all', async (req, res) => {
    try {
        const users = await UserController.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get user by ID
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserController.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Update user by ID
router.put('/update/:id', UserController.updateUser)
//     async (req, res) => {
//     const { id } = req.params;
//     console.log(id);
//
//     try {
//         const updatedUser = await UserController.updateUser(res, res);
//         console.log("updatedUser in router => ", updatedUser);
//         // if (!updatedUser) {
//         //     return res.status(404).json({ error: 'User not found' });
//         // }
//         res.json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ error: 'Server Error' });
//     }
// });

// Delete user by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await UserController.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted'});
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;