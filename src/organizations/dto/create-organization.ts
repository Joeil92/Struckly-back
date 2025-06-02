import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateOrganizationDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "Organization's name",
    example: 'Organization Name',
  })
  name: string

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: 'Country',
    example: 'France',
  })
  country: string
}
