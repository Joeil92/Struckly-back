import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString, Length } from 'class-validator'
import { OrganizationSize } from '../organization.types'

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

  @IsEnum(OrganizationSize)
  @ApiProperty({
    type: String,
    enum: OrganizationSize,
    description: 'Organization size',
    example: OrganizationSize['1-9'],
  })
  size: OrganizationSize
}
