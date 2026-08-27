const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // We use process.env to access the variables from the .env file
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // If the database fails to connect, we shut down the server process
        process.exit(1); 
    }
};

module.exports = connectDB;