interface DecodeToken {
    id: number;
    username: string;
    email: string;
}

declare namespace Express {
    
    export interface Request {
         decodedToken?: DecodeToken;
     }
 }