const mongoose = require("mongoose");

// Define the blueprint for our user data
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // Removes accidental spaces before/after the name
        },
        username: {
            type: String,
            required: true,
            unique: true, // Ensures no two users can have the same username
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures no two users can register with the same email
            lowercase: true, // Automatically converts emails to lowercase
            trim: true
        },
        password: {
            type: String,
            required: true // We will store the bcrypt hashed password here
        }
    },
    { 
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);

// Compile the schema into a model and export it
module.exports = mongoose.model("User", userSchema);