// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
    isValidEmail,
    isValidPassword,
    verifyToken,
    generateToken
} = require('../auth/auth');

// Load environment variables from .env file

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

    try {
        const email = await User.findOne({
            where: {
                email: user.email
            }
        });
        const username = await User.findOne({
            where: {
                username: user.username
            }
        });
        if (email !== null) {
            return res.status(400).json({ error: 'User with that email already exists' });
        }
        if (username !== null) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create the user
        await UserController.createUser(user).then(user =>{
            res.status(201).json({
                message: "User Successfully created",
                user

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

// Login user
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const currentTime = new Date().getTime();

    try {
        console.log(req.body);
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // create payload for JWT Token
        const expirationTimeSeconds = 3600; // 1 hour in seconds
        const expirationTime = Math.floor(Date.now() / 1000) + expirationTimeSeconds;
        

        const payload = {
            time: currentTime, // Current time in milliseconds since Unix epoch
            userId: user.userId,
            role: user.role,
            username: user.username,
            exp: expirationTime
        };
        // Generate token
        const token = generateToken(payload);
        res.status(200).json({
            message: "User successfully login in",
            token: token
        })
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})


// Get user by ID
router.get('/get/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const { role } = req.user;
        if (role === 'superuser') {
            const user = await UserController.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }
        const user = await UserController.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});


// Get user by ID
router.get('/users', verifyToken, async (req, res) => {
    try {
        // extract user from token
        
        if (!req.user) {
            return res.status(404).json({ error: 'No user in the database' });
        }
        const { role } = req.user;
        if (role !== 'superuser') {
            console.log(role);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const allUser = await UserController.getAllUsers();
        if (!allUser) {
            return res.status(404).json({ error: 'No user in the database' });
        }
        res.json(allUser);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});


// Update user by ID
// router.put('/update/:id', UserController.updateUser)

router.put('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userUpdate = req.body;
    try {
        // Check if user exists
        const existingUser = await UserController.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });         
        }

        if (userUpdate.password !== undefined) {
            if (!isValidPassword(userUpdate.password)) {
                return res.status(400).json({ error: 'Password should contain at least 8 characters, one letter, one number, and one special character.' });
            }
            // Generate salt and hash the new password
            const salt = await bcrypt.genSalt(10);
            userUpdate.password = await bcrypt.hash(userUpdate.password, salt);
        }
        
        if (userUpdate.email !== undefined) {
            if (!isValidEmail(userUpdate.email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
        }
        
        // Update the user
        const updatedUser = await UserController.updateUser(req, res, id, userUpdate);
        
        if (updatedUser) {
            return res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Server Error check' });
    }
});


// Delete user by ID
router.delete('/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
     // Assuming the user ID is included in the token payload
    
    try {
        const { userId} = req.user;
        const { role } = req.user;
        const userToDelete = await UserController.getUserById(userId);
        console.log(userToDelete.userId, req.user);

        // Check if the user to delete exists
        if (!userToDelete) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the authenticated user is either a superuser or the owner of the account
        if (role === 'superuser') {
            const deleted = await UserController.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Failed to delete user' });
            }
            return res.json({ message: `User with id ${id} deleted` });
        }
        if (userToDelete.userId.toString() === id) {
            console.log(userToDelete.userId);
            const deleted = await UserController.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Failed to delete user' });
            }
            return res.json({ message: `User with id ${id} deleted` });
        }
        
        else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;