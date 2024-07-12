const Book = require('../models/book.model.js')
const fs = require('fs');

// Récupère tous les livres
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

// Récupère les 3 livres les mieux notés
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
    res.status(200).json(topRatedBooks)
  } catch (error) {
    res.status(500).json({ error: 'An error has occurred' })
  }
}

// Récupère le livre correspondant à l'ID passé dans la requête
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Crée un nouveau livre
exports.createBook = async (req, res, next) => {
  // Convertit la réponse JSON en objet
  const bookObject = JSON.parse(req.body.book)

  // Vérifie que la requête contient un fichier pour éviter de sauvegarder un fichier orphelin
  if(!req.file){
    return res.status(400).json({ message: 'File missing' })
  } else {
    // Ne jamais faire confiance aux données des utilisateurs
    delete bookObject._id
    delete bookObject._userId

    // Si l'utilisateur n'a pas noté le livre, vider le tableau (utile pour permettre à l'utilisateur de noter son livre plus tard)
    if(bookObject.ratings[0].grade === 0){
      bookObject.ratings = []
    }

    const filename = req.file.filename

    // Crée un nouveau livre à partir des données de la réponse
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
    })

    // Sauvegarde le livre dans MongoDB
    try {
      await book.save()
      res.status(201).json({ message: 'Book saved' })
    } catch (error) {      
      fs.unlinkSync(`images/${filename}`)
      res.status(400).json({ error })
    }
  }  
}

// Ajoute une note à un livre
exports.addBookRating = async (req, res, next) => {
  // Vérifie que l'utilisateur n'a pas déjà noté le livre
  const existingRating = await Book.findOne({
    _id: req.params.id,
    "ratings.userId": req.body.userId
  })
  if (existingRating) {
    return res.status(400).json({ message: 'User has already rated this book' })
  }

  // Vérifie que la note est un nombre compris entre 0 et 5 inclus
  if(!(req.body.rating  >= 0) && !(req.body.rating  <= 5) && (typeof req.body.rating === 'number')){
    return res.status(500).json({ message: 'Grade is not between 0 and 5 included or is not a number' })
  }

  try {
    // Récupère le livre à noter selon l'ID de la requête
    const book = await Book.findOne({ _id: req.params.id })
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Ajoute une nouvelle note au tableau des notes du livre
    book.ratings.push({ userId : req.body.userId, grade: req.body.rating })

    // Sauvegarde le livre dans MongoDB, averageRating sera mis à jour lors de la sauvegarde
    await book.save()
    res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error has occurred' })
  }
}

// Modifie un livre
exports.modifyBook = async (req, res, next) => {
  try {
    // Vérifie si un fichier est inclus dans la requête
    const bookObject = req.file
        ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        : { ...req.body } 

    delete bookObject._userId

    // Récupère le livre correspondant à l'ID spécifié dans les paramètres de la requête
    const book = await Book.findOne({ _id: req.params.id })

    // Vérifie si l'utilisateur est autorisé à modifier le livre
    if (book.userId != req.auth.userId) {
      return res.status(403).json({message: 'Unauthorized request'})
    }

    // Si la requête contient un fichier, supprime l'ancien fichier du backend (dossier images)
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }

    // Met à jour le livre
    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    res.status(200).json({ message: 'Book modified!' })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Supprime un livre
exports.deleteBook = (req, res, next) => {
  // Récupère le livre correspondant à l'ID passé dans la requête
  Book.findOne({ _id: req.params.id})
      .then(book => {
        // Vérifie si l'utilisateur est autorisé à supprimer le livre
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message: 'Unauthorized request' })
          } else {
              // Supprime le fichier du backend (dossier images)
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  // Supprime le livre de MongoDB
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({ message: 'Book deleted' })})
                      .catch(error => res.status(401).json({ error }))
              })
          }
      })
      .catch( error => {
          res.status(500).json({ error })
      })
}





























