import {v4 as uuid} from 'uuid';
import { User } from "../types";
import { pool } from '../utils/db';
import { ValidationError } from "../utils/errors";
import { promisify } from 'util';
import { hash } from 'bcrypt';
import { FieldPacket } from 'mysql2';
const hashing = promisify(hash);

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord {
    public id?: string;
    public username: string;
    public email: string; 
    public pwd: string;
    constructor(obj: User) {
        if(!obj.email || !obj.pwd) throw new ValidationError('Email and password are required');
        if(!obj.username) throw new ValidationError('Username is required');

        this.id = obj.id || uuid();
        this.username = obj.username;
        this.email = obj.email;
        this.pwd = obj.pwd;
    }

    async insert(): Promise<void> {
        await pool.execute("INSERT INTO `users` (`id`, `username`, `email`, `pwd`) VALUES(:id, :username, :email, :pwd)", {
            id: this.id,
            username: this.username,
            email: this.email,
            pwd: await hashing(this.pwd, 10),
        });

        console.log(`User ${this.username} has been created`);
    }

    static async getUserById(id: string): Promise<UserRecord> {
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        })) as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async update(data: Partial<User>): Promise<UserRecord> {
        await pool.execute("UPDATE `users` SET username=:username, email=:email, pwd=:pwd WHERE id=:id", {
            id: this.id,
            username: data.username || this.username,
            email: data.email || this.email,
            pwd: data.pwd ? await hashing(data.pwd, 10) : this.pwd,
        });

        Object.assign(this, data);
        console.log(`User ${data.username || this.username} has been updated`);
        return this;
    } 

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `users` WHERE id=:id", {
            id: this.id,
        });

        console.log(`User ${this.username} has been deleted`);
    }
}