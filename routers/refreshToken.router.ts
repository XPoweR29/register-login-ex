import { Router } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserRecord } from "../records/user.record";
import { User } from "../types";

dotenv.config();

export const refreshTokenRouter = Router();

refreshTokenRouter

.get('/', (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.status(401).json({
            isSuccess: false, 
            message: 'JWT cookie not found',
        });
    }

    const foundUser = UserRecord.getUserByRefreshToken(cookies.jwt);
    if(!foundUser) {
        return res.status(403).json({
            isSuccess: false, 
            message: 'Refresh token not found',
        });
    };

    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN, (err: Error, decoded: User) => {
        if(err) {
            return res.status(403).json({
                isSuccess: false, 
                message: 'Refresh token not valid',
            });
        }

        const payload = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
        }
        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '15s'});
        res.json({newAccessToken});
    }); 
})