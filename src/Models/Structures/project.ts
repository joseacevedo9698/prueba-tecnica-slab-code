import {IsNotEmpty, IsString, IsEmail, IsBoolean} from 'class-validator';
import { IProject } from '../Interfaces';
export class ProjectStructure {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    date_init: string

    @IsNotEmpty()
    @IsString()
    date_end: string

   
    constructor(data: IProject) {
        this.description = data.description;
        this.name = data.name;
        this.date_init = data.date_init;
        this.date_end = data.date_end;
    }
}