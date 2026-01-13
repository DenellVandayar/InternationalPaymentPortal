const mongoose = require('mongoose');

// This function will connect to the database
const connectDB = async () => {
    try {
        // Get the MongoDB connection string from the .env file and connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully.');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        // Exit the application with a failure message
        process.exit(1);
    }
};

module.exports = connectDB;