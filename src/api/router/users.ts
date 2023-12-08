import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";
import { User } from "../model/User";
import jwt from "jsonwebtoken";
import { DecodeToken } from "../middlewares/checkToken";

export const userRouter = Router()

userRouter.get("/me", checkToken, async (req, res) => {
    const userId = req.params.id
    try{
        const decoded = req.decodedToken
        const user = await User.findOne({ where: { id: decoded!.id } });
    if (user) {
        delete user.dataValues.password;
        res.json(user);
    }
    else {
        res.status(404).send("User not found");
    }
    }catch(e){
        console.error("Affichage n'est pas possible:", e)
    }
})