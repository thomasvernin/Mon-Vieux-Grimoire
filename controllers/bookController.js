const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Book } = require('../db/mongo');

// Configuration du multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-') + '-' + Date.now() + ".jpg";
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Route: Ajout d'un livre
router.post('/', upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send("No image uploaded");
        }

        const stringifiedBook = req.body.book;
        if (!stringifiedBook) {
            return res.status(400).send("No book data provided");
        }

        const book = JSON.parse(stringifiedBook);
        if (!book.title || !book.author || !book.year || !book.genre) {
            return res.status(400).send("Missing required book fields");
        }

        // Ajouter l'URL de l'image au livre
        book.imageUrl = file.path;

        // Créer le livre en base de données
        const result = await Book.create(book);

        res.status(201).send({
            message: "Book added successfully",
            book: result
        });
    } catch (e) {
        console.error("Error adding book:", e);
        res.status(500).send("Something went wrong");
    }
});

// Route: Récupération de tous les livres
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (e) {
        console.error("Error fetching books:", e);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;









