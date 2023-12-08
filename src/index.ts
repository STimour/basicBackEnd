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

/////////ANCHOR - FreeGames
//ANCHOR - Affichages des jeux
//ANCHOR - Affichage d'un jeu
//ANCHOR - Creation d'un jeu
//ANCHOR - Modification d'un jeu
//ANCHOR - Suppression d'un jeu
//////ANCHOR - OfficialGames
//ANCHOR - Creation d'un jeu
//ANCHOR - Affichage d'un jeu
//ANCHOR - Modification d'un jeu
//ANCHOR - Suppression d'un jeu
/////ANCHOR - User
//ANCHOR - Create User
//ANCHOR - middleware auth
//ANCHOR - Affichages des jeux
//ANCHOR -  Suppression d'un jeu avec token

try{
  APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}catch(error: any){
  console.log(`Error occurred: ${error.message}`)
}

