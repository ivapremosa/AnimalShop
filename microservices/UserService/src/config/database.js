const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@ita.vittz13.mongodb.net/';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 