const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const router = express.Router();
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render("register", {
        error: "Username or email already in use.",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "Registration failed. Please try again." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid username or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password." });
    }
    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { error: "Login failed. Please try again." });
  }
});
router.get("/dashboard", async (req, res) => {
  const users = await User.find().select("-password");
  res.render("dashboard", { users });
});
module.exports = router;
