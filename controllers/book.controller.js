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
    res.status(500).json({ error: 'Une erreur est survenue' })
  }
}

// Récupère un livre selon l'ID passé dans la requête
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ error: 'Livre non trouvé' })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Crée un nouveau livre
exports.createBook = async (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)

  // Vérifie que la requête contient un fichier pour ne pas sauvegarder un fichier orphelin
  if (!req.file) {
    return res.status(400).json({ message: 'Fichier manquant' })
  } else {
    // Ne jamais faire confiance aux entrées utilisateur
    delete bookObject._id
    delete bookObject._userId

    // Si l'utilisateur n'a pas noté le livre, vider le tableau (utile pour qu'il puisse noter son livre plus tard)
    if (bookObject.ratings[0].grade === 0) {
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
      res.status(201).json({ message: 'Livre enregistré' })
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
    return res.status(400).json({ message: 'L\'utilisateur a déjà noté ce livre' })
  }

  // Vérifie que la note est un nombre entre 0 et 5 inclus
  if (!(req.body.rating >= 0) && !(req.body.rating <= 5) && (typeof req.body.rating === 'number')) {
    return res.status(500).json({ message: 'La note n\'est pas entre 0 et 5 inclus ou n\'est pas un nombre' })
  }

  try {
    // Récupère le livre à noter selon l'ID de la requête
    const book = await Book.findOne({ _id: req.params.id })
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' })
    }

    // Ajoute une nouvelle note au tableau de notes du livre
    book.ratings.push({ userId: req.body.userId, grade: req.body.rating })

    // Sauvegarde le livre dans MongoDB, averageRating sera mis à jour lors de la sauvegarde
    await book.save()
    res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Une erreur est survenue' })
  }
}

// Modifie un livre
exports.modifyBook = async (req, res, next) => {
  try {
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
      return res.status(403).json({ message: 'Requête non autorisée' })
    }

    // Si la requête contient un fichier, supprime l'ancien fichier du backend (dossier images)
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }

    // Met à jour le livre
    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    res.status(200).json({ message: 'Livre modifié!' })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Supprime un livre
exports.deleteBook = (req, res, next) => {
  // Récupère le livre selon l'ID passé dans la requête
  Book.findOne({ _id: req.params.id })
    .then(book => {
      // Vérifie si l'utilisateur est autorisé à supprimer le livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Requête non autorisée' })
      } else {
        // Supprime le fichier du backend (dossier images)
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de MongoDB
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Livre supprimé' }) })
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}















































































































































