# Mon Vieux Grimoire - Backend

Bienvenue dans le dépôt du backend du projet **Mon Vieux Grimoire**. Ce projet a pour but de créer un site web pour une chaîne de librairies, permettant le référencement et la notation de livres. Ce backend a été développé avec **Node.js**, **Express.js**, et **MongoDB**.

## Stack Technique

### Node.js
![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)

### Express


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
├── controllers/
│   ├── book.controller.js
│   └── user.controller.js
├── images/
├── middleware/
│   ├── auth.js
│   └── multer-config.js
├── models/
│   ├── book.model.js
│   └── user.model.js
├── routes/
│   ├── book.routes.js
│   └── user.routes.js
├── .env.example
├── .gitignore
├── App.js
├── README.md
├── package-lock.json
├── package.json
├── requests.http
└── server.js
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

## Lien du Frontend

Le dépôt du frontend du projet est disponible [ici](https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres).

---

Développé par Vernin Thomas.

Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir une issue ou à me contacter directement.

---

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/MonVieuxGrimoire-backend)
