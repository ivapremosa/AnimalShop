const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'User'
});

// Add method to convert to gRPC response format
userSchema.methods.toGrpcResponse = function() {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString()
    };
};

// Create the User model
const User = mongoose.model('User', userSchema);

class UserModel {
    async getAllUsers() {
        try {
            const users = await User.find({});
            return { users: users.map(user => user.toGrpcResponse()) };
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user.toGrpcResponse();
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }

    async createUser(userData) {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const user = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            await user.save();
            return user.toGrpcResponse();
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async updateUser(id, userData) {
        try {
            if (userData.email) {
                const existingUser = await User.findOne({ email: userData.email, _id: { $ne: id } });
                if (existingUser) {
                    throw new Error('Email already exists');
                }
            }
            const user = await User.findByIdAndUpdate(
                id,
                { $set: userData },
                { new: true }
            );
            if (!user) {
                throw new Error('User not found');
            }
            return user.toGrpcResponse();
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    async deleteUser(id) {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user.toGrpcResponse();
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

module.exports = new UserModel(); 