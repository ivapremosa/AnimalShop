const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the proto file
const PROTO_PATH = path.resolve(__dirname, 'protos/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

// Create the client
const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const client = new userProto.UserService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Test functions
async function testCreateUser() {
    console.log('\nTesting CreateUser...');
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    };
    
    client.createUser(user, (err, response) => {
        if (err) {
            console.error('Error creating user:', err.message);
            return;
        }
        console.log('Created user:', response);
    });
}

async function testGetAllUsers() {
    console.log('\nTesting GetAllUsers...');
    client.getAllUsers({}, (err, response) => {
        if (err) {
            console.error('Error getting users:', err.message);
            return;
        }
        console.log('All users:', response.users);
    });
}

async function testGetUserById(id) {
    console.log('\nTesting GetUserById...');
    client.getUserById({ id }, (err, response) => {
        if (err) {
            console.error('Error getting user:', err.message);
            return;
        }
        console.log('User:', response);
    });
}

async function testUpdateUser(id, name, email) {
    console.log('\nTesting UpdateUser...');
    const user = {
        id,
        name,
        email
    };
    
    client.updateUser(user, (err, response) => {
        if (err) {
            console.error('Error updating user:', err.message);
            return;
        }
        console.log('Updated user:', response);
    });
}

async function testDeleteUser(id) {
    console.log('\nTesting DeleteUser...');
    client.deleteUser({ id }, (err, response) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return;
        }
        console.log('User deleted successfully');
    });
}

// Run all tests
async function runTests() {
    console.log('Starting gRPC client tests...');
    
    // Create a user
    await testCreateUser();
    
    // Wait a bit before next operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get all users
    await testGetAllUsers();
    
    // Wait a bit before next operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get user by ID (assuming ID 1 exists)
    await testGetUserById(1);
    
    // Wait a bit before next operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user
    await testUpdateUser(1, 'John Updated', 'john.updated@example.com');
    
    // Wait a bit before next operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Delete user
    await testDeleteUser(1);
    
    console.log('\nAll tests completed!');
}

// Run the tests
runTests().catch(console.error); 