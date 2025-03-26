const { User, users } = require('../models/userModel');

// Get all users
const getAllUsers = (req, res) => {
    res.json(users);
};

// Get user by ID
const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

// Create new user
const createUser = (req, res) => {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User(users.length + 1, name, email, password);
    users.push(newUser);
    res.status(201).json(newUser);
};

// Update user
const updateUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { name, email, password } = req.body;
    
    if (name) user.name = name;
    if (email) {
        // Check if new email already exists
        if (users.some(u => u.email === email && u.id !== user.id)) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        user.email = email;
    }
    if (password) user.password = password;
    
    user.updatedAt = new Date();
    res.json(user);
};

// Delete user
const deleteUser = (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    
    users.splice(userIndex, 1);
    res.status(204).send();
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}; 