"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const sequelize_1 = require("sequelize");
const FreeGame_1 = require("./api/model/FreeGame");
const OfficialGame_1 = require("./api/model/OfficialGame");
const User_1 = require("./api/model/User");
const auth_1 = require("./api/router/auth");
const freeGame_1 = require("./api/router/freeGame");
const officialGame_1 = require("./api/router/officialGame");
const users_1 = require("./api/router/users");
dotenv_1.default.config();
//ANCHOR - Connexion à la bdd
exports.sequelize = new sequelize_1.Sequelize('authTest', 'tim', 'admin', {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
(0, User_1.user)();
(0, OfficialGame_1.officielGame)();
(0, FreeGame_1.freeGame)();
//sequelize.sync({force: true}).then(() => 
//    console.log('Base de données synchronisée et remis à zéro')
//)
exports.sequelize.sync().then(() => console.log('Base de données synchronisée'));
const APP = (0, express_1.default)();
const PORT = process.env.PORT;
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const FreeGames = yield FreeGame_1.FreeGame.findAll();
            console.log(FreeGames);
        }
        catch (e) {
            console.error('Erreur lors de la requête Sequelize :', e);
        }
    });
}
fetchData();
APP.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
APP.use(body_parser_1.default.json());
//ANCHOR Gestion des routes
const apiRouter = express_1.default.Router();
APP.use("/api", apiRouter);
apiRouter.use('/auth', auth_1.authRouter);
apiRouter.use('/free-games', freeGame_1.freeGameRouter);
apiRouter.use('/official-games', officialGame_1.officialGameRouter);
apiRouter.use('/users', users_1.userRouter);
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
try {
    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
}
catch (error) {
    console.log(`Error occurred: ${error.message}`);
}
