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

const updateUser = async (userId, userData) => {
    try {
        const updatedUser = await User.update(userData, {
            where: { userId: userId },
            returning: true,
        });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user by ID:', error);
        throw error;
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
