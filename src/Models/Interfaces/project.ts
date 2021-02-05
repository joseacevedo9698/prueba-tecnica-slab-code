import { Document } from 'mongoose';

export interface IProject extends Document {
    name:string;
    description:string;
    date_init:string;
    date_end:string;
    status:boolean;
}


export interface ICreateProject extends Document {
    name:string;
    description:string;
    date_init:string;
    date_end:string;
}

export interface IEditProject extends Document {
    name:string;
    description:string;
    date_end:string;
}