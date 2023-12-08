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
exports.authRouter = void 0;
const express_1 = require("express");
const User_1 = require("../model/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const checkToken_1 = require("../middlewares/checkToken");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/local/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        //on peut noter cela d'une autre manière
        // const username = req.body.username;
        // const password = req.body.password;
        // const email = req.body.email;
        const emailExist = yield User_1.User.findOne({ where: { email } });
        if (emailExist) {
            return res.status(400).json({ error: "Entrez un email valide" });
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(password, parseInt(process.env.SALT_ROUNDS));
            const newUser = yield User_1.User.create({
                username: req.body["username"],
                email: req.body["email"],
                password: hashedPassword
            });
            res.send(newUser);
        }
    }
    catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: error });
    }
}));
exports.authRouter.post("/local", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        const emailVerify = yield User_1.User.findOne({ where: { email: identifier } });
        if (!emailVerify) {
            res.status(400).send("Email ou Password est incorrecte");
        }
        else {
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, emailVerify.dataValues.password);
            if (isPasswordCorrect) {
                delete emailVerify.dataValues.password;
                const token = jsonwebtoken_1.default.sign(emailVerify.dataValues, process.env.JWT_TOKEN, {
                    expiresIn: '1h'
                });
                res.send(Object.assign({ token }, emailVerify.dataValues));
            }
            else {
                res.status(400).send("Email ou Password est incorrecte");
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Problème de connexion' });
    }
}));
exports.authRouter.post('/change-password', checkToken_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, passwordConfirmation, password } = req.body;
    if (passwordConfirmation !== password) {
        res.status(400).send("New passwords do not match");
    }
    else if (passwordConfirmation.length < 6) {
        res.status(400).send("New password must be at least 6 characters long");
    }
    else {
        const decoded = req.decodedToken;
        const user = yield User_1.User.findOne({ where: { id: decoded.id } });
        if (user) {
            const isPasswordCorrect = yield bcrypt_1.default.compare(currentPassword, user.dataValues.password);
            if (isPasswordCorrect) {
                const hashedPassword = yield bcrypt_1.default.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS));
                yield user.update({ password: hashedPassword });
                res.send("Password changed");
            }
            else {
                res.status(400).send("Current password is incorrect");
            }
        }
        else {
            res.status(404).send("User not found");
        }
    }
}));
