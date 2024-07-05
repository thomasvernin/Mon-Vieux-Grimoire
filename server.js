const express = require('express');
const app = express();
const { User } = require("./db/mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");

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

        const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
        console.log(`Hashed password: ${hashedPassword}`); // Affichage du mot de passe haché dans le terminal

        const user = new User({
            email: email,
            password: hashedPassword // Utilisation du mot de passe haché
        });

        await user.save();
        res.send({
            message: "Sign up successful",
            hashedPassword: hashedPassword // Inclure le mot de passe haché dans la réponse
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).send("Invalid email or password");
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).send("Invalid email or password");
            return;
        }

        res.send({
            userId: user._id,
            token: "token" // Vous pouvez générer un vrai token JWT ici
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

app.get('/', sayHI);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);


console.log("password in .env", process.env);

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});








