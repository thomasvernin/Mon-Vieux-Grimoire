const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { User, Book } = require('../db/mongo');
const { books } = require('../db/books') || [];

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

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/images", express.static("uploads"));

// Routes
const authRoutes = require('../controllers/authController');
const bookRoutes = require('../controllers/bookController');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;























  














