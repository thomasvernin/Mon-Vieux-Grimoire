const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
        userId: { type: String },
        grade: { type: Number }
    }
   ],
   averageRating: { type: Number, default: 0 }
})

// A chaque fois qu'un nouveau livre est sauvegardé sur MongoDB, sa note moyenne est mise à jour
bookSchema.pre('save', function (next) {
  const ratings = this.ratings.map((rating) => rating.grade)
  if (ratings.length === 0) {
    this.averageRating = 0
  } else {
    const sumOfRatings = ratings.reduce((acc, curr) => acc + curr, 0)
    this.averageRating = Math.ceil(sumOfRatings / ratings.length)
  }
  next()
})

module.exports = mongoose.model('Book', bookSchema)





