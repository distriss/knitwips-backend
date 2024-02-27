const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connectDB');
const auth = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errors')
const userRoutes = require('./routes/userRoutes');

const User = require('./db/models/User');

require("dotenv").config({path: "./config/.env"})
connectDB();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization',]
}));

app.get("/", (req, res, next) => {
    res.json({ message: "Server is Live" });
    next();
  });

app.get("/homepage", (req, res) => {
    res.json({ message: "Guest Access" })
});

app.get("/authtest", auth, (req, res) => {
    res.json({ message: "You are authorized." });
});

app.use('/users', userRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server running on Port: ${PORT}`));