const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a Username."],
        unique: [true, "Username already taken."],
    },
    email: {
        type: String,
        required: [true, "Please provide an Email."],
        unique: [true, "Email already exists."],
    },
    password: {
        type: String,
        required: [true, "Please provide a Password."],
        unique: false,
    }
})

module.exports = mongoose.model("User", UserSchema);