const mongoose = require('mongoose');

const books = [{
    
    
    title : " The Lord of the Rings",
    author : " J.R.R. Tolkien" ,
    imageUrl: "https://m.media-amazon.com/images/I/91CqpUMYeLL._SL1500_.jpg",
    genre : "Fantasy", 
    ratings: [{ 
        UserId: "1",
        grade : 5
    }],
    averageRatting: 5
}
];

module.exports = { books };