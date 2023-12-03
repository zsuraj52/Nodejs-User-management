import { IsOptional, IsString } from "class-validator";

export class adminData {

    @IsOptional()
    @IsString()
    email: string;
    
    @IsOptional()
    @IsString()
    adminName: string;

    @IsOptional()
    @IsString()
    password: string;
    
}