import { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    name: string;
    email: string;
    status: boolean;
    is_admin: boolean;
    password: string;
}

export interface TokenDecode {
    userId: string
    iat: number
}

export interface CreateUser extends Document {
    username: string;
    email: string;
    password: string;
}