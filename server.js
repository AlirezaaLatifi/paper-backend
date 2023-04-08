require("dotenv").config();
const express = require("express");
const app = express();
const reqLogger = require("./middleware/reqLogger");
const cookieParser = require("cookie-parser");

// ********* Middlewares *********

// logger
app.use(reqLogger);

// credentials

// cors

// urlencoded
app.use(express.urlencoded({ extended: false }));

// json
app.use(express.json());

// cookies
app.use(cookieParser());

// ********* Routes *********

app.all("*", (req, res) => {
  res.status(404).json({ message: "404 not found" });
});

// ********* Custom Error Handlers *********

// ********* Running server *********
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is running on localhost:${PORT}`));
