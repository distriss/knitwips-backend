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
                isAdmin: user.isAdmin,
            },
            token, 
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({
            message: "An error occurd during the login process",
            error: error.message,
        });
    }
})

// User Profile
const getProfile = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password -email -isAdmin');
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error getting User Profile:", error);
        return res.status(500).send({
            message: "An error occurd getting User Profile",
            error: error.message,
        });
    }
    
})

// Follow & Unfollow
const followUser = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const { authUserId, userId } = req.body

        const authUser = await User.findById(authUserId)
        if (!authUser) {
            return res.status(404).send({ message: "Authenticated user not found" });
        }       

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).send({ message: "Target user not found" });        
        }

        if (targetUser._id.toString() === authUser._id.toString()) {
            return res.status(400).send({ message: "You can't follow yourself"});
        }

        if (authUser.following.includes(targetUser._id)) {
            return res.status(400).send({ message: "You are already following this user" });
        }        

        authUser.following.push(targetUser);
        await authUser.save();
        targetUser.followers.push(authUser);
        await targetUser.save();

        const updatedAuthUser = await User.findById(authUserId).populate('following followers');
        const updatedTargetUser = await User.findById(userId).populate('following followers');

        res.status(200).json({
            message: `Following ${username}`,
            authUser: updatedAuthUser,
            targetUser: updatedTargetUser,
        });


    } catch (error) {
        console.error("Error following user:", error);
        return res.status(500).send({
            message: "An error occurd following user",
            error: error.message,
        });
    }
    
})

const unfollowUser = asyncHandler(async(req, res) => {
    try {
        const { username } = req.params;
        const { authUserId, userId } = req.body

        const authUser = await User.findById(authUserId)
        if (!authUser) {
            return res.status(404).send({ message: "Authenticated user not found" });
        }       

        const targetUser = await User.findOne({ username }).select('_id');
        if (!targetUser || targetUser._id !== userId) {
            return res.status(404).send({ message: "Target user not found" });
        
        }

        if (!authUser.following.includes(targetUser._id)) {
            return res.status(400).send({ message: "You are not following this user" });
        }

        authUser.following.push(targetUser);
        await authUser.save();
        targetUser.followers.push(authUser._id);
        await targetUser.save();

        res.status(200).json({
            message: `Unfollowed ${username}`
        });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return res.status(500).send({
            message: "An error occurd unfollowing user",
            error: error.message,
        });
    }    
})

module.exports = { registerUser, authUser, getProfile, followUser, unfollowUser }
