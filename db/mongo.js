require('dotenv').config();
const mongoose = require('mongoose');



const DB_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_DOMAIN}`;
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





module.exports = {User};

