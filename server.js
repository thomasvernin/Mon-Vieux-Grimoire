const express = require('express');
const app = express();
const { User } = require("./db/mongo");
const cors = require("cors");

const PORT = 4000;

app.use(cors());
app.use(express.json());

function sayHI(req, res) {
    res.send('Hello World');
}

async function signUp(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const userInDb = await User.findOne({ email: email });
        if (userInDb) {
            res.status(400).send("Email already exists");
            return;
        }

        const user = new User({
            email: email,
            password: password
        });

        await user.save();
        res.send("Sign up successful");
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

function login(req, res) {
    const body = req.body;
    console.log("body", body);
    res.send({
        userId: "123",
        token: "token"
    });
}

app.get('/', sayHI);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});

