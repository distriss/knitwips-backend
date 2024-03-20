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

        if (description && description.length > 150) {
            return res.status(400).json({
                message: "Description should not exceed 150 characters."
            })
        }

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
                image: pattern.image,
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

// List of Patterns
const getPatternList = asyncHandler(async(req, res) => {
    try {
        const filterOption = req.query.filter || 'latest';
        let limit = parseInt(req.query.limit) || 9
        let page = parseInt(req.query.page) || 1;
        let skip = (page - 1) * limit;

        let filter = { createdAt: -1 };
        if (filterOption === 'likes') {
            filter = { likes: -1 };
        }

        const total = await Pattern.countDocuments();
        const patterns = await Pattern.find()
            .sort(filter)
            .skip(skip)
            .limit(limit)
            .populate('user', 'username');

        res.status(200).json({
            message: "Success Fetching Patterns",
            patterns: patterns,
            total: total,
        });
    } catch (error) {
        res.status(500).send({ 
            message: "Error fetching latest patterns", 
            error: error.message,
        })
    }
});

// Like & Unlike Pattern
const likePattern = asyncHandler(async(req, res) => {
    try {
        const { patternId } = req.params;
        const { authUserId } = req.body;

        const authUser = await User.findById(authUserId);
        if (!authUser) {
            return res.status(404).send({ message: "Authenticated user not found" });
        }

        const pattern = await Pattern.findById(patternId);
        if (!pattern) {
            return res.status(404).send({ message: "Pattern not found" });
        }

        const isLiked = authUser.likedPatterns.includes(patternId);
        if (!isLiked) {
            authUser.likedPatterns.push(pattern._id);
            pattern.likes++

            await authUser.save();
            await pattern.save();
            
            

            res.status(200).json({
                message: `${pattern._id} added to Liked Patterns`,
                authUser: authUser,
                newLikesCount: pattern.likes,          
            });

        } else if (isLiked) {
            authUser.likedPatterns.pull(pattern._id);
            pattern.likes--
            
            await authUser.save();
            await pattern.save();
            

            res.status(200).json({
                message: `Unliked ${pattern._id}`,
                authUser: authUser,
                newLikesCount: pattern.likes,
            })
        }

        
        
    } catch (error) {
        console.error("Error liking/unliking pattern:", error );
        return res.status(500).send({
            message: "An error occurred liking or unliking pattern",
            error: error.message,
        });
    }
})


module.exports = { newPattern, getPattern, getPatternList, likePattern }