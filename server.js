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
    res.status(201).send('User signed up');
}

app.get('/', sayHI);
app.post("/api/auth/signup", signUp);

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});
