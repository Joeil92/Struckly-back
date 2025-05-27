import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator'
import { UserGenderType } from '../user.entity'

export class CreateUserDto {
  @IsEmail()
  @MinLength(1)
  @MaxLength(255)
  email: string

  @MinLength(1)
  @MaxLength(255)
  firstName: string

  @MinLength(1)
  @MaxLength(255)
  lastName: string

  @IsIn(['male', 'female', 'other'])
  @IsString()
  @MaxLength(255)
  gender: UserGenderType
}
