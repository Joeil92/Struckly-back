import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { UserGenderType } from '../user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @IsEmail()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john.doe@gmail.com',
  })
  email: string

  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'First name',
    example: 'John',
  })
  firstName: string

  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string

  @MinLength(8)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: 'test1234',
  })
  password: string

  @IsIn(['male', 'female', 'other'])
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'Gender',
    example: 'male',
  })
  gender: UserGenderType

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'Invitation token',
    example: '89bd50e06b87e25b2e804f913f7998b0bc7921af7ae80ea18dc825925db5f7b7',
  })
  invitationToken?: string | null
}
