const mongoose = require('mongoose');
const DatabaseConnectionError = require('../errors/database-connection-error.js');

const uri = process.env.MONGO_URI;
const mongoOptions = {
    maxPoolSize: 10, 
};

const connectDB = async () => {
    try {
        await mongoose.connect(uri, mongoOptions);
        console.log('Connected to MongoDB database');
        mongoose.connection
            .on('connected', () => console.log('Connected to MongoDB database'))
            .on('error', (err) => console.error('MongoDB connection error:', err))
            .on('disconnected', () => console.log('MongoDB disconnected'));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new DatabaseConnectionError('Failed to connect to MongoDB');
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw new DatabaseConnectionError('Failed to close MongoDB connection');
    }
};

module.exports = { connectDB, closeDB };
