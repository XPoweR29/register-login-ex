import { Router } from "express";
import { UserRecord } from "../records/user.record";

export const userRouter = Router();

userRouter

.post('/login', (req, res) => {
    console.log(req.body);
    res.json({isSucces: true}); 
})

.post('/register', (req, res) => {
    const user = new UserRecord(req.body);
    user.insert();
    res.json({isSucces: true});
})