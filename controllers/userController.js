const User = require('../models/user');

const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByPk(id);
        console.log('updatedUser:', updatedUser);
        if (!updatedUser) {
            throw Error(`User not found. id: ${id}`);
        }
        console.log('email:', updatedUser.email);
        if (req.body.username) updatedUser.username = req.body.username;
        if (req.body.email) updatedUser.email = req.body.email;
        if (req.body.password) updatedUser.password = req.body.password;
        if (req.body.role) updatedUser.role = req.body.role;

        await updatedUser.save();
        return updatedUser; // Return the updated user object
    } catch (error) {
        console.error('Error updating user:', error);
        throw error; // Re-throw the error to be caught in the calling route handler
    }
};

const deleteUser = async (userId) => {
    try {
        const deletedRows = await User.destroy({ where: { userId: userId } });
        return deletedRows > 0;
    } catch (error) {
        console.error('Error deleting user by ID:', error);
        throw error;
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
