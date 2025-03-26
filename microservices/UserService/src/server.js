// Trigger workflow test - UserService
// Main server file for the User Service
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const UserModel = require('./models/userModel');
const connectDB = require('./config/database');

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Define the service implementation
const userService = {
    createUser: async (call, callback) => {
        try {
            const user = await UserModel.createUser(call.request);
            callback(null, user);
        } catch (error) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: error.message
            });
        }
    },

    getAllUsers: async (call, callback) => {
        try {
            const response = await UserModel.getAllUsers();
            callback(null, response);
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: error.message
            });
        }
    },

    getUserById: async (call, callback) => {
        try {
            const user = await UserModel.getUserById(call.request.id);
            callback(null, user);
        } catch (error) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: error.message
            });
        }
    },

    updateUser: async (call, callback) => {
        try {
            const user = await UserModel.updateUser(call.request.id, call.request);
            callback(null, user);
        } catch (error) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: error.message
            });
        }
    },

    deleteUser: async (call, callback) => {
        try {
            const user = await UserModel.deleteUser(call.request.id);
            callback(null, user);
        } catch (error) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: error.message
            });
        }
    }
};

// Create gRPC server
const server = new grpc.Server();

// Add the service to the server
server.addService(userProto.UserService.service, userService);

// Start the server
async function startServer() {
    try {
        await connectDB();
        server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                console.error('Error binding server:', error);
                return;
            }
            server.start();
            console.log(`gRPC server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 