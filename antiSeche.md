Pour atteindre l'objectif décrit et mettre en place toutes les fonctionnalités demandées, vous pouvez suivre les étapes ci-dessous. Assurez-vous d'avoir les dépendances nécessaires installées, telles que Express, Sequelize, bcrypt, et jsonwebtoken.

1. **Créer une API sans authentification avec Express + Sequelize pour les jeux gratuits et payants**

   - Configurez votre projet Express et intégrez Sequelize pour la gestion de la base de données.
   - Définissez les modèles Sequelize pour les jeux gratuits et payants.

2. **Créer un modèle utilisateur**

   - Créez un modèle `User` avec les champs suivants : `id`, `email`, `password`.

   ```typescript
   // models/User.js
   const User = sequelize.define('User', {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
     },
     email: {
       type: Sequelize.STRING,
       allowNull: false,
       unique: true,
     },
     password: {
       type: Sequelize.STRING,
       allowNull: false,
     },
   });

   module.exports = User;
   ```

3. **Créer une route de registration**

   - Créez une route pour gérer l'enregistrement d'un utilisateur.
   - Vérifiez que l'email n'est pas déjà utilisé.
   - Hash le mot de passe et créez l'utilisateur.

   ```typescript
   // routes/auth.js
   const express = require('express');
   const bcrypt = require('bcrypt');
   const User = require('../models/User');

   const router = express.Router();

   router.post('/register', async (req, res) => {
     try {
       const { email, password } = req.body;

       // Vérifiez si l'email est déjà utilisé
       const existingUser = await User.findOne({ where: { email } });
       if (existingUser) {
         return res.status(400).json({ error: 'Email already in use' });
       }

       // Hash le mot de passe
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);

       // Créez l'utilisateur
       const newUser = await User.create({ email, password: hashedPassword });

       res.status(201).json({ user: newUser });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });

   module.exports = router;
   ```

4. **Créer une route de login**

   - Créez une route pour gérer la connexion d'un utilisateur.
   - Vérifiez que le couple email/password est correct.
   - Créez un token JWT et renvoyez-le dans la réponse.

   ```typescript
   // routes/auth.js
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');
   const User = require('../models/User');

   router.post('/login', async (req, res) => {
     try {
       const { email, password } = req.body;

       // Vérifiez le couple email/password
       const user = await User.findOne({ where: { email } });
       if (!user || !(await bcrypt.compare(password, user.password))) {
         return res.status(400).json({ error: 'Invalid email or password' });
       }

       // Créez un token JWT
       const token = jwt.sign({ userId: user.id }, 'your_secret_key', {
         expiresIn: '1h',
       });

       res.json({ token });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });
   ```

5. **Créer un middleware d'authentification**

   - Créez un middleware qui vérifie que le token JWT est présent dans le header `Authorization` et qu'il est valide.
   - Ajoutez l'utilisateur dans la requête et appelez la fonction `next()` si le token est valide.

   ```typescript
   // middleware/auth.js
   const jwt = require('jsonwebtoken');

   const authenticateMiddleware = (req, res, next) => {
     const token = req.headers.authorization;

     if (!token) {
       return res.status(401).json({ error: 'Unauthorized - Token missing' });
     }

     try {
       // Vérifiez que le token est valide
       const decodedToken = jwt.verify(token, 'your_secret_key');
       req.userId = decodedToken.userId;
       next();
     } catch (error) {
       console.error(error);
       res.status(401).json({ error: 'Unauthorized - Invalid token' });
     }
   };

   module.exports = authenticateMiddleware;
   ```

6. **Utilisation du middleware d'authentification**

   - Ajoutez le middleware d'authentification sur les routes privées.

   ```typescript
   // app.js
   const authenticateMiddleware = require('./middleware/auth');

   app.use('/private', authenticateMiddleware);
   ```

   - Utilisez la route `/private` pour toutes les opérations nécessitant une authentification.

7. **Créer une route de logout**

   - Créez une route pour gérer la déconnexion d'un utilisateur.
   - Détruisez le token JWT.

   ```typescript
   // routes/auth.js
   router.post('/logout', (req, res) => {
     // Détruisez le token JWT (si stocké côté client)
     res.json({ message: 'Logout successful' });
   });
   ```

8. **Créer une route de récupération de l'utilisateur connecté**

   - Créez une route pour récupérer les informations de l'utilisateur connecté.
   - Utilisez le token JWT pour identifier l'utilisateur.

   ```typescript
   // routes/user.js
   router.get('/current-user', async (req, res) => {
     try {
       const userId = req.userId;
       const user = await User.findByPk(userId);

       res.json({ user });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });
   ```

9. **Créer une route de modification du mot de passe**

   - Créez une route pour permettre à l'utilisateur connecté de modifier son mot de passe.
   - Utilisez le token JWT pour identifier l'utilisateur et mettre à jour le mot de passe dans la base de données.

   ```typescript
   // routes/user.js
   router.put('/change-password', async (req, res) => {
     try {
       const userId = req.userId;
       const { currentPassword, newPassword } = req.body;

       // Récupérez l'utilisateur
       const user = await User.findByPk(userId);
       if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
         return res.status(400).json({ error: 'Invalid current password' });
       }

       // Hash le nouveau mot de passe
       const saltRounds = 10;
       const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

       // Mettez à jour

 le mot de passe dans la base de données
       await user.update({ password: hashedNewPassword });

       res.json({ message: 'Password updated successfully' });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });
   ```

Ces étapes devraient vous aider à mettre en place une API avec Express qui intègre l'authentification, crée un middleware d'authentification, et fournit des fonctionnalités telles que l'enregistrement, la connexion, la déconnexion, la récupération de l'utilisateur connecté, et la modification du mot de passe. Assurez-vous de personnaliser le code en fonction de vos besoins spécifiques et de tester soigneusement toutes les fonctionnalités.