const express = require("express");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.listen(5000, console.log("Server running on http://localhost:5000"));
