import {IsNotEmpty, IsString, IsISO8601} from 'class-validator';
import { ITask } from '../Interfaces';
export class TaskStructure {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsISO8601()
    @IsNotEmpty()
    date_init: string

    @IsNotEmpty()
    @IsString()
    project: string

   
    constructor(data: ITask) {
        this.description = data.description;
        this.name = data.name;
        this.date_init = data.date_init;
        this.project  = data.project;
    }
}