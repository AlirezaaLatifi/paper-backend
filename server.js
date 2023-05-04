require("dotenv").config();
const express = require("express");
const app = express();
// const reqLogger = require("./middleware/reqLogger");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");

// ********* Middlewares *********

// logger
// app.use(reqLogger);

// credentials
app.use(credentials);

// cors
app.use(cors(corsOptions));

// urlencoded
app.use(express.urlencoded({ extended: false }));

// json
app.use(express.json());

// cookies
app.use(cookieParser());

// ********* Routes *********
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/books", require("./routes/api/books"));
app.use("/papers", require("./routes/api/papers"));

app.all("*", (req, res) => {
  res.status(404).json({ message: "404 not found" });
});

// ********* Custom Error Handlers *********
app.use(errorHandler);

// ********* Running server *********
const PORT = process.env.PORT || 3500;
app.listen(PORT, () =>
  console.log(`server is running on ${process.env.BASE_URL}:${PORT}`)
);
