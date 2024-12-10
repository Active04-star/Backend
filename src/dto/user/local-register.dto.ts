import { File } from "buffer";
import { IsNotEmpty, Length, IsString, IsEmail, Matches, Validate, IsOptional } from "class-validator";
import { MatchPassword } from "src/validator/matchPassword";

export class LocalRegister  { 
    @IsNotEmpty()
    @Length(3, 50)
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    @Length(3, 50)
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(8, 80)
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]/,
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*), and be more than 8 characters.',
      },
    )
    password: string;
  
    @IsNotEmpty()
    @IsString()
    @Validate(MatchPassword, ['password'])
    confirm_password: string;
  
    @IsOptional()
    profile_image?: File;
}