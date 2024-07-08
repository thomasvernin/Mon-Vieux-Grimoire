const mongoose = require('mongoose');

// Schéma Mongoose pour l'utilisateur
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Création du modèle User à partir du schéma
const User = mongoose.model('User', UserSchema);

module.exports = { User };





