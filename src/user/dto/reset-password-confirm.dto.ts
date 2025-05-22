import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ResetPasswordConfirmDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Token',
    example: '1234567890',
  })
  token: string

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: 'User ID',
    example: '12345678-1234-1234-1234-123456789012',
  })
  userId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'New password',
    example: 'test12345678',
  })
  password: string
}
