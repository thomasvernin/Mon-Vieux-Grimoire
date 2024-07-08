const mongoose = require('mongoose');

// Schéma Mongoose pour le livre
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number }
        }
    ],
    averageRating: { type: Number }
});

// Création du modèle Book à partir du schéma
const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };






