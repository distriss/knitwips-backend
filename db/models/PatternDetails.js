const mongoose = require('mongoose');

const PatternDetailsSchema = new mongoose.Schema({       
    category: {
        type: String,
    },
    yarn: {
        type: String,
    },   
    yardage: {
        type: String,
    },
    gauge: {
        type: String,
    },
    size: {
        type: String
    },    
    craft: {
        type: String,
    },
    origin: {
        type: String,
    },
    custom: {
        type: Map,
        of: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patternId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern',
        required: true,
    }, 
},
{
    timestamps: true,
});

module.exports = mongoose.model("PatternDetails", PatternDetailsSchema);