## Api de type Strapi 

Dans un premier temps nous allons faire la connexion à la base de donnée dans notre fichier index.ts et puis ensuite créer nos models pour la base de données.

```javascript
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
```javascript
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

C'est une approche plus concise et est souvent utilisée lorsqu'on n'a pas besoin de définir des méthodes spécifiques sur le modèle.


```javascript
//2 ème approche
export class FreeGame extends Model{
  id!: number;
  name!: string;
  description!: string;
  image!: string;
}

//initialisation de la table à partir d'un model - dans notre cas, nous créons une fonction qu'il faudra appeler dans l'index, si cette partie nous ecrivons comme une instance du modèle directement. nous pouvons l'ecrire dans le fichier ou nous faison la connexion à la bdd
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

Dans ce projet nous avons fait le choix d'utiliser la deuxième approche. Ainsi, en s'appuyant sur le premier exemple nous allons créer OfficialGame et User, a la fin nous ferrons TokenBlackList.

