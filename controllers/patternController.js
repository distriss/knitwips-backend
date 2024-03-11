const asyncHandler = require('express-async-handler');
const User = require('../db/models/User');
const Pattern = require('../db/models/Pattern');
const PatternDetails = require('../db/models/PatternDetails');

// New Pattern WIP
const newPattern = asyncHandler(async(req, res) => {
    try {
        const { title, description, needleSize, yarnWeight, user } = req.body;
        if (!user || !user._id) {
            return res.status(400).json({ 
                message: "User information is missing." 
            });
        }
        const userId = user._id;

        const pattern = await Pattern.create({
            title,
            description,
            needleSize,
            yarnWeight,
            user: userId,
    });

    if (pattern) {
        res.status(201).send({
            message: "Pattern Created Successfully",
            pattern: {                
                _id: pattern._id,
                title: pattern.title,
                description: pattern.description,
                needleSize: pattern.needleSize,
                yarnWeight: pattern.yarnWeight,
                likes: pattern.likes,
                private: pattern.private,
                details: pattern.details,
                user: pattern.user,
            }
        })
    }
    } catch (error) {
        console.error("Error Creating Pattern: ", error);
        return res.status(500).send({
            message: "An error occurred during pattern creation process",
            error: error.message,
        });
    }
})

// Pattern Page
const getPattern = asyncHandler(async(req, res) => {
    const { username, patternId } = req.params;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        const pattern = await Pattern.findOne({ _id: patternId, user: user._id }).populate('details');
        if (!pattern ) {
            return res.status(404).json({
                message: "Pattern not found" 
            })
        }
        res.status(200).json(pattern);

    } catch (error) {
        console.error("Error getting Pattern", error);
        return res.status(500).send({
            message: "An error occurred getting pattern details",
            error: error.message,
        });
    }
    
})


module.exports = { newPattern, }