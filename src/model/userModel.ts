import { IsOptional, IsString } from "class-validator";

export class UserModel {

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    userName: string;

    @IsOptional()
    @IsString()
    password: string;
    
}