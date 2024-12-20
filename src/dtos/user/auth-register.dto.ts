import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsString, IsEmail, IsOptional, IsUrl } from "class-validator";

export class AuthRegister  { 
    @ApiProperty({description: "nombre entregado por auth0"})
    @IsNotEmpty()
    @Length(3, 50)
    @IsString()
    name: string;
  
    @ApiProperty({description: "email entregado por auth0"})
    @IsNotEmpty()
    @IsEmail()
    @Length(3, 50)
    email: string;
    
    @ApiProperty({description: "foto de perfil entregada por auth0"})
    @IsOptional()
    @IsString()
    @IsUrl()
    profile_image?: string;

    @ApiProperty({description: "identificador unico (sub) entregado por auth0"})
    @IsNotEmpty()
    @IsString()
    sub: string;
}