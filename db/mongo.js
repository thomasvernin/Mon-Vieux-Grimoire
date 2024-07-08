require("dotenv").config();
const mongoose = require('mongoose');

const PASSWORD = "tvernin49100";
const USER = "tvernin49100";
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.37u4gzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

































