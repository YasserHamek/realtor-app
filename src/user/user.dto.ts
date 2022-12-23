import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im, {
    message: 'phoneNumber must be a valide phone number',
  })
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
