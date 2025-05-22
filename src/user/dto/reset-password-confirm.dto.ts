import { IsString, IsUUID } from 'class-validator'

export class ResetPasswordConfirmDto {
  @IsString()
  token: string

  @IsUUID()
  userId: string

  @IsString()
  password: string
}
