const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connectDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

const User = require('./db/models/User');

require("dotenv").config({path: "./config/.env"})
connectDB();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.get("/", (req, res, next) => {
    res.json({ message: "Server is Live" });
    next();
  });

// Sign Up
app.post("/signup", (req, res) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            user
                .save()
                .then((result) => {
                    res.status(201).send({
                        message: "User Created Successfully",
                        user: {
                            username: result.username,
                            email: result.email,
                            _id: result._id
                        }
                });
            })
            .catch((error) => {
                res.status(500).send({
                    message: "Error creating user", 
                    error,
                });
            });
        })
        .catch((e) => {
            res.status(500).send({
                message: "Password was not hashed successfully", 
                e,
            });
        });
});


// Log In
app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email})
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
                .then((checkPassword) => {
                    if(!checkPassword) {
                        return res.status(400).send({
                            message: "Password does not match",
                        });
                    }
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email,

                        },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN }
                    );

                    res.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    });
                })
                .catch((error) => {
                    res.status(400).send({
                        message: "Password does not match",
                        error,
                    });
                })
        })
        .catch((e) => {
            res.status(404).send({
                message: "Email not found",
                e,
            });
        })
})


app.get("/homepage", (req, res) => {
    res.json({ message: "Guest Access" })
});

app.get("/profile", auth, (req, res) => {
    res.json({ message: "You are authorized." });
});


app.listen(process.env.PORT, () => console.log(`Server running on Port: ${PORT}`));