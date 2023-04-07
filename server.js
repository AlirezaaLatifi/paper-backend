require("dotenv").config();
const express = require("express");
const app = express();
const reqLogger = require("./middleware/reqLogger");

// Middlewares
app.use(reqLogger);

// Routes

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "404 not found" });
});

// Custom Error Handlers

// Running server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is running on localhost:${PORT}`));
