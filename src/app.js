const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// 1. Middlewares
app.use(cors()); // Allows cross-origin requests[cite: 9]
app.use(express.json()); // Parses incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser(process.env.COOKIE_SECRET || "fallback_secret_key")); // Parses cookies securely

// 2. View Engine Setup
app.set("view engine", "ejs"); // Tells Express to use EJS[cite: 9]
app.set("views", path.join(__dirname, "views")); // Points to src/views

// 3. Routes (We will uncomment these in the next step!)
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.redirect("/login");
}); 

// A temporary default route just to test if the app works
app.get("/", (req, res) => {
    res.send("Express application is configured and running!");
});

module.exports = app;