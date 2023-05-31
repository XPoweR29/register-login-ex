import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req: Record<'user', any> & Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];
    if(!headerToken) {
        return res.status(401);
    }

    const token = headerToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if(err) {
            return res.status(403);
        }

        req.user = decoded;
        next();
    })
}