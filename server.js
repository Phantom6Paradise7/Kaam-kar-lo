// const app = require("./app");

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


// server.js
require("dotenv").config(); // Loads variables from your .env file immediately
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the function we built earlier
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});