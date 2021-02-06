import {IsNotEmpty, IsString, IsISO8601, IsOptional} from 'class-validator';
import { IProject , IEditProject} from '../Interfaces';
export class ProjectStructure {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsISO8601()
    @IsNotEmpty()
    date_init: string

    @IsISO8601()
    @IsNotEmpty()
    date_end: string

   
    constructor(data: IProject) {
        this.description = data.description;
        this.name = data.name;
        this.date_init = data.date_init;
        this.date_end = data.date_end;
    }
}

export class EditProjectStructure {
    
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsISO8601()
    date_end: string

   
    constructor(data: IEditProject) {
        this.description = data.description;
        this.name = data.name;
        this.date_end = data.date_end;
    }
}