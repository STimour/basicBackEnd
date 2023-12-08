import { Router } from "express";
import { FreeGame } from "../model/FreeGame";

export const freeGameRouter = Router()
//ANCHOR - Affichages des jeux
freeGameRouter.get("/", async (req, res) => {
    try{
        const allFreeGames = await FreeGame.findAll()
        res.json(allFreeGames);
      }catch(e){
        console.error('Erreur lors de l\'affichage des jeux :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage des jeux", error: e });
      }
})

//ANCHOR - Affichage d'un jeu
freeGameRouter.get("/:id", async (req, res) => {
    const freeGameId = req.params.id;
    try{
        const oneFreeGame = await FreeGame.findOne({
          where: {id: freeGameId}
        })
        res.json(oneFreeGame);
    }catch(e){
        console.error('Erreur lors de l\'affichage du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'affichage du jeu", error: e });
    }
})

//ANCHOR - Creation d'un jeu
freeGameRouter.post("/", async (req, res) => {
    try{
        const {name, description, image} = req.body
        const resultatOfCreating = await FreeGame.create({
            name: req.body.data["Name"],
            description: req.body.data["Description"],
            image: req.body.data["Image"] 
        })
        res.json(resultatOfCreating)
    }catch(e){
        console.error('Erreur lors de l\'ajout du jeu :', e);
        res.status(500).json({ message: "Erreur lors de l'ajout du jeu", error: e });
      }
})

//ANCHOR - Modification d'un jeu
freeGameRouter.put("/:id",async (req, res) => {
    const freeGameId = req.params.id
    try{
        const resultatOfUpdate = await FreeGame.update(
            {
                name: req.body.data["Name"],
                description: req.body.data["Description"],
                image: req.body.data["Image"] 
            },
            {
                where: { id: freeGameId },
                returning: true, // Renvoie les données mises à jour 
            }
        )
        res.json(resultatOfUpdate);
    }catch(e){
        console.error('Erreur lors de la modification du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la modification du jeu", error: e });
    }
})

//ANCHOR - Suppression d'un jeu
freeGameRouter.delete("/:id", async (req, res) => {
    const freeGameId = req.params.id
    try{
        const gameDeletig = await FreeGame.destroy(
            {
                where: { id: freeGameId}
            }
        )
    res.json(gameDeletig)
    }catch(e){
        console.error('Erreur lors de la suppression du jeu :', e);
        res.status(500).json({ message: "Erreur lors de la suppression du jeu", error: e });
    }
})