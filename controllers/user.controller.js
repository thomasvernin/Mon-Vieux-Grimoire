const User = require('../models/user.model.js')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.signup = (req, res, next) => {

// checks that the string matches the email regex
if (!emailRegex.test(req.body.email)) {
    return res.status(410).json({message:"Email non conforme"})
}

if(!passwordRegex.test(req.body.password)){
    return res.status(410).json({message: "Le mot de passe doit contenir au moins 8 catactères, dont une majuscule et un chiffre"})
}

    // check if user is already registered in the database
    User.findOne({email: req.body.email}).then(user => {
        if(user){
            return res.status(409).json({message: "Utilisateur déjà existant"})
        } else {
            // save the user and hash his password
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

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // check if email exist in database
            if (!user) {
                return res.status(401).json({ error: `L'adresse email ou le mot de passe est incorrect` })
            }
            // check if password is correct
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: `L'adresse email ou le mot de passe est incorrect` })
                    }
                    // authorize the user and generate a temporary token
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













