// Server
const express = require('express')
const app = express()

const mongoSanitize = require('express-mongo-sanitize');
// Remove all keys containing prohibited characters
app.use(mongoSanitize());

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Database
const mongodb_password = process.env.MONGODB_PASSWORD
const mongodb_username = process.env.MONGODB_USERNAME
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.37u4gzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Headers & CORS
const helmet = require('helmet')

app.use(helmet({crossOriginResourcePolicy: false,}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next();
})

// ROUTER
const bookRoutes = require('./routes/book.routes')
app.use('/api/books', bookRoutes)
const userRoutes = require('./routes/user.routes')
app.use('/api/auth', userRoutes)

// static path for images
const path = require('path')
app.use('/images', express.static(path.join(__dirname, 'images')))


module.exports = app



