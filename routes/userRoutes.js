// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user');
const { isValidEmail, isValidPassword } = require('../auth/auth');

// Load environment variables from .env file
dotenv.config();

// Register a new user
router.post('/register', async (req, res) => {
    const user = req.body;
    if (!isValidEmail(user.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password complexity
    if (!isValidPassword(user.password)) {
        return res.status(400).json({ error: 'Password should contain at least 8 characters, one letter, one number, and one special character.' });
    }

    
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Create payload for JWT token
        const payload = {
            time: Date.now(), // Use Date.now() to get milliseconds since Unix epoch
            userId: user.id, // Assuming user.id is the unique identifier for the user
            expiration: Date.now() + 3600000 // 1 hour from now
        };
       

    try {
        if (User.findOne({ email: user.email })) {
            return res.status(400).json({ error: 'User with that email already exists' });
        }
        if (User.findOne({ username: user.username })) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Generate JWT token
    
        const token = jwt.sign(payload, `${process.env.JWT_SECRET_KEY}`);
        console.log(token)
        

        // Create the user
        await UserController.createUser(user).then(user =>{
            res.status(201).json({ 
                message: "User Successfully created",
                user,
                token 
            
            });
        });

        // Send response with user object and token
        
    } catch (error) {
        
        res.status(500).json({ 
            message: "User not successfully created",
            error: error.message
         });
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
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await UserController.updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

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