const express = require('express')

const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require("../middleware/sharp-config");


const bookCtrl = require('../controllers/book.controller')


router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.getTopRatedBooks)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, multer, sharp,  bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.addBookRating)
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)


module.exports = router