# Mon Vieux Grimoire - Backend

Bienvenue dans le dépôt du backend du projet **Mon Vieux Grimoire**. Ce projet a pour but de créer un site web pour une chaîne de librairies, permettant le référencement et la notation de livres. Ce backend a été développé avec **Node.js**, **Express**, et **MongoDB**.

## Stack Technique

### Node.js
![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)

### Express
![Express](https://img.icons8.com/ios-filled/50/000000/express-js.png)

### MongoDB
![MongoDB](https://img.icons8.com/color/48/000000/mongodb.png)

## Scénario

Je suis développeur back-end freelance depuis maintenant un an dans la région de Lille. J'ai l’habitude de travailler avec Kévin, un développeur front-end plus expérimenté, qui a déjà un bon réseau de contacts dans le milieu. Kévin m'a contacté pour me proposer de travailler avec lui en mutualisant nos compétences front/back sur ce nouveau projet proposé par une petite chaîne de librairies.

## Compétences

- **Implémentation d'un modèle logique de données** : Assurer la conformité à la réglementation en vigueur.
- **Opérations CRUD sécurisées** : Mettre en œuvre des opérations CRUD de manière sécurisée.
- **Stockage sécurisé des données** : Garantir la sécurité des données stockées dans la base de données.

## Structure du Projet

Voici la structure du projet backend :

```
MonVieuxGrimoire/
├── config/
│   └── database.js
├── controllers/
│   ├── bookController.js
│   └── userController.js
├── models/
│   ├── bookModel.js
│   └── userModel.js
├── routes/
│   ├── bookRoutes.js
│   └── userRoutes.js
├── middlewares/
│   └── authMiddleware.js
├── .env
├── app.js
├── package.json
└── README.md
```

## Installation

Pour installer et démarrer le projet, suivez les étapes suivantes :

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/your-username/MonVieuxGrimoire-backend.git
   cd MonVieuxGrimoire-backend
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Configurez votre fichier `.env` en utilisant l'exemple fourni dans `.env.example`.

4. Démarrez le serveur :
   ```sh
   npm start
   ```

## Fonctionnalités

- **Création de compte utilisateur**
- **Connexion utilisateur**
- **Ajout de livres**
- **Consultation de livres**
- **Notation de livres**
- **Sécurisation des opérations avec JWT**

## Contribution

Les contributions sont les bienvenues ! Veuillez lire le [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails sur notre code de conduite et le processus de soumission des demandes de tirage.

## Lien du Frontend

Le dépôt du frontend du projet est disponible [ici](https://github.com/your-username/MonVieuxGrimoire-frontend).

---

Développé par Vernin Thomas.

Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir une issue ou à me contacter directement.

---

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/MonVieuxGrimoire-backend)
