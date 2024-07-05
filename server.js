const express = require('express');
const app = express();
const cors = require("cors");

const PORT = 4000;

app.use(cors());
app.use(express.json());

function sayHI(req, res) {
    res.send('Hello World');
}

function signUp(req, res) {
    const body = req.body;
    console.log("body", body);
    res.send("Sign up");
}

function login(req, res) {
    const body = req.body;
    console.log("body", body);
    res.send({
        userId: "123" ,
        token : "token"
    });
}





app.get('/', sayHI);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});
