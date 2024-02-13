const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connectDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

const User = require('./db/models/User');

require("dotenv").config({path: "./config/.env"})
connectDB();

const PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response, next) => {
    response.json({ message: "Server is Live" });
    next();
  });

// Sign Up
app.post("/signup", (request, response) => {
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                username: request.body.username,
                email: request.body.email,
                password: hashedPassword,
            });
            user
                .save()
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        user: {
                            username: result.username,
                            email: result.email,
                            _id: result._id
                        }
                });
            })
            .catch((error) => {
                response.status(500).send({
                    message: "Error creating user", 
                    error,
                });
            });
        })
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully", 
                e,
            });
        });
});


// Log In
app.post("/login", (request, response) => {
    User.findOne({ email: request.body.email})
        .then((user) => {
            bcrypt.compare(request.body.password, user.password)
                .then((checkPassword) => {
                    if(!checkPassword) {
                        return response.status(400).send({
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

                    response.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    });
                })
                .catch((error) => {
                    response.status(400).send({
                        message: "Password does not match",
                        error,
                    });
                })
        })
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        })
})


app.get("/homepage", (request, response) => {
    response.json({ message: "Guest Access" })
});

app.get("/profile", auth, (request, response) => {
    response.json({ message: "You are authorized." });
});


app.listen(process.env.PORT, () => console.log(`Server running on Port: ${PORT}`));