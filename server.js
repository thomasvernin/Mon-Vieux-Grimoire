const express = require('express');
const app = express();
const { User, Book } = require("./db/mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require('path');

const PORT = 4000;

// Middleware pour la gestion des uploads d'images avec multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-') + '-' + Date.now() + ".jpg";
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage
});

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour traiter les données JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques depuis le répertoire 'uploads'
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Route de test
function sayHI(req, res) {
    res.send('Hello World');
}

// Route pour l'inscription
async function signUp(req, res) {
    const { email, password } = req.body;

    try {
        const userInDb = await User.findOne({ email: email });
        if (userInDb) {
            return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPassword
        });

        await user.save();
        res.send({
            message: "Sign up successful",
            hashedPassword: hashedPassword
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

// Route pour la connexion
async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
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
}

// Route pour ajouter un livre
async function postBook(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).send("Image file is required");
    }

    try {
        const { book } = req.body;
        const parsedBook = JSON.parse(book);

        // Enregistrer le chemin de l'image dans le livre
        const imageUrl = `/images/${file.filename}`;
        parsedBook.imageUrl = imageUrl;

        // Enregistrer le livre dans la base de données MongoDB
        const result = await Book.create(parsedBook);

        res.status(201).send({
            message: "Book added successfully",
            book: result
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

// Route pour récupérer tous les livres
async function getBooks(req, res) {
    try {
        const books = await Book.find();

        // Transformer les URL des images en URL complètes
        const booksWithFullImageUrl = books.map(book => ({
            ...book.toObject(),
            imageUrl: `http://localhost:4000/images/${path.basename(book.imageUrl)}`
        }));

        res.send(booksWithFullImageUrl);
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

// Routes
app.get('/', sayHI);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);
app.get("/api/books", getBooks);
app.post("/api/books", upload.single("image"), postBook);



// Démarrer le serveur
app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});



























  







































  




































  



































  


































  





































  

































  






































  







































  




































  



































  


































  





































  

































  












