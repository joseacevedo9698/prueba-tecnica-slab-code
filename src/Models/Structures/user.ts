import {IsNotEmpty, IsString, IsEmail, IsBoolean} from 'class-validator';
import { IUser } from '../Interfaces';
export class UserStructure {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsBoolean()
    status: boolean

    @IsNotEmpty()
    @IsBoolean()
    is_admin: boolean

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

   
    @IsNotEmpty()
    @IsString()
    password: string

   

    constructor(data: IUser) {
        this.email = data.email;
        this.name = data.name;
        this.password = data.password;
        this.username = data.username;
        this.status = data.status;
        this.is_admin = data.is_admin;
    }
}

export class emailVerify {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string


    constructor(email: string) {
        this.email = email;
    }
}

export class CreateUserStructure {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    username: string


    constructor(data: IUser) {
        this.email = data.email
        this.password = data.password
        this.username = data.username
    }
}

export class UpdateUser{
    @IsString()
    @IsEmail()
    email?: string

    @IsString()
    password?: string


    @IsString()
    username?: string



    constructor(data: IUser) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
    }
}
