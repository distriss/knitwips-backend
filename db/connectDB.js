const mongoose = require('mongoose');
require('dotenv').config({ path: "./config/.env" });


async function connectDB() {
    try { 
        await mongoose.connect(process.env.DB_STRING)
        console.log("Connected to Database.")
    } catch(error) {
        console.log(`Database connection error: ${error}`)
        console.error(error);
        process.exit(1);
    }     
}

module.exports = connectDB;