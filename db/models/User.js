const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    } , 
},
{
    timestamps: true,
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


module.exports = mongoose.model("User", UserSchema);