import { ApiProperty } from '@nestjs/swagger'
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEmail } from 'class-validator'

export class CreateInvitationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsEmail({}, { each: true })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    description: 'List of emails',
    example: ['john.doe@gmail.com', 'john.doe2@gmail.com'],
  })
  emails: string[]
}
