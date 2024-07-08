const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/mongo');

// Route: Inscription
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userInDb = await User.findOne({ email });
        if (userInDb) {
            return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.send({
            message: "Sign up successful",
            hashedPassword: hashedPassword
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
});

// Route: Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid email or password");
        }

        res.send({
            userId: user._id,
            token: "token" // Vous pouvez générer un vrai token JWT ici
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;











