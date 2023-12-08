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
exports.freeGameRouter = void 0;
const express_1 = require("express");
const FreeGame_1 = require("../model/FreeGame");
exports.freeGameRouter = (0, express_1.Router)();
//ANCHOR - Affichages des jeux
exports.freeGameRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allFreeGames = yield FreeGame_1.FreeGame.findAll();
        res.json(allFreeGames);
    }
    catch (e) {
        console.error('Erreur lors de l\'affichage des jeux :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage des jeux", error: e });
    }
}));
//ANCHOR - Affichage d'un jeu
exports.freeGameRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const freeGameId = req.params.id;
    try {
        const oneFreeGame = yield FreeGame_1.FreeGame.findOne({
            where: { id: freeGameId }
        });
        res.json(oneFreeGame);
    }
    catch (e) {
        console.error('Erreur lors de l\'affichage du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage du jeu", error: e });
    }
}));
//ANCHOR - Creation d'un jeu
exports.freeGameRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image } = req.body;
        const resultatOfCreating = yield FreeGame_1.FreeGame.create({
            name: req.body.data["Name"],
            description: req.body.data["Description"],
            image: req.body.data["Image"]
        });
        res.json(resultatOfCreating);
    }
    catch (e) {
        console.error('Erreur lors de l\'ajout du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'ajout du jeu", error: e });
    }
}));
//ANCHOR - Modification d'un jeu
exports.freeGameRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const freeGameId = req.params.id;
    try {
        const resultatOfUpdate = yield FreeGame_1.FreeGame.update({
            name: req.body.data["Name"],
            description: req.body.data["Description"],
            image: req.body.data["Image"]
        }, {
            where: { id: freeGameId },
            returning: true, // Renvoie les données mises à jour 
        });
        res.json(resultatOfUpdate);
    }
    catch (e) {
        console.error('Erreur lors de la modification du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la modification du jeu", error: e });
    }
}));
//ANCHOR - Suppression d'un jeu
exports.freeGameRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const freeGameId = req.params.id;
    try {
        const gameDeletig = yield FreeGame_1.FreeGame.destroy({
            where: { id: freeGameId }
        });
        res.json(gameDeletig);
    }
    catch (e) {
        console.error('Erreur lors de la suppression du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la suppression du jeu", error: e });
    }
}));
