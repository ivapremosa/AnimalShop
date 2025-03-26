const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../../proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Create gRPC client
const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

// Test function to create a user
function createUser() {
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
    };

    client.createUser(user, (error, response) => {
        if (error) {
            console.error('Error creating user:', error.message);
            return;
        }
        console.log('User created successfully:', response);
        // After creating, test getting all users
        getAllUsers();
    });
}

// Test function to get all users
function getAllUsers() {
    client.getAllUsers({}, (error, response) => {
        if (error) {
            console.error('Error getting users:', error.message);
            return;
        }
        console.log('All users:', response.users);
    });
}

// Run the tests
console.log('Starting gRPC client tests...');
createUser(); 