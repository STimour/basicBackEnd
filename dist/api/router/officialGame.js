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
Object.defineProperty(exports, "__esModule", { value: true });
exports.officialGameRouter = void 0;
const express_1 = require("express");
const OfficialGame_1 = require("../model/OfficialGame");
const checkToken_1 = require("../middlewares/checkToken");
exports.officialGameRouter = (0, express_1.Router)();
//ANCHOR - Creation d'un jeu
exports.officialGameRouter.post("/", checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image, prix } = req.body;
        const creationOfOfficialGame = yield OfficialGame_1.OfficialGame.create({
            name: req.body.data["Name"],
            description: req.body.data["Description"],
            image: req.body.data["Image"],
            prix: req.body.data["Prix"]
        });
        res.json(creationOfOfficialGame);
    }
    catch (e) {
        console.error('Erreur lors de l\'ajout du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'ajout du jeu", error: e });
    }
}));
//ANCHOR - Affichage des tous les jeux
exports.officialGameRouter.get("/", checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allOfficialGames = yield OfficialGame_1.OfficialGame.findAll();
        res.json(allOfficialGames);
    }
    catch (e) {
        console.error('Erreur lors de l\'affichage des jeux :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage des jeux", error: e });
    }
}));
//ANCHOR - Affichage d'un jeu
exports.officialGameRouter.get("/:id", checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const officialGameId = req.params.id;
    try {
        const oneOfficialGame = yield OfficialGame_1.OfficialGame.findOne({
            where: { id: officialGameId }
        });
        res.json(oneOfficialGame);
    }
    catch (e) {
        console.error('Erreur lors de l\'affichage du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage du jeu", error: e });
    }
}));
//ANCHOR - Modification d'un jeu
exports.officialGameRouter.put("/:id", checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const officialGameId = req.params.id;
    try {
        const updateOfficialGame = yield OfficialGame_1.OfficialGame.update({
            name: req.body.data["Name"],
            description: req.body.data["Description"],
            image: req.body.data["Image"],
            prix: req.body.data["Prix"]
        }, {
            where: { id: officialGameId },
            returning: true
        });
        res.json(updateOfficialGame);
    }
    catch (e) {
        console.error('Erreur lors de la modification du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la modification du jeu", error: e });
    }
}));
//ANCHOR - Suppression d'un jeu
exports.officialGameRouter.delete("/:id", checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const officialGameId = req.params.id;
    try {
        const deletingOfficialGame = yield OfficialGame_1.OfficialGame.destroy({
            where: { id: officialGameId }
        });
        res.json(deletingOfficialGame);
    }
    catch (e) {
        console.error('Erreur lors de la suppression du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la suppression du jeu", error: e });
    }
}));
