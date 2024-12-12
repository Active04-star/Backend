import { IsNotEmpty, Length, IsString, IsEmail, IsOptional } from "class-validator";

export class AuthRegister  { 
    @IsNotEmpty()
    @Length(3, 50)
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    @Length(3, 50)
    email: string;
    
    @IsOptional()
    @IsString()
    profile_image: string;
}