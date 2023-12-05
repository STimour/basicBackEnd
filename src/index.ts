import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const APP: Express = express();
const PORT = process.env.PORT;

APP.use(cors({
  origin: '*', //accepte all
  methode: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

APP.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

APP.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});