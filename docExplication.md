## Api de type Strapi 

Dans un premier temps nous allons faire la connexion à la base de donnée dans notre fichier index.ts et puis ensuite créer nos models pour la base de données.

```typescript
export const sequelize = new Sequelize('authTest', 'tim', 'admin', {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    port:  process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
})
    // ici on peut initialiser les tables 

sequelize.sync({force: true}).then(() => 
    console.log('Base de données synchronisée')
)
```



Nous avons deux approches différentes pour définir un modèle Sequelize dans Node.js pour représenter une table dans une base de données relationnelle.
```typescript
//1 ère approche
import { DataType, DataTypes, Sequelize } from "sequelize";

export const FreeGameModel = (sequelize: Sequelize) => {
    return sequelize.define("freegame", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        image: DataTypes.STRING
    })
}
```
- Dans cette approche, nous utilisons directement la fonction `sequelize.define` pour définir le modèle. 
- Ensuite on doit initialiser cette table dans l'index par exemple (là ou se fait la connexion à la bdd) `export const User = FreeGameModel(sequelize);`
C'est une approche plus concise et est souvent utilisée lorsqu'on n'a pas besoin de définir des méthodes spécifiques sur le modèle.


```typescript
//2 ème approche
export class FreeGame extends Model{
  id!: number;
  name!: string;
  description!: string;
  image!: string;
}

//initialisation de la table à partir d'un model - dans notre cas, nous créons une fonction qu'il faudra appeler dans l'index - freeGame(), si cette partie nous ecrivons comme une instance du modèle directement. nous pouvons l'ecrire dans le fichier ou nous faison la connexion à la bdd
export const freeGame = () => { FreeGame.init(
    {   
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'FreeGame'
    }
)}

```
- Dans cette approche, nous définissons une classe `FreeGame`qui étend la classe `Model` dournie ar Sequelize. 
- Ensuite nous appelons la méthode `init` pour spécifier les détails du modèle (nom des colonnes, les tyoes de données, etc).

C'est une approche plus orientée objet et permet également de définir des méthodes personnalisées sur le modèle si nécessaire.

Dans ce projet nous avons fait le choix d'utiliser la deuxième approche. Ainsi, en s'appuyant sur le premier exemple nous allons créer OfficialGame et User et les appeler dans le index.ts, a la fin nous ferrons TokenBlackList.

Le tokenBlackList va nous servire pour garder les Tokens "deconnecté" cela permettra de restreindre les acces au utilisatreur qui vient de se déconnecter

Une fois la connexion a la bdd est faite et les models sont créés et appelé dans la page de connexion, nous allons gerer des route et pour cela nous créerons un dossier a part `router` et dedans nous allos créer des fichier qui gere les routes. Dans notre cas ça sera `auth.ts` pour inscription connexion et déconnexion des utilisateur des utilisateur, ensuite `freeGame.ts` et `officialGame.ts` pour gestion des jeux et en dernier `users.ts` pour affichage des information de l'utilisateur.

- Commençons par ajout des route dans l'index, en partant du principe qu'il y a deja un reglage de base pour faire tourner le serveur local.
```typescript
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from "body-parser";
import { Sequelize, Dialect } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { FreeGame, freeGame } from './api/model/FreeGame';
import { OfficialGame, officielGame } from './api/model/OfficialGame';
import { User, user } from './api/model/User';
import { authRouter } from './api/router/auth';
import { checkToken } from './api/middlewares/checkToken';
import { freeGameRouter } from './api/router/freeGame';
import { officialGameRouter } from './api/router/officialGame';
import { userRouter } from './api/router/users';

dotenv.config();

//ANCHOR - Connexion à la bdd
export const sequelize = new Sequelize('authTest', 'tim', 'admin', {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    port:  process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
})

user()  
officielGame()
freeGame()

//sequelize.sync({force: true}).then(() => 
//    console.log('Base de données synchronisée et remis à zéro')
//)
sequelize.sync().then(() => 
    console.log('Base de données synchronisée')
)

const APP: Express = express();
const PORT = process.env.PORT;

async function fetchData() {
  try{
    const FreeGames = await FreeGame.findAll()
    console.log(FreeGames)
  }catch(e){
    console.error('Erreur lors de la requête Sequelize :', e)
  }
}
fetchData()

APP.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

APP.use(bodyParser.json())

//ANCHOR Gestion des routes
const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/free-games', freeGameRouter);
apiRouter.use('/official-games', officialGameRouter);
apiRouter.use('/users', userRouter);

APP.use("/api", apiRouter);

APP.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

try{
  APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}catch(error: any){
  console.log(`Error occurred: ${error.message}`)
}
```
- Etant donné que nous avons créés un dossier pour les routes, nous pouvonons utiliser Router().
    - En Express.js, la classe Router permet de créer des gestionnaires de routes modulaires. Elle permet de regrouper des routes et d'appliquer des middleware de manière collective. La classe Router est généralement utilisée pour créer des mini-applications pouvant être montées en tant que middleware.

