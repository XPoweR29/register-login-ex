import { Router } from "express";
import { UserRecord } from "../records/user.record";
import * as jwt from 'jsonwebtoken';
import { User } from "../types";
import * as dotenv from 'dotenv';
import { compare } from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware";

dotenv.config();


export const userRouter = Router();

userRouter

.post('/login', authMiddleware, async(req, res) => {
    const user = await UserRecord.getUserByEmail(req.body.email);
    if(!user){
        return res.status(401).json({
            isSuccess: false,
            message: 'User not found'
        });
    }

    if(!(await compare(req.body.pwd, user.pwd))) {
        return res.status(401).json({
            isSucess: false,
            message: 'Invalid password'
        });
    }

    const payload: Partial<User> = {
        id: user.id,
        username: user.username,
        email: user.email,
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '15s'});
    res.json({token});
})

.post('/register', (req, res) => {
    const user = new UserRecord(req.body);
    user.insert();
    res.json({isSucces: true});
})