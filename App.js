// Serveur
const express = require('express')
const app = express()

require('dotenv').config() 

// Middleware pour parser les requêtes JSON et URL encodées
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Base de données
const mongodb_password = process.env.MONGODB_PASSWORD
const mongodb_username = process.env.MONGODB_USERNAME
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.37u4gzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next();
})

// ROUTER
const bookRoutes = require('./routes/book.routes')
// Routes pour les livres
app.use('/api/books', bookRoutes)
const userRoutes = require('./routes/user.routes')
// Routes pour l'authentification des utilisateurs
app.use('/api/auth', userRoutes)

// Chemin statique pour les images
const path = require('path')
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app