Donc dans notre cas, nous avons par exemple `auth.ts` qui ecrit de manière suivante:
```typescript
export const authRouter = Router()

authRouter.post("/local/register", async (req, res) => {
    try{
        const {username, email, password} = req.body
        //on peut noter cela d'une autre manière
        // const username = req.body.username;
        // const password = req.body.password;
        // const email = req.body.email;
        
        const emailExist = await User.findOne({where: {email}})
        if(emailExist){
            return res.status(400).json({error: "Entrez un email valide"})
        }else{    
            const hashedPassword = await bcrypt.hash(
                                                password, 
                                                parseInt(process.env.SALT_ROUNDS!));
            const newUser = await User.create({
                                            username: req.body["username"],
                                            email: req.body["email"],
                                            password: hashedPassword
                                        });
            
            res.send(newUser);
        }

    }catch(error){
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: error }); 
    }
})
```
Dans notre index apres avoir créé un Router comme dans l'exemple ci-dessous et nous avons créer notre fichier `auth.ts` et defini les route comme dans l'exemple plus haut 
```typescript
const express = require('express');
const apiRouter = express.Router();
```

Nous allons monetre le router de manière suivante:
```typescript
app.use('/api', apiRouter);
```
- Cela montera votre apiRouter sur le chemin /api. Ainsi, si vous définissez une route comme /auth sur apiRouter, elle sera accessible à l'adresse /api/auth.

L'utilisation de la classe Router aide à organiser vos routes, rendant votre application plus modulaire et plus facile à maintenir, surtout lorsqu'elle prend de l'ampleur. Chaque routeur peut avoir ses propres middleware, routes, et peut être monté à un chemin spécifique.

