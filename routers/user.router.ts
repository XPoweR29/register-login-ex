import { Request, Router } from "express";
import { UserRecord } from "../records/user.record";
import * as jwt from 'jsonwebtoken';
import { User } from "../types";
import * as dotenv from 'dotenv';
import { compare } from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware";
import { saveRefreshToken } from "../utils/saveRefreshToken";

dotenv.config();

export const userRouter = Router();

userRouter

	.get("/", authMiddleware, (req: Record<"user", any> & Request, res) => {
		res.json(req.user);
	})

	.post("/login", async (req, res) => {
		const user = await UserRecord.getUserByEmail(req.body.email);
		if (!user) {
			return res.status(401).json({
				isSuccess: false,
				message: "User not found",
			});
		}

		if (!req.body.pwd || !(await compare(req.body.pwd, user.pwd))) {
			return res.status(401).json({
				isSucess: false,
				message: "Invalid password",
			});
		}

		const payload: Partial<User> = {
			id: user.id,
			username: user.username,
			email: user.email,
		};
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
			expiresIn: "15s",
		});
		const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
		saveRefreshToken(user.id, refreshToken);
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
		});

		res.json({ accessToken, isSuccess: true });
	})

	.post("/register", (req, res) => {
		const user = new UserRecord(req.body);
		user.insert();
		res.json({ isSucces: true });
	})

    .delete('/logout', async(req, res) => {
        const refreshToken = req.cookies.jwt;
        await UserRecord.removeRefreshToken(refreshToken);
        res.clearCookie('jwt');
        res.json('Successfully log out');
    })