import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Auth0TokenRequestDto {
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsNumber()
    @IsNotEmpty()
    expires_in: number;

    @IsString()
    @IsNotEmpty()
    token_type: string;
}