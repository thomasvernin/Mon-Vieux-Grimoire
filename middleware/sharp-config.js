const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const processImage = (req, res, next) => {
	if (req.file) {
		const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
		const webpImagePath = path.join("images", webpFilename);

		const newWidth = 400;
		const newHeight = 600;

		sharp(req.file.path)
			.resize(newWidth, newHeight)
			.webp({ quality: 80 })
			.toFile(webpImagePath, (err, info) => {
				if (err) {
					console.error("Erreur lors du traitement de l'image");
					return res.status(500).json({
						error: "Erreur lors du traitement de l'image",
					});
				}

				//To delete the old image
				fs.unlink(req.file.path, (err) => {
					if (err) {
						console.error(
							"Erreur lors de la suppression de l'image"
						);
					} else {
						console.log("Ancienne image supprimee avec succes !");
					}
				});

				req.file.filename = webpFilename;
				next();
			});
	} else {
		next();
	}
};

module.exports = processImage;
























