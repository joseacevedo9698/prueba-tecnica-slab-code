import { Document } from 'mongoose';
import { IProject } from './project';

export interface ITask extends Document {
    name:string;
    description:string;
    date_init:string;
    status:boolean;
    project: string;
}



export interface ICreateTask extends Document {
    name:string;
    description:string;
    date_init:string;
    project: string;
}