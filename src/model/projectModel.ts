import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProjectModel {

    @IsOptional()
    @IsString()
    project_Name: string;

    @IsOptional()
    @IsString()
    project_Language: string;

    @IsOptional()
    @IsNumber()
    project_Deadline: number;

    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsNumber()
    adminId: number;
    
}