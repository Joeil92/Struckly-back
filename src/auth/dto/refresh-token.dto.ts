import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  refresh_token: string
}
