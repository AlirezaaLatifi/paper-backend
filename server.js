require("dotenv").config();
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello There =)");
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is running on localhost:${PORT}`));
