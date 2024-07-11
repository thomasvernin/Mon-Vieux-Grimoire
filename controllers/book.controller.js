const Book = require('../models/book.model.js')
const fs = require('fs');


exports.getAllBooks = async (req, res, next) => {
  try {
    // Retrieves all books
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}


exports.getTopRatedBooks = async (req, res, next) => {
  try {
    // Retrieves the 3 top rated books
    const topRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
    res.status(200).json(topRatedBooks)
  } catch (error) {
    res.status(500).json({ error: 'An error has occurred' })
  }
}


exports.getOneBook = async (req, res, next) => {
  // Retrieves the book according to the id passed in the request
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


exports.createBook = async (req, res, next) => {

  // Convert JSON response to Object
  const bookObject = JSON.parse(req.body.book)

  // Checks that the request contains a file so as not to save an orphan file
  if(!req.file){
    return res.status(400).json({ message: 'File missing' })

  } else {
    // Never trust user input
    delete bookObject._id
    delete bookObject._userId

  // If the user has not rated the book, empty the table (useful so that the user can still rate his book later)
  if(bookObject.ratings[0].grade === 0){
  bookObject.ratings = []
  }

  const filename = req.file.filename

  // Create a new Book from the reponse data
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
  })

  // Save the book to MongoDB
  try {
    await book.save()
    res.status(201).json({ message: 'Book saved' })
  } catch (error) {      
      fs.unlinkSync(`images/${filename}`)
    res.status(400).json({ error })
  }
  }  
}


exports.addBookRating = async (req, res, next) => {
   // Check that the user has not already rated the book
   const existingRating = await Book.findOne({
    _id: req.params.id,
    "ratings.userId": req.body.userId
  })
  if (existingRating) {
    return res.status(400).json({ message: 'User has already rated this book' })
  }

  // Check that the rating is a number between 0..5 included
  if(!(req.body.rating  >= 0) && !(req.body.rating  <= 5) && (typeof req.body.rating === 'number')){
    return res.status(500).json({ message: 'Grade is not between 0 and 5 included or is not a number' })
  }

  try {
    // Retrieves the book to rate according to the id of the request
    const book = await Book.findOne({ _id: req.params.id })
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Add a new rating to the ratings array of the book
    book.ratings.push({ userId : req.body.userId, grade: req.body.rating })

    // Save the book to MongoDB, averageRating will be up to date on save
    await book.save()
    res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error has occurred' })
  }
}


exports.modifyBook = async (req, res, next) => {
  // Check if a file is included in the request
  try {
    const bookObject = req.file
        // If so, convert request JSON to Object
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        // If not, use data from req.body
      : { ...req.body } 

    delete bookObject._userId

     // Retrieves book that match the id specified in the request params
    const book = await Book.findOne({ _id: req.params.id })

    // Check if user is authorized to modify the book
    if (book.userId != req.auth.userId) {
      return res.status(403).json({message: 'Unauthorized request'})
    }

    // If request contain a file, remove the old file from the back end (images folder)
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }

    // Update book
    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    res.status(200).json({ message: 'Book modified!' })
  } catch (error) {
    res.status(400).json({ error })
  }
}


exports.deleteBook = (req, res, next) => {
  // Retrieves the book according to the id passed in the request
  Book.findOne({ _id: req.params.id})
      .then(book => {

        // Check if user is authorized to delete the book
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message: 'Unauthorized request' })
          } else {

              // Delete file from the back end (images folder)
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {

                  // Delete the book from MongoDB
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


























