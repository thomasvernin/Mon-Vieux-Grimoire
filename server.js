const express = require('express');
const app = express();
const { User, Book } = require("./db/mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { books } = require("./db/books") || []; // Assurez-vous que books est un tableau
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, path.join(__dirname, "uploads"));
   },
   filename: function (req, file, cb) {
       const fileName = file.originalname.toLowerCase().split(' ').join('-') + '-' + Date.now() + ".jpg";
       cb(null, fileName);
   }
});

const upload = multer({
    storage: storage
});

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "uploads")));

function sayHI(req, res) {
    res.send('Hello World');
}

async function signUp(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userInDb = await User.findOne({ email: email });
        if (userInDb) {
            res.status(400).send("Email already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hashed password: ${hashedPassword}`);

        const user = new User({
            email: email,
            password: hashedPassword
        });

        await user.save();
        res.send({
            message: "Sign up successful",
            hashedPassword: hashedPassword
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).send("Invalid email or password");
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).send("Invalid email or password");
            return;
        }

        res.send({
            userId: user._id,
            token: "token" // Vous pouvez générer un vrai token JWT ici
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

async function postBook(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).send("Image file is required");
    }

    try {
        const stringifiedBook = req.body.book;
        const book = JSON.parse(stringifiedBook);
        const filename = req.file.filename; 
        book.imageUrl = filename; 
        
        const result = await Book.create(book);
        console.log("result from DB:", result);

        books.push(book);
        res.status(201).send({
            message: "Book added successfully",
            book: result
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
    }
}

function getBooks(req, res) {
    const booksWithFullImageUrl = books.map(book => {
        return {
            ...book,
            imageUrl: `http://localhost:4000/images/${book.imageUrl}`
        };
    });
    res.send(booksWithFullImageUrl);
}

app.get('/', sayHI);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);
app.get("/api/books", getBooks);
app.post("/api/books", upload.single("image"), postBook);

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`);
});
























  







































  




































  



































  


































  





































  

































  












