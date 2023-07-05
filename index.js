require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => { 
    res.send("Hello World!");
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port ${port}...`));
