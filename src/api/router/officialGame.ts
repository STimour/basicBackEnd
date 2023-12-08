import { Router } from "express";
import { OfficialGame } from "../model/OfficialGame";
import { checkToken } from "../middlewares/checkToken";

export const officialGameRouter = Router()

//ANCHOR - Creation d'un jeu
officialGameRouter.post("/", checkToken, async (req, res) => {
    try{
        const {name, description, image, prix} = req.body
        const creationOfOfficialGame = await OfficialGame.create({
                name: req.body.data["Name"],
                description: req.body.data["Description"],
                image: req.body.data["Image"],
                prix: req.body.data["Prix"]
        })
        res.json(creationOfOfficialGame)
    }catch(e){
        console.error('Erreur lors de l\'ajout du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'ajout du jeu", error: e });
    }
})

//ANCHOR - Affichage des tous les jeux
officialGameRouter.get("/", checkToken, async (req, res) => {
    try{
        const allOfficialGames= await OfficialGame.findAll()
        res.json(allOfficialGames)
    }catch(e){
        console.error('Erreur lors de l\'affichage des jeux :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage des jeux", error: e });
    }
})

//ANCHOR - Affichage d'un jeu
officialGameRouter.get("/:id", checkToken, async (req, res) => {
    const officialGameId = req.params.id
    try{
        const oneOfficialGame = await OfficialGame.findOne({
                where: {id: officialGameId}
        })
        res.json(oneOfficialGame)
    }catch(e){
        console.error('Erreur lors de l\'affichage du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage du jeu", error: e });
    }
})

//ANCHOR - Modification d'un jeu
officialGameRouter.put("/:id", checkToken, async (req, res) => {
    const officialGameId = req.params.id
    try{
        const updateOfficialGame = await OfficialGame.update(
            {
                name: req.body.data["Name"],
                description: req.body.data["Description"],
                image: req.body.data["Image"],
                prix: req.body.data["Prix"]
            },
            {
                where: {id: officialGameId},
                returning: true
            }
        )
        res.json(updateOfficialGame)
    }catch(e){
        console.error('Erreur lors de la modification du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la modification du jeu", error: e }); 
    }  
})

//ANCHOR - Suppression d'un jeu
officialGameRouter.delete("/:id", checkToken, async (req, res) => {
    const officialGameId = req.params.id
    try{
        const deletingOfficialGame = await OfficialGame.destroy(
            {
                where: {id: officialGameId}
            }
        )
        res.json(deletingOfficialGame)
    }catch(e){
        console.error('Erreur lors de la suppression du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la suppression du jeu", error: e }); 
    }
})