const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const processImage = (req, res, next) => {
	if (req.file) {
		// Générer le nom du fichier WebP à partir du nom du fichier d'origine
		const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
		const webpImagePath = path.join("images", webpFilename);

		const newWidth = 463;
		const newHeight = 595;

		// Convertir l'image d'origine en WebP
		sharp(req.file.path)
			.resize(newWidth, newHeight)
			.webp({ quality: 50 })
			.toFile(webpImagePath, (err, info) => {
				if (err) {
					console.error("Erreur lors du traitement de l'image: ", err);
					return res.status(500).json({
						error: "Erreur lors du traitement de l'image",
					});
				}

				// Supprimer l'image d'origine après la conversion
				fs.unlink(req.file.path, (err) => {
					if (err) {
						console.error("Erreur lors de la suppression de l'image d'origine: ", err);
					} else {
						console.log("Ancienne image supprimée avec succès !");
					}
				});

				// Mettre à jour le nom du fichier et le chemin dans la requête
				req.file.filename = webpFilename;
				req.file.path = webpImagePath;

				next();
			});
	} else {
		next();
	}
};

module.exports = processImage;



























