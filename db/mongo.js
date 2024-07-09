require("dotenv").config();
const mongoose = require('mongoose');

const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_DOMAIN = process.env.DB_DOMAIN;
const DB_NAME = process.env.DB_NAME;
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@${DB_DOMAIN}/${DB_NAME}`;

console.log("DB_URL:", DB_URL);

async function connect() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to DB");
    } catch (e) {
        console.error("Connection error:", e);
    }
}
connect();

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = mongoose.model("User", UserSchema);

const BookSchema = new mongoose.Schema ({ 
    userId: String,
    title: String,
    author: String,
    year: Number,
    genre: String,
    imageUrl: String, 
    ratings: [
         {
             userId: String , 
             grade: Number
            } 
        ],
    averageRating: Number
});


const Book = mongoose.model("Book", BookSchema);




module.exports = {User , Book };









































































