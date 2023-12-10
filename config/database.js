const mongoose = require("mongoose");
const database = process.env.DB_STRING

const connectDB = mongoose.connect(database).then(() => {
    console.log("Connected to MongoDB Database");
}).catch((error) => {
    console.error("Database connection error:", error);
})

module.exports = connectDB;