Maintenant passons à la création de `middleware`
Un middleware en développement web fait référence à une fonction ou un ensemble de fonctions qui sont exécutées entre le moment où une requête HTTP est reçue par le serveur et le moment où une réponse est renvoyée au client. Ces fonctions interviennent au milieu (d'où le nom "middleware") du processus de traitement de la requête et de la réponse.

Les middlewares sont utilisés pour effectuer diverses tâches, notamment :

1. **Transformation de la requête :** Modification des données de la requête avant qu'elles n'atteignent les gestionnaires de route. Par exemple, analyser les données du corps de la requête, ajouter des en-têtes, etc.

2. **Validation :** Vérification de la validité des données de la requête. Par exemple, s'assurer que les champs obligatoires sont présents, que les données ont le bon format, etc.

3. **Authentification :** Vérification de l'identité de l'utilisateur, généralement en examinant un jeton ou un cookie. Si l'utilisateur n'est pas authentifié, rediriger vers une page de connexion ou renvoyer une erreur d'authentification.

4. **Autorisation :** Vérification des permissions de l'utilisateur pour accéder à certaines ressources ou effectuer certaines actions.

5. **Gestion des erreurs :** Capture des erreurs et envoi d'une réponse appropriée au client plutôt que de laisser l'application planter.

6. **Journalisation :** Enregistrement d'informations sur la requête, la réponse ou d'autres événements à des fins de débogage ou d'analyse.

7. **Compression :** Compression des réponses pour réduire la taille des données envoyées au client, améliorant ainsi les performances.

8. **Caching :** Mise en cache de certaines réponses pour améliorer l'efficacité en évitant de refaire le même travail pour des requêtes similaires.

Les middlewares offrent une manière flexible et modulaire d'ajouter des fonctionnalités à une application web, en permettant de séparer les préoccupations et d'appliquer des traitements spécifiques à différentes parties du cycle de vie de la requête.

Dans notre application nous allons créer un middleware d'authentification. Voici à quoi il doit rassembler

```typescript
// Importation des modules nécessaires
import "dotenv/config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

// Définition d'une interface pour le décodage du token
export interface DecodeToken {
    id: number;
    username: string;
    email: string;
}

// Définition de la fonction middleware checkToken
export async function checkToken(req: Request, res: Response, next: NextFunction) {
    // Récupération du token complet depuis l'en-tête Authorization
    const fullToken = req.headers.authorization;

    // Vérification si le token est absent
    if (!fullToken) {
        return res.status(401).json({ error: 'Token absent' });
    } else {
        // Séparation du type de token et du token lui-même
        const [typeToken, token] = fullToken.split(" ");

        // Vérification du type de token (doit être "Bearer")
        if (typeToken !== "Bearer") {
            res.status(401).send("Type de token invalide");
        } else {
            // Vérification et décodage du token
            const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as DecodeToken;

            // Si le décodage est réussi, ajout du décodage à l'objet de requête (req)
            if (decoded) {
                req.decodedToken = decoded;
                next(); // Appel de la fonction suivante dans la chaîne de middleware
            }
        }
    }
}
```

Explications détaillées :

1. **Importation des modules :**
   - `dotenv/config`: Charge les variables d'environnement depuis un fichier `.env`.
   - `jsonwebtoken`: Bibliothèque pour créer et vérifier les jetons JWT.
   - `Request`, `Response`, `NextFunction` : Types d'Express pour les objets de requête, de réponse et la fonction middleware suivante.

2. **Interface DecodeToken :**
   - Définit la structure attendue des données décodées du token.

3. **Fonction middleware checkToken :**
   - La fonction prend trois paramètres : l'objet de requête (`req`), l'objet de réponse (`res`), et la fonction middleware suivante (`next`).
   - Récupère le token complet depuis l'en-tête `Authorization` de la requête.
   - Vérifie si le token est présent. S'il est absent, renvoie une réponse avec le statut 401 (non autorisé) et un message d'erreur.
   - Si le token est présent, le sépare en type de token (doit être "Bearer*") et le token lui-même.
   - Vérifie le type de token. S'il n'est pas "Bearer", renvoie une réponse avec le statut 401 et un message d'erreur.
   - Si le type est correct, utilise `jsonwebtoken` pour vérifier et décoder le token en utilisant la clé secrète (`JWT_TOKEN` dans les variables d'environnement).
   - Si le décodage réussit, ajoute l'objet décodé à l'objet de requête (`req.decodedToken`) et appelle la fonction middleware suivante (`next`).


- Si il n'y plus aucune erreur on peut tester notre back-end avec des requettes  














*
- Le terme "Bearer" dans le contexte des tokens d'authentification est utilisé pour indiquer au serveur comment interpréter le token qui suit dans l'en-tête `Authorization` d'une requête HTTP. C'est une convention qui spécifie le type de token inclus.

L'en-tête `Authorization` ressemble à ceci : `Authorization: Bearer <token>`

- **OAuth 2.0 Bearer Token**: Lorsque vous utilisez OAuth 2.0 pour l'authentification, le token Bearer est souvent utilisé. Le type de token peut varier, mais il est généralement JWT (JSON Web Token) ou un simple jeton d'accès. L'utilisation du mot-clé "Bearer" indique que le token fourni dans la requête doit être utilisé pour accéder à la ressource protégée.

- **JWT (JSON Web Token)**: Dans le cas des JWT, le mot-clé "Bearer" indique que le token qui suit est un JWT, et le serveur doit le décoder pour vérifier l'authenticité de la requête.

- **API Keys**: Bien que moins fréquent, certains systèmes peuvent utiliser le terme "Bearer" avec une clé d'API. Par exemple, `Authorization: Bearer <api-key>`.

En résumé, le mot-clé "Bearer" est une norme d'authentification HTTP qui spécifie le type de token inclus, permettant au serveur de comprendre comment traiter ce token pour autoriser l'accès à une ressource protégée.