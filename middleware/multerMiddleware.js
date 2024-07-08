const multer = require("multer");

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

module.exports = upload;





