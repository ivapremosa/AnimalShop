const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const connectDB = require('../config/database');

let testUserId;

async function setup() {
    try {
        await connectDB();
        console.log('Database connected and collection cleared');
        // Clear the users collection before running tests
        await mongoose.connection.collection('User').deleteMany({});
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

async function runTests() {
    console.log('\nStarting Repository Tests...\n');

    // Test 1: Create User
    try {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };
        const user = await UserModel.createUser(userData);
        testUserId = user.id;
        console.log('✓ Create User Success');
    } catch (error) {
        console.log('✗ Create User Failed:', error.message);
    }

    // Test 2: Create User with Duplicate Email
    try {
        const userData = {
            name: 'Another User',
            email: 'test@example.com',
            password: 'password123'
        };
        await UserModel.createUser(userData);
    } catch (error) {
        console.log('✓ Duplicate Email Test Success:', error.message);
    }

    // Test 3: Get All Users
    try {
        const users = await UserModel.getAllUsers();
        console.log('✓ Get All Users Success:', users.length, 'users found');
    } catch (error) {
        console.log('✗ Get All Users Failed:', error.message);
    }

    // Test 4: Get User by ID
    try {
        const user = await UserModel.getUserById(testUserId);
        console.log('✓ Get User by ID Success:', user.name);
    } catch (error) {
        console.log('✗ Get User by ID Failed:', error.message);
    }

    // Test 5: Update User
    try {
        const updateData = {
            name: 'Updated User',
            email: 'updated@example.com'
        };
        const updatedUser = await UserModel.updateUser(testUserId, updateData);
        console.log('✓ Update User Success:', updatedUser.name);
    } catch (error) {
        console.log('✗ Update User Failed:', error.message);
    }

    // Test 6: Update User with Duplicate Email
    try {
        const userData = {
            name: 'Another User',
            email: 'test@example.com',
            password: 'password123'
        };
        await UserModel.createUser(userData);
        const updateData = {
            email: 'test@example.com'
        };
        await UserModel.updateUser(testUserId, updateData);
    } catch (error) {
        console.log('✓ Update with Duplicate Email Success:', error.message);
    }

    // Test 7: Update Non-existent User
    try {
        const updateData = {
            name: 'Updated User',
            email: 'updated@example.com'
        };
        await UserModel.updateUser('507f1f77bcf86cd799439011', updateData);
    } catch (error) {
        console.log('✓ Update Non-existent User Success:', error.message);
    }

    // Test 8: Delete User
    try {
        const deletedUser = await UserModel.deleteUser(testUserId);
        console.log('✓ Delete User Success:', deletedUser.name);
    } catch (error) {
        console.log('✗ Delete User Failed:', error.message);
    }

    // Test 9: Delete Non-existent User
    try {
        await UserModel.deleteUser('507f1f77bcf86cd799439011');
    } catch (error) {
        console.log('✓ Delete Non-existent User Success:', error.message);
    }

    // Test 10: Get All Users After Deletion
    try {
        const users = await UserModel.getAllUsers();
        console.log('✓ Get All Users After Deletion Success:', users.length, 'users found');
    } catch (error) {
        console.log('✗ Get All Users After Deletion Failed:', error.message);
    }

    console.log('\nRepository Tests Completed!');
}

async function cleanup() {
    try {
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

// Run the tests
setup()
    .then(runTests)
    .then(cleanup)
    .catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    }); 