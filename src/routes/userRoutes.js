// src/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing[cite: 4]
const User = require("../models/userModel");
const mockData = require("../data/MOCK_DATA.json"); // Your provided data[cite: 8]

const router = express.Router();

// --- MIDDLEWARE: PROTECT ROUTES ---
// This checks if the user has a valid signed cookie before allowing access
const requireAuth = (req, res, next) => {
    if (req.signedCookies.userId) {
        next(); // Cookie exists, proceed to the route
    } else {
        res.redirect("/login"); // No cookie, kick them back to login
    }
};

// --- GET: RENDER FORMS ---
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// --- POST: HANDLE REGISTRATION ---
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        
        // 1. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render("register", { error: "Username or email already exists." });
        }

        // 2. Hash the password (10 salt rounds)[cite: 6]
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Save the new user to MongoDB
        await User.create({ name, username, email, password: hashedPassword });
        
        // 4. Redirect to login
        res.redirect("/login");
    } catch (error) {
        res.render("register", { error: "Registration failed. Try again." });
    }
});

// --- POST: HANDLE LOGIN ---
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { error: "Invalid username or password." });
        }

        // 2. Compare the plain-text password to the stored hash[cite: 6]
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "Invalid username or password." });
        }

        // 3. Set a signed cookie to create the session
        res.cookie("userId", user._id.toString(), {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            signed: true,   // Cryptographically signs the cookie using your app.js secret
            maxAge: 24 * 60 * 60 * 1000 // Cookie lasts for 24 hours
        });

        // 4. Redirect to the protected dashboard
        res.redirect("/dashboard");
    } catch (error) {
        res.render("login", { error: "Login failed. Try again." });
    }
});

// --- GET: HANDLE LOGOUT ---
router.get("/logout", (req, res) => {
    res.clearCookie("userId"); // Destroys the cookie
    res.redirect("/login");
});

// --- GET: PROTECTED DASHBOARD ---
// Notice the 'requireAuth' middleware inserted here
router.get("/dashboard", requireAuth, (req, res) => {
    // Renders your existing index.ejs and passes the mock data to it[cite: 8, 11]
    res.render("index", { data: mockData });
});

module.exports = router;