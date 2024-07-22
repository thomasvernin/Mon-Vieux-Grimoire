const sharp = require('sharp');
const fs = require('fs');

const compressImage = async (req, res, next) => {
  if (req.file) {
    try {
      // Redimensionner et compresser l'image
      const newFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
      
      await sharp(req.file.path)
        .resize({ width: 498, height: 568, fit: 'inside' }) // Redimensionne tout en conservant les proportions et en s'assurant que l'image ne dépasse pas les dimensions spécifiées
        .webp({ quality: 50 }) // Compression en format WebP avec qualité de 50%
        .toFile(`images/${newFilename}`);
      
      // Supprimer l'image originale
      fs.unlinkSync(req.file.path);
      
      // Mettre à jour les informations de req.file pour refléter le nouveau fichier WebP
      req.file.path = `images/${newFilename}`;
      req.file.filename = newFilename;
      req.file.mimetype = "image/webp";
      
      // Pour déboguer : afficher les informations de req.file mises à jour
      console.log(req.file);
    } catch (error) {
      console.error('Erreur lors de la compression de l\'image:', error);
      return res.status(500).json({ message: 'Échec de la compression de l\'image', error: error.message });
    }
  }
  next();
};

module.exports = compressImage;






