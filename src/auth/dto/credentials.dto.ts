import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'

export class CredentialsDto {
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "User's email",
    example: 'john.doe@gmail.com',
  })
  email: string

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "User's password",
    example: '12345678',
  })
  password: string
}
