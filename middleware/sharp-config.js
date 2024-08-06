const sharp = require("sharp");
const fs = require('fs');
const path = require("path");

const processImage = (req, res, next) => {
    if (req.file) {
        console.log("Fichier reçu :", req.file);

        const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
        const webpImagePath = path.join("images", webpFilename);

        const newWidth = 463;
        const newHeight = 595;

        sharp(req.file.path)
            .resize(newWidth, newHeight)
            .webp({ quality: 50 })
            .toFile(webpImagePath, (err, info) => {
                if (err) {
                    console.error("Erreur lors du traitement de l'image :", err);
                    return res.status(500).json({
                        error: "Erreur lors du traitement de l'image",
                    });
                }

                console.log("Image traitée et enregistrée sous forme de WebP :", info);

                // Vérifier si le fichier existe avant de le supprimer
                fs.access(req.file.path, fs.constants.F_OK, (accessErr) => {
                    if (accessErr) {
                        console.error("Fichier non trouvé pour suppression :", accessErr);
                    } else {
                        console.log("Fichier trouvé, suppression en cours :", req.file.path);
                        // Supprimer l'image d'origine (JPG, PNG, etc.)
                        fs.unlink(req.file.path, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error("Erreur lors de la suppression de l'image d'origine :", unlinkErr);
                            } else {
                                console.log("Ancienne image d'origine supprimée avec succès !");
                            }

                            // Mettre à jour le nom et le chemin du fichier dans la requête pour pointer vers le fichier WebP
                            req.file.filename = webpFilename;
                            req.file.path = webpImagePath;

                            next();
                        });
                    }
                });
            });
    } else {
        console.log("Aucun fichier reçu");
        next();
    }
};

module.exports = processImage;































