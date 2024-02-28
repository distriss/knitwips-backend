const asyncHandler = require('express-async-handler');
const User = require('../db/models/User');
const generateToken = require('../utilities/generateToken');


// Register
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
     
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        username, 
        email, 
        password,
    });

    if (user) {
        const token = generateToken({ userId: user._id, userEmail: user.email });

        res.status(201).send({
            message: "User Created Successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                following: user.following,
                followers: user.followers,
                isAdmin: user.isAdmin,
            },
            token, 
        });
    } else {
        res.status(500)
        throw new Error("Error creating user.")
    }
})


// Login
const authUser = asyncHandler(async(req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: "Email not found" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).send({ message: "Password does not match" });
        }

        const token = generateToken({ userId: user._id, userEmail: user.email });
    
        res.status(200).send({
            message: "Login Successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                following: user.following,
                followers: user.followers,
                isAdmin: user.isAdmin,
            },
            token, 
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({
            message: "An error occurred during the login process",
            error: error.message,
        });
    }
})

// User Profile
const getProfile = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        res.status(200).json({
            message: "Fetching Profile Successful",
            user: {
                _id: user._id,
                username: user.username,
                following: user.following,
                followers: user.followers,
            },
        });
    } catch (error) {
        console.error("Error getting User Profile:", error);
        return res.status(500).send({
            message: "An error occurred getting User Profile",
            error: error.message,
        });
    }
    
})

// Follow User
const followUser = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const { authUserId, userId } = req.body

        const authUser = await User.findById(authUserId)
        if (!authUser) {
            return res.status(404).send({ message: "Authenticated user not found" });
        }       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });        
        }

        if (user._id.toString() === authUser._id.toString()) {
            return res.status(400).send({ message: "You can't follow yourself"});
        }

        if (authUser.following.includes(user._id)) {
            return res.status(400).send({ message: "You are already following this user" });
        }        

        authUser.following.push(user);
        await authUser.save();
        user.followers.push(authUser);
        await user.save();

        const updatedAuthUser = await User.findById(authUserId).populate('following followers');
        const updatedUser = await User.findById(userId).populate('following followers');

        res.status(200).json({
            message: `Following ${username}`,
            authUser: updatedAuthUser,
            user: updatedUser,
        });


    } catch (error) {
        console.error("Error following user:", error);
        return res.status(500).send({
            message: "An error occurred following user",
            error: error.message,
        });
    }
    
})

// Unfollow User
const unfollowUser = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const { authUserId, userId } = req.body

        const authUser = await User.findById(authUserId)
        if (!authUser) {
            return res.status(404).send({ message: "Authenticated user not found" });
        }       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: " user not found" });        
        }

        if (user._id.toString() === authUser._id.toString()) {
            return res.status(400).send({ message: "You can't unfollow yourself"});
        }

        if (!authUser.following.includes(user._id)) {
            return res.status(400).send({ message: "You aren't following this user" });
        }        

        authUser.following.pull(user);
        await authUser.save();
        user.followers.pull(authUser);
        await user.save();

        const updatedAuthUser = await User.findById(authUserId).populate('following followers');
        const updatedUser = await User.findById(userId).populate('following followers');

        res.status(200).json({
            message: `UnFollowed ${username}`,
            authUser: updatedAuthUser,
            user: updatedUser,
        });


    } catch (error) {
        console.error("Error unfollowing user:", error);
        return res.status(500).send({
            message: "An error occurred unfollowing user",
            error: error.message,
        });
    }
})

module.exports = { registerUser, authUser, getProfile, followUser, unfollowUser }
