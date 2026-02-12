import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

console.log('Testing connection to:', uri.replace(/:([^:@]{1,})@/, ':****@')); // Hide password in logs

const testConnection = async () => {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('FAILURE: Could not connect to MongoDB.');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
    process.exit(1);
  }
};

testConnection();
