const mongoose = require('mongoose');

const PatternSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },    
    needleSize: {
        type: String,
        required: true,
    },
    yarnWeight: {
        type: String,
        required: true,        
    }, 
    likes: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dzgmbioat/image/upload/v1710417928/wip-default_ttr2r5.png'
    },
    private: {
        type: Boolean,
        default: false,
    },   
    details: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PatternDetails' 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Pattern", PatternSchema);