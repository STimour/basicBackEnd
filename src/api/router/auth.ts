import { Router } from "express"
import { User, user } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";
import { decode } from "punycode";

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

authRouter.post("/local", async (req,res) => {
    try{
        const {identifier, password} = req.body
        const emailVerify = await User.findOne({ where: { email: identifier}})

        if(!emailVerify){
            res.status(400).send("Email ou Password est incorrecte"); 
        }else{
            const isPasswordCorrect = await bcrypt.compare(password, emailVerify.dataValues.password)
            if(isPasswordCorrect){
                delete emailVerify.dataValues.password;
                const token = jwt.sign(emailVerify.dataValues, process.env.JWT_TOKEN!, {
                    expiresIn: '1h'
                })
                res.send({
                    token,
                    ...emailVerify.dataValues
                });
            }else {
                res.status(400).send("Email ou Password est incorrecte");
            }
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Problème de connexion' });
    }
})

authRouter.post('/change-password', checkToken, async (req, res) => {
    const {currentPassword, passwordConfirmation, password} = req.body
    if (passwordConfirmation !== password) {
        res.status(400).send("New passwords do not match");
    }else if(passwordConfirmation.length < 6){
        res.status(400).send("New password must be at least 6 characters long")
    }else {
        const decoded = req.decodedToken
        const user = await User.findOne({ where: { id: decoded!.id } });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.dataValues.password);
            if (isPasswordCorrect) {
                const hashedPassword = await bcrypt.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS!));
                await user.update({ password: hashedPassword });
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
})