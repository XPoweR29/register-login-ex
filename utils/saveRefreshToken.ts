import { pool } from "./db"

export const saveRefreshToken = async(id: string, refreshToken: string) => {
    await pool.execute("UPDATE `users` SET refreshToken= :refreshToken WHERE id= :id", {
        id,
        refreshToken,
    });
}