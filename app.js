const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/", userRoutes);
app.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = app;
