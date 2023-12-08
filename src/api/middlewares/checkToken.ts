import "dotenv/config";
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction } from 'express';
import { request } from "http";

export interface DecodeToken {
    id: number;
    username: string;
    email: string;
}

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const fullToken = req.headers.authorization
    if(!fullToken){
        return res.status(401).json({ error: 'Token absent' });
    }else{
        const [typeToken, token] = fullToken.split(" ")
        if(typeToken !== "Bearer"){
            res.status(401).send("Invalid token type");
        }else{
            const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as DecodeToken
               if(decoded){
                   req.decodedToken = decoded
                   next()
               }

            
             
        }
    }
}