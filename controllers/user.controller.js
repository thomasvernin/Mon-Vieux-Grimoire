const User = require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {

  // Vérifie que l'adresse email est conforme au regex
  if (!emailRegex.test(req.body.email)) {
      return res.status(410).json({message:"Email non conforme"})
  }

  // Vérifie que le mot de passe est conforme au regex
  if(!passwordRegex.test(req.body.password)){
      return res.status(410).json({message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre"})
  }

  // Vérifie si l'utilisateur est déjà enregistré dans la base de données
  User.findOne({email: req.body.email}).then(user => {
      if(user){
          return res.status(409).json({message: "Utilisateur déjà existant"})
      } else {
          // Sauvegarde l'utilisateur et hache son mot de passe
          bcrypt.hash(req.body.password, 10)
           .then(hash => {
              const user = new User({
                  email: req.body.email,
                  password: hash
              })
          user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
      }
  })
}

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          // Vérifie si l'email existe dans la base de données
          if (!user) {
              return res.status(401).json({ error: `L'adresse email ou le mot de passe est incorrect` })
          }
          // Vérifie si le mot de passe est correct
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ error: `L'adresse email ou le mot de passe est incorrect` })
                  }
                  // Autorise l'utilisateur et génère un token temporaire
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                          { userId: user._id },
                          'RANDOM_TOKEN_SECRET',
                          { expiresIn: '24h' }
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
}













