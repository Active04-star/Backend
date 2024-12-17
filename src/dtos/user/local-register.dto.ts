import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsString, IsEmail, Matches, Validate } from "class-validator";
import { MatchPassword } from "src/validator/matchPassword";

export class LocalRegister {

  @ApiProperty({
    example: "Tom Howard",
  })
  @IsNotEmpty()
  @Length(3, 50)
  @IsString()
  name: string;

  @ApiProperty({
    example: 'TomHoward@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 50)
  email: string;

  @ApiProperty({
    example: 'Password!1',
  })
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
  
  @ApiProperty({
    example: 'Password!1',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(MatchPassword, ['password'])
  confirm_password: string;
